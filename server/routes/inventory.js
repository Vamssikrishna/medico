import express from "express";
import { z } from "zod";
import Medicine from "../models/Medicine.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { medicineSlug } from "../utils/slug.js";
import { escapeRegex, isObjectId, routeError, routeOk } from "../utils/http.js";

const router = express.Router();

const medicineSchema = z.object({
  brand: z.string().trim().min(1),
  pharmacyName: z.string().trim().min(1),
  genericSalts: z.array(z.string().trim().min(1)).default([]),
  strength: z.string().trim().default("As labelled"),
  form: z.string().trim().default("Tablet"),
  mrp: z.coerce.number().min(0),
  discountedPrice: z.coerce.number().min(0).optional(),
  manufacturer: z.string().trim().optional(),
  usesSummary: z.string().trim().optional(),
  simplifiedAi: z.string().trim().optional(),
  storageInstructions: z.string().trim().optional(),
  commonSideEffects: z.array(z.string().trim()).default([]),
  severeRisks: z.array(z.string().trim()).default([]),
  whenToConsult: z.array(z.string().trim()).default([]),
  prescriptionsRequired: z.boolean().default(false),
  restrictedAge: z.coerce.number().min(0).optional(),
  temperatureSensitive: z.boolean().default(false),
  symptoms: z.array(z.string().trim()).default([]),
  interactions: z
    .array(
      z.object({
        with: z.string().trim().min(1),
        message: z.string().trim().min(1),
        severity: z.enum(["info", "warn", "danger"]).default("info"),
      }),
    )
    .default([]),
  stockQty: z.coerce.number().int().min(0).default(0),
  etaMin: z.coerce.number().int().min(1).default(18),
}).refine((data) => data.discountedPrice === undefined || data.discountedPrice <= data.mrp, {
  message: "Selling price cannot be greater than MRP",
  path: ["discountedPrice"],
});

const listQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  limit: z.coerce.number().int().min(1).max(200).optional().default(200),
});

function normalizeMedicine(input) {
  const parsed = medicineSchema.parse(input);
  const salts = parsed.genericSalts.length ? parsed.genericSalts : [parsed.brand];
  const symptoms = parsed.symptoms.length ? parsed.symptoms : [parsed.brand, ...salts].map((s) => s.toLowerCase());
  return {
    ...parsed,
    slug: medicineSlug(parsed.brand, parsed.pharmacyName),
    genericSalts: salts,
    manufacturer: parsed.manufacturer || parsed.pharmacyName,
    usesSummary:
      parsed.usesSummary || "Pharmacy-uploaded medicine. Verify label and pharmacist guidance before use.",
    simplifiedAi:
      parsed.simplifiedAi || "This item was uploaded by a pharmacy. Follow label, prescription, and pharmacist instructions.",
    storageInstructions:
      parsed.storageInstructions || (parsed.temperatureSensitive ? "Cold-chain storage required." : "Store as per label."),
    commonSideEffects: parsed.commonSideEffects.length ? parsed.commonSideEffects : ["Check product leaflet"],
    severeRisks: parsed.severeRisks.length ? parsed.severeRisks : ["Seek medical help for allergic reaction or severe symptoms"],
    whenToConsult: parsed.whenToConsult.length ? parsed.whenToConsult : ["If symptoms persist or worsen"],
    symptoms,
    interactions: parsed.interactions.length
      ? parsed.interactions
      : [{ with: "Current medicines", message: "Ask pharmacist to verify interactions before use.", severity: "info" }],
    uploadedAt: new Date(),
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { q, limit } = listQuerySchema.parse(req.query);
    const filter = q
      ? {
          $or: [
            { $text: { $search: q } },
            { brand: new RegExp(escapeRegex(q), "i") },
            { genericSalts: new RegExp(escapeRegex(q), "i") },
            { pharmacyName: new RegExp(escapeRegex(q), "i") },
          ],
        }
      : {};
    const medicines = await Medicine.find(filter).sort({ uploadedAt: -1, createdAt: -1 }).limit(limit);
    routeOk(res, { medicines, count: medicines.length });
  }),
);

router.get(
  "/id/:id",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid medicine id");
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return routeError(res, 404, "Medicine not found");
    return routeOk(res, { medicine });
  }),
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const medicine = await Medicine.findOne({ slug: req.params.slug });
    if (!medicine) return routeError(res, 404, "Medicine not found");
    return routeOk(res, { medicine });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = normalizeMedicine(req.body);
    const medicine = await Medicine.findOneAndUpdate(
      { slug: data.slug },
      data,
      { new: true, upsert: true, runValidators: true },
    );
    routeOk(res, { medicine }, 201);
  }),
);

router.post(
  "/bulk",
  asyncHandler(async (req, res) => {
    const rows = z.array(z.unknown()).min(1).max(500).parse(req.body.rows || []);
    const payload = rows.map(normalizeMedicine);
    for (const item of payload) {
      await Medicine.findOneAndUpdate(
        { slug: item.slug },
        item,
        { new: true, upsert: true, runValidators: true },
      );
    }
    const medicines = await Medicine.find({}).sort({ uploadedAt: -1, createdAt: -1 }).limit(200);
    routeOk(res, { medicines, imported: payload.length }, 201);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isObjectId(req.params.id)) return routeError(res, 400, "Invalid medicine id");
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return routeError(res, 404, "Medicine not found");
    return routeOk(res, { deletedId: req.params.id });
  }),
);

router.delete(
  "/",
  asyncHandler(async (_req, res) => {
    await Medicine.deleteMany({});
    routeOk(res, { deleted: true });
  }),
);

export default router;
