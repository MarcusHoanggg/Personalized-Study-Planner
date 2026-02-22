package com.studyplanner.backend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Component
public class LlmClient {
    @Value("${gemini.completion-url}")
    private String completionUrl;

//    @Value("${ollama.model}")
//    private String model;

    @Value("${gemini.api-key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();


    public String sendPrompt(String prompt) {
        String requestBody = """
            {
              "contents": [
                {
                  "parts": [{ "text": "%s" }]
                }
              ]
            }
            """.formatted(prompt);


// ollama string body

//        String requestBody = """
//                {
//                  "model": "%s",
//                  "messages": [
//                    { "role": "system", "content": "You are a helpful study planner assistant who makes
//                                                            tasks using either a calendar or user input." },
//                    { "role": "user", "content": "%s" }
//                  ]
//                }
//                """.formatted(model, prompt);

        String finalUrl = completionUrl + "?key=" + apiKey;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(finalUrl))
                .header("Content-Type", "application/json")
//                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();


        try {

            System.out.println("=== LLM REQUEST ===");
            System.out.println("URL: " + completionUrl + "/chat/completions");
            System.out.println("API Key starts with: " + apiKey.substring(0, 10));
            System.out.println("Request body: " + requestBody);


            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("=== LLM RESPONSE ===");
            System.out.println("Status: " + response.statusCode());
            System.out.println("Body: " + response.body());

            return response.body();

        } catch (Exception e) {
            throw new RuntimeException("Failed to call ollama/gemini API", e);
        }
    }
}