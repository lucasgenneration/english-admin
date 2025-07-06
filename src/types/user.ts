export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  
  // Personalização
  goal?: string;
  level?: string;
  frequency?: string;
  dailyGoal: number;
  
  // Gamificação
  xp: number;
  streak: number;
  userLevel: number;
  achievements: string[];
  totalLessons: number;
  totalWords: number;
  totalHours: number;
  
  // Sistema de Moedas
  coins: number;
  lastCheckInDate?: Date;
  
  // Metadados
  createdAt: Date;
  lastLoginAt: Date;
  isPremium: boolean;
  subscriptionType?: string;
}