package com.studyplanner.backend.client;

import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


public class LlmClient {
    @Value("${gemini.completion-url}")
    private String completionUrl;
    @Value("${gemini.api-key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();

    // sends a prompt to gemini API and returns the raw response
    public String sendPrompt(String prompt) throws IOException {
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
            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new IOException(
                        "Gemini API returned status " + response.statusCode() +
                                ": " + response.body()
                );
            }

            return response.body();

        } catch (IOException e) {
            throw e; // preserve meaning

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // REQUIRED
            throw new IOException("Request interrupted", e);
        }    }

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
}