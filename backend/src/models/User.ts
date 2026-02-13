import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    dob?: string;
    disease?: string;
    medications?: any[];
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    googleId: { type: String },
    dob: { type: String },
    disease: { type: String },
    medications: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
