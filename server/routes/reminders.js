import express from "express";
import { z } from "zod";
import Reminder from "../models/Reminder.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { isObjectId, routeError, routeOk } from "../utils/http.js";

const router = express.Router();

const reminderSchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().min(1),
  dose: z.string().min(1),
  schedule: z.string().min(1),
  refillAtStock: z.coerce.number().min(0).default(5),
  active: z.boolean().default(true),
});

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const reminders = await Reminder.find({}).sort({ createdAt: -1 }).limit(100);
    routeOk(res, { reminders, count: reminders.length });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid reminder id");
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return routeError(res, 404, "Reminder not found");
    return routeOk(res, { reminder });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = reminderSchema.parse(req.body);
    const reminder = await Reminder.create(input);
    routeOk(res, { reminder }, 201);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid reminder id");
    const patch = z
      .object({
        active: z.boolean().optional(),
        takenToday: z.boolean().optional(),
        schedule: z.string().min(1).optional(),
      })
      .parse(req.body);
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!reminder) return routeError(res, 404, "Reminder not found");
    return routeOk(res, { reminder });
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid reminder id");
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) return routeError(res, 404, "Reminder not found");
    routeOk(res, { deletedId: req.params.id });
  }),
);

export default router;
