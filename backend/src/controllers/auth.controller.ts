import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../services/email";

// Mémoire temporaire (à remplacer par DB en prod)
const codes: Record<string, { hash: string; expires: number }> = {};
const verifiedEmails: Set<string> = new Set();
const users: Record<string, { name: string; email: string; passwordHash: string }> = {};

// Helpers
const hash = (val: string) => crypto.createHash("sha256").update(val).digest("hex");
const generateCode = () => Math.floor(10000 + Math.random() * 90000).toString(); // 5 chiffres
function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ========================
// SEND CODE
// ========================
export async function sendCode(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, message: "Email invalide" });
      return;
    }

    const code = generateCode();

    codes[email.toLowerCase()] = {
      hash: hash(code),
      expires: Date.now() + 15 * 60 * 1000, // expire dans 15 min
    };

    await sendVerificationEmail(email, code);

    res.json({ success: true, message: "Code de vérification envoyé" });
  } catch (err) {
    console.error("Erreur sendCode:", err);
    res.status(500).json({ success: false, message: "Échec d'envoi du code" });
  }
}

// ========================
// VERIFY CODE
// ========================
export function verifyCode(req: Request, res: Response): void {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ success: false, message: "Email et code requis" });
    return;
  }

  const entry = codes[email.toLowerCase()];
  if (!entry) {
    res.status(400).json({ success: false, message: "Aucun code trouvé" });
    return;
  }

  if (Date.now() > entry.expires) {
    delete codes[email.toLowerCase()];
    res.status(400).json({ success: false, message: "Code expiré" });
    return;
  }

  if (entry.hash !== hash(code)) {
    res.status(400).json({ success: false, message: "Code invalide" });
    return;
  }

  verifiedEmails.add(email.toLowerCase());
  delete codes[email.toLowerCase()];

  res.json({ success: true, message: "Email vérifié avec succès" });
}

// ========================
// RESET PASSWORD
// ========================
export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    return;
  }

  const entry = codes[email.toLowerCase()];
  if (!entry || entry.hash !== hash(code)) {
    res.status(400).json({ success: false, message: "Code invalide ou expiré" });
    return;
  }

  if (!users[email.toLowerCase()]) {
    res.status(400).json({ success: false, message: "Utilisateur inexistant" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  users[email.toLowerCase()].passwordHash = passwordHash;
  delete codes[email.toLowerCase()];

  res.json({ success: true, message: "Mot de passe réinitialisé avec succès" });
}

// ========================
// REGISTER
// ========================
export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "Tous les champs sont requis" });
    return;
  }

  if (!verifiedEmails.has(email.toLowerCase())) {
    res.status(400).json({ success: false, message: "Email non vérifié" });
    return;
  }

  if (users[email.toLowerCase()]) {
    res.status(400).json({ success: false, message: "Utilisateur déjà existant" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  users[email.toLowerCase()] = { name, email, passwordHash };
  verifiedEmails.delete(email.toLowerCase());

  res.json({ success: true, message: "Utilisateur enregistré avec succès" });
}

// ========================
// LOGIN
// ========================
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email et mot de passe requis" });
    return;
  }

  const user = users[email.toLowerCase()];
  if (!user) {
    res.status(400).json({ success: false, message: "Identifiants invalides" });
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(400).json({ success: false, message: "Identifiants invalides" });
    return;
  }

  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    message: "Connexion réussie",
    data: { token, email: user.email, name: user.name },
  });
}

