
'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { Invoice } from '@/lib/data';
import { format } from 'date-fns';

/**
 * Retrieves all invoices for a specific user from Firestore.
 * @param userId - The UID of the user whose invoices are to be fetched.
 * @returns A promise that resolves to an array of Invoice objects.
 */
export const getInvoices = async (userId: string): Promise<Invoice[]> => {
  if (!userId) {
    console.error("getInvoices was called without a userId.");
    return [];
  }
  const invoicesCol = collection(db, 'invoices');
  const q = query(invoicesCol, where("ownerId", "==", userId));
  const invoiceSnapshot = await getDocs(q);

  const invoiceList = invoiceSnapshot.docs.map(doc => {
    const data = doc.data();
    const dateEmission = data.dateEmission instanceof Timestamp ? format(data.dateEmission.toDate(), 'yyyy-MM-dd') : data.dateEmission;
    const dateEcheance = data.dateEcheance instanceof Timestamp ? format(data.dateEcheance.toDate(), 'yyyy-MM-dd') : data.dateEcheance;
    
    return {
      id: doc.id,
      clientName: data.clientName,
      dateEmission: dateEmission,
      dateEcheance: dateEcheance,
      amount: data.amount,
      status: data.status,
    } as Invoice;
  });
  return invoiceList;
};
