import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';

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

export const userService = {
  // Buscar todos os usuários
  async getUsers(): Promise<User[]> {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      lastLoginAt: doc.data().lastLoginAt?.toDate() || new Date(),
      lastCheckInDate: doc.data().lastCheckInDate?.toDate(),
    })) as User[];
  },

  // Buscar um usuário específico
  async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
      lastCheckInDate: data.lastCheckInDate?.toDate(),
    } as User;
  },

  // Atualizar dados do usuário
  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    
    // Converter dates para Timestamp
    const updateData: any = { ...data };
    if (data.createdAt) {
      updateData.createdAt = Timestamp.fromDate(data.createdAt);
    }
    if (data.lastLoginAt) {
      updateData.lastLoginAt = Timestamp.fromDate(data.lastLoginAt);
    }
    if (data.lastCheckInDate) {
      updateData.lastCheckInDate = Timestamp.fromDate(data.lastCheckInDate);
    }
    
    // Adicionar timestamp de atualização
    updateData.updatedAt = serverTimestamp();
    
    await updateDoc(docRef, updateData);
  },

  // Deletar usuário
  async deleteUser(userId: string): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await deleteDoc(docRef);
  },

  // Resetar senha do usuário
  async resetUserPassword(email: string): Promise<void> {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  },

  // Alterar status premium
  async togglePremiumStatus(userId: string, isPremium: boolean): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      isPremium,
      subscriptionType: isPremium ? 'individual' : null,
      updatedAt: serverTimestamp()
    });
  },

  // Adicionar XP
  async addXP(userId: string, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('Usuário não encontrado');
    
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    await updateDoc(doc(db, 'users', userId), {
      xp: newXP,
      userLevel: newLevel,
      updatedAt: serverTimestamp()
    });
  },

  // Adicionar moedas
  async addCoins(userId: string, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) throw new Error('Usuário não encontrado');
    
    await updateDoc(doc(db, 'users', userId), {
      coins: user.coins + amount,
      updatedAt: serverTimestamp()
    });
  },

  // Resetar streak
  async resetStreak(userId: string): Promise<void> {
    await updateDoc(doc(db, 'users', userId), {
      streak: 0,
      lastCheckInDate: null,
      updatedAt: serverTimestamp()
    });
  }
};