import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  medicationId: mongoose.Types.ObjectId;
  scheduledTime: string;
  status: "active" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    medicationId: { type: Schema.Types.ObjectId, ref: "Medication", required: true },
    scheduledTime: { type: String, required: true },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Reminder ||
  mongoose.model<IReminder>("Reminder", ReminderSchema);
