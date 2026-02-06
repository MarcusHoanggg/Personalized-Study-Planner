package com.studyplanner.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "suggested")
@NoArgsConstructor
@AllArgsConstructor
@Data


public class SuggestedLLM {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


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

    @Column(name = "priority", nullable = true)
    private String priority;

    @Column(name = "status", nullable = false) // approved by the user or not
    private boolean status;

    @Column(name = "response", nullable = false)
    private String response;

}
