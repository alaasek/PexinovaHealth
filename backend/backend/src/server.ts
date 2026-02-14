import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import medicationRoutes from "./routes/medication.routes";
import reminderRoutes from "./routes/reminder.routes";
import gamificationRoutes from "./routes/gamification.routes";  // ✅ AJOUT
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => res.send("Server is working!"));

mongoose.connect("mongodb://127.0.0.1:27017/healthcare")
  .then(() => {
    console.log("✅ MongoDB connected");

    app.use("/api/auth", authRoutes);
    app.use("/api/medications", medicationRoutes);
    app.use("/api/reminders", reminderRoutes);
    app.use("/api/gamification", gamificationRoutes);  // ✅ AJOUT

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB error:", err));
