
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc, query, where, serverTimestamp, addDoc } from 'firebase/firestore';
import type { Client } from '@/lib/data';

// Ce type est utilisé lors de la création de nouveaux clients.
// Il omet les champs qui sont générés par la base de données ou ajoutés plus tard.
export type NewClientData = Omit<Client, 'id' | 'lastService' | 'totalSpent'>;


/**
 * Ajoute un seul client à Firestore.
 * @param clientData - L'objet NewClientData du client à ajouter.
 * @param userId - L'UID de l'utilisateur propriétaire.
 */
export const addClient = async (clientData: NewClientData, userId: string): Promise<void> => {
  if (!userId) {
    throw new Error("L'ID utilisateur est requis pour ajouter un client.");
  }
  const clientsCol = collection(db, 'clients');
  await addDoc(clientsCol, {
    ...clientData,
    ownerId: userId,
    createdAt: serverTimestamp(),
    totalSpent: 0,
    lastService: "Aucun service récent"
  });
};


/**
 * Ajoute plusieurs clients à Firestore en une seule opération (batch) pour un utilisateur spécifique.
 * @param clients - Un tableau d'objets NewClientData à ajouter.
 * @param userId - L'UID de l'utilisateur auquel les clients appartiennent.
 */
export const addClientsBatch = async (clients: NewClientData[], userId: string): Promise<void> => {
    const batch = writeBatch(db);
    const clientsCol = collection(db, 'clients');

    clients.forEach(client => {
        const docRef = doc(clientsCol); // Firestore génère un nouvel ID
        batch.set(docRef, { 
          ...client, 
          ownerId: userId, 
          createdAt: serverTimestamp(),
          totalSpent: 0,
          lastService: "Aucun service récent"
        });
    });

    await batch.commit();
};

/**
 * Récupère tous les clients d'un utilisateur spécifique depuis la collection 'clients' de Firestore.
 * @param userId - L'UID de l'utilisateur dont on veut récupérer les clients.
 * @returns Une promesse qui résout en un tableau d'objets Client.
 */
export const getClients = async (userId: string): Promise<Client[]> => {
    if (!userId) {
        console.error("getClients a été appelé sans userId.");
        return [];
    }
    const clientsCol = collection(db, 'clients');
    const q = query(clientsCol, where("ownerId", "==", userId));
    const clientSnapshot = await getDocs(q);

    const clientList = clientSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        lastService: data.lastService || 'Aucun service récent',
        totalSpent: data.totalSpent || 0,
      };
    });
    return clientList;
};
