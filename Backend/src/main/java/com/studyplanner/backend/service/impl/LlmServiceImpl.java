package com.studyplanner.backend.service.impl;

<<<<<<< HEAD
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyplanner.backend.dto.LlmTaskGenerationRequest;
import com.studyplanner.backend.dto.LlmTaskGenerationResponse;
import com.studyplanner.backend.dto.SuggestedTasksDto;
import com.studyplanner.backend.entity.SuggestedLLM;
import com.studyplanner.backend.entity.SuggestedLLM.Priority;
import com.studyplanner.backend.entity.SuggestedLLM.Status;
import com.studyplanner.backend.entity.SuggestedLLM.SuggestedStatus;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.mapper.SuggestedTasksMapper;
import com.studyplanner.backend.repository.SuggestedTaskRepository;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.service.LlmService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class LlmServiceImpl implements LlmService {

    private final ChatClient chatClient;
    private final UserRepository userRepository;
    private final SuggestedTaskRepository suggestedTaskRepository;
    private final ObjectMapper objectMapper;
    private final int monthlyQuota;

    public LlmServiceImpl(ChatClient.Builder chatClientBuilder,
                          UserRepository userRepository,
                          SuggestedTaskRepository suggestedTaskRepository,
                          ObjectMapper objectMapper,
                          @Value("${app.llm.monthly-quota:50}") int monthlyQuota) {
        this.chatClient = chatClientBuilder.build();
        this.userRepository = userRepository;
        this.suggestedTaskRepository = suggestedTaskRepository;
        this.objectMapper = objectMapper;
        this.monthlyQuota = monthlyQuota;
    }

    @Override
    @Transactional
    public LlmTaskGenerationResponse generateTaskSuggestions(
            LlmTaskGenerationRequest request, Long userId) {

        if (!canUserRequestMoreSuggestions(userId)) {
            throw new IllegalStateException(
                    "Monthly LLM quota exceeded. You can request more suggestions next month.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Build prompts
        String systemPrompt = buildSystemPrompt();
        String userPrompt = "User request: " + request.getPrompt();
        if (request.getAdditionalContext() != null && !request.getAdditionalContext().isBlank()) {
            userPrompt += "\nAdditional context: " + request.getAdditionalContext();
        }

        // Call Spring AI ChatClient — replaces your manual HTTP client
        String rawResponse = chatClient.prompt()
                .system(systemPrompt)
                .user(userPrompt)
                .call()
                .content();

        log.info("LLM raw response: {}", rawResponse);

        // Parse response
        List<SuggestedTasksDto> parsedTasks = parseLlmResponse(rawResponse);

        // Save to database
        List<SuggestedTasksDto> savedSuggestions = new ArrayList<>();
        for (SuggestedTasksDto taskDto : parsedTasks) {
            SuggestedLLM entity = SuggestedLLM.builder()
                    .user(user)
                    .taskName(taskDto.getTaskName())
                    .taskDescription(taskDto.getTaskDescription())
                    .taskDeadline(taskDto.getTaskDeadline())
                    .priority(taskDto.getPriority() != null ? taskDto.getPriority() : Priority.MEDIUM)
                    .status(Status.PENDING)
                    .suggestedStatus(SuggestedStatus.PENDING)
                    .llmResponse(rawResponse)
                    .llmModel("gemini-1.5-flash")
                    .build();

            SuggestedLLM saved = suggestedTaskRepository.save(entity);
            savedSuggestions.add(SuggestedTasksMapper.toDto(saved));
        }

        return LlmTaskGenerationResponse.builder()
                .suggestions(savedSuggestions)
                .totalGenerated(savedSuggestions.size())
                .message("Generated " + savedSuggestions.size() + " task suggestions for you")
                .build();
    }

    @Override
    public boolean canUserRequestMoreSuggestions(Long userId) {
        return getRemainingMonthlyQuota(userId) > 0;
    }

    @Override
    public int getRemainingMonthlyQuota(Long userId) {
        YearMonth currentMonth = YearMonth.now();
        LocalDateTime start = currentMonth.atDay(1).atStartOfDay();
        LocalDateTime end   = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        long used = suggestedTaskRepository.countByUserIdAndTaskDeadlineBetween(userId, start, end);
        return Math.max(0, monthlyQuota - (int) used);
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────────

    private String buildSystemPrompt() {
        return """
                You are a study planner assistant. Generate concrete, actionable study tasks.
                
                CRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no code blocks.
                
                Format:
                {
                  "tasks": [
                    {
                      "taskName": "Read Docker documentation chapters 1-3",
                      "taskDescription": "Focus on containers, images, and basic commands",
                      "taskDeadline": "2026-03-15T18:00:00",
                      "priority": "HIGH"
                    }
                  ]
                }
                
                Rules:
                - taskName: Short title (10-20 words max)
                - taskDescription: Clear action (3-4 sentences)
                - taskDeadline: ISO 8601 format (YYYY-MM-DDTHH:mm:ss), realistic future dates
                - priority: HIGH, MEDIUM, or LOW
                - Generate 3-8 tasks spread over time
                - Today's date is """ + LocalDateTime.now().toLocalDate();
    }

    private List<SuggestedTasksDto> parseLlmResponse(String rawResponse) {
        List<SuggestedTasksDto> tasks = new ArrayList<>();

        try {
            // Strip markdown code blocks if Gemini adds them
            String cleaned = rawResponse.trim();
            if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
            if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
            if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);
            cleaned = cleaned.trim();

            // Parse JSON
            JsonNode root = objectMapper.readTree(cleaned);
            JsonNode taskArray = root.path("tasks");

            if (taskArray.isArray()) {
                for (JsonNode taskNode : taskArray) {
                    try {
                        tasks.add(SuggestedTasksDto.builder()
                                .taskName(taskNode.path("taskName").asText())
                                .taskDescription(taskNode.path("taskDescription").asText())
                                .taskDeadline(LocalDateTime.parse(
                                        taskNode.path("taskDeadline").asText()))
                                .priority(Priority.valueOf(
                                        taskNode.path("priority").asText("MEDIUM")))
                                .build());
                    } catch (Exception e) {
                        log.warn("Failed to parse task: {}", e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.error("Parse error: {}", e.getMessage());
            log.error("Raw response: {}", rawResponse);
            throw new RuntimeException("Invalid LLM response: " + e.getMessage(), e);
        }

        if (tasks.isEmpty()) {
            throw new RuntimeException("LLM generated no valid tasks");
        }

        return tasks;
    }
}
=======

import com.studyplanner.backend.client.LlmClient;
import com.studyplanner.backend.dto.LlmApiRequest;
import com.studyplanner.backend.dto.LlmApiResponse;
import com.studyplanner.backend.service.LlmService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class LlmServiceImpl implements LlmService {

    private final LlmClient LlmClient;

    @Override
    public LlmApiResponse chat(LlmApiRequest request) {
        System.out.println("Service hit, prompt: " + request.getPrompt());

        String rawResponse = LlmClient.sendPrompt(request.getPrompt());


        LlmApiResponse apiResponse = new LlmApiResponse();
        apiResponse.setResponse(rawResponse);
        apiResponse.setReceived(true);

        return apiResponse;
    }
}
>>>>>>> b21b7d8 (google calendar)
