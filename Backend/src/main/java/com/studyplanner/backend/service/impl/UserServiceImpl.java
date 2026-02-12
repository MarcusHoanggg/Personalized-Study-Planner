package com.studyplanner.backend.service.impl;

import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.mapper.UserMapper;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.service.UserService;

import lombok.AllArgsConstructor;

import javax.crypto.SecretKeyFactory;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final UserRepository userRepository;

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
        String now = LocalDateTime.now().format(FORMATTER);

        // Hashed password updated to userDto
        user.setPassword(hashedPassword);

        // set timestamps, default values
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // save to database
        User saved = userRepository.save(user);

        // Map back to DTO for response (without password)
        return UserMapper.mapToUserDto(saved);
    }

    @Override
    public UserProfileUpdateDto login(UserLoginDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        // TODO: Replace with password hash comparison (e.g. BCrypt) in production

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
