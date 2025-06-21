
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Service } from '@/lib/data';

// Ce type est utilisé lors de la création de nouveaux services.
// Il omet les champs qui sont générés par la base de données ou ajoutés plus tard.
export type NewServiceData = Omit<Service, 'id' | 'colorClassName'>;

/**
 * Ajoute plusieurs services à Firestore en une seule opération (batch).
 * @param services - Un tableau d'objets NewServiceData à ajouter.
 */
export const addServicesBatch = async (services: NewServiceData[]): Promise<void> => {
    const batch = writeBatch(db);
    const servicesCol = collection(db, 'services');

    services.forEach(service => {
        const docRef = doc(servicesCol); // Firestore génère un nouvel ID
        const { colorCode, ...rest } = service;

        // Le document stocké dans Firestore doit avoir le type complet (ou presque)
        const serviceDoc = {
            ...rest,
            colorCode: colorCode,
            colorClassName: colorCode, // On suppose que le code couleur est une classe Tailwind (ex: 'bg-blue-500')
            createdAt: new Date(),
        };
        batch.set(docRef, serviceDoc);
    });

    await batch.commit();
};

/**
 * Récupère tous les services depuis la collection 'services' de Firestore.
 * @returns Une promesse qui résout en un tableau d'objets Service.
 */
export const getServices = async (): Promise<Service[]> => {
    const servicesCol = collection(db, 'services');
    const serviceSnapshot = await getDocs(servicesCol);
    
    const serviceList = serviceSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        category: data.category || '',
        subCategory: data.subCategory,
        rate: data.rate,
        unit: data.unit,
        description: data.description,
        price: data.price,
        colorCode: data.colorCode,
        colorClassName: data.colorClassName,
      };
    });
    return serviceList;
};
