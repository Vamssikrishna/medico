import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ZodError } from "zod";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

import inventoryRoutes from "./routes/inventory.js";
import orderRoutes from "./routes/orders.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import reminderRoutes from "./routes/reminders.js";
import authRoutes from "./routes/auth.js";
import aiRoutes from "./routes/ai.js";
import { requireAuth } from "./middleware/auth.js";
import { routeError, routeOk } from "./utils/http.js";

const app = express();

app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const routeManifest = [
  "GET /api/health",
  "GET /api/routes",
  "POST /api/auth/send-otp",
  "POST /api/auth/verify-otp",
  "GET /api/inventory (auth)",
  "GET /api/inventory/:slug (auth)",
  "GET /api/inventory/id/:id (auth)",
  "POST /api/inventory (auth)",
  "POST /api/inventory/bulk (auth)",
  "DELETE /api/inventory/:id (auth)",
  "GET /api/orders (auth)",
  "GET /api/orders/:id (auth)",
  "POST /api/orders (auth)",
  "PATCH /api/orders/:id/status (auth)",
  "GET /api/prescriptions (auth)",
  "GET /api/prescriptions/:id (auth)",
  "POST /api/prescriptions (auth)",
  "PATCH /api/prescriptions/:id/status (auth)",
  "GET /api/reminders (auth)",
  "GET /api/reminders/:id (auth)",
  "POST /api/reminders (auth)",
  "PATCH /api/reminders/:id (auth)",
  "DELETE /api/reminders/:id (auth)",
  "POST /api/ai/assistant (auth)",
];

function healthPayload() {
  return {
    service: "MediRush MERN API",
    mongo: "connected",
    time: new Date().toISOString(),
  };
}

function mountApi(prefix) {
  app.get(`${prefix}/health`, (_req, res) => routeOk(res, healthPayload()));
  app.get(`${prefix}/routes`, (_req, res) => routeOk(res, { version: prefix, routes: routeManifest }));
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/inventory`, requireAuth, inventoryRoutes);
  app.use(`${prefix}/orders`, requireAuth, orderRoutes);
  app.use(`${prefix}/prescriptions`, requireAuth, prescriptionRoutes);
  app.use(`${prefix}/reminders`, requireAuth, reminderRoutes);
  app.use(`${prefix}/ai`, requireAuth, aiRoutes);
}

app.get("/api/health", (_req, res) => {
  routeOk(res, healthPayload());
});

app.get("/api/routes", (_req, res) => routeOk(res, { version: "/api", routes: routeManifest }));
mountApi("/api/v1");
app.use("/api/auth", authRoutes);
app.use("/api/inventory", requireAuth, inventoryRoutes);
app.use("/api/orders", requireAuth, orderRoutes);
app.use("/api/prescriptions", requireAuth, prescriptionRoutes);
app.use("/api/reminders", requireAuth, reminderRoutes);
app.use("/api/ai", requireAuth, aiRoutes);

app.use((req, res) => {
  routeError(res, 404, `Route not found: ${req.method} ${req.path}`);
});

app.use((err, _req, res, next) => {
  void next;
  if (err instanceof ZodError) {
    return routeError(res, 400, "Validation failed", err.issues);
  }
  console.error(err);
  return routeError(res, 500, "Internal server error");
});

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`MediRush API running on http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect MongoDB", err);
    process.exit(1);
  });
