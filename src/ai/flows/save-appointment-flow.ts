'use server';
/**
 * @fileOverview A Genkit flow for saving an appointment and updating client stats.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { saveAppointmentAndUpdateClient } from '@/services/appointment-service';

// Corresponds to AppointmentData in the service
export const SaveAppointmentInputSchema = z.object({
  clientId: z.string(),
  clientName: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  date: z.string(), // Assuming "yyyy-MM-dd" format from client
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional(),
  workDone: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  smsReminder: z.boolean().optional(),
  serviceColorClassName: z.string().optional(),
  ownerId: z.string(),
  servicePrice: z.number(),
});
export type SaveAppointmentInput = z.infer<typeof SaveAppointmentInputSchema>;

export const SaveAppointmentOutputSchema = z.object({
  appointmentId: z.string(),
  message: z.string(),
});
export type SaveAppointmentOutput = z.infer<typeof SaveAppointmentOutputSchema>;

export async function saveAppointment(input: SaveAppointmentInput): Promise<SaveAppointmentOutput> {
  return saveAppointmentFlow(input);
}

const saveAppointmentFlow = ai.defineFlow(
  {
    name: 'saveAppointmentFlow',
    inputSchema: SaveAppointmentInputSchema,
    outputSchema: SaveAppointmentOutputSchema,
  },
  async (input) => {
    // The core logic is in the service layer for better separation of concerns.
    // The flow acts as a secure, validated entry point from the client.
    const appointmentId = await saveAppointmentAndUpdateClient(input);

    return {
      appointmentId,
      message: `Appointment ${appointmentId} saved successfully and client ${input.clientId} was updated.`,
    };
  }
);
