import express from "express";
import { z } from "zod";
import Medicine from "../models/Medicine.js";
import Order from "../models/Order.js";
import Prescription from "../models/Prescription.js";
import Reminder from "../models/Reminder.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { askGemini } from "../services/gemini.js";
import { escapeRegex, routeOk } from "../utils/http.js";

const router = express.Router();

const aiRequestSchema = z.object({
  question: z.string().trim().min(3).max(1200),
});

const systemInstruction = `
You are MediRush AI Copilot for a professional MERN pharmacy operating website.
You are not a doctor and must not diagnose, prescribe, or replace pharmacist/clinician judgment.
Use ONLY the provided RAG_CONTEXT_JSON as business truth. Do not invent medicines, pharmacies, stock, orders, users, prices, or prescriptions.
If the context does not contain enough information, say exactly what data is missing and suggest the next operational step.
For medicine safety, explain risks conservatively and recommend pharmacist/doctor verification.
Return a concise professional answer with:
1. Direct answer
2. Evidence from context
3. Recommended next action
`;

function serializeMedicine(medicine) {
  return {
    id: String(medicine._id),
    brand: medicine.brand,
    pharmacyName: medicine.pharmacyName,
    salts: medicine.genericSalts,
    strength: medicine.strength,
    form: medicine.form,
    mrp: medicine.mrp,
    sellingPrice: medicine.discountedPrice ?? medicine.mrp,
    stockQty: medicine.stockQty,
    etaMin: medicine.etaMin,
    prescriptionsRequired: medicine.prescriptionsRequired,
    temperatureSensitive: medicine.temperatureSensitive,
    usesSummary: medicine.usesSummary,
    interactions: medicine.interactions,
  };
}

function serializeOrder(order) {
  return {
    id: order.orderCode,
    status: order.status,
    etaMin: order.etaMin,
    pharmacyName: order.pharmacyName,
    itemCount: order.items.length,
    items: order.items.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
    createdAt: order.createdAt,
  };
}

function serializePrescription(rx) {
  return {
    id: String(rx._id),
    fileName: rx.fileName,
    status: rx.status,
    extracted: rx.extracted,
    uploadedAt: rx.createdAt,
  };
}

function serializeReminder(reminder) {
  return {
    id: String(reminder._id),
    medicineName: reminder.medicineName,
    dose: reminder.dose,
    schedule: reminder.schedule,
    active: reminder.active,
    takenToday: reminder.takenToday,
  };
}

async function buildRagContext(question) {
  const q = question.trim();
  const regex = new RegExp(escapeRegex(q), "i");
  const medicineFilter = q
    ? {
        $or: [
          { $text: { $search: q } },
          { brand: regex },
          { pharmacyName: regex },
          { genericSalts: regex },
          { manufacturer: regex },
          { symptoms: regex },
        ],
      }
    : {};

  const [medicines, orders, prescriptions, reminders] = await Promise.all([
    Medicine.find(medicineFilter).sort({ uploadedAt: -1, createdAt: -1 }).limit(12),
    Order.find({}).sort({ createdAt: -1 }).limit(8),
    Prescription.find({}).sort({ createdAt: -1 }).limit(8),
    Reminder.find({}).sort({ createdAt: -1 }).limit(8),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    policy: {
      noPredefinedData: true,
      sourceOfTruth: "MongoDB records created at runtime by pharmacies/users",
      medicalSafety: "Non-diagnostic operational guidance only",
    },
    inventory: medicines.map(serializeMedicine),
    orders: orders.map(serializeOrder),
    prescriptions: prescriptions.map(serializePrescription),
    reminders: reminders.map(serializeReminder),
  };
}

function sourceSummary(context) {
  return [
    { type: "inventory", count: context.inventory.length },
    { type: "orders", count: context.orders.length },
    { type: "prescriptions", count: context.prescriptions.length },
    { type: "reminders", count: context.reminders.length },
  ];
}

router.post(
  "/assistant",
  asyncHandler(async (req, res) => {
    const { question } = aiRequestSchema.parse(req.body);
    const context = await buildRagContext(question);
    const answer = await askGemini({
      prompt: question,
      context,
      instruction: systemInstruction,
    });

    routeOk(res, {
      answer,
      sources: sourceSummary(context),
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      context,
    });
  }),
);

export default router;
