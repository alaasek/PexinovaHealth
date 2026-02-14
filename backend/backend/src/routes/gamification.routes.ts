import { Router, Request, Response } from "express";
import { GamificationController } from "../controllers/gamification.controller";

const router = Router();
const gamificationController = new GamificationController();

// Route de test
router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Gamification routes fonctionnent!" });
});

// Récupérer le score total
router.get("/score", async (req: Request, res: Response) => {
  await gamificationController.getScore(req, res);
});

// Récupérer le statut de la planète
router.get("/planet", async (req: Request, res: Response) => {
  await gamificationController.getPlanetStatus(req, res);
});

// Récupérer les streaks
router.get("/streak", async (req: Request, res: Response) => {
  await gamificationController.getStreak(req, res);
});

export default router;