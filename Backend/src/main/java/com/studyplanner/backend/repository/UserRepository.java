package com.studyplanner.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyplanner.backend.entity.User;

// The purpose of this repository is to perform CRUD operations on User entities or models.
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
