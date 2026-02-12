import express from "express";
import * as authController from "../controllers/auth.controller";

const router = express.Router();

router.post("/send-code", authController.sendCode);
router.post("/verify-code", authController.verifyCode);
router.post("/register", authController.register);
router.post("/Login", authController.Login);
router.post("/reset-password", authController.resetPassword);
router.post("/update-name", authController.updateName);
router.post("/update-dob", authController.updateDob);
router.post("/update-disease", authController.updateDisease);
router.post("/google", authController.loginWithGoogle);

export default router;




