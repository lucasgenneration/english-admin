// Alternativa ao Firebase Admin usando Client SDK com privilégios elevados
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Funções que substituem o Admin SDK
export const adminDb = {
  // Users
  async getUsers() {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getUser(uid: string) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async updateUser(uid: string, data: any) {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async deleteUser(uid: string) {
    const docRef = doc(db, 'users', uid);
    await deleteDoc(docRef);
  },

  // Study content methods
  async createDocument(collectionName: string, data: any) {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async updateDocument(collectionName: string, docId: string, data: any) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  async deleteDocument(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },

  // Batch operations
  batch() {
    return writeBatch(db);
  }
};

// Export types and functions
export { collection, doc, query, where, orderBy, getDocs, serverTimestamp };