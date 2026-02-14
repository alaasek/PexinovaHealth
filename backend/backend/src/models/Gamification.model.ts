import mongoose, { Schema, Document } from 'mongoose';

export interface IGamification extends Document {
  userId: string;
  totalStars: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: Date;
  level: number;
  planetStatus: {
    health: number;
    appearance: 'destroyed' | 'damaged' | 'healing' | 'healthy' | 'thriving';
    enemiesDestroyed: number;
  };
  achievements: { id: string; name: string; unlockedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const GamificationSchema = new Schema<IGamification>(
  {
    userId: { type: String, ref: 'User', required: true, unique: true },
    totalStars: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActivityDate: { type: Date },
    level: { type: Number, default: 1 },
    planetStatus: {
      health: { type: Number, default: 50 },
      appearance: { 
        type: String, 
        enum: ['destroyed', 'damaged', 'healing', 'healthy', 'thriving'], 
        default: 'healing' 
      },
      enemiesDestroyed: { type: Number, default: 0 },
    },
    achievements: [{ 
      id: String, 
      name: String, 
      unlockedAt: Date 
    }],
  },
  { timestamps: true }
);

// ✅ Éviter l'erreur de recompilation
export default mongoose.models.Gamification || mongoose.model<IGamification>('Gamification', GamificationSchema);