package com.studyplanner.backend.dto;

import lombok.Data;

@Data
public class LlmApiResponse {

    private String response;
    private boolean received;

}
