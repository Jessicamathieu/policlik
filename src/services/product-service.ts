
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

// Données d'exemple pour peupler la base si elle est vide
const seedProducts: NewProductData[] = [
    { name: 'Produit de nettoyage tout usage (1L)', code: 'PNC-001', category: 'Produits', subCategory: 'Nettoyants', price: 15.99 },
    { name: 'Lingettes microfibres (paquet de 10)', code: 'MAT-001', category: 'Matériel', subCategory: 'Accessoires', price: 25.00 },
    { name: 'Désodorisant Professionnel (500ml)', code: 'PNC-002', category: 'Produits', subCategory: 'Finition', price: 12.50 },
    { name: 'Raclette à vitres professionnelle', code: 'MAT-002', category: 'Matériel', subCategory: 'Vitrages', price: 35.00 },
];


/**
 * Récupère tous les produits depuis la collection 'products' de Firestore.
 * Si la collection est vide, la peuple avec des données d'exemple.
 * @returns Une promesse qui résout en un tableau d'objets Product.
 */
export const getProducts = async (): Promise<Product[]> => {
    const productsCol = collection(db, 'products');
    let productSnapshot = await getDocs(productsCol);
    
    // Si la base de données est vide, on la peuple avec des données d'exemple
    if (productSnapshot.empty) {
        console.log("La collection 'products' est vide. Peuplement avec des données d'exemple...");
        await addProductsBatch(seedProducts);
        // On relit les données après les avoir ajoutées
        productSnapshot = await getDocs(productsCol);
        console.log("Peuplement terminé.");
    }
    
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
