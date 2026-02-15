package com.studyplanner.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyplanner.backend.dto.ApiResponse;
import com.studyplanner.backend.dto.AuthResponseDto;
import com.studyplanner.backend.dto.ShareTaskDto;
import com.studyplanner.backend.dto.TaskDto;
import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.dto.UserSearchdto;
import com.studyplanner.backend.security.JwtUtil;
import com.studyplanner.backend.service.UserService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

        private final UserService userService;
        private final JwtUtil jwtUtil;
        private final UserDetailsService userDetailsService;

        // Build user registration
        @PostMapping("/register")
        public ResponseEntity<ApiResponse<AuthResponseDto>> createUser(
                        @RequestBody UserRegisterDto userDto) {

                UserProfileUpdateDto savedUser = userService.createUser(userDto);
                AuthResponseDto authResponse = buildAuthResponse(savedUser);

                ApiResponse<AuthResponseDto> response = ApiResponse.<AuthResponseDto>builder()
                                .status(HttpStatus.CREATED.value())
                                .message("User created successfully")
                                .data(authResponse)
                                .build();

                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        // Build user login
        @PostMapping("/login")
        public ResponseEntity<ApiResponse<AuthResponseDto>> login(
                        @RequestBody UserLoginDto userDto) {

                UserProfileUpdateDto loggedInUser = userService.login(userDto);
                AuthResponseDto authResponse = buildAuthResponse(loggedInUser);

                ApiResponse<AuthResponseDto> response = ApiResponse.<AuthResponseDto>builder()
                                .status(HttpStatus.OK.value())
                                .message("Login successful")
                                .data(authResponse)
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        // Build user update
        @PutMapping("/update")
        public ResponseEntity<ApiResponse<UserProfileUpdateDto>> updateProfile(
                        @RequestBody UserProfileUpdateDto userDto) {

                UserProfileUpdateDto updatedUser = userService.updateProfile(userDto);

                ApiResponse<UserProfileUpdateDto> response = ApiResponse.<UserProfileUpdateDto>builder()
                                .status(HttpStatus.OK.value())
                                .message("Profile updated successfully")
                                .data(updatedUser)
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        // Build get user by id
        @GetMapping("/get/{id}")
        public ResponseEntity<ApiResponse<UserProfileUpdateDto>> getUserById(
                        @PathVariable Long id) {

                UserProfileUpdateDto user = userService.getUserById(id);

                ApiResponse<UserProfileUpdateDto> response = ApiResponse.<UserProfileUpdateDto>builder()
                                .status(HttpStatus.OK.value())
                                .message("User found successfully")
                                .data(user)
                                .build();

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        private AuthResponseDto buildAuthResponse(UserProfileUpdateDto user) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
                String token = jwtUtil.generateToken(Map.of("userId", user.getUserId()), userDetails);
                return AuthResponseDto.builder()
                                .token(token)
                                .user(user)
                                .build();
        }

        // call search on every keystroke from the frontend
        @GetMapping("/search")
        public ResponseEntity<ApiResponse<List<UserSearchdto>>> searchUsers(
                        @RequestParam String query,
                        @RequestParam Long excludeUserId) {

                List<UserSearchdto> results = userService.searchUsers(query, excludeUserId);
                return ResponseEntity.ok(ApiResponse.<List<UserSearchdto>>builder()
                                .status(HttpStatus.OK.value())
                                .message("Users found successfully")
                                .data(results)
                                .build());
        }

        // share one or multiple tasks
        @PostMapping("/share")
        public ResponseEntity<ApiResponse<List<TaskDto>>> shareTasks(
                        @Valid @RequestBody ShareTaskDto shareTaskDto) {
                List<TaskDto> sharedTasks = userService.shareTasks(shareTaskDto);
                return ResponseEntity.status(HttpStatus.CREATED).body(
                                ApiResponse.<List<TaskDto>>builder()
                                                .status(HttpStatus.CREATED.value())
                                                .message(sharedTasks.size() + " Task(s) shared successfully")
                                                .data(sharedTasks)
                                                .build()

                );
        }

}
