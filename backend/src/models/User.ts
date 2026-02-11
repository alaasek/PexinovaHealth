import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provider: { type: String, default: "email" } // email, apple, google
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
