package com.studyplanner.backend.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.studyplanner.backend.entity.User;
import com.studyplanner.backend.repository.UserRepository;
import com.studyplanner.backend.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication)
            throws IOException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String email = oauth2User.getAttribute("email");
        String googleId = oauth2User.getAttribute("sub"); // Google's unique ID for the user
        String firstName = oauth2User.getAttribute("name");

        // Check if user already exists in the database
        User user = userRepository.findByGoogleId(googleId).orElseGet(() -> {

            // Check if email is already registered with a local account
            return userRepository.findByEmail(email).map(existingUser -> {
                existingUser.setGoogleId(googleId);
                existingUser.setAuthProvider(User.AuthProvider.GOOGLE);
                return userRepository.save(existingUser);
            }).orElseGet(() -> {
                User newUser = User.builder()
                        .email(email)
                        .firstName(firstName)
                        .googleId(googleId)
                        .authProvider(User.AuthProvider.GOOGLE)
                        .password(null)
                        .build();
                User saved = userRepository.save(newUser);
                // Send welcome email for first-time Google sign-up
                try {
                    emailService.sendWelcomeEmail(email, firstName != null && !firstName.isBlank() ? firstName : "there");
                } catch (Exception e) {
                    log.warn("Failed to send welcome email to {}: {}", email, e.getMessage());
                }
                return saved;
            });
        });

        // Generate JWT token for the authenticated user
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(Map.of("userId", user.getId()), userDetails);

        // Redirect to frontend with the token as a query parameter
        String redirectUrl = frontendUrl + "/oauth2/redirect?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);

    }
}
