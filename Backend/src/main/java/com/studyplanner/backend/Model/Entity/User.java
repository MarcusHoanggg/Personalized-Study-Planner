package com.studyplanner.backend.Model.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

// using lombok as it automatically generates getters and setters


@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Data

public class User {

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Tasks> tasks;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<SuggestedLLM> suggestedTasks;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash")
    // depending on if the users signs in from google account idk if to keep this as null or not
    private String passwordHash;

    @Column(name = "profile_picture")
    private String profilePicture;


}
