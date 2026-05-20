# MediRush

Professional pharmacy operating website built with the **MERN stack**: MongoDB, Express, React 19, and Node.js. The frontend is a Vite React SPA and the backend is an Express API with MongoDB persistence.

**Repository:** [github.com/Vamssikrishna/medico](https://github.com/Vamssikrishna/medico)

---

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm** 10+
- **MongoDB** running locally

---

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/Vamssikrishna/medico.git
cd medico
npm install
```

### Environment variables

Use the single **`.env.local`** file in the project root.

| Variable | Description |
|----------|-------------|
| `VITE_APP_URL` | Public site URL (e.g. `http://localhost:3000`) |
| `VITE_API_URL` | Express API URL (e.g. `http://localhost:5000`) |
| `PORT` | Express API port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `CORS_ORIGIN` | Allowed frontend origin |
| `SMTP_*` | SMTP settings used to send OTP by email |

Secrets live in `.env.local`; that file is **gitignored**.

### Scripts

```bash
npm run dev      # Vite frontend + Express API
npm run build    # Vite production build
npm run start    # Vite preview + Express API
npm run lint     # ESLint
```

---

## How to use

1. Start local MongoDB.
2. Run `npm run dev`.
3. Use the pharmacy inventory screen to upload medicines/tablets.
4. Customer marketplace, cart, orders, prescriptions, and reminders use Mongo-backed API data only.

**Important:** There is no predefined catalogue or business data. Pharmacies must upload stock before customers can browse or order.

---

## Project structure (high level)

```
src/
  App.tsx          # Vite React SPA
  main.tsx         # React entrypoint
  styles.css       # Professional MERN frontend styling
  lib/             # API client and shared types
server/
  index.js         # Express API
  models/          # Mongoose models
  routes/          # Auth, inventory, orders, prescriptions, reminders
```

---

## Security & production notes

- OTP is sent by SMTP email only. Configure real SMTP credentials before testing sign-in.
- OTP is stored in-memory on the server for now; use Redis plus rate limiting for production.
- Do **not** commit `.env.local` or API keys.

---

## License

This project is provided as-is for demonstration and portfolio use. Specify a license here if you add one (`MIT`, etc.).

---

## Acknowledgements

Built as a MERN stack application with Vite React and Express.
