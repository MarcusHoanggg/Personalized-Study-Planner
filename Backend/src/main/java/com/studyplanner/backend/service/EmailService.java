package com.studyplanner.backend.service;

import com.studyplanner.backend.entity.Task;

public interface EmailService {

    void sendTaskReminderEmail(String email, String firstName, Task task);

    void sendWelcomeEmail(String email, String firstName);
}
