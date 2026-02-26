package com.studyplanner.backend.dto;

<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonInclude;
import com.studyplanner.backend.entity.SuggestedLLM.Priority;
import com.studyplanner.backend.entity.SuggestedLLM.Status;
import com.studyplanner.backend.entity.SuggestedLLM.SuggestedStatus;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SuggestedTasksDto {

    private Long taskId;
    private Long userId;
    private String taskName;
    private String taskDescription;
    private LocalDateTime taskDeadline;
    private Priority priority;
    private Status status;
    private SuggestedStatus suggestedStatus;
    private String llmModel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // if accepted, the ID of the task created in the database
    private Long acceptedTaskId;
=======
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
>>>>>>> b21b7d8 (google calendar)
}
