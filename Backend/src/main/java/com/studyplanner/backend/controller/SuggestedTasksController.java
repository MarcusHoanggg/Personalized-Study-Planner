package com.studyplanner.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyplanner.backend.dto.ApiResponse;
import com.studyplanner.backend.dto.LlmTaskGenerationRequest;
import com.studyplanner.backend.dto.LlmTaskGenerationResponse;
import com.studyplanner.backend.service.LlmService;
import com.studyplanner.backend.service.SuggestedTaskService;
import com.studyplanner.backend.util.SecurityUtils;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("api/v1/suggestions")
@AllArgsConstructor
public class SuggestedTasksController {

    private final LlmService llmService;
    private final SuggestedTaskService suggestedTaskService;
    private final SecurityUtils securityUtils;

    // Generate Post /api/v1/suggestions/generate

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<LlmTaskGenerationResponse>> generateSuggestions(
            @Valid @RequestBody LlmTaskGenerationRequest request) {

        Long userId = securityUtils.getAuthenticatedUserId();
        LlmTaskGenerationResponse response = llmService.generateTaskSuggestions(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<LlmTaskGenerationResponse>builder()
                .status(HttpStatus.CREATED.value())
                .message(response.getMessage())
                .data(response)
                .build());
    }
}
