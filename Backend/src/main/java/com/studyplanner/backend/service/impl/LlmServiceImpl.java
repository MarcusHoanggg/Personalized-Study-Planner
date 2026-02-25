package com.studyplanner.backend.service.impl;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyplanner.backend.client.LlmClient;
import com.studyplanner.backend.dto.LlmTaskGenerationRequest;
import com.studyplanner.backend.dto.LlmTaskGenerationResponse;
import com.studyplanner.backend.dto.SuggestedTasksDto;
import com.studyplanner.backend.entity.SuggestedLLM;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.entity.SuggestedLLM.Priority;
import com.studyplanner.backend.entity.SuggestedLLM.Status;
import com.studyplanner.backend.entity.SuggestedLLM.SuggestedStatus;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.mapper.SuggestedTasksMapper;
import com.studyplanner.backend.repository.SuggestedTaskRepository;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.service.LlmService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j // for logging
public class LlmServiceImpl implements LlmService {

    private final LlmClient llmClient;
    private final UserRepository userRepository;
    private final SuggestedTaskRepository suggestedTaskRepository;
    private final ObjectMapper objectMapper; // Used to convert between Java objects and JSON
    private final int monthlyQuota; // The maximum number of tasks that can be generated per month

    public LlmServiceImpl(LlmClient llmClient,
            UserRepository userRepository,
            SuggestedTaskRepository suggestedTaskRepository,
            ObjectMapper objectMapper,
            @Value("${app.llm.monthly-quota:50}") int monthlyQuota) {
        this.llmClient = llmClient;
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
                    "Monthly LLM limit reached. You can request up to " + monthlyQuota + " suggestions per month.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String systemPrompt = buildSystemPrompt();
        String userPromt = request.getPrompt();
        if (request.getAdditionalContext() != null && !request.getAdditionalContext().isBlank()) {
            userPromt += "\n\nAdditional context: " + request.getAdditionalContext();
        }

        String rawResponse = llmClient.sendPrompt(systemPrompt + "\n\nUser request: " + userPromt);
        log.info("LLM raw response: {}", rawResponse);

        List<SuggestedTasksDto> parsedTasks = parseLlmResponse(rawResponse);

        List<SuggestedTasksDto> savedSuggestions = new ArrayList<>();
        for (SuggestedTasksDto taskDto : parsedTasks) {
            SuggestedLLM entity = SuggestedLLM.builder()
                    .user(user)
                    .taskName(taskDto.getTaskName())
                    .taskDescription(taskDto.getTaskDescription())
                    .taskDeadline(taskDto.getTaskDeadline())
                    .priority(taskDto.getPriority())
                    .status(Status.PENDING)
                    .suggestedStatus(SuggestedStatus.PENDING)
                    .llmResponse(rawResponse)
                    .llmModel("gemini-1.5-pro")
                    .build();

            SuggestedLLM saved = suggestedTaskRepository.save(entity);
            savedSuggestions.add(SuggestedTasksMapper.toDto(saved));
        }

        return LlmTaskGenerationResponse.builder()
                .suggestions(savedSuggestions)
                .totalGenerated(savedSuggestions.size())
                .message("Generated" + savedSuggestions.size() + " task suggestions for you")
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
        LocalDateTime end = currentMonth.atEndOfMonth().atTime(23, 59, 59);

        Long used = suggestedTaskRepository.countByUserIdAndTaskDeadlineBetween(userId, start, end);
        return Math.max(0, monthlyQuota - used.intValue());
    }

    // -------------- Private helper functions -------------- //

    private String buildSystemPrompt() {
        return """
                You are a study planner assistant. When a user describes what they want to study, generate a list of concrete, actionable study tasks.

                CRITICAL: Respond ONLY with valid JSON. No markdown, no explanations, no code blocks.

                Format:
                {
                  "tasks": [
                    {
                      "taskName": "...",
                      "taskDescription": "...",
                      "taskDeadline": "2026-03-15T18:00:00",
                      "priority": "HIGH"
                    }
                  ]
                }

                Rules:
                - taskName: Short title (10-20 words max)
                - taskDescription: Clear action item (3-4 sentences)
                - taskDeadline: ISO 8601 format, realistic dates
                - priority: HIGH, MEDIUM or LOW
                - Generate 3-8 tasks depending on the user's request
                - Make deadlines progressive (spread over time)
                - Be realistic about study timelines
                """;
    }

    // Parse the LLM response and return a list of suggested tasks
    private List<SuggestedTasksDto> parseLlmResponse(String rawResponse) {
        List<SuggestedTasksDto> tasks = new ArrayList<>();

        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            JsonNode candidates = root.path("candidates");

            // Ensure LLM returned at least one candidate before accessing index
            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandiate = candidates.get(0);
                JsonNode content = firstCandiate.path("content");
                JsonNode parts = content.path("parts");

                // Ensure candidate contains content parts before extracting text
                if (parts.isArray() && parts.size() > 0) {
                    String textContent = parts.get(0).path("text").asText();
                    JsonNode taskData = objectMapper.readTree(textContent);
                    JsonNode taskArray = taskData.path("parts");

                    // Ensure parsed LLM JSON contains a valid tasks array
                    if (taskArray.isArray()) {
                        for (JsonNode taskNode : taskArray) {
                            try {
                                SuggestedTasksDto task = SuggestedTasksDto.builder()
                                        .taskName(taskNode.path("taskName").asText())
                                        .taskDescription(taskNode.path("taskDescription").asText())
                                        .taskDeadline(LocalDateTime.parse(taskNode.path("taskDeadline").asText()))
                                        .priority(Priority.valueOf(taskNode.path("priority").asText("MEDIUM")))
                                        .build();
                                tasks.add(task);
                            } catch (Exception e) {
                                log.warn("Failed to parse individual task: {}", e.getMessage());
                            }
                        }
                    }
                }
            }

        } catch (Exception e) {
            log.error("failed to parse LLM response as JSON: {}", e.getMessage());
            throw new RuntimeException("LLM returned invalid JSON", e);
        }

        if (tasks.isEmpty()) {
            throw new RuntimeException("LLM did not generate any valid tasks");
        }

        return tasks;
    }
}
