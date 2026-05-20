# MediRush

MediRush is a professional pharmacy operating website built with the **MERN stack**:

- **MongoDB** for persistent pharmacy, order, prescription, and reminder records.
- **Express + Node.js** for the protected REST API.
- **React 19 + Vite** for the modern single-page frontend.
- **Gemini API** for a protected AI Copilot using RAG over live MongoDB context.

Repository: [github.com/Vamssikrishna/medico](https://github.com/Vamssikrishna/medico)

## Core Product Rules

- There is **no predefined catalogue data**.
- There are **no predefined medicines, pharmacies, orders, prescriptions, reminders, or users**.
- Pharmacies must upload their own medicine/tablet stock before customers can browse or order.
- All business screens are locked behind email OTP authentication.
- OTP codes are sent by email only. They are never shown in the website response.
- Gemini AI answers are grounded through RAG using live MongoDB records only.

## Features

- Secure email OTP login with JWT sessions.
- Protected React website: no entry without sign-in.
- Pharmacy inventory upload, CSV import, listing, and deletion.
- Customer marketplace using uploaded MongoDB inventory only.
- Cart and order creation with stock validation.
- Mongo-backed order stream and fulfilment state.
- Prescription record upload workflow.
- Reminder source workspace based on uploaded inventory.
- Gemini AI Copilot with RAG over inventory, orders, prescriptions, and reminders.
- Versioned API endpoints under `/api/v1`.
- Route discovery endpoint for auditing available API routes.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, custom CSS |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | Email OTP + JWT |
| Email | SMTP via Nodemailer |
| AI | Gemini API |
| Validation | Zod |
| Dev tooling | ESLint, TypeScript, Concurrently |

## Prerequisites

Install these before running the project:

- Node.js 20+
- npm 10+
- MongoDB running locally or a valid MongoDB connection string
- SMTP credentials for email OTP
- Gemini API key for AI Copilot

## Local Setup

Clone and install:

```bash
git clone https://github.com/Vamssikrishna/medico.git
cd medico
npm install
```

Start MongoDB locally:

```bash
mongod
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The dev command starts both services:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`

## Environment Variables

Use one local environment file only:

```text
.env.local
```

Required local structure:

```env
VITE_APP_URL=http://localhost:3000
VITE_API_URL=http://localhost:5000

PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/medico
JWT_SECRET=change-this-before-production
CORS_ORIGIN=http://localhost:3000

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="MediRush <your-email@gmail.com>"

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

### Environment Reference

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_APP_URL` | Yes | Public frontend URL. |
| `VITE_API_URL` | Yes | Express API base URL used by the React app. |
| `PORT` | Yes | Express server port. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign JWT sessions. Use a strong value in production. |
| `CORS_ORIGIN` | Yes | Allowed frontend origin for browser requests. |
| `SMTP_HOST` | Yes | SMTP server host. |
| `SMTP_PORT` | Yes | SMTP server port. |
| `SMTP_SECURE` | Yes | `true` for port `465`, otherwise usually `false`. |
| `SMTP_USER` | Yes | SMTP username. |
| `SMTP_PASS` | Yes | SMTP password or provider app password. |
| `SMTP_FROM` | Yes | From address used for OTP emails. |
| `GEMINI_API_KEY` | Yes for AI | Gemini API key. Keep it backend-only. |
| `GEMINI_MODEL` | Yes for AI | Gemini model name. Defaults to `gemini-1.5-flash` if omitted. |

For Gmail, `SMTP_PASS` should be a Google App Password, not your normal Gmail password.

## Scripts

```bash
npm run dev
```

Runs Vite and Express together in development.

```bash
npm run build
```

Builds the Vite React frontend into `dist/`.

```bash
npm run start
```

Runs Vite preview and Express together.

```bash
npm run lint
```

Runs ESLint across the active MERN codebase.

## Authentication Flow

The website is fully gated.

1. User enters name and email on the login screen.
2. Frontend calls `POST /api/v1/auth/send-otp`.
3. Backend generates an OTP and sends it through SMTP.
4. User enters the OTP from email.
5. Frontend calls `POST /api/v1/auth/verify-otp`.
6. Backend returns a JWT and user profile.
7. Frontend stores the JWT locally and includes it as a bearer token for protected API calls.
8. Business screens and API routes become accessible.

If the JWT is missing or expired, protected endpoints return `401`.

## API Routes

All business routes are available under `/api/v1` and require JWT authentication unless marked public.

### Public

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/health` | API and MongoDB health response. |
| `GET` | `/api/v1/routes` | Lists available routes. |
| `POST` | `/api/v1/auth/send-otp` | Sends OTP to email. |
| `POST` | `/api/v1/auth/verify-otp` | Verifies OTP and returns JWT. |

### Protected Inventory

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/inventory` | List uploaded medicines. Supports `q` and `limit`. |
| `GET` | `/api/v1/inventory/:slug` | Get medicine by slug. |
| `GET` | `/api/v1/inventory/id/:id` | Get medicine by Mongo ID. |
| `POST` | `/api/v1/inventory` | Create or update a medicine record. |
| `POST` | `/api/v1/inventory/bulk` | Bulk upload inventory rows. |
| `DELETE` | `/api/v1/inventory/:id` | Delete a medicine record. |
| `DELETE` | `/api/v1/inventory` | Clear inventory. |

### Protected Orders

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/orders` | List recent orders. |
| `GET` | `/api/v1/orders/:id` | Get order by order code. |
| `POST` | `/api/v1/orders` | Create order from uploaded inventory. |
| `PATCH` | `/api/v1/orders/:id/status` | Update order status. |

Order creation checks that all medicines exist and that stock is sufficient before decrementing inventory.

### Protected Prescriptions

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/prescriptions` | List prescription records. |
| `GET` | `/api/v1/prescriptions/:id` | Get prescription record. |
| `POST` | `/api/v1/prescriptions` | Create prescription record. |
| `PATCH` | `/api/v1/prescriptions/:id/status` | Update prescription status. |

### Protected Reminders

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/v1/reminders` | List reminders. |
| `GET` | `/api/v1/reminders/:id` | Get reminder. |
| `POST` | `/api/v1/reminders` | Create reminder. |
| `PATCH` | `/api/v1/reminders/:id` | Update reminder. |
| `DELETE` | `/api/v1/reminders/:id` | Delete reminder. |

### Protected AI

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/ai/assistant` | Gemini RAG answer grounded in MongoDB context. |

## Gemini RAG Copilot

The Gemini Copilot does not train a model inside the app. Instead, it uses a production-style RAG flow:

1. The user asks a question.
2. Backend retrieves relevant MongoDB records:
   - inventory
   - orders
   - prescriptions
   - reminders
3. Backend sends a structured context package to Gemini.
4. Gemini answers using only that context.
5. The response includes source counts so operators know what data was used.

The system instruction tells Gemini:

- Do not invent medicines, pharmacies, stock, orders, users, or prescriptions.
- Do not diagnose or prescribe.
- Say what data is missing if context is insufficient.
- Recommend pharmacist or clinician verification for medical safety.

## No Predefined Data Policy

This project includes a persistent Cursor rule at:

```text
.cursor/rules/no-predefined-data.mdc
```

The rule states:

- Do not add predefined catalogue or business records.
- Customer-visible catalogue data must come from pharmacy uploads.
- Empty states should guide users to create/upload data.
- Generic placeholders like `Brand Name` or `Pharmacy Name` are allowed.

## Project Structure

```text
.
├── index.html
├── vite.config.ts
├── package.json
├── README.md
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   ├── vite-env.d.ts
│   └── lib/
│       ├── api-client.ts
│       └── types.ts
└── server/
    ├── index.js
    ├── config/
    │   ├── db.js
    │   └── env.js
    ├── middleware/
    │   ├── asyncHandler.js
    │   └── auth.js
    ├── models/
    │   ├── Medicine.js
    │   ├── Order.js
    │   ├── Prescription.js
    │   └── Reminder.js
    ├── routes/
    │   ├── ai.js
    │   ├── auth.js
    │   ├── inventory.js
    │   ├── orders.js
    │   ├── prescriptions.js
    │   └── reminders.js
    ├── services/
    │   ├── gemini.js
    │   └── mailer.js
    └── utils/
        ├── http.js
        └── slug.js
```

## First Run Checklist

1. Start MongoDB:

```bash
mongod
```

2. Confirm `.env.local` has SMTP credentials.
3. Confirm `.env.local` has `GEMINI_API_KEY`.
4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`.
6. Sign in using email OTP.
7. Upload pharmacy inventory.
8. Use marketplace, orders, care operations, and Gemini AI Copilot.

## Troubleshooting

### OTP email is not received

- Check `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM`.
- For Gmail, use an App Password.
- Restart `npm run dev` after editing `.env.local`.

### API connection issue in frontend

- Confirm Express is running on `PORT`.
- Confirm `VITE_API_URL` points to the Express server.
- Confirm `CORS_ORIGIN` matches the frontend URL.

### MongoDB connection fails

- Start MongoDB with `mongod`.
- Check `MONGODB_URI`.
- Ensure MongoDB is installed and listening on the configured host/port.

### Gemini AI says API key missing

- Add `GEMINI_API_KEY` to `.env.local`.
- Restart the dev server.
- Confirm the key is valid for the selected `GEMINI_MODEL`.

### Protected route returns 401

- Sign in again using email OTP.
- The frontend must send `Authorization: Bearer <token>`.
- Sign out clears the local session.

## Production Notes

Before production deployment:

- Replace `JWT_SECRET` with a strong secret.
- Use MongoDB Atlas or a managed MongoDB instance.
- Use a transactional email provider for SMTP.
- Replace in-memory OTP storage with Redis and rate limiting.
- Add audit logs for pharmacy uploads and order status changes.
- Add role-based access control for pharmacy, admin, rider, and customer users.
- Serve frontend from a production host and set `VITE_APP_URL`, `VITE_API_URL`, and `CORS_ORIGIN` accordingly.
- Never commit `.env.local` or real credentials.

## License

This project is currently private/proprietary unless a license file is added.
