package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

<<<<<<< HEAD
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "suggested_tasks")
=======
@Entity
@Table(name = "suggested")
>>>>>>> b21b7d8 (google calendar)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder

public class SuggestedLLM {

<<<<<<< HEAD
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long id;

=======
>>>>>>> b21b7d8 (google calendar)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

<<<<<<< HEAD
    @Column(name = "task_name", nullable = false)
    private String taskName;

    @Column(name = "task_description", columnDefinition = "TEXT")
    private String taskDescription;

    @Column(name = "task_deadline")
    private LocalDateTime taskDeadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

=======
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id", nullable = false)
    private Long id;

    @Column(name = "task_name", nullable = false)
    private String taskName;

    @Column(name = "task_description", nullable = false)
    private String taskDescription;

    @Column(name = "task_deadline", nullable = true)
    private LocalDateTime taskDeadline;

>>>>>>> b21b7d8 (google calendar)
    public enum Priority {
        HIGH,
        MEDIUM,
        LOW
    }

<<<<<<< HEAD
    // To check the LLMs task status if the task is accepted or not
    @Enumerated(EnumType.STRING)
    @Column(name = "suggested_status")
    private SuggestedStatus suggestedStatus;

    public enum SuggestedStatus {
        PENDING, // The user has not accepted or declined the LLM suggested task
        ACCEPTED, // user has accepted the task - the task will be added to the user's calendar
        DECLINED // user has declined the task - the task will not be added to the user's
                 // calendar
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED
    }

    // if accpeted, then the task will be added to the user's calendar
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accepted_task_id")
    private Task acceptedTask;

    // full raw text of the LLM response for analysis/debugging
    @Column(name = "llm_response", columnDefinition = "TEXT")
    private String llmResponse;

    // Which LLM Model generated this task
    // In case of multiple LLMs in the future
    @Column(name = "llm_model")
    private String llmModel;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // when user responds to the suggested task, time of the response
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;
=======
    @Column(name = "priority", nullable = true)
    private Priority priority;

    @Column(name = "status", nullable = false) // approved by the user or not
    private boolean status;

    @Column(name = "response", nullable = false)
    private String response;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

>>>>>>> b21b7d8 (google calendar)
}
