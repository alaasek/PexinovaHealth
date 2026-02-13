// types.ts - Définitions TypeScript pour l'application

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  score: number;
  streak: number;
  medications: Medication[];
}

export interface AlienPosition {
  x: number;
  y: number;
  angle: number;
}

export type RootStackParamList = {
  Home: undefined;
  Onboarding: undefined;
  MedicationDetail: { medicationId: string };
  AddMedication: undefined;
  Profile: undefined;
};