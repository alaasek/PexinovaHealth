import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");

    // ✅ IMPORTANT : stocker userId (pas email)
    (req as any).userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }
}
