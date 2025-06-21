import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Client } from '@/lib/data';

// Ce type est utilisé lors de la création de nouveaux clients.
// Il omet les champs qui sont générés par la base de données ou ajoutés plus tard.
export type NewClientData = Omit<Client, 'id' | 'lastService' | 'totalSpent'>;

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

// Données d'exemple pour peupler la base si elle est vide
const seedClients: NewClientData[] = [
    { name: 'Jean Dupont', email: 'jean.dupont@example.com', phone: '418-555-0101', address: '123 Rue de la Paix, Québec, QC G1V 0A1' },
    { name: 'Marie Tremblay', email: 'marie.tremblay@email.com', phone: '581-555-0102', address: '456 Avenue Cartier, Québec, QC G1R 2V4' },
    { name: 'Pierre Gagnon', email: 'pierre.gagnon@host.com', phone: '418-555-0103', address: '789 Boulevard Laurier, Québec, QC G1S 1T9' },
    { name: 'Julie Roy', email: 'julie.roy@example.net', phone: '438-555-0104', address: '101 Grande Allée O, Québec, QC G1R 2G8' },
];

/**
 * Récupère tous les clients depuis la collection 'clients' de Firestore.
 * Si la collection est vide, la peuple avec des données d'exemple.
 * @returns Une promesse qui résout en un tableau d'objets Client.
 */
export const getClients = async (): Promise<Client[]> => {
    const clientsCol = collection(db, 'clients');
    let clientSnapshot = await getDocs(clientsCol);

    // Si la base de données est vide, on la peuple avec des données d'exemple
    if (clientSnapshot.empty) {
        console.log("La collection 'clients' est vide. Peuplement avec des données d'exemple...");
        await addClientsBatch(seedClients);
        // On relit les données après les avoir ajoutées
        clientSnapshot = await getDocs(clientsCol);
        console.log("Peuplement terminé.");
    }

    const clientList = clientSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        lastService: data.lastService,
        totalSpent: data.totalSpent,
      };
    });
    return clientList;
};
