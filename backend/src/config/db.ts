import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

console.log("🔍 MONGO_URI =", MONGO_URI); // 👈 temporary debug

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined. Check .env file");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB error", error);
    process.exit(1);
  }
};

