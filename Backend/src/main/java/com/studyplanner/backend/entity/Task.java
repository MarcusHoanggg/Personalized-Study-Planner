package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
<<<<<<< HEAD
import org.hibernate.annotations.UpdateTimestamp;
=======
>>>>>>> b21b7d8 (google calendar)

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tasks")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder

public class Task {

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

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Reminder> reminders;

<<<<<<< HEAD
=======
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long id;

>>>>>>> b21b7d8 (google calendar)
    @Column(name = "task_name", nullable = false)
    private String taskName;

    @Column(name = "task_description", nullable = false)
    private String taskDescription;

    @Column(name = "task_deadline")
    private LocalDateTime taskDeadline;

<<<<<<< HEAD
=======
    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @CreationTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "google_event_id")
    private String googleEventId;

>>>>>>> b21b7d8 (google calendar)
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    @Column(name = "priority")
    private Priority priority;

    public enum Status {
        PENDING,
        IN_PROGRESS,
        COMPLETED
    }

    @Column(name = "status")
    private Status status;

    @Column(name = "completed", nullable = false)
    private boolean completed;

<<<<<<< HEAD
    // New fields for LLM integration
    // Indicates if the task has been accepted from the LLM
    @Column(name = "from_llm_suggestion")
    private boolean fromLlmSuggestion;

    // If this task came from LLM, points to the suggested task
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suggested_task_id")
    private SuggestedLLM suggestedTask;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

=======
>>>>>>> b21b7d8 (google calendar)
}
