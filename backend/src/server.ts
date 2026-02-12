import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;

// Enable CORS
app.use(
  cors({
    origin: '*', // for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(cors());
// Parse JSON bodies
app.use(express.json());

// Optional test route
app.get("/test", (req, res) => res.send("Server is working!"));

// Connect to MongoDB first
mongoose.connect("mongodb://127.0.0.1:27017/healthcare")
  .then(() => {
    console.log("✅ MongoDB connected");

    // Mount the auth routes AFTER DB is ready
    app.use("/api/auth", authRoutes);

    // Start server
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB error:", err));


