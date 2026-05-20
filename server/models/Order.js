import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ["placed", "packed", "rider_assigned", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
    },
    etaMin: { type: Number, default: 18, min: 0 },
    deliveryOtp: { type: String, required: true },
    items: [orderItemSchema],
    pharmacyName: { type: String, required: true, trim: true },
    riderName: { type: String, trim: true },
    batchId: { type: String, trim: true },
  },
  { timestamps: true },
);

orderSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret.orderCode;
    ret.placedAt = ret.createdAt?.toISOString?.() ?? ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.orderCode;
    return ret;
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
