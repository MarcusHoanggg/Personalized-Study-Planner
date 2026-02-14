package com.studyplanner.backend.service.impl;

import com.studyplanner.backend.entity.Task;
import com.studyplanner.backend.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@AllArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

  private final JavaMailSender mailSender;

  private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");

  // ---- Email Service Implementation for Sending Task Reminders ----

  @Override
  @Async // sends email in a background thread so it doesn't block the scheduler
  public void sendTaskReminderEmail(String toEmail, String firstName, Task task) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(toEmail);
      helper.setSubject("Study Planner Reminder: \"" + task.getTaskName() + "\" is due tomorrow!");
      helper.setText(buildReminderEmailBody(firstName, task), true); // true = HTML

      mailSender.send(message);
      log.info("Reminder email sent to {} for task '{}'", toEmail, task.getTaskName());

    } catch (MessagingException e) {
      log.error("Failed to send reminder email to {} for task '{}': {}",
          toEmail, task.getTaskName(), e.getMessage());
    }
  }

  // ---- Email Service Implementation for Sending Welcome Emails ----
  @Override
  @Async // sends email in a background thread so it doesn't block the scheduler
  public void sendWelcomeEmail(String toEmail, String firstName) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(toEmail);
      helper.setSubject("Welcome to Personalized Study Planner!");
      helper.setText(buildWelcomeEmailBody(firstName), true); // true = HTML

      mailSender.send(message);
      log.info("Welcome email sent to {} for user '{}'", toEmail, firstName);

    } catch (MessagingException e) {
      log.error("Failed to send welcome email to {} for user '{}': {}",
          toEmail, firstName, e.getMessage());
    }
  }

  // ---- Email Body Builders ----
  private String buildReminderEmailBody(String firstName, Task task) {
    String deadline = task.getTaskDeadline() != null
        ? task.getTaskDeadline().format(FORMATTER)
        : "No deadline set";

    String priorityColor = switch (task.getPriority()) {
      case HIGH -> "#e74c3c";
      case MEDIUM -> "#f39c12";
      case LOW -> "#27ae60";
      default -> "#7f8c8d";
    };

    String statusBadge = switch (task.getStatus()) {
      case PENDING -> " Pending";
      case IN_PROGRESS -> " In Progress";
      case COMPLETED -> " Completed";
      default -> task.getStatus().name();
    };

    return """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff;
                         border-radius: 8px; overflow: hidden;
                         box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background-color: #2c3e50; padding: 24px 32px; color: #ffffff; }
            .header h1 { margin: 0; font-size: 22px; }
            .header p  { margin: 6px 0 0; font-size: 14px; color: #bdc3c7; }
            .body { padding: 32px; }
            .greeting { font-size: 16px; color: #2c3e50; margin-bottom: 20px; }
            .task-card { background: #f8f9fa; border-left: 4px solid #2c3e50;
                         border-radius: 4px; padding: 20px 24px; margin-bottom: 24px; }
            .task-title { font-size: 20px; font-weight: bold; color: #2c3e50; margin: 0 0 12px; }
            .task-row { display: flex; margin-bottom: 8px; font-size: 14px; }
            .task-label { color: #7f8c8d; width: 110px; flex-shrink: 0; }
            .task-value { color: #2c3e50; font-weight: 500; }
            .priority-badge { display: inline-block; padding: 2px 10px; border-radius: 12px;
                              color: #fff; font-size: 13px; font-weight: bold;
                              background-color: %s; }
            .deadline-highlight { background: #fff3cd; border: 1px solid #ffc107;
                                  border-radius: 4px; padding: 12px 16px; margin-bottom: 24px;
                                  font-size: 14px; color: #856404; }
            .footer { background: #f8f9fa; padding: 16px 32px; font-size: 12px;
                      color: #95a5a6; text-align: center; border-top: 1px solid #e9ecef; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Personalized Study Planner</h1>
              <p>Task Deadline Reminder</p>
            </div>
            <div class="body">
              <p class="greeting">Hi <strong>%s</strong>,</p>
              <p style="color:#555; font-size:15px;">
                This is a friendly reminder that the following task is due <strong>tomorrow</strong>.
                Make sure you're on track!
              </p>

              <div class="task-card">
                <p class="task-title">%s</p>
                <div class="task-row">
                  <span class="task-label">Description:</span>
                  <span class="task-value">%s</span>
                </div>
                <div class="task-row">
                  <span class="task-label">Priority:</span>
                  <span class="priority-badge">%s</span>
                </div>
                <div class="task-row">
                  <span class="task-label">Status:</span>
                  <span class="task-value">%s</span>
                </div>
                <div class="task-row">
                  <span class="task-label">Deadline:</span>
                  <span class="task-value">%s</span>
                </div>
              </div>

              <div class="deadline-highlight">
                 <strong>Due tomorrow!</strong> Log in to your Study Planner to review and complete this task.
              </div>

              <p style="color:#555; font-size:14px;">
                Stay focused and good luck!
                Have a productive day!
              </p>
            </div>
            <div class="footer">
              You are receiving this email because you have a task deadline approaching in your Study Planner.<br>
              This is an automated reminder — please do not reply to this email.
            </div>
          </div>
        </body>
        </html>
        """
        .formatted(
            priorityColor,
            firstName,
            task.getTaskName(),
            task.getTaskDescription(),
            task.getPriority().name(),
            statusBadge,
            deadline);
  }

  private String buildWelcomeEmailBody(String firstName) {
    return """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff;
                         border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background-color: #2c3e50; padding: 32px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0 0 8px; font-size: 26px; }
            .header p  { margin: 0; font-size: 15px; color: #bdc3c7; }
            .body { padding: 36px 32px; }
            .message { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px; }
            .features { background: #f8f9fa; border-radius: 6px; padding: 20px 24px; margin-bottom: 28px; }
            .features h3 { margin: 0 0 12px; color: #2c3e50; font-size: 15px; }
            .feature-item { font-size: 14px; color: #555; margin-bottom: 8px; }
            .quote { border-left: 4px solid #2c3e50; padding: 12px 20px; margin-bottom: 24px;
                     font-size: 14px; color: #7f8c8d; font-style: italic; }
            .footer { background: #f8f9fa; padding: 16px 32px; font-size: 12px;
                      color: #95a5a6; text-align: center; border-top: 1px solid #e9ecef; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 Personalized Study Planner</h1>
              <p>Your journey to success starts here</p>
            </div>
            <div class="body">
              <p style="font-size:18px; color:#2c3e50;">Welcome, <strong>%s</strong>! 🎉</p>
              <p class="message">
                We're thrilled to have you on board. You've just taken the first step toward
                taking control of your learning — and your future.
                <br><br>
                With <strong>Personalized Study Planner</strong>, you don't just create tasks —
                you build habits, set goals, and turn your ambitions into achievements.
                Whether you're preparing for exams, learning a new skill, or planning your
                career path, we're here to keep you focused every step of the way.
              </p>
              <div class="features">
                <h3>✨ Here's what you can do:</h3>
                <div class="feature-item">📝 &nbsp; Create and organize your study tasks</div>
                <div class="feature-item">🎯 &nbsp; Set priorities and track your progress</div>
                <div class="feature-item">⏰ &nbsp; Get deadline reminders before it's too late</div>
                <div class="feature-item">📈 &nbsp; Build consistent study habits day by day</div>
              </div>
              <div class="quote">
                "The secret of getting ahead is getting started." — Mark Twain
              </div>
              <p class="message">
                Create your first task today and build not only your studies —
                but your future as well. 🚀
              </p>
            </div>
            <div class="footer">
              You're receiving this because you registered at Personalized Study Planner.<br>
              Automated message — please do not reply.
            </div>
          </div>
        </body>
        </html>
        """.formatted(firstName);
  }
}