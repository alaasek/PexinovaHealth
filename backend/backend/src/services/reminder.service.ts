import ReminderModel from "../models/Reminder.model";
import MedicationLog from "../models/MedicationLog.model";
import { GamificationService } from "./gamification.service";

export class ReminderService {

  // Récupérer les rappels du jour
  static async getToday(userEmail: string) {
    return ReminderModel.find({ 
      userId: userEmail, 
      status: { $in: ['pending', 'completed'] }  // ✅ Changé de isActive à status
    })
      .populate("medicationId")
      .sort({ scheduledTime: 1 });
  }

  // Récupérer tous les rappels d'un utilisateur
  static async getAllReminders(userEmail: string) {
    return ReminderModel.find({ 
      userId: userEmail, 
      status: { $ne: 'cancelled' }  // ✅ Changé : exclut les cancelled
    })
      .populate("medicationId")
      .sort({ createdAt: -1 });
  }

  // Marquer un médicament comme pris
  static async markAsTaken(userEmail: string, reminderId: string) {
    const reminder = await ReminderModel.findOne({ 
      _id: reminderId, 
      userId: userEmail,
      status: { $in: ['pending', 'completed'] }  // ✅ Changé de isActive à status
    });

    if (!reminder) {
      throw new Error("Rappel non trouvé");
    }

    // Créer un log de prise de médicament
    await MedicationLog.create({
      userId: userEmail,
      medicationId: reminder.medicationId,
      reminderId: reminder._id,
      takenAt: new Date(),
      starsEarned: 1,
    });

    // Mettre à jour le statut du reminder
    reminder.status = 'completed';
    reminder.lastTaken = new Date();
    await reminder.save();

    // Renvoie le score mis à jour via gamification
    return await GamificationService.handleMedicationTaken(userEmail);
  }

  // Annuler un rappel (changer le status)
  static async deleteReminder(reminderId: string, userEmail: string) {
    return ReminderModel.findOneAndUpdate(
      { _id: reminderId, userId: userEmail },
      { status: 'cancelled' },  // ✅ Changé de isActive: false à status: 'cancelled'
      { new: true }
    );
  }
}
