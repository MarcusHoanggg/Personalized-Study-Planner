package com.studyplanner.backend.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyplanner.backend.dto.ShareTaskDto;
import com.studyplanner.backend.dto.TaskDto;
import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.dto.UserSearchdto;
import com.studyplanner.backend.entity.Task;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.exception.UnauthorizedAccessException;
import com.studyplanner.backend.mapper.TaskMapper;
import com.studyplanner.backend.mapper.UserMapper;
import com.studyplanner.backend.repository.TaskRepository;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.service.EmailService;
import com.studyplanner.backend.service.ReminderService;
import com.studyplanner.backend.service.UserService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final TaskRepository taskRepository;
    private final ReminderService reminderService;

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
                    ? saved.getFirstName()
                    : "there";
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

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return UserMapper.mapToUserDto(user);
    }

    @Override
    public UserProfileUpdateDto updateProfile(Long userId, UserProfileUpdateDto userDto) {
        if (userDto.getUserId() == null || !userDto.getUserId().equals(userId)) {
            throw new IllegalArgumentException("User ID mismatch: You can only update your own profile");
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

    // ---------------FOR USER SHARING TASKS--------------- //

    // mapper helper methods
    private UserSearchdto mapUserSearchdto(User user) {
        return UserSearchdto.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .build();
    }

    // ----- User Search ----- //
    @Override
    @Transactional(readOnly = true)
    public List<UserSearchdto> searchUsers(String query, Long excludeUserId) {
        // search will not run until query has at least 2 characters
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }

        return userRepository.searchUsers(query.trim(), excludeUserId)
                .stream()
                .map(this::mapUserSearchdto)
                .collect(Collectors.toList());
    }

    // ----------- Share Tasks between Users ----------- //
    @Override
    @Transactional
    public List<TaskDto> shareTasks(ShareTaskDto shareTaskDto) {

        // validate recipient exists
        if (shareTaskDto.getSenderUserId().equals(shareTaskDto.getReceiverUserId())) {
            throw new IllegalArgumentException("You cannot share tasks with yourself.");
        }

        // validate sender exists
        User sender = userRepository.findById(shareTaskDto.getSenderUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Sender not Found "));

        // validate recipient exists
        User recipient = userRepository.findById(shareTaskDto.getReceiverUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient User not Found"));

        List<TaskDto> sharedTasks = new ArrayList<>();

        for (Long taskId : shareTaskDto.getTaskIds()) {

            // load and verify tasks belong to sender
            Task originalTask = taskRepository.findById(taskId)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found: "));

            if (!originalTask.getUser().getId().equals(shareTaskDto.getSenderUserId())) {
                throw new UnauthorizedAccessException(" You can only share your own Tasks");
            }

            // Create a copy of the task
            Task copiedTask = Task.builder()
                    .user(recipient)
                    .taskName(originalTask.getTaskName())
                    .taskDescription(originalTask.getTaskDescription())
                    .taskDeadline(originalTask.getTaskDeadline())
                    .priority(originalTask.getPriority())
                    .status(originalTask.getStatus())
                    .completed(false) // set as not completed())
                    .build();

            Task saved = taskRepository.save(copiedTask);

            sharedTasks.add(TaskMapper.mapToTaskDto(saved));

            log.info("Task '{}' shared from user {} ({}) to user {} ({})",
                    originalTask.getTaskName(),
                    sender.getId(), sender.getFirstName() + " " + sender.getLastName(),
                    recipient.getId(), recipient.getFirstName() + " " + recipient.getLastName());
        }

        return sharedTasks;
    }
}
