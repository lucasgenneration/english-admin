import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { VocabularyCategory, VocabularyQuestion } from '@/types/vocabulary';

const CATEGORIES_COLLECTION = 'vocabularyCategories';
const QUESTIONS_COLLECTION = 'vocabularyQuestions';

export const vocabularyService = {
  // Categories CRUD
  async getCategories(): Promise<VocabularyCategory[]> {
    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('order'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as VocabularyCategory));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryById(id: string): Promise<VocabularyCategory | null> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as VocabularyCategory;
      }
      return null;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  async createCategory(data: Omit<VocabularyCategory, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, data: Partial<VocabularyCategory>): Promise<void> {
    try {
      const docRef = doc(db, CATEGORIES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      // First, delete all questions in this category
      const questions = await this.getQuestionsByCategory(id);
      const batch = writeBatch(db);
      
      questions.forEach(question => {
        const questionRef = doc(db, QUESTIONS_COLLECTION, question.id);
        batch.delete(questionRef);
      });
      
      // Delete the category
      const categoryRef = doc(db, CATEGORIES_COLLECTION, id);
      batch.delete(categoryRef);
      
      await batch.commit();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  async reorderCategories(categories: { id: string; order: number }[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      categories.forEach(({ id, order }) => {
        const docRef = doc(db, CATEGORIES_COLLECTION, id);
        batch.update(docRef, { order, updatedAt: serverTimestamp() });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error reordering categories:', error);
      throw error;
    }
  },

  // Questions CRUD
  async getQuestionsByCategory(categoryId: string): Promise<VocabularyQuestion[]> {
    try {
      const q = query(
        collection(db, QUESTIONS_COLLECTION),
        where('categoryId', '==', categoryId),
        orderBy('level'),
        orderBy('difficulty')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as VocabularyQuestion));
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  async getQuestionById(id: string): Promise<VocabularyQuestion | null> {
    try {
      const docRef = doc(db, QUESTIONS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as VocabularyQuestion;
      }
      return null;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  async createQuestion(data: Omit<VocabularyQuestion, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  async updateQuestion(id: string, data: Partial<VocabularyQuestion>): Promise<void> {
    try {
      const docRef = doc(db, QUESTIONS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  async deleteQuestion(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, QUESTIONS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  async bulkCreateQuestions(questions: Omit<VocabularyQuestion, 'id'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      questions.forEach(question => {
        const docRef = doc(collection(db, QUESTIONS_COLLECTION));
        batch.set(docRef, {
          ...question,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error bulk creating questions:', error);
      throw error;
    }
  }
};