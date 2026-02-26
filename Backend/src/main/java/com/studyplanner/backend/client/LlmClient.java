package com.studyplanner.backend.client;

import org.springframework.beans.factory.annotation.Value;
<<<<<<< HEAD
=======
import org.springframework.stereotype.Component;
>>>>>>> b21b7d8 (google calendar)

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

<<<<<<< HEAD
public class LlmClient {
        @Value("${gemini.completion-url}")
        private String completionUrl;

        // @Value("${ollama.model}")
        // private String model;

        @Value("${gemini.api-key}")
        private String apiKey;

        private final HttpClient httpClient = HttpClient.newBuilder()
                        .followRedirects(HttpClient.Redirect.ALWAYS)
                        .build();

        // sends a prompt to gemini API and returns the raw response
        public String sendPrompt(String prompt) {
                String requestBody = String.format("""
                                {
                                  "contents": [
                                    {
                                      "parts": [
                                        {
                                          "text": %s
                                        }
                                      ]
                                    }
                                  ]
                                }
                                """, escapeJson(prompt));

                String finalUrl = completionUrl + "?key=" + apiKey;
                HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create(finalUrl))
                                .header("Content-Type", "application/json")
                                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                                .build();
                try {
                        System.out.println("=== LLM REQUEST ===");
                        System.out.println("URL: " + finalUrl);
                        System.out.println("Request body preview: "
                                        + requestBody.substring(0, Math.min(200, requestBody.length())) + "...");

                        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                        System.out.println("=== LLM RESPONSE ===");
                        System.out.println("Status: " + response.statusCode());
                        System.out.println("Body preview: "
                                        + response.body().substring(0, Math.min(500, response.body().length()))
                                        + "...");

                        if (response.statusCode() != 200) {
                                throw new RuntimeException("Gemini API returned status " + response.statusCode() +
                                                ": " + response.body());
                        }

                        return response.body();

                } catch (Exception e) {
                        throw new RuntimeException("Failed to call Gemini API: " + e.getMessage(), e);
                }
        }

        // escapes special characters in the JSON string
        private String escapeJson(String text) {
                if (text == null)
                        return "\"\"";

                // Escape backslashes first (must be done before quotes)
                String escaped = text.replace("\\", "\\\\");

                // Escape double quotes
                escaped = escaped.replace("\"", "\\\"");

                // Escape newlines, tabs, carriage returns
                escaped = escaped.replace("\n", "\\n")
                                .replace("\r", "\\r")
                                .replace("\t", "\\t");

                return "\"" + escaped + "\"";
        }
=======
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
        String systemInstruction = """
                You are a helpful study planner assistant.
                        You create clear, realistic study tasks.
                        Always respond in a structured way.
                """;

        String requestBody = """
                {
                "systemInstruction": {
                            "parts": [{ "text": %s }]
                          },
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
>>>>>>> b21b7d8 (google calendar)
}