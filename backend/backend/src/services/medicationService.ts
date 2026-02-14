import Medication from "../models/Medication.model";
import Reminder from "../models/Reminder.model";

export class MedicationService {
  // Ajouter un médicament
  static async addMedication(userEmail: string, data: any) {
    return await Medication.create({ userId: userEmail, ...data });
  }

  // Mettre à jour un médicament
  static async updateMedication(id: string, userEmail: string, data: any) {
    return await Medication.findOneAndUpdate(
      { _id: id, userId: userEmail },
      data,
      { new: true }
    );
  }

  // Supprimer un médicament et ses reminders
  static async deleteMedication(id: string, userEmail: string) {
    // Supprimer les reminders associés
    await Reminder.deleteMany({ medicationId: id });
    
    // Supprimer le médicament
    return await Medication.findOneAndDelete({ 
      _id: id, 
      userId: userEmail 
    });
  }

  // Récupérer tous les médicaments d'un utilisateur
  static async getMedications(userEmail: string) {
    return await Medication.find({ 
      userId: userEmail,
      isActive: true 
    }).sort({ createdAt: -1 });
  }

  // Récupérer un médicament par ID
  static async getMedicationById(id: string, userEmail: string) {
    return await Medication.findOne({ 
      _id: id, 
      userId: userEmail,
      isActive: true 
    });
  }
}
