# MediRush

Quick-commerce–style pharmacy web app demo: gated sign-in, product search, cart, prescriptions flow, checkout, and order tracking. Built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS v4**.

**Repository:** [github.com/Vamssikrishna/medico](https://github.com/Vamssikrishna/medico)

---

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm** 10+

---

## Getting started

Clone the repo and install dependencies:

```bash
git clone https://github.com/Vamssikrishna/medico.git
cd medico
npm install
```

### Environment variables

Create **`.env.local`** in the **project root** (same folder as `package.json`). You can copy the example:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Public site URL (e.g. `http://localhost:3000`) |
| `MEDIRUSH_DEMO_OTP` | Set to `true` to return `demoOtp` from the send-otp API in production builds (normally only in dev). |

Secrets live in `.env.local`; that file is **gitignored**.

### Scripts

```bash
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

---

## How to use (demo)

1. Open **`/auth/login`** — sign in with **email OTP** (development responses may include **`demoOtp`** in JSON), **Google / Apple** (demo stubs), or use **`/guest`** for a limited guest lane.
2. Browse **Home**, **Search**, medicine detail pages, **Cart**, and **Checkout**.
3. **`/prescriptions`** simulates uploads and OCR/review states (client-side demo).

**Note:** Catalogue, pharmacies, rankings, and payments are **mocked**. This is **not medical advice**.

---

## Project structure (high level)

```
src/
  app/
    (app)/           # Routes behind session cookie gate
    (public)/        # /auth/login, /guest
    api/auth/       # OTP send / verify (in-memory demo store)
  components/       # Shell, header, search, cards, banners
  context/          # Auth, cart, profile (localStorage + cookies)
  lib/             # Types, mocks, search, cart validation
  middleware.ts    # Requires mr_session cookie for protected routes
```

---

## Security & production notes

- Session gate uses an **`mr_session`** cookie (`user` | `guest`) set client-side — **upgrade** to signed **httpOnly** cookies and a real auth backend before production.
- OTP is stored **in-memory** on the server in this demo — use **Redis** + rate limiting for real workloads.
- Do **not** commit `.env.local` or API keys.

---

## License

This project is provided as-is for demonstration and portfolio use. Specify a license here if you add one (`MIT`, etc.).

---

## Acknowledgements

Bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
