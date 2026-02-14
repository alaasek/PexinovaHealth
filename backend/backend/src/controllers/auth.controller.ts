import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Gamification from "../models/Gamification.model";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/email";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
const JWT_EXPIRES_IN = "7d";

const generateCode = () => Math.floor(10000 + Math.random() * 90000).toString();
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export class AuthController {

  // ENVOYER CODE OTP
  async sendCode(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email || !isValidEmail(email)) return res.status(400).json({ success: false, message: "Email invalide" });

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser.password) return res.status(400).json({ success: false, message: "Utilisateur déjà inscrit" });

      const code = generateCode();
      const expires = new Date(Date.now() + 15 * 60 * 1000);

      await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { verificationCode: code, verificationCodeExpires: expires },
        { upsert: true, new: true }
      );

      await sendVerificationEmail(email, code);

      return res.json({ success: true, message: "Code de vérification envoyé" });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }

  // VERIFIER CODE OTP
  async verifyCode(req: Request, res: Response) {
    try {
      const { email, code } = req.body;
      if (!email || !code) return res.status(400).json({ success: false, message: "Email et code requis" });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.verificationCode) return res.status(400).json({ success: false, message: "Aucun code trouvé" });

      if (new Date() > user.verificationCodeExpires!) return res.status(400).json({ success: false, message: "Code expiré" });
      if (user.verificationCode !== code) return res.status(400).json({ success: false, message: "Code invalide" });

      user.isEmailVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      return res.json({ success: true, message: "Email vérifié avec succès" });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }

  // REGISTER
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
      if (password.length < 6) return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères" });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.isEmailVerified) return res.status(400).json({ success: false, message: "Email non vérifié" });
      if (user.password) return res.status(400).json({ success: false, message: "Utilisateur déjà enregistré" });

      user.name = name;
      user.password = await bcrypt.hash(password, 10);
      await user.save();

      await Gamification.create({ userId: user._id });

      const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return res.json({ success: true, message: "Inscription réussie", data: { token, user: { id: user._id, name: user.name, email: user.email } } });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }

  // LOGIN
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ success: false, message: "Email et mot de passe requis" });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !user.password) return res.status(400).json({ success: false, message: "Identifiants invalides" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ success: false, message: "Identifiants invalides" });

      const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return res.json({ success: true, message: "Connexion réussie", data: { token, user: { id: user._id, name: user.name, email: user.email } } });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }

  // SEND RESET CODE
  async sendResetCode(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: "Email requis" });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.json({ success: true, message: "Si cet email existe, un code a été envoyé" });

      const code = generateCode();
      user.verificationCode = code;
      user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendPasswordResetEmail(email, code);

      return res.json({ success: true, message: "Code de réinitialisation envoyé" });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }

  // RESET PASSWORD
  async resetPassword(req: Request, res: Response) {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) return res.status(400).json({ success: false, message: "Tous les champs sont requis" });

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || user.verificationCode !== code || new Date() > user.verificationCodeExpires!) return res.status(400).json({ success: false, message: "Code invalide ou expiré" });

      user.password = await bcrypt.hash(newPassword, 10);
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined;
      await user.save();

      return res.json({ success: true, message: "Mot de passe réinitialisé avec succès" });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }

  // GET PROFILE
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await User.findById(userId).select("-password -verificationCode -verificationCodeExpires");
      if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });

      return res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, isEmailVerified: user.isEmailVerified } });

    } catch (error: any) {
      return res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
  }
}
