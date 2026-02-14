import { Request, Response } from "express";
import { ReminderService } from "../services/reminder.service";

export class ReminderController {

  // Récupérer les rappels du jour
  async getToday(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      
      const reminders = await ReminderService.getToday(userEmail);

      return res.status(200).json({ 
        success: true, 
        count: reminders.length,
        data: reminders 
      });
    } catch (error: any) {
      console.error('Get today reminders error:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Erreur serveur",
        error: error.message 
      });
    }
  }

  // Récupérer tous les rappels
  async getAllReminders(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      
      const reminders = await ReminderService.getAllReminders(userEmail);

      return res.status(200).json({
        success: true,
        count: reminders.length,
        data: reminders,
      });
    } catch (error: any) {
      console.error('Get all reminders error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }

  // Marquer un médicament comme pris
  async markAsTaken(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      const reminderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      // Validation de l'ID
      if (!reminderId) {
        return res.status(400).json({ 
          success: false, 
          message: "ID du rappel requis" 
        });
      }

      const result = await ReminderService.markAsTaken(userEmail, reminderId);

      return res.status(200).json({ 
        success: true, 
        message: "Médicament pris ! +1 étoile ⭐", 
        data: result 
      });
    } catch (error: any) {
      console.error('Mark as taken error:', error);
      return res.status(400).json({ 
        success: false, 
        message: error.message || "Erreur lors de l'enregistrement" 
      });
    }
  }

  // Désactiver un rappel
  async deleteReminder(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      const reminderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      // Validation de l'ID
      if (!reminderId) {
        return res.status(400).json({ 
          success: false, 
          message: "ID du rappel requis" 
        });
      }

      const reminder = await ReminderService.deleteReminder(reminderId, userEmail);

      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: 'Rappel non trouvé',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Rappel supprimé avec succès',
      });
    } catch (error: any) {
      console.error('Delete reminder error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: error.message,
      });
    }
  }
}