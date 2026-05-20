import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine" },
    medicineName: { type: String, required: true, trim: true },
    dose: { type: String, required: true, trim: true },
    schedule: { type: String, required: true, trim: true },
    refillAtStock: { type: Number, default: 5, min: 0 },
    active: { type: Boolean, default: true },
    takenToday: { type: Boolean, default: false },
  },
  { timestamps: true },
);

reminderSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Reminder = mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);

export default Reminder;
