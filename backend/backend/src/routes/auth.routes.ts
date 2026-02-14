import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

// Routes publiques
router.post("/send-code", (req, res) => authController.sendCode(req, res));
router.post("/verify-code", (req, res) => authController.verifyCode(req, res));
router.post("/send-reset-code", (req, res) => authController.sendResetCode(req, res));
router.post("/reset-password", (req, res) => authController.resetPassword(req, res));
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));

// Routes protégées
router.get("/profile", authMiddleware, (req, res) => authController.getProfile(req, res));

export default router;
