package com.studyplanner.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyplanner.backend.dto.ApiResponse;
import com.studyplanner.backend.dto.TaskDto;
import com.studyplanner.backend.entity.Task.Priority;
import com.studyplanner.backend.entity.Task.Status;
import com.studyplanner.backend.service.TaskService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/v1/task")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // CREAT POST api
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@Valid @RequestBody TaskDto taskDto) {
        TaskDto created = taskService.createTask(taskDto);

        ApiResponse<TaskDto> response = ApiResponse.<TaskDto>builder()
                .status(HttpStatus.CREATED.value())
                .message("Task created successfully")
                .data(created)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // READ GET api

    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskDto>> getTaskById(
            @PathVariable Long taskId,
            @RequestParam Long userId) {
        TaskDto task = taskService.getTaskById(taskId, userId);
        return ResponseEntity.ok(ApiResponse.<TaskDto>builder().status(HttpStatus.OK.value())
                .message("Task retrieved successfully").data(task).build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TaskDto>>> getAllTasksByUser(@PathVariable Long userId) {
        List<TaskDto> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(
                ApiResponse.<List<TaskDto>>builder()
                        .status(HttpStatus.OK.value())
                        .message("Tasks retrieved successfully")
                        .data(tasks)
                        .build());
    }

    @GetMapping("/user/{userId}/filter")
    public ResponseEntity<ApiResponse<List<TaskDto>>> filterTasks(
            @PathVariable Long userId,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime taskDeadline) {

        List<TaskDto> tasks;

        if (priority != null && status != null) {
            tasks = taskService.getTasksByStatusAndPriority(userId, status, priority);
        } else if (priority != null) {
            tasks = taskService.getTasksByPriority(userId, priority);
        } else if (taskDeadline != null) {
            tasks = taskService.getTasksByDeadline(userId, from);
        } else if (status != null) {
            tasks = taskService.getTasksByStatus(userId, status);
        } else if (completed != null) {
            tasks = taskService.getTasksByCompleted(userId, completed);
        } else if (from != null && to != null) {
            tasks = taskService.getTasksByDateRange(userId, from, to);
        } else {
            tasks = taskService.getTasksByUserId(userId);
        }

        return ResponseEntity.ok(
                ApiResponse.<List<TaskDto>>builder()
                        .status(HttpStatus.OK.value())
                        .message("Tasks filtered successfully")
                        .data(tasks)
                        .build());
    }

    // ---- UPDATE PUT api----

    @PutMapping("/update/{taskId}")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody TaskDto taskDto) {
        TaskDto updated = taskService.updateTask(taskId, taskDto);
        return ResponseEntity.ok(
                ApiResponse.<TaskDto>builder()
                        .status(HttpStatus.OK.value())
                        .message("Task updated successfully")
                        .data(updated)
                        .build());
    }

    @PatchMapping("/update/{taskId}/complete")
    public ResponseEntity<ApiResponse<TaskDto>> markCompleted(
            @PathVariable Long taskId,
            @RequestParam Long userId,
            @RequestParam boolean completed) {
        TaskDto updated = taskService.markTaskAsCompleted(taskId, userId, completed);
        return ResponseEntity.ok(
                ApiResponse.<TaskDto>builder()
                        .status(HttpStatus.OK.value())
                        .message(completed ? "Task marked as completed" : "Task marked as incomplete")
                        .data(updated)
                        .build());
    }

    @PatchMapping("/update/{taskId}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateStatus(
            @PathVariable Long taskId,
            @RequestParam Long userId,
            @RequestParam Status status) {
        TaskDto updated = taskService.updateTaskStatus(taskId, userId, status.name());
        return ResponseEntity.ok(
                ApiResponse.<TaskDto>builder()
                        .status(HttpStatus.OK.value())
                        .message("Task status updated to " + status)
                        .data(updated)
                        .build());
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long taskId,
            @RequestParam Long userId) {
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .status(HttpStatus.OK.value())
                        .message("Task deleted successfully")
                        .data(null)
                        .build());
    }
}
