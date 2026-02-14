import Gamification from "../models/Gamification.model";

export class GamificationService {

  // Récupérer le score
  static async getScore(userEmail: string) {
    let record = await Gamification.findOne({ userId: userEmail });
    
    // ✅ Créer automatiquement si n'existe pas
    if (!record) {
      record = await Gamification.create({ userId: userEmail });
    }
    
    return { 
      totalStars: record.totalStars, 
      level: record.level 
    };
  }

  // Récupérer le statut de la planète
  static async getPlanetStatus(userEmail: string) {
    let record = await Gamification.findOne({ userId: userEmail });
    
    if (!record) {
      record = await Gamification.create({ userId: userEmail });
    }
    
    return record.planetStatus;
  }

  // Récupérer les streaks
  static async getStreak(userEmail: string) {
    let record = await Gamification.findOne({ userId: userEmail });
    
    if (!record) {
      record = await Gamification.create({ userId: userEmail });
    }
    
    return { 
      currentStreak: record.currentStreak, 
      longestStreak: record.longestStreak 
    };
  }

  // Gérer la prise d'un médicament
  static async handleMedicationTaken(userEmail: string) {
    let record = await Gamification.findOne({ userId: userEmail });
    
    // ✅ Créer automatiquement si n'existe pas
    if (!record) {
      record = await Gamification.create({ userId: userEmail });
    }

    // Ajouter une étoile
    record.totalStars += 1;
    
    // Calculer le niveau (ex: 1 niveau = 10 étoiles)
    record.level = Math.floor(record.totalStars / 10) + 1;

    // Gérer les streaks
    const today = new Date().toDateString();
    const lastActivity = record.lastActivityDate?.toDateString();
    
    if (lastActivity !== today) {
      // Nouvelle journée
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivity === yesterday.toDateString()) {
        // Continuité du streak
        record.currentStreak += 1;
      } else {
        // Streak cassé, recommencer
        record.currentStreak = 1;
      }
      
      // Mettre à jour le meilleur streak
      if (record.currentStreak > record.longestStreak) {
        record.longestStreak = record.currentStreak;
      }
      
      record.lastActivityDate = new Date();
    }

    // Améliorer la santé de la planète
    record.planetStatus.health = Math.min(100, record.planetStatus.health + 5);
    
    // Mettre à jour l'apparence selon la santé
    if (record.planetStatus.health >= 90) {
      record.planetStatus.appearance = 'thriving';
    } else if (record.planetStatus.health >= 70) {
      record.planetStatus.appearance = 'healthy';
    } else if (record.planetStatus.health >= 40) {
      record.planetStatus.appearance = 'healing';
    } else if (record.planetStatus.health >= 20) {
      record.planetStatus.appearance = 'damaged';
    } else {
      record.planetStatus.appearance = 'destroyed';
    }

    await record.save();
    
    return { 
      totalStars: record.totalStars, 
      currentStreak: record.currentStreak,
      level: record.level,
      planetStatus: record.planetStatus
    };
  }
}