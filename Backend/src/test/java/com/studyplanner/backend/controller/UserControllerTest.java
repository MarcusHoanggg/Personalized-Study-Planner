package com.studyplanner.backend.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.security.JwtUtil;
import com.studyplanner.backend.service.UserService;

import java.time.LocalDateTime;
import java.util.Collections;

/**
 * Unit tests for UserController.
 * Tests HTTP endpoints for user registration, login, profile update, and
 * retrieval.
 */
@WebMvcTest(controllers = UserController.class, excludeAutoConfiguration = SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for unit testing
@Import(UserControllerTest.MockConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Replace deprecated @MockBean usage by providing mocked beans via a
    // TestConfiguration.
    // Expose mocks as static fields so tests can configure stubbing in @BeforeEach.
    private static final UserService userServiceMock = mock(UserService.class);
    private static final JwtUtil jwtUtilMock = mock(JwtUtil.class);
    private static final UserDetailsService userDetailsServiceMock = mock(UserDetailsService.class);

    @TestConfiguration
    public static class MockConfig {
        @Bean
        public UserService userService() {
            return userServiceMock;
        }

        @Bean
        public JwtUtil jwtUtil() {
            return jwtUtilMock;
        }

        @Bean
        public UserDetailsService userDetailsService() {
            return userDetailsServiceMock;
        }
    }

    private UserRegisterDto validRegisterDto;
    private UserLoginDto validLoginDto;
    private UserProfileUpdateDto userProfile;
    private UserDetails mockUserDetails;

    @BeforeEach
    void setUp() {
        // Reset the static mocks before each test to avoid cross-test interference
        reset(userServiceMock, jwtUtilMock, userDetailsServiceMock);

        validRegisterDto = new UserRegisterDto();
        validRegisterDto.setEmail("test@example.com");
        validRegisterDto.setPassword("password123");

        validLoginDto = new UserLoginDto();
        validLoginDto.setEmail("test@example.com");
        validLoginDto.setPassword("password123");

        userProfile = UserProfileUpdateDto.builder()
                .userId(1L)
                .firstName("John")
                .lastName("Doe")
                .email("test@example.com")
                .createdAt(LocalDateTime.of(2024, 1, 1, 10, 0, 0))
                .updatedAt(LocalDateTime.of(2024, 1, 1, 10, 0, 0))
                .build();

        mockUserDetails = User.builder()
                .username("test@example.com")
                .password("password123")
                .authorities(Collections.emptyList())
                .build();
    }

    @Nested
    @DisplayName("POST /api/v1/users/register")
    class RegisterEndpointTests {

        @Test
        @DisplayName("Should return 201 CREATED when registration succeeds")
        void register_WithValidData_ShouldReturnCreated() throws Exception {
            // Arrange
            when(userServiceMock.createUser(any(UserRegisterDto.class))).thenReturn(userProfile);
            when(userDetailsServiceMock.loadUserByUsername(anyString())).thenReturn(mockUserDetails);
            when(jwtUtilMock.generateToken(anyMap(), any(UserDetails.class))).thenReturn("mock-jwt-token");

            // Act & Assert
            mockMvc.perform(post("/api/v1/users/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validRegisterDto)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.status").value(201))
                    .andExpect(jsonPath("$.message").value("User created successfully"))
                    .andExpect(jsonPath("$.data.token").value("mock-jwt-token"))
                    .andExpect(jsonPath("$.data.user.email").value("test@example.com"));
        }

        @Test
        @DisplayName("Should return error when email already exists")
        void register_WithExistingEmail_ShouldReturnError() throws Exception {
            // Arrange
            when(userServiceMock.createUser(any(UserRegisterDto.class)))
                    .thenThrow(new RuntimeException("Email already registered"));

            // Act & Assert
            mockMvc.perform(post("/api/v1/users/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validRegisterDto)))
                    .andExpect(status().is5xxServerError());
        }
    }

    @Nested
    @DisplayName("POST /api/v1/users/login")
    class LoginEndpointTests {

        @Test
        @DisplayName("Should return 200 OK with token on successful login")
        void login_WithValidCredentials_ShouldReturnOkWithToken() throws Exception {
            // Arrange
            when(userServiceMock.login(any(UserLoginDto.class))).thenReturn(userProfile);
            when(userDetailsServiceMock.loadUserByUsername(anyString())).thenReturn(mockUserDetails);
            when(jwtUtilMock.generateToken(anyMap(), any(UserDetails.class))).thenReturn("mock-jwt-token");

            // Act & Assert
            mockMvc.perform(post("/api/v1/users/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validLoginDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value(200))
                    .andExpect(jsonPath("$.message").value("Login successful"))
                    .andExpect(jsonPath("$.data.token").value("mock-jwt-token"))
                    .andExpect(jsonPath("$.data.user.email").value("test@example.com"));
        }

        @Test
        @DisplayName("Should return error when credentials are invalid")
        void login_WithInvalidCredentials_ShouldReturnError() throws Exception {
            // Arrange
            when(userServiceMock.login(any(UserLoginDto.class)))
                    .thenThrow(new IllegalArgumentException("Invalid email or password"));

            // Act & Assert
            mockMvc.perform(post("/api/v1/users/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(validLoginDto)))
                    .andExpect(status().is4xxClientError());
        }
    }

    @Nested
    @DisplayName("PUT /api/v1/users/update")
    class UpdateProfileEndpointTests {

        @Test
        @DisplayName("Should return 200 OK when profile update succeeds")
        void updateProfile_WithValidData_ShouldReturnOk() throws Exception {
            // Arrange
            UserProfileUpdateDto updateDto = UserProfileUpdateDto.builder()
                    .userId(1L)
                    .firstName("Jane")
                    .lastName("Smith")
                    .build();

            UserProfileUpdateDto updatedProfile = UserProfileUpdateDto.builder()
                    .userId(1L)
                    .firstName("Jane")
                    .lastName("Smith")
                    .email("test@example.com")
                    .updatedAt(LocalDateTime.of(2024, 1, 2, 10, 0, 0))
                    .build();

            when(userServiceMock.updateProfile(any(Long.class), any(UserProfileUpdateDto.class)))
                    .thenReturn(updatedProfile);

            // Act & Assert
            mockMvc.perform(put("/api/v1/users/update")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value(200))
                    .andExpect(jsonPath("$.message").value("Profile updated successfully"))
                    .andExpect(jsonPath("$.data.firstName").value("Jane"))
                    .andExpect(jsonPath("$.data.lastName").value("Smith"));
        }

        @Test
        @DisplayName("Should return error when user not found")
        void updateProfile_WithNonExistentUser_ShouldReturnError() throws Exception {
            // Arrange
            UserProfileUpdateDto updateDto = UserProfileUpdateDto.builder()
                    .userId(999L)
                    .firstName("Jane")
                    .build();

            when(userServiceMock.updateProfile(any(Long.class), any(UserProfileUpdateDto.class)))
                    .thenThrow(new ResourceNotFoundException("Cannot update: User not found"));

            // Act & Assert
            mockMvc.perform(put("/api/v1/users/update")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("GET /api/v1/users/get/{id}")
    class GetUserByIdEndpointTests {

        @Test
        @DisplayName("Should return 200 OK with user data when user exists")
        void getUserById_WithExistingId_ShouldReturnUser() throws Exception {
            // Arrange
            when(userServiceMock.getUserById(1L)).thenReturn(userProfile);

            // Act & Assert
            mockMvc.perform(get("/api/v1/users/get/1")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.status").value(200))
                    .andExpect(jsonPath("$.message").value("User found successfully"))
                    .andExpect(jsonPath("$.data.userId").value(1))
                    .andExpect(jsonPath("$.data.email").value("test@example.com"))
                    .andExpect(jsonPath("$.data.firstName").value("John"));
        }

        @Test
        @DisplayName("Should return 404 NOT FOUND when user doesn't exist")
        void getUserById_WithNonExistentId_ShouldReturnNotFound() throws Exception {
            // Arrange
            when(userServiceMock.getUserById(999L))
                    .thenThrow(new ResourceNotFoundException("User not found"));

            // Act & Assert
            mockMvc.perform(get("/api/v1/users/get/999")
                    .contentType(MediaType.APPLICATION_JSON))
                    .andExpect(status().isNotFound());
        }
    }
}
