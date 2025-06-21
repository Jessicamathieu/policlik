import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Client } from '@/lib/data';

// Ce type est utilisé lors de la création de nouveaux clients.
// Il omet les champs qui sont générés par la base de données ou ajoutés plus tard.
export type NewClientData = Omit<Client, 'id' | 'lastService' | 'totalSpent'>;

/**
 * Récupère tous les clients depuis la collection 'clients' de Firestore.
 * @returns Une promesse qui résout en un tableau d'objets Client.
 */
export const getClients = async (): Promise<Client[]> => {
    const clientsCol = collection(db, 'clients');
    const clientSnapshot = await getDocs(clientsCol);
    const clientList = clientSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        // Les champs optionnels peuvent ne pas exister sur le document
        lastService: data.lastService,
        totalSpent: data.totalSpent,
      };
    });
    return clientList;
};

/**
 * Ajoute plusieurs clients à Firestore en une seule opération (batch).
 * @param clients - Un tableau d'objets NewClientData à ajouter.
 */
export const addClientsBatch = async (clients: NewClientData[]): Promise<void> => {
    const batch = writeBatch(db);
    const clientsCol = collection(db, 'clients');

    clients.forEach(client => {
        const docRef = doc(clientsCol); // Firestore génère un nouvel ID
        batch.set(docRef, { ...client, createdAt: new Date() });
    });

    await batch.commit();
};
