package com.studyplanner.backend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class LlmClient {
    @Value("${ollama.completion-url}")
    private String completionUrl;

//    @Value("${ollama.model}")
//    private String model;

    @Value("${ollama.api-key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String sendPrompt(String prompt) {
        String requestBody = """
            {
              "model": "${model}",
              "messages": [
                { "role": "system", "content": "You are a helpful study planner assistant who makes
                                                        tasks using either a calendar or user input." },
                { "role": "user", "content": "%s" }
              ]
            }
            """.formatted(prompt);


        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(completionUrl + "/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();


        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Status code: " + response.statusCode());
            System.out.println("Response body: " + response.body());
            return response.body();

        } catch (Exception e) {
            throw new RuntimeException("Failed to call ollama API", e);
        }
    }
}