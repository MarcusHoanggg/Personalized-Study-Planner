package com.studyplanner.backend.dto;

import lombok.Data;


@Data
public class LlmApiRequest {

    private String prompt;
    private boolean sent;

}
