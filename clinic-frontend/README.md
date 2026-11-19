# Al Shifa Homeo Clinic frontend

React, Vite, Tailwind CSS, React Router, Axios, and Lucide React frontend for the existing Spring Boot clinic API.

## Run locally

1. Start the clinic backend at `http://localhost:8080`.
2. Copy `.env.example` to `.env` (or create a `.env.local`) and set `VITE_API_BASE_URL` to the backend origin.
3. Run `npm install`, then `npm run dev`.

For a production build, run `npm run build`; preview it with `npm run preview`. Run `npm run lint` for ESLint.

## Deploy to Vercel

Import `clinic-frontend/` as the Vercel project root. The Vite defaults are build command `npm run build` and output directory `dist`. Set this environment variable in Vercel for each environment:

```text
VITE_API_BASE_URL=https://your-deployed-backend-origin
VITE_CLINIC_WHATSAPP_NUMBER=917547899822
```

Use the backend's origin only, without a trailing `/api`. Vite embeds `VITE_` values into the frontend bundle, so this variable is a public API URL and must not contain secrets.

## Backend integration notes

- Public booking uses `POST /api/appointments` and the DTO fields `patientName`, `phone`, `appointmentDate`, `appointmentTime`, and optional `reason`. Time is sent as `HH:mm:ss`; new requests are `PENDING`.
- Staff authentication uses the backend's HTTP Basic mechanism and `GET /api/auth/me`. Credentials remain in memory for the current page session; refreshing the page requires signing in again.
- Use HTTPS for the deployed backend because HTTP Basic credentials must be protected in transit.
- `ADMIN`, `DOCTOR`, and `STAFF` can view appointments. `ADMIN` and `DOCTOR` can update appointment statuses.
- The backend does not currently configure CORS. For separate local/Vercel origins, configure the backend to allow the exact frontend origin, `GET`, `POST`, `PATCH`, preflight `OPTIONS`, and the `Authorization` and `Content-Type` headers. The frontend does not change backend configuration.
- WhatsApp booking uses the same POST /api/appointments request and then opens a prefilled WhatsApp message after the API confirms the save. Set VITE_CLINIC_WHATSAPP_NUMBER to the clinic number using country code and digits only. The current number is 917547899822.
- The public website describes in-clinic visits only; it does not offer online consultations.

## Routes

- `/` — clinic home
- `/about`, `/services`, `/contact` — public clinic information
- `/appointment` — public appointment request
- `/staff/login`, `/staff/appointments` — staff dashboard
