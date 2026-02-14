import { Router, Request, Response } from "express";
import { ReminderController } from "../controllers/reminder.controller";

const router = Router();
const reminderController = new ReminderController();

// Route de test
router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "Reminder routes fonctionnent!" });
});

// Récupérer les rappels du jour
router.get("/today", async (req: Request, res: Response) => {
  await reminderController.getToday(req, res);
});

// Récupérer tous les rappels
router.get("/all", async (req: Request, res: Response) => {
  await reminderController.getAllReminders(req, res);
});

// Marquer un médicament comme pris
router.post("/mark-taken/:id", async (req: Request, res: Response) => {
  await reminderController.markAsTaken(req, res);
});

// Désactiver un rappel
router.delete("/delete/:id", async (req: Request, res: Response) => {
  await reminderController.deleteReminder(req, res);
});

export default router;