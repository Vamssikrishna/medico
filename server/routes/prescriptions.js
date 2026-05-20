import express from "express";
import { z } from "zod";
import Prescription from "../models/Prescription.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { isObjectId, routeError, routeOk } from "../utils/http.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const prescriptions = await Prescription.find({}).sort({ createdAt: -1 }).limit(100);
    routeOk(res, { prescriptions, count: prescriptions.length });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid prescription id");
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return routeError(res, 404, "Prescription not found");
    return routeOk(res, { prescription });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = z.object({ fileName: z.string().min(1) }).parse(req.body);
    const prescription = await Prescription.create({
      fileName: input.fileName,
      status: "pharmacist",
      extracted: {
        doctor: "Uploaded prescription",
        medicines: [`Extracted from ${input.fileName}`],
        duration: "Awaiting pharmacist confirmation",
      },
    });
    routeOk(res, { prescription }, 201);
  }),
);

router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid prescription id");
    const status = z.enum(["pending", "ai_review", "pharmacist", "approved", "rejected"]).parse(req.body.status);
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!prescription) return routeError(res, 404, "Prescription not found");
    return routeOk(res, { prescription });
  }),
);

export default router;
