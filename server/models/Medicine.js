import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    with: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    severity: { type: String, enum: ["info", "warn", "danger"], default: "info" },
  },
  { _id: false },
);

const medicineSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    brand: { type: String, required: true, trim: true },
    pharmacyName: { type: String, required: true, trim: true, index: true },
    genericSalts: [{ type: String, trim: true }],
    strength: { type: String, default: "As labelled", trim: true },
    form: { type: String, default: "Tablet", trim: true },
    mrp: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    manufacturer: { type: String, required: true, trim: true },
    usesSummary: { type: String, required: true, trim: true },
    simplifiedAi: { type: String, required: true, trim: true },
    storageInstructions: { type: String, required: true, trim: true },
    commonSideEffects: [{ type: String, trim: true }],
    severeRisks: [{ type: String, trim: true }],
    whenToConsult: [{ type: String, trim: true }],
    prescriptionsRequired: { type: Boolean, default: false },
    restrictedAge: { type: Number, min: 0 },
    temperatureSensitive: { type: Boolean, default: false },
    symptoms: [{ type: String, trim: true, lowercase: true }],
    interactions: [interactionSchema],
    stockQty: { type: Number, default: 0, min: 0 },
    etaMin: { type: Number, default: 18, min: 1 },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

medicineSchema.index({
  brand: "text",
  pharmacyName: "text",
  manufacturer: "text",
  genericSalts: "text",
  symptoms: "text",
});

medicineSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    ret.uploadedAt = ret.uploadedAt?.toISOString?.() ?? ret.uploadedAt;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);

export default Medicine;
