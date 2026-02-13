import { Request, Response } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendVerificationEmail } from "../services/email";
import { verifyGoogleToken } from "../services/googleAuth";

// Temporary memory for codes
const codes: Record<string, { hash: string; expires: number }> = {};
const verifiedEmails: Set<string> = new Set();

// Helpers
const hash = (val: string) =>
    crypto.createHash("sha256").update(val).digest("hex");

const generateCode = () =>
    Math.floor(10000 + Math.random() * 90000).toString();

function isValidEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//////////////////////////////////////////////////
// SEND CODE
//////////////////////////////////////////////////
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
            expires: Date.now() + 15 * 60 * 1000,
        };

        await sendVerificationEmail(email, code);

        res.json({ success: true, message: "Code envoyé" });
    } catch (err) {
        console.error("sendCode error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

//////////////////////////////////////////////////
// VERIFY CODE
//////////////////////////////////////////////////
export function verifyCode(req: Request, res: Response): void {
    const { email, code } = req.body;

    if (!email || !code) {
        res.status(400).json({ success: false, message: "Email et code requis" });
        return;
    }

    const entry = codes[email.toLowerCase()];

    if (!entry) {
        res.status(400).json({ success: false, message: "Code introuvable" });
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

    // Mark email as verified (in-memory)
    verifiedEmails.add(email.toLowerCase());
    delete codes[email.toLowerCase()];

    // Optionally return a short-lived token for password reset flows
    const resetToken = jwt.sign(
        { email: email.toLowerCase(), type: "reset" },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "10m" }
    );

    res.json({
        success: true,
        message: "Code vérifié",
        data: { resetToken },
    });
}

// auth.controller.ts (replace existing register function)

export async function register(req: Request, res: Response): Promise<void> {
    try {
        // Debug incoming body
        console.log("REGISTER REQ BODY:", req.body);

        const { name, email, password, dob, disease, medications } = req.body;

        // Basic validation
        if (!name || !email || !password || !dob) {
            res.status(400).json({ success: false, message: "Champs requis: name, email, password, dob" });
            return;
        }

        // Optional: require email verification
        const requireVerification = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
        if (requireVerification && !verifiedEmails.has(email.toLowerCase())) {
            res.status(400).json({ success: false, message: "Email non vérifié" });
            return;
        }

        // Validate medications shape if provided
        if (medications && !Array.isArray(medications)) {
            res.status(400).json({ success: false, message: "Medications must be an array" });
            return;
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ success: false, message: "Utilisateur existe déjà" });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            passwordHash,
            dob: dob || null,
            disease: disease || null,
            medications: Array.isArray(medications) ? medications : [],
        });

        await newUser.save();

        // If email was verified in-memory, remove it
        if (verifiedEmails.has(email.toLowerCase())) {
            verifiedEmails.delete(email.toLowerCase());
        }

        // Debug log to confirm saved fields
        console.log("Saved user:", {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            dob: newUser.dob,
            disease: newUser.disease,
            medications: newUser.medications,
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            message: "Utilisateur créé",
            data: {
                token,
                email: newUser.email,
                name: newUser.name,
                dob: newUser.dob,
                disease: newUser.disease,
                medications: newUser.medications,
            },
        });
    } catch (err) {
        console.error("register error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

//////////////////////////////////////////////////
// LOGIN
//////////////////////////////////////////////////
export async function Login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body as { email?: string; password?: string };

        if (!email || !password) {
            res.status(400).json({ success: false, message: "Champs requis" });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(400).json({ success: false, message: "Identifiants invalides" });
            return;
        }

        // Ensure passwordHash exists (handles OAuth users without local password)
        if (!user.passwordHash) {
            res.status(400).json({ success: false, message: "No local password set for this account" });
            return;
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            res.status(400).json({ success: false, message: "Identifiants invalides" });
            return;
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        res.json({
            success: true,
            data: {
                token,
                name: user.name,
                email: user.email,
                dob: user.dob,
            },
        });
    } catch (err) {
        console.error("login error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

//////////////////////////////////////////////////
// RESET PASSWORD
//////////////////////////////////////////////////
export async function resetPassword(req: Request, res: Response): Promise<void> {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            res.status(400).json({ success: false, message: "Champs requis" });
            return;
        }

        const decoded = jwt.verify(
            resetToken,
            process.env.JWT_SECRET || "secret"
        ) as { email: string; type: string };

        if (decoded.type !== "reset") {
            res.status(400).json({ success: false, message: "Token invalide" });
            return;
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable" });
            return;
        }

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ success: true, message: "Mot de passe réinitialisé" });
    } catch (err) {
        console.error("resetPassword error:", err);
        res.status(400).json({ success: false, message: "Token expiré ou invalide" });
    }
}

//////////////////////////////////////////////////
// UPDATE NAME
//////////////////////////////////////////////////
export async function updateName(req: Request, res: Response): Promise<void> {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            res.status(400).json({ success: false, message: "Email et name requis" });
            return;
        }

        const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { name }, { new: true });
        if (!user) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable" });
            return;
        }

        res.json({ success: true, message: "Nom mis à jour", user });
    } catch (err) {
        console.error("updateName error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

//////////////////////////////////////////////////
// UPDATE DOB
//////////////////////////////////////////////////
export async function updateDob(req: Request, res: Response): Promise<void> {
    try {
        const { email, dob } = req.body;

        if (!email || !dob) {
            res.status(400).json({ success: false, message: "Email et date de naissance requis" });
            return;
        }

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { dob },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable" });
            return;
        }

        res.json({ success: true, message: "Date de naissance mise à jour", user });
    } catch (err) {
        console.error("updateDob error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

//////////////////////////////////////////////////
// UPDATE DISEASE
//////////////////////////////////////////////////
export async function updateDisease(req: Request, res: Response): Promise<void> {
    try {
        const { email, disease } = req.body;

        if (!email || !disease) {
            res.status(400).json({ success: false, message: "Email et disease requis" });
            return;
        }

        const user = await User.findOneAndUpdate({ email: email.toLowerCase() }, { disease }, { new: true });
        if (!user) {
            res.status(404).json({ success: false, message: "Utilisateur introuvable" });
            return;
        }

        res.json({ success: true, message: "Maladie mise à jour", user });
    } catch (err) {
        console.error("updateDisease error:", err);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
}

//////////////////////////////////////////////////
// LOGIN WITH GOOGLE
//////////////////////////////////////////////////
// Replace only the loginWithGoogle function in your auth.controller.ts with this.
// Keeps the same structure but fixes the TypeScript complaints by validating token
// and using a safe cast when accessing/setting googleId.

export const loginWithGoogle = async (req: Request, res: Response) => {
    try {
        // ensure token is a string before calling verifyGoogleToken
        const { token } = req.body as { token?: string };
        if (!token) return res.status(400).json({ error: "Token is required" });

        const payload = await verifyGoogleToken(token);
        if (!payload?.email) {
            return res.status(400).json({ error: "Google token did not return an email" });
        }

        // find user; cast to any so TypeScript won't complain about googleId property
        let user = (await User.findOne({ email: payload.email.toLowerCase() })) as any;

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const passwordHash = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                email: payload.email.toLowerCase(),
                name: payload.name || 'No name',
                googleId: payload.sub,
                passwordHash,
            });
        } else if (!user.googleId) {
            // link googleId for existing user
            user.googleId = payload.sub;
            await user.save();
        }

        const appToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        res.json({ success: true, token: appToken, user });
    } catch (err) {
        console.error("loginWithGoogle error:", err);
        res.status(401).json({ error: "Invalid Google token or server error" });
    }
};
