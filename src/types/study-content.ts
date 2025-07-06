// Tipos que correspondem à estrutura real do Firestore

export interface StudyContent {
  id: string;
  title: string;
  subtitle?: string;
  type: 'video' | 'article' | 'podcast';
  externalLink: string; // URL no Firestore
  durationMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  description?: string;
  order: number;
  subfolderId: string; // parentId no Firestore
  isCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudySubfolder {
  id: string;
  name: string;
  description?: string;
  order: number;
  parentId: string; // ID da folder principal
  totalItems: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StudyFolder {
  id: string;
  name: string;
  description?: string;
  iconName?: string; // "book" no Firestore
  colorHex?: string; // "#9C27B0" no Firestore
  order: number;
  isPremium?: boolean;
  totalItems: number;
  completedItems?: number;
  subfolders?: StudySubfolder[];
  contents?: StudyContent[];
  createdAt?: Date;
  updatedAt?: Date;
}