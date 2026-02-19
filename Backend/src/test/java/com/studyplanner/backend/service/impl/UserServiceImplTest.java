package com.studyplanner.backend.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;
import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.exception.ResourceNotFoundException;
import com.studyplanner.backend.repository.UserRepository;

/**
 * Unit tests for UserServiceImpl.
 * Tests cover user registration, login, profile update, and retrieval
 * operations.
 */
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserRegisterDto validRegisterDto;
    private UserLoginDto validLoginDto;
    private User existingUser;

    @BeforeEach
    void setUp() {
        // Common test data setup
        validRegisterDto = new UserRegisterDto();
        validRegisterDto.setEmail("test@example.com");
        validRegisterDto.setPassword("password123");

        validLoginDto = new UserLoginDto();
        validLoginDto.setEmail("test@example.com");
        validLoginDto.setPassword("hashedPassword");

        existingUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .password("hashedPassword")
                .firstName("John")
                .lastName("Doe")
                .createdAt(LocalDateTime.of(2024, 1, 1, 10, 0, 0))
                .updatedAt(LocalDateTime.of(2024, 1, 1, 10, 0, 0))
                .build();
    }

    @Nested
    @DisplayName("createUser Tests")
    class CreateUserTests {

        @Test
        @DisplayName("Should successfully create a new user with valid data")
        void createUser_WithValidData_ShouldReturnCreatedUser() {
            // Arrange
            when(userRepository.findByEmail(validRegisterDto.getEmail())).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setId(1L);
                return user;
            });

            // Act
            UserProfileUpdateDto result = userService.createUser(validRegisterDto);

            // Assert
            assertNotNull(result);
            assertEquals(validRegisterDto.getEmail(), result.getEmail());
            assertNotNull(result.getCreatedAt());
            assertNotNull(result.getUpdatedAt());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when email already exists")
        void createUser_WithExistingEmail_ShouldThrowException() {
            // Arrange
            when(userRepository.findByEmail(validRegisterDto.getEmail())).thenReturn(Optional.of(existingUser));

            // Act & Assert
            RuntimeException exception = assertThrows(RuntimeException.class,
                    () -> userService.createUser(validRegisterDto));
            assertEquals("Email already registered", exception.getMessage());
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should hash password before saving")
        void createUser_ShouldHashPassword() {
            // Arrange
            when(userRepository.findByEmail(validRegisterDto.getEmail())).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setId(1L);
                // Verify password is hashed (BCrypt hashes start with $2a$, $2b$, or $2y$)
                assertTrue(user.getPassword().startsWith("$2"));
                return user;
            });

            // Act
            userService.createUser(validRegisterDto);

            // Assert
            verify(userRepository).save(argThat(user -> user.getPassword() != null &&
                    !user.getPassword().equals(validRegisterDto.getPassword())));
        }
    }

    @Nested
    @DisplayName("login Tests")
    class LoginTests {

        @Test
        @DisplayName("Should return user profile on successful login")
        void login_WithValidCredentials_ShouldReturnUserProfile() {
            // Arrange
            when(userRepository.findByEmail(validLoginDto.getEmail())).thenReturn(Optional.of(existingUser));

            // Act
            UserProfileUpdateDto result = userService.login(validLoginDto);

            // Assert
            assertNotNull(result);
            assertEquals(existingUser.getEmail(), result.getEmail());
            assertEquals(existingUser.getFirstName(), result.getFirstName());
            assertEquals(existingUser.getLastName(), result.getLastName());
        }

        @Test
        @DisplayName("Should throw exception when email not found")
        void login_WithNonExistentEmail_ShouldThrowException() {
            // Arrange
            when(userRepository.findByEmail(validLoginDto.getEmail())).thenReturn(Optional.empty());

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> userService.login(validLoginDto));
            assertEquals("Invalid email or password", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when password is incorrect")
        void login_WithWrongPassword_ShouldThrowException() {
            // Arrange
            validLoginDto.setPassword("wrongPassword");
            when(userRepository.findByEmail(validLoginDto.getEmail())).thenReturn(Optional.of(existingUser));

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> userService.login(validLoginDto));
            assertEquals("Invalid email or password", exception.getMessage());
        }
    }

    @Nested
    @DisplayName("updateProfile Tests")
    class UpdateProfileTests {

        @Test
        @DisplayName("Should successfully update user profile")
        void updateProfile_WithValidData_ShouldReturnUpdatedProfile() {
            // Arrange
            UserProfileUpdateDto updateDto = UserProfileUpdateDto.builder()
                    .userId(1L)
                    .firstName("Jane")
                    .lastName("Smith")
                    .profilePicture("new-picture.jpg")
                    .build();

            when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            UserProfileUpdateDto result = userService.updateProfile(1L, updateDto);

            // Assert
            assertNotNull(result);
            assertEquals("Jane", result.getFirstName());
            assertEquals("Smith", result.getLastName());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw exception when userId is null")
        void updateProfile_WithNullUserId_ShouldThrowException() {
            // Arrange
            UserProfileUpdateDto updateDto = UserProfileUpdateDto.builder()
                    .userId(null)
                    .firstName("Jane")
                    .build();

            // Act & Assert
            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                    () -> userService.updateProfile(null, updateDto));
            assertEquals("User ID is required", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void updateProfile_WithNonExistentUser_ShouldThrowException() {
            // Arrange
            UserProfileUpdateDto updateDto = UserProfileUpdateDto.builder()
                    .userId(999L)
                    .firstName("Jane")
                    .build();

            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(ResourceNotFoundException.class,
                    () -> userService.updateProfile(999L, updateDto));
        }

        @Test
        @DisplayName("Should update only provided fields")
        void updateProfile_WithPartialData_ShouldUpdateOnlyProvidedFields() {
            // Arrange
            UserProfileUpdateDto updateDto = UserProfileUpdateDto.builder()
                    .userId(1L)
                    .firstName("Jane")
                    .build();

            when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            UserProfileUpdateDto result = userService.updateProfile(1L, updateDto);

            // Assert
            assertNotNull(result);
            assertEquals("Jane", result.getFirstName());
            assertEquals("Doe", result.getLastName()); // Should remain unchanged
        }
    }

    @Nested
    @DisplayName("getUserById Tests")
    class GetUserByIdTests {

        @Test
        @DisplayName("Should return user when found")
        void getUserById_WithExistingId_ShouldReturnUser() {
            // Arrange
            when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));

            // Act
            UserProfileUpdateDto result = userService.getUserById(1L);

            // Assert
            assertNotNull(result);
            assertEquals(existingUser.getId(), result.getUserId());
            assertEquals(existingUser.getEmail(), result.getEmail());
            assertEquals(existingUser.getFirstName(), result.getFirstName());
        }

        @Test
        @DisplayName("Should throw exception when user not found")
        void getUserById_WithNonExistentId_ShouldThrowException() {
            // Arrange
            when(userRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                    () -> userService.getUserById(999L));
            assertEquals("User not found", exception.getMessage());
        }
    }
}
