import express from "express";
import { z } from "zod";
import Medicine from "../models/Medicine.js";
import Order from "../models/Order.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { isObjectId, routeError, routeOk } from "../utils/http.js";

const router = express.Router();

const orderSchema = z.object({
  items: z.array(z.object({ medicineId: z.string().min(1), qty: z.coerce.number().int().min(1) })).min(1),
  priority: z.boolean().default(false),
});

function aggregateItems(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.medicineId, (map.get(item.medicineId) ?? 0) + item.qty);
  }
  return [...map.entries()].map(([medicineId, qty]) => ({ medicineId, qty }));
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(100);
    routeOk(res, { orders, count: orders.length });
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const order = await Order.findOne({ orderCode: req.params.id });
    if (!order) return routeError(res, 404, "Order not found");
    return routeOk(res, { order });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = orderSchema.parse(req.body);
    const aggregated = aggregateItems(input.items);
    if (aggregated.some((item) => !isObjectId(item.medicineId))) {
      return routeError(res, 400, "Invalid medicine id in order");
    }
    const ids = aggregated.map((i) => i.medicineId);
    const medicines = await Medicine.find({ _id: { $in: ids } });
    if (medicines.length !== ids.length) {
      return routeError(res, 400, "One or more medicines are unavailable");
    }

    const insufficient = aggregated
      .map((line) => {
        const medicine = medicines.find((m) => String(m._id) === line.medicineId);
        return medicine && (medicine.stockQty ?? 0) < line.qty
          ? { medicineId: line.medicineId, brand: medicine.brand, requested: line.qty, available: medicine.stockQty ?? 0 }
          : null;
      })
      .filter(Boolean);

    if (insufficient.length) {
      return routeError(res, 409, "Insufficient stock for one or more medicines", insufficient);
    }

    const items = aggregated.map((line) => {
      const medicine = medicines.find((m) => String(m._id) === line.medicineId);
      return {
        medicineId: medicine._id,
        name: medicine.brand,
        qty: line.qty,
        price: medicine.discountedPrice ?? medicine.mrp,
      };
    });

    for (const line of aggregated) {
      await Medicine.findByIdAndUpdate(line.medicineId, { $inc: { stockQty: -line.qty } });
    }

    const etaValues = medicines.map((m) => m.etaMin || 18);
    const order = await Order.create({
      orderCode: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "placed",
      etaMin: input.priority ? 12 : Math.min(...etaValues),
      deliveryOtp: String(Math.floor(100000 + Math.random() * 900000)),
      items,
      pharmacyName: medicines[0]?.pharmacyName || "Partner pharmacy",
      riderName: "Assigning",
      batchId: `B-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    });

    return routeOk(res, { order }, 201);
  }),
);

router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const status = z
      .enum(["placed", "packed", "rider_assigned", "out_for_delivery", "delivered", "cancelled"])
      .parse(req.body.status);
    const order = await Order.findOneAndUpdate({ orderCode: req.params.id }, { status }, { new: true });
    if (!order) return routeError(res, 404, "Order not found");
    return routeOk(res, { order });
  }),
);

export default router;
