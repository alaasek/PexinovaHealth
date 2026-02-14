import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicationLog extends Document {
  userId: string;
  medicationId: mongoose.Types.ObjectId;
  reminderId: mongoose.Types.ObjectId;
  takenAt: Date;
  starsEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationLogSchema = new Schema<IMedicationLog>(
  {
    userId: { type: String, required: true },
    medicationId: { type: Schema.Types.ObjectId, ref: 'Medication', required: true },
    reminderId: { type: Schema.Types.ObjectId, ref: 'Reminder', required: true },
    takenAt: { type: Date, required: true },
    starsEarned: { type: Number, default: 1 },
  },
  { timestamps: true }
);

// ✅ Correction pour éviter l'erreur de modèle déjà compilé
export default mongoose.models.MedicationLog || mongoose.model<IMedicationLog>('MedicationLog', MedicationLogSchema);