package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.LlmApiRequest;
import com.studyplanner.backend.dto.LlmApiResponse;

public interface LlmService {

    LlmApiResponse chat(LlmApiRequest prompt);

}
