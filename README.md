## Personalized Study Planner – Overview

### Project description

The Personalized Study Planner is a full-stack web application that helps students plan, organize, and track their study activities. It combines a modern **React + TypeScript** frontend with a **Spring Boot** backend and a relational database to deliver personalized schedules, progress tracking, and smart integrations (Google OAuth2, email, calendar, and AI-powered assistance).

Key capabilities include:
- **User registration & authentication**, including Google OAuth2 login.
- **Personalized study plan creation**, with subjects, tasks, and time slots.
- **Dynamic scheduling & progress tracking**, helping students stay on top of their goals.
- **Integrations** such as email notifications, Google Calendar sync, and AI support for suggestions.

### High-level flow

1. Users access the **frontend SPA** (served via Nginx) in the browser.
2. The frontend communicates with the **Spring Boot backend** via REST APIs (e.g. `/api/**`, `/oauth2/authorization/**`).
3. The backend authenticates users (username/password + OAuth2), issues JWT tokens, and enforces authorization.
4. Application data (users, study plans, tasks, schedules, etc.) is persisted through **Spring Data JPA** to a **PostgreSQL** database.
5. Background responsibilities include sending email notifications, integrating with Google Calendar, and using AI services to enhance the planning experience.

### Architecture overview

- **Frontend**
  - React + TypeScript + Vite SPA
  - Deployed behind Nginx (also handling API proxying and OAuth2 redirects)
  - See `Frontend/README.md` for details and local run instructions

- **Backend**
  - Spring Boot REST API (`Personalized-Study-Planner` application)
  - Uses Spring Security (JWT + OAuth2), Spring Data JPA, and PostgreSQL
  - Configured via `application.yaml` with externalized environment variables
  - See `Backend/README.md` for service details and environment configuration

- **Data & external services**
  - Relational database (PostgreSQL) for persistent storage
  - SMTP mail server (e.g. Gmail) for notifications
  - Google OAuth2 and Calendar APIs
  - Google GenAI (Gemini) for AI-related features

### ER and Use Case diagrams

The system architecture is backed by:
- An **ER diagram** that models the main entities (User, StudyPlan, Task/Subject, Schedule/Session, etc.) and their relationships.
- A **Use Case diagram** that shows high-level interactions like registration/login, Google sign-in, creating/updating study plans, generating schedules, and tracking progress.

These diagrams live alongside the project documentation and are referenced by the sprint reports.
### Localization

- Row-based localization: Each task stores a language column (EN/FI/VI/NE) set from the user's active UI language via i18next. LLM-generated tasks are prompted to respond in the same language.



### Sprint reports

All sprint documentation, including planning notes, retrospective summaries, and design artifacts (ER and Use Case diagrams), is stored in the **Sprint Report** folder in the project root. Use that folder as the primary reference for project history and detailed design decisions.

### Subproject READMEs

- **Frontend**: see `Frontend/README.md` for UI, tech stack, and run instructions.
- **Backend**: see `Backend/README.md` for API, configuration, and backend stack details.


