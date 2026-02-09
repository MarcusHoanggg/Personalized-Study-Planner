package com.studyplanner.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.AuthProvider;
import java.util.List;

// using lombok as it automatically generates getters and setters

@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data

// The @Builder annotation allows us to use the builder pattern to create
// instances of UserDto in a more readable and flexible way.
@Builder

public class User {

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Tasks> tasks;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SuggestedLLM> suggestedTasks;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    // depending on if the users signs in from google account idk if to keep this as
    // null or not
    private String passwordHash;

//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private AuthProvider provider;

    @Column
    private String providerId;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

}
