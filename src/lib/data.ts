
// src/lib/data.ts
import { format, isToday, parseISO } from "date-fns";

// Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  lastService?: string;
  totalSpent: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  description?: string;
  rate?: string;
  unit?: string;
  price?: number;
  colorCode?: string;
  colorClassName?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  subCategory?: string;
  price?: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string; // yyyy-MM-dd
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  description: string;
  workDone?: string;
  address?: string;
  phone?: string;
  smsReminder?: boolean;
  status?: "À venir" | "Terminé" | "En cours";
  serviceColorClassName?: string;
}

export type QuoteStatus = "Envoyé" | "Accepté" | "Refusé" | "En attente" | "Converti";

export interface Quote {
  id: string;
  clientName: string;
  date: string; // yyyy-MM-dd
  amount: number;
  status: QuoteStatus;
}

export type InvoiceStatus = "Brouillon" | "Envoyée" | "Payée" | "Non Payée" | "Partiellement Payée" | "En Retard";

export interface Invoice {
  id: string;
  clientName: string;
  dateEmission: string; // yyyy-MM-dd
  dateEcheance: string; // yyyy-MM-dd
  amount: number;
  status: InvoiceStatus;
}

export interface Expense {
    id: string;
    date: string; // yyyy-MM-dd
    category: string;
    description: string;
    amount: number;
    receiptUrl: string | null;
    status: "Vérifié" | "En attente" | "Rejeté";
}

export type PaymentStatus = "Réussi" | "En attente" | "Échoué" | "Remboursé";
export type PaymentMethod = "Carte de crédit" | "Virement bancaire" | "PayPal" | "Espèces";

export interface Payment {
    id: string;
    invoiceId: string;
    clientName: string;
    date: string; // yyyy-MM-dd
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
}


// Mock Data
// Les listes de données ci-dessous sont conservées pour les parties de l'application
// qui n'ont pas encore été migrées vers une base de données.

export const services: Service[] = [];

export const products: Product[] = [];

// This function is now deprecated as appointments are fetched from Firestore.
// It returns an empty array to avoid breaking pages that might still import it.
export const getAppointments = (): Appointment[] => {
  return [];
};


export const getQuotes = (): Quote[] => [
  { id: "DEV001", clientName: "Entreprise Alpha", date: "2023-11-15", amount: 1250.00, status: "Envoyé" },
  { id: "DEV002", clientName: "Société Beta", date: "2023-11-20", amount: 875.50, status: "Accepté" },
  { id: "DEV003", clientName: "Organisation Gamma", date: "2023-12-01", amount: 2100.75, status: "Refusé" },
  { id: "DEV004", clientName: "Particulier Delta", date: "2023-12-05", amount: 350.00, status: "En attente" },
];

export const getInvoices = (): Invoice[] => [
  { id: "FAC001", clientName: "Entreprise Alpha", dateEmission: "2023-11-20", dateEcheance: "2023-12-20", amount: 1500.00, status: "Payée" },
  { id: "FAC002", clientName: "Société Beta", dateEmission: "2023-12-01", dateEcheance: "2024-01-01", amount: 950.50, status: "Envoyée" },
  { id: "FAC003", clientName: "Organisation Gamma", dateEmission: "2023-10-15", dateEcheance: "2023-11-15", amount: 2500.75, status: "En Retard" },
  { id: "FAC004", clientName: "Particulier Delta", dateEmission: "2023-12-10", dateEcheance: "2024-01-10", amount: 420.00, status: "Brouillon" },
  { id: "FAC005", clientName: "Jean Dupont", dateEmission: "2023-11-05", dateEcheance: "2023-12-05", amount: 780.00, status: "Non Payée" },
];

export const getExpenses = (): Expense[] => [
    { id: "EXP001", date: "2023-11-15", category: "Fournitures de bureau", description: "Achat de papier et stylos", amount: 45.50, receiptUrl: "https://placehold.co/100x100.png", status: "Vérifié" },
    { id: "EXP002", date: "2023-11-18", category: "Carburant", description: "Plein d'essence véhicule utilitaire", amount: 72.30, receiptUrl: null, status: "En attente" },
    { id: "EXP003", date: "2023-12-02", category: "Matériel de nettoyage", description: "Produits désinfectants", amount: 120.00, receiptUrl: "https://placehold.co/100x100.png", status: "Vérifié" },
    { id: "EXP004", date: "2023-12-05", category: "Repas d'affaires", description: "Déjeuner client M. Dupont", amount: 35.80, receiptUrl: null, status: "Rejeté" },
];

export const getPayments = (): Payment[] => [
    { id: "PAY001", invoiceId: "FAC001", clientName: "Entreprise Alpha", date: "2023-11-20", amount: 1500.00, method: "Carte de crédit", status: "Réussi" },
    { id: "PAY002", invoiceId: "FAC002", clientName: "Société Beta", date: "2023-12-05", amount: 950.50, method: "Virement bancaire", status: "En attente" },
    { id: "PAY003", invoiceId: "FAC00X", clientName: "Client Inconnu", date: "2023-10-18", amount: 200.00, method: "PayPal", status: "Échoué" },
    { id: "PAY004", invoiceId: "FAC005", clientName: "Jean Dupont", date: "2023-11-10", amount: 780.00, method: "Carte de crédit", status: "Réussi" },
    { id: "PAY005", invoiceId: "FAC001", clientName: "Entreprise Alpha", date: "2023-11-25", amount: -100.00, method: "Carte de crédit", status: "Remboursé" },
];
