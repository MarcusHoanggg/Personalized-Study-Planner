package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminder")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder

public class Reminder {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Tasks task;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminder_id", nullable = false)
    private long id;

    @Column(name = "reminder_sent", nullable = false)
    private boolean reminderSent;

    @Column(name = "reminder_date", nullable = true)
    private LocalDateTime reminderDate;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

}
