// Estrutura baseada no modelo Flutter existente

export interface StudyContent {
  id: string;
  subfolderId: string;
  iconName: string;
  colorHex: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  externalLink: string;
  type: 'video' | 'article' | 'podcast';
  isCompleted: boolean;
  durationMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySubfolder {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  contents?: StudyContent[];
  totalItems: number;
  completedItems: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyFolder {
  id: string;
  name: string;
  description?: string;
  iconName: string;
  colorHex: string;
  subfolders?: StudySubfolder[];
  totalItems: number;
  completedItems: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Para compatibilidade com o código existente
export type StudyPlanFolder = StudySubfolder;
export type StudyPlanContent = StudyContent;
export type StudyPlan = StudyFolder;