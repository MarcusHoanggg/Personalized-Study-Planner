package com.studyplanner.backend.dto;

import com.studyplanner.backend.entity.SuggestedLLM;
import java.time.LocalDateTime;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuggestedTasksDto {

    private Long id;
    private Long userId;
    @NotNull(message = "User ID is required") // is required to map the task to the required user
                                                // honestly idk if it is required or not
    private String taskName;
    private String taskDescription;
    private LocalDateTime taskDeadline;
    private SuggestedLLM.Priority priority;
    private boolean status;
    private String response;
    private String createdAt;
    private String updatedAt;
}
