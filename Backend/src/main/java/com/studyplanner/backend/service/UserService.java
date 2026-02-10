package com.studyplanner.backend.service;

import com.studyplanner.backend.dto.UserLoginDto;
import com.studyplanner.backend.dto.UserProfileUpdateDto;
import com.studyplanner.backend.dto.UserRegisterDto;

public interface UserService {

    UserProfileUpdateDto createUser(UserRegisterDto userDto);

    UserProfileUpdateDto login(UserLoginDto userDto);

    UserProfileUpdateDto updateProfile(UserProfileUpdateDto userDto);

    UserProfileUpdateDto getUserById(Long userId);
}
