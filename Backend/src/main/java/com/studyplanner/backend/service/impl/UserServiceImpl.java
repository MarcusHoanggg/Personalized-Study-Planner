package com.studyplanner.backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.mapper.UserMapper;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.service.EmailService;
import com.studyplanner.backend.service.UserService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@AllArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public UserProfileUpdateDto createUser(UserRegisterDto userDto) {

        // Check if email is already registered
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Password Hashing
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(userDto.getPassword());

        // Map DTO to entity,
        User user = UserMapper.mapToUser(userDto);

        // Hashed password updated to userDto
        user.setPassword(hashedPassword);

        // set timestamps, default values
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // save to database
        User saved = userRepository.save(user);

        // Send welcome email (local registration)
        try {
            String firstName = saved.getFirstName() != null && !saved.getFirstName().isBlank()
                    ? saved.getFirstName() : "there";
            emailService.sendWelcomeEmail(saved.getEmail(), firstName);
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}: {}", saved.getEmail(), e.getMessage());
        }

        // Map back to DTO for response (without password)
        return UserMapper.mapToUserDto(saved);
    }

    @Override
    public UserProfileUpdateDto login(UserLoginDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.getPassword().equals(userDto.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return UserMapper.mapToUserDto(user);
    }

    @Override
    public UserProfileUpdateDto updateProfile(UserProfileUpdateDto userDto) {
        if (userDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        User user = userRepository.findById(userDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Cannot update: User not found"));

        UserMapper.applyProfileUpdate(user, userDto);
        user.setUpdatedAt(LocalDateTime.now());
        User updated = userRepository.save(user);
        return UserMapper.mapToUserDto(updated);
    }

    @Override
    public UserProfileUpdateDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserMapper.mapToUserDto(user);
    }
}
