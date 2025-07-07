export interface VocabularyCategory {
  id: string;
  titleEn: string;
  titlePt: string;
  iconName: string;
  gradientColors: string[];
  totalLevels: number;
  order: number;
  isPremium: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VocabularyQuestion {
  id: string;
  categoryId: string;
  level: number;
  question: string;
  options: string[];
  correctIndex: number;
  emoji: string;
  difficulty: number; // 1 = easy, 2 = medium, 3 = hard
  explanationEn?: string;
  explanationPt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VocabularyProgress {
  categoryId: string;
  currentLevel: number;
  completedLevels: number;
  totalXP: number;
  totalCoins: number;
  attempts: LevelAttempt[];
  lastPlayedAt?: Date;
  bestScore: number;
  isCompleted: boolean;
}

export interface LevelAttempt {
  level: number;
  score: number;
  xpEarned: number;
  coinsEarned: number;
  playedAt: Date;
  correctAnswers: number;
  totalQuestions: number;
}