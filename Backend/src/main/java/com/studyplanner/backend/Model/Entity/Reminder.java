package com.studyplanner.backend.Model.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminder")
@NoArgsConstructor
@AllArgsConstructor
@Data

public class Reminder {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Tasks task;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reminderId", nullable = false)
    private long id;

    @Column(name = "reminder_sent", nullable = false)
    private boolean reminderSent;

    @Column(name = "reminder_date", nullable = true)
    private LocalDateTime reminderDate;
}
