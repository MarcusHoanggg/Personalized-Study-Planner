package com.studyplanner.backend.controller;

import com.studyplanner.backend.dto.LlmApiRequest;
import com.studyplanner.backend.dto.LlmApiResponse;
import com.studyplanner.backend.service.LlmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/llm")
@RequiredArgsConstructor
public class LlmController {

    private final LlmService llmService;

    @PostMapping("/chat")
    public ResponseEntity<LlmApiResponse> chat(@RequestBody LlmApiRequest request) {
        System.out.println("Controller hit");
        LlmApiResponse response = llmService.chat(request);
        return ResponseEntity.ok(response);

    }

}