# Al Shifa Homoeo Clinic

A full-stack clinic website and appointment management system built for Al Shifa Homoeo Clinic in Kolasi, Katihar, Bihar. Patients can submit an in-clinic appointment request online or continue the saved request in WhatsApp. Clinic staff manage requests from a role-protected dashboard.

**Live website:** [al-shifa-homoeo-clinic.vercel.app](https://al-shifa-homoeo-clinic.vercel.app/)  
**Staff portal:** `/staff/login` on the live website

> This project handles appointment requests. A request remains pending until clinic staff updates its status. The site does not offer online consultations or automated SMS/WhatsApp delivery.

## Features

### Public website

- Responsive clinic pages for Home, About, Treatments, Clinic, Appointment, Reviews, Gallery, FAQ, and Contact.
- Appointment request form with client-side validation and API error/success states.
- Online booking and WhatsApp booking use the same backend appointment endpoint.
- WhatsApp opens after the appointment request has been saved, with a pre-filled message for the patient to review and send.
- Clinic location, hours, doctor profiles, and contact actions.

### Staff dashboard

- HTTP Basic sign-in with role-based access.
- Appointment list sorted newest first, with status filtering and appointment details.
- Admin and doctor actions to change appointment status or soft-delete a request.
- Click-to-call and pre-filled WhatsApp status messages for patients. Staff must review and send WhatsApp messages; they are not sent automatically.
- User management: admins can create and manage admin, doctor, and staff accounts; doctors can manage doctor and staff accounts within their permissions.
- Soft deletion keeps removed appointments and users in the database while removing them from active lists.

### Backend API

- Spring Boot REST API with MySQL persistence, request validation, and BCrypt password hashing.
- Public appointment creation; authenticated appointment and user management according to role.
- Appointment statuses: `PENDING`, `CONFIRMED`, `REJECTED`, `COMPLETED`, and `CANCELLED`.
- Initial admin bootstrap through environment variables when no active admin account exists.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Tailwind CSS, Lucide React |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA, Bean Validation |
| Database | MySQL |
| Deployment | Vercel (frontend), Docker-compatible web service (backend) |

## Repository layout

```text
clinic-frontend/   React application and public/staff user interfaces
clinic-backend/    Spring Boot API, persistence, validation, and security
```

## Run locally

### Requirements

- Node.js and npm
- Java 21
- MySQL

### 1. Create a local database

Create a MySQL database named `al_shifa_clinic`, or use another name and update the JDBC URL below.

### 2. Configure and start the backend

In PowerShell, from the repository root, set local environment variables. Replace the example values with your own local credentials; do not commit real secrets.

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/al_shifa_clinic"
$env:SPRING_DATASOURCE_USERNAME = "root"
$env:DB_PASSWORD = "your-local-mysql-password"
$env:CLINIC_ADMIN_NAME = "Clinic Admin"
$env:CLINIC_ADMIN_EMAIL = "admin@example.com"
$env:CLINIC_ADMIN_PASSWORD = "choose-a-strong-password"
cd clinic-backend
.\mvnw.cmd spring-boot:run
```

The backend starts on `http://localhost:8080`. The configured initial admin is created only when the database has no active admin account.

### 3. Configure and start the frontend

In a second terminal:

```powershell
cd clinic-frontend
Copy-Item .env.example .env.local
```

Set the values in `clinic-frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_CLINIC_WHATSAPP_NUMBER=917547899822
```

Use the clinic number in international format with digits only. Then run:

```powershell
npm install
npm run dev -- --port 5175
```

Open `http://localhost:5175`. Port `5175` is included in the backend's current CORS allowlist.

## Environment variables

### Backend

| Variable | Purpose |
| --- | --- |
| `SPRING_DATASOURCE_URL` | MySQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `CLINIC_ADMIN_NAME` | Name for initial admin bootstrap |
| `CLINIC_ADMIN_EMAIL` | Email for initial admin bootstrap |
| `CLINIC_ADMIN_PASSWORD` | Password for initial admin bootstrap (8–72 characters) |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend origin, such as `https://your-api.example.com`; do not append `/api` |
| `VITE_CLINIC_WHATSAPP_NUMBER` | Clinic WhatsApp number, country code plus digits, without `+` or spaces |

Only public configuration belongs in `VITE_` variables. Never put passwords, database credentials, or API secrets in frontend environment variables.

## API overview

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/appointments` | Public | Create an appointment request |
| `GET` | `/api/appointments` | Admin, doctor, staff | List active appointments |
| `GET` | `/api/appointments/status/{status}` | Admin, doctor, staff | Filter appointments by status |
| `PATCH` | `/api/appointments/{id}/status` | Admin, doctor | Update appointment status |
| `DELETE` | `/api/appointments/{id}` | Admin, doctor | Soft-delete an appointment |
| `GET` | `/api/auth/me` | Authenticated | Return the current staff identity |
| `/api/users` | `GET`, `POST` | Role restricted | List/create staff accounts |
| `/api/users/{id}/status` | `PATCH` | Admin, doctor | Enable or disable an eligible account |
| `/api/users/{id}` | `DELETE` | Admin, doctor | Soft-delete an account |

Staff authentication uses HTTP Basic. Use HTTPS in production so credentials are protected in transit. CORS currently allows `http://localhost:5175` and the production Vercel origin; update the backend allowlist when using a different frontend domain.

## Build and checks

```powershell
cd clinic-frontend
npm run lint
npm run build
```

```powershell
cd clinic-backend
.\mvnw.cmd test
```

## Deployment notes

- **Vercel:** set the project root to `clinic-frontend`, build with `npm run build`, and use `dist` as the output directory. Configure `VITE_API_BASE_URL` and `VITE_CLINIC_WHATSAPP_NUMBER` for Production and redeploy after changing them.
- **Backend:** deploy `clinic-backend` using its Dockerfile. Configure the backend environment variables above and point `SPRING_DATASOURCE_URL` at the deployed MySQL service.
- Add the deployed frontend origin to the backend CORS allowlist before connecting a new Vercel domain.
- Never commit `.env` files or production credentials.

## Current appointment scheduling behavior

The backend currently requires an `appointmentTime` in its request DTO. The public form collects the preferred date but does not display a time field; it sends `10:00:00` to satisfy the existing API. The dashboard's call and WhatsApp actions use the saved patient phone number. WhatsApp messages are prepared for staff to send manually.

