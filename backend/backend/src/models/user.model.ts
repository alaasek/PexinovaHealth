import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;                 // optionnel avant inscription
  email: string;
  password?: string;             // optionnel avant inscription
  isEmailVerified: boolean;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },   // plus required
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // plus required
    isEmailVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
