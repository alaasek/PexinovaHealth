import { Request, Response } from 'express';
import { GamificationService } from '../services/gamification.service';

export class GamificationController {

  async getScore(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      const data = await GamificationService.getScore(userEmail);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Get score error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur',
        error: error.message 
      });
    }
  }

  async getPlanetStatus(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      const data = await GamificationService.getPlanetStatus(userEmail);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Get planet status error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur',
        error: error.message 
      });
    }
  }

  async getStreak(req: Request, res: Response): Promise<Response> {
    try {
      const userEmail = (req as any).userEmail || (req as any).userId || "test-user";
      const data = await GamificationService.getStreak(userEmail);
      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Get streak error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur serveur',
        error: error.message 
      });
    }
  }
}