# Smart Campus Hub

A full-stack campus operations platform for student/user services, resource booking, incident ticketing, role-based dashboards, notifications, and Google OAuth login.

## Tech Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, React Hot Toast, Lucide Icons
- Backend: Spring Boot, Spring Security, Spring Data JPA, MySQL, JWT, OAuth2 Client, JavaMail
- Auth: Email/password + Google OAuth2
- Database: MySQL (`campus_hub_db`)

## Project Structure

```text
it3030-paf-2026-smart-campus/
├── frontend/                       # React app
├── BACKEND/campus-hub-backend/     # Spring Boot API
└── uploads/                        # Ticket attachment files (served statically)
```

## Core Modules and Functions

### 1) Authentication and User Management

- User registration (OTP flow + simple registration support)
- Login with JWT token issuing
- Google OAuth login and callback handling
- Current user profile fetch (`/api/auth/me`)
- Password management:
  - Change password
  - Forgot password
  - OTP verification
  - Password reset
- Admin user management:
  - List users
  - Get user by ID
  - Update user
  - Update role (USER / ADMIN / TECHNICIAN)
  - Delete user

### 2) Resource Management

- Resource listing and filtering
- Resource creation/update/deletion (admin)
- Resource availability/status updates
- Resource issue reporting

### 3) Booking Management

- Create booking requests
- View my bookings
- View all bookings (admin)
- Approve / reject bookings (admin)
- Cancel booking (user/admin constraints)
- Reschedule booking
- Delete cancelled booking
- Booking conflict handling with user-friendly messages
- Booking notifications for create/update and lifecycle changes

### 4) Incident Ticketing

- Create incident ticket
- View all tickets / my tickets / assigned tickets
- Ticket details page
- Ticket status updates
- Technician assignment
- Ticket deletion
- Ticket comments:
  - Add
  - List
  - Edit
  - Delete
- Ticket attachments:
  - Upload
  - List
  - Delete
  - Static serving for uploaded files

### 5) Notifications

- Fetch my notifications
- Unread notification count
- Mark one as read
- Mark all as read
- Delete notification
- Safe/fault-tolerant notification handling integrated with booking and ticket flows

### 6) Dashboards and Role-Based Access

- User dashboard and homepage quick actions
- Admin dashboard with nested routing/content areas
- Technician dashboard for incident workflows
- Protected routes with role-based guards

### 7) Chatbot Integration

- Backend chat endpoint (`/api/chat`)
- External webhook integration (configurable)
- Friendly fallback message handling if webhook is unavailable

## Frontend Routes (Major)

- Public:
  - `/`
  - `/register`
  - `/login`
  - `/forgot-password`
  - `/oauth-success`
  - `/api/auth/oauth-success`
- User:
  - `/dashboard/user`
  - `/profile`
  - `/bookings/new`
  - `/bookings/my-bookings`
  - `/user/facilities`
  - `/incidents`, `/incidents/create`, `/incidents/:id`
- Admin:
  - `/dashboard/admin`
  - `/dashboard/admin/users`
  - `/dashboard/admin/resources`
  - `/dashboard/admin/bookings`
  - `/dashboard/admin/incidents`
- Technician:
  - `/dashboard/technician`
  - `/dashboard/technician/incidents`

## Backend API Overview

### Auth (`/api/auth`)
- `GET /test`
- `POST /register/send-otp`
- `POST /register/verify`
- `POST /register-simple`
- `POST /login`
- `GET /me`
- `PATCH /change-password`
- `POST /forgot-password`
- `POST /verify-otp`
- `POST /reset-password`
- `GET /oauth-success`

### Admin Users (`/api/admin/users`)
- `GET /`
- `GET /{id}`
- `PUT /{id}`
- `PATCH /{id}/role`
- `DELETE /{id}`

### Resources (`/api/resources`)
- `GET /`
- `GET /{id}`
- `POST /`
- `PUT /{id}`
- `PATCH /{id}/status`
- `POST /{id}/issues`
- `DELETE /{id}`

### Bookings (`/api/bookings`)
- `POST /`
- `GET /my`
- `GET /`
- `PATCH /{id}/approve`
- `PATCH /{id}/reject`
- `PATCH /{id}/cancel`
- `PATCH /{id}/reschedule`
- `DELETE /{id}`

### Tickets (`/api/tickets`)
- Ticket CRUD/flows:
  - `POST /`
  - `GET /`
  - `GET /my`
  - `GET /assigned`
  - `GET /{id}`
  - `PATCH /{id}/status`
  - `PATCH /{id}/assign`
  - `DELETE /{id}`
- Comments:
  - `POST /{id}/comments`
  - `GET /{id}/comments`
  - `PUT /{id}/comments/{commentId}`
  - `DELETE /{id}/comments/{commentId}`
- Attachments:
  - `POST /{id}/attachments`
  - `GET /{id}/attachments`
  - `DELETE /{id}/attachments/{attachmentId}`

### Notifications (`/api/notifications`)
- `GET /`
- `GET /unread-count`
- `PATCH /{id}/read`
- `PATCH /read-all`
- `DELETE /{id}`

### Chat (`/api/chat`)
- `POST /`

## Local Setup

## 1) Clone

```bash
git clone <your-repo-url>
cd it3030-paf-2026-smart-campus
```

## 2) Backend setup (Spring Boot)

Prerequisites:
- Java 21
- Maven 3.9+
- MySQL 8+

Steps:

```bash
cd BACKEND/campus-hub-backend
mvn clean install
mvn spring-boot:run
```

Backend default port: `8088`

## 3) Frontend setup (React + Vite)

Prerequisites:
- Node.js 20+
- npm 10+

Steps:

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Configuration Notes

- Configure database, JWT, mail, OAuth, and chatbot webhook in backend config before production use.
- Keep secrets out of source control (recommended: environment variables or secret manager).
- Ensure `uploads/` directory exists and backend has write permission.

## Recommended Environment Variables

For production-ready deployment, externalize these values:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID`
- `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET`
- `APP_FRONTEND_URL`
- `APP_CHAT_N8N_WEBHOOK`

## Functional Highlights

- Consistent user-facing booking UI with dashboard-aligned styling
- Admin nested dashboard routing with persistent left navigation
- Role-specific ticket pages (user vs admin/technician layouts)
- Attachment serving and encoded URL compatibility for filenames with spaces
- Notification resilience for database and transaction edge cases
- Better frontend API error parsing for non-JSON backend responses

## Testing and Quality Commands

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Backend:

```bash
cd BACKEND/campus-hub-backend
mvn test
```

## Troubleshooting

- If OAuth callback opens a blank page:
  - confirm frontend route for `/oauth-success` and `/api/auth/oauth-success` exists
- If bookings/tickets return 500:
  - verify DB schema and required tables are created
  - verify backend is running on `8088`
- If attachments do not display:
  - verify static uploads mapping and file path encoding
- If frontend context errors appear (e.g. booking context):
  - restart Vite server after provider-tree changes

## Team Notes

- Keep API response shapes stable (especially auth, booking, notification endpoints)
- Prefer explicit role checks on sensitive actions
- Maintain consistent design tokens (`#0A192F`, `#e8edf5`) across user-facing pages