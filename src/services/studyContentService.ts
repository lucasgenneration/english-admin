import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StudyFolder, StudySubfolder, StudyContent } from '@/types/study-content';

// Serviços para StudyFolders (pastas principais)
export const studyFolderService = {
  async getAll(): Promise<StudyFolder[]> {
    const q = query(collection(db, 'studyFolders'));
    const snapshot = await getDocs(q);
    
    const folders: StudyFolder[] = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const folder: StudyFolder = {
        id: doc.id,
        name: data.name,
        description: data.description,
        iconName: data.iconName,
        colorHex: data.colorHex,
        order: data.order || 0,
        isPremium: data.isPremium || false,
        totalItems: data.totalItems || 0,
        completedItems: data.completedItems || 0,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
      
      // Carregar subfolders
      const subfoldersQuery = query(
        collection(db, 'studySubfolders'),
        where('parentId', '==', doc.id)
      );
      const subfoldersSnapshot = await getDocs(subfoldersQuery);
      
      folder.subfolders = subfoldersSnapshot.docs
        .map(subDoc => ({
          id: subDoc.id,
          ...subDoc.data(),
          createdAt: subDoc.data().createdAt?.toDate(),
          updatedAt: subDoc.data().updatedAt?.toDate(),
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0)) as StudySubfolder[];
      
      folders.push(folder);
    }
    
    // Ordenar manualmente por order
    return folders.sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async getById(id: string): Promise<StudyFolder | null> {
    const docRef = doc(db, 'studyFolders', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    const folder: StudyFolder = {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      iconName: data.iconName,
      colorHex: data.colorHex,
      order: data.order || 0,
      isPremium: data.isPremium || false,
      totalItems: data.totalItems || 0,
      completedItems: data.completedItems || 0,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
    
    // Carregar subfolders
    const subfoldersQuery = query(
      collection(db, 'studySubfolders'),
      where('parentId', '==', id)
    );
    const subfoldersSnapshot = await getDocs(subfoldersQuery);
    
    folder.subfolders = subfoldersSnapshot.docs
      .map(subDoc => ({
        id: subDoc.id,
        ...subDoc.data(),
        createdAt: subDoc.data().createdAt?.toDate(),
        updatedAt: subDoc.data().updatedAt?.toDate(),
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0)) as StudySubfolder[];
    
    return folder;
  },

  async create(data: Omit<StudyFolder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'studyFolders'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<StudyFolder>): Promise<void> {
    const { id: _, createdAt, updatedAt, subfolders, contents, ...updateData } = data;
    await updateDoc(doc(db, 'studyFolders', id), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const batch = writeBatch(db);
    
    // Deletar folder
    batch.delete(doc(db, 'studyFolders', id));
    
    // Deletar todas as subfolders
    const subfoldersQuery = query(
      collection(db, 'studySubfolders'),
      where('parentId', '==', id)
    );
    const subfoldersSnapshot = await getDocs(subfoldersQuery);
    
    for (const subfolderDoc of subfoldersSnapshot.docs) {
      // Deletar subfolder
      batch.delete(doc(db, 'studySubfolders', subfolderDoc.id));
      
      // Deletar conteúdos da subfolder
      const contentsQuery = query(
        collection(db, 'studyContents'),
        where('subfolderId', '==', subfolderDoc.id)
      );
      const contentsSnapshot = await getDocs(contentsQuery);
      
      for (const contentDoc of contentsSnapshot.docs) {
        batch.delete(doc(db, 'studyContents', contentDoc.id));
      }
    }
    
    await batch.commit();
  },

  async reorder(folders: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db);
    
    for (const folder of folders) {
      batch.update(doc(db, 'studyFolders', folder.id), {
        order: folder.order,
        updatedAt: serverTimestamp(),
      });
    }
    
    await batch.commit();
  }
};

// Serviços para StudySubfolders
export const studySubfolderService = {
  async getByParentId(parentId: string): Promise<StudySubfolder[]> {
    const q = query(
      collection(db, 'studySubfolders'),
      where('parentId', '==', parentId)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0)) as StudySubfolder[];
  },

  async getById(id: string): Promise<StudySubfolder | null> {
    const docRef = doc(db, 'studySubfolders', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      parentId: data.parentId,
      order: data.order || 0,
      totalItems: data.totalItems || 0,
      completedItems: data.completedItems || 0,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },

  async create(data: Omit<StudySubfolder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'studySubfolders'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Atualizar contador na folder pai
    await updateDoc(doc(db, 'studyFolders', data.parentId), {
      totalItems: (await getDoc(doc(db, 'studyFolders', data.parentId))).data()?.totalItems + 1 || 1,
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  },

  async update(id: string, data: Partial<StudySubfolder>): Promise<void> {
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    await updateDoc(doc(db, 'studySubfolders', id), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const subfolderDoc = await getDoc(doc(db, 'studySubfolders', id));
    if (!subfolderDoc.exists()) return;
    
    const parentId = subfolderDoc.data().parentId;
    const batch = writeBatch(db);
    
    // Deletar subfolder
    batch.delete(doc(db, 'studySubfolders', id));
    
    // Deletar todos os conteúdos
    const contentsQuery = query(
      collection(db, 'studyContents'),
      where('subfolderId', '==', id)
    );
    const contentsSnapshot = await getDocs(contentsQuery);
    
    for (const contentDoc of contentsSnapshot.docs) {
      batch.delete(doc(db, 'studyContents', contentDoc.id));
    }
    
    await batch.commit();
    
    // Atualizar contador na folder pai
    const parentDoc = await getDoc(doc(db, 'studyFolders', parentId));
    if (parentDoc.exists()) {
      await updateDoc(doc(db, 'studyFolders', parentId), {
        totalItems: Math.max(0, (parentDoc.data().totalItems || 0) - 1),
        updatedAt: serverTimestamp(),
      });
    }
  },

  async reorder(subfolders: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db);
    
    for (const subfolder of subfolders) {
      batch.update(doc(db, 'studySubfolders', subfolder.id), {
        order: subfolder.order,
        updatedAt: serverTimestamp(),
      });
    }
    
    await batch.commit();
  }
};

// Serviços para StudyContents
export const studyContentService = {
  async getByParentId(parentId: string): Promise<StudyContent[]> {
    const q = query(
      collection(db, 'studyContents'),
      where('subfolderId', '==', parentId)
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        subtitle: data.subtitle,
        type: data.type,
        externalLink: data.externalLink,
        durationMinutes: data.durationMinutes,
        difficulty: data.difficulty,
        description: data.description,
        order: data.order || 0,
        subfolderId: data.subfolderId,
        isCompleted: data.isCompleted || false,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as StudyContent;
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
  },

  async getById(id: string): Promise<StudyContent | null> {
    const docRef = doc(db, 'studyContents', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      subtitle: data.subtitle,
      type: data.type,
      externalLink: data.externalLink,
      durationMinutes: data.durationMinutes,
      difficulty: data.difficulty,
      description: data.description,
      order: data.order || 0,
      subfolderId: data.subfolderId,
      isCompleted: data.isCompleted || false,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    };
  },

  async create(data: Omit<StudyContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'studyContents'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Atualizar contador na subfolder pai
    await updateDoc(doc(db, 'studySubfolders', data.subfolderId), {
      totalItems: (await getDoc(doc(db, 'studySubfolders', data.subfolderId))).data()?.totalItems + 1 || 1,
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  },

  async update(id: string, data: Partial<StudyContent>): Promise<void> {
    const { id: _, createdAt, updatedAt, ...updateData } = data;
    await updateDoc(doc(db, 'studyContents', id), {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const contentDoc = await getDoc(doc(db, 'studyContents', id));
    if (!contentDoc.exists()) return;
    
    const subfolderId = contentDoc.data().subfolderId;
    
    // Deletar conteúdo
    await deleteDoc(doc(db, 'studyContents', id));
    
    // Atualizar contador na subfolder pai
    const parentDoc = await getDoc(doc(db, 'studySubfolders', subfolderId));
    if (parentDoc.exists()) {
      await updateDoc(doc(db, 'studySubfolders', subfolderId), {
        totalItems: Math.max(0, (parentDoc.data().totalItems || 0) - 1),
        updatedAt: serverTimestamp(),
      });
    }
  },

  async reorder(contents: { id: string; order: number }[]): Promise<void> {
    const batch = writeBatch(db);
    
    for (const content of contents) {
      batch.update(doc(db, 'studyContents', content.id), {
        order: content.order,
        updatedAt: serverTimestamp(),
      });
    }
    
    await batch.commit();
  }
};