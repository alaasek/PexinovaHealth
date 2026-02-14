import { Request, Response } from "express";
import Medication from "../models/Medication.model";
import Reminder from "../models/Reminder.model";

export class MedicationController {

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      if (!userId) return res.status(401).json({ success:false,message:"Non authentifié" });

      const { name, dosage, category, timer } = req.body;

      if (!name || !timer?.hours || !timer?.minutes || !timer?.period) {
        return res.status(400).json({ success:false,message:"Horaire incomplet" });
      }

      const medication = await Medication.create({
        userId,
        name,
        dosage,
        category,
        timer,
      });

      const scheduledTime = `${timer.hours}:${timer.minutes} ${timer.period}`;

      const reminder = await Reminder.create({
        userId,
        medicationId: medication._id,
        scheduledTime,
      });

      return res.status(201).json({
        success: true,
        data: { medication, reminder }
      });

    } catch (e:any) {
      return res.status(500).json({ success:false,message:"Erreur serveur",error:e.message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const meds = await Medication.find({ userId, isActive:true }).sort({createdAt:-1});
      return res.json({ success:true,data:meds });
    } catch (e:any) {
      return res.status(500).json({ success:false,message:"Erreur serveur",error:e.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      await Medication.findOneAndUpdate(
        { _id:id, userId },
        { isActive:false }
      );

      await Reminder.updateMany({ medicationId:id },{ status:"cancelled" });

      return res.json({ success:true,message:"Médicament supprimé" });

    } catch (e:any) {
      return res.status(500).json({ success:false,message:"Erreur serveur",error:e.message });
    }
  }
}
