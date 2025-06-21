'use server';

import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  where,
  serverTimestamp,
  addDoc,
  runTransaction,
  Timestamp,
  getDoc,
  DocumentReference,
} from 'firebase/firestore';
import type { Appointment, Service } from '@/lib/data';
import { format } from 'date-fns';

export type AppointmentData = Omit<Appointment, 'id'> & { ownerId: string; servicePrice: number };

/**
 * Retrieves all appointments for a specific user from Firestore.
 * @param userId - The UID of the user whose appointments are to be fetched.
 * @returns A promise that resolves to an array of Appointment objects.
 */
export const getAppointmentsForUser = async (userId: string): Promise<Appointment[]> => {
  if (!userId) {
    console.error("getAppointmentsForUser was called without a userId.");
    return [];
  }
  const appointmentsCol = collection(db, 'appointments');
  const q = query(appointmentsCol, where("ownerId", "==", userId));
  const appointmentSnapshot = await getDocs(q);

  const appointmentList = appointmentSnapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamps to date strings if necessary
    const date = data.date instanceof Timestamp ? format(data.date.toDate(), 'yyyy-MM-dd') : data.date;
    return {
      id: doc.id,
      ...data,
      date: date,
    } as Appointment;
  });
  return appointmentList;
};


/**
 * Saves a new appointment and atomically updates the related client's statistics.
 * @param appointmentData The full data for the new appointment.
 * @returns The ID of the newly created appointment.
 */
export const saveAppointmentAndUpdateClient = async (appointmentData: AppointmentData): Promise<string> => {
    const { clientId, servicePrice, serviceName, date, ownerId } = appointmentData;
    
    if (!clientId) throw new Error("Client ID is required.");
    if (!ownerId) throw new Error("Owner ID is required.");

    const clientRef = doc(db, "clients", clientId);
    const appointmentRef = doc(collection(db, "appointments"));

    await runTransaction(db, async (transaction) => {
        const clientDoc = await transaction.get(clientRef);
        if (!clientDoc.exists()) {
            throw new Error("Client document does not exist!");
        }
        
        // Ensure the client belongs to the user trying to modify it
        if (clientDoc.data().ownerId !== ownerId) {
            throw new Error("User does not have permission to modify this client.");
        }

        // 1. Create the new appointment
        transaction.set(appointmentRef, {
            ...appointmentData,
            createdAt: serverTimestamp(),
        });
        
        // 2. Update the client document
        const currentTotalSpent = clientDoc.data().totalSpent || 0;
        const newTotalSpent = currentTotalSpent + servicePrice;
        
        const lastServiceDate = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
        const newLastService = `${serviceName} - ${lastServiceDate}`;

        transaction.update(clientRef, { 
            totalSpent: newTotalSpent,
            lastService: newLastService,
        });
    });

    return appointmentRef.id;
};
