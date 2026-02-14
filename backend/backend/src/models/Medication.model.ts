import mongoose, { Schema, Document } from "mongoose";

export interface IMedication extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  dosage: number;
  category: string;
  timer: {
    hours: number;
    minutes: number;
    period: "AM" | "PM";
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema<IMedication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dosage: { type: Number, default: 1 },
    category: { type: String, default: "flexible" },
    timer: {
      hours: { type: Number, required: true },
      minutes: { type: Number, required: true },
      period: { type: String, enum: ["AM", "PM"], required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Medication ||
  mongoose.model<IMedication>("Medication", MedicationSchema);
