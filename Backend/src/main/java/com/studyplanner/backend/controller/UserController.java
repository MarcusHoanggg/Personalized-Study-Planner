package com.studyplanner.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyplanner.backend.dto.ApiResponse;
import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.service.UserService;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private UserService userService;

    // Build user registration
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileUpdateDto>> createUser(
            @RequestBody UserRegisterDto userDto) {

        UserProfileUpdateDto savedUser = userService.createUser(userDto);

        ApiResponse<UserProfileUpdateDto> response = ApiResponse.<UserProfileUpdateDto>builder()
                .status(HttpStatus.CREATED.value())
                .message("User created successfully")
                .data(savedUser)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Build user login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserProfileUpdateDto>> login(
            @RequestBody UserLoginDto userDto) {

        UserProfileUpdateDto loggedInUser = userService.login(userDto);

        ApiResponse<UserProfileUpdateDto> response = ApiResponse.<UserProfileUpdateDto>builder()
                .status(HttpStatus.OK.value())
                .message("Login successful")
                .data(loggedInUser)
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

}
