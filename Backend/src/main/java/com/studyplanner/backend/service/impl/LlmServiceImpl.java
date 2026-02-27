package com.studyplanner.backend.service.impl;


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
