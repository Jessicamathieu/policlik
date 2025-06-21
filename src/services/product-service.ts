
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Product } from '@/lib/data';

// Ce type est utilisé lors de la création de nouveaux produits.
export type NewProductData = Omit<Product, 'id'>;

/**
 * Ajoute plusieurs produits à Firestore en une seule opération (batch).
 * @param products - Un tableau d'objets NewProductData à ajouter.
 */
export const addProductsBatch = async (products: NewProductData[]): Promise<void> => {
    const batch = writeBatch(db);
    const productsCol = collection(db, 'products');

    products.forEach(product => {
        const docRef = doc(productsCol); // Firestore génère un nouvel ID
        batch.set(docRef, { ...product, createdAt: new Date() });
    });

    await batch.commit();
};

/**
 * Récupère tous les produits depuis la collection 'products' de Firestore.
 * @returns Une promesse qui résout en un tableau d'objets Product.
 */
export const getProducts = async (): Promise<Product[]> => {
    const productsCol = collection(db, 'products');
    const productSnapshot = await getDocs(productsCol);
    
    const productList = productSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        code: data.code || '',
        category: data.category || '',
        subCategory: data.subCategory,
        price: data.price,
      };
    });
    return productList;
};
