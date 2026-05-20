import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "ai_review", "pharmacist", "approved", "rejected"],
      default: "pending",
    },
    extracted: {
      doctor: { type: String, trim: true },
      medicines: [{ type: String, trim: true }],
      duration: { type: String, trim: true },
    },
  },
  { timestamps: true },
);

prescriptionSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    ret.uploadedAt = ret.createdAt?.toISOString?.() ?? ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const Prescription = mongoose.models.Prescription || mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
