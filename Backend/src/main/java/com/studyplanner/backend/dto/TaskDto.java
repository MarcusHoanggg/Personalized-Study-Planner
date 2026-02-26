package com.studyplanner.backend.dto;

import java.time.LocalDateTime;

import com.studyplanner.backend.entity.Task;

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

public class TaskDto {

    private Long taskId;
    @NotNull(message = "User ID is required")
    private Long userId;
    private String taskName;
    private String taskDescription;
    private LocalDateTime taskDeadline;
    private Task.Priority priority;
    private Task.Status status;
    private boolean completed;
<<<<<<< HEAD
=======

>>>>>>> b21b7d8 (google calendar)
}
