package com.studyplanner.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyplanner.backend.entity.User;

// The purpose of this repository is to perform CRUD operations on User entities or models.
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId); // For finding users who signed up via Google OAuth2

    boolean existsByEmail(String email); // Check if a user with the given email already exists
}
