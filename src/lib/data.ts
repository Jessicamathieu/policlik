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
  totalSpent?: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  rate: string;
  unit: string;
  description: string;
  price?: number; // for invoice form
  colorClassName?: string; // for agenda
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
  date: Date;
  amount: number;
  status: QuoteStatus;
}

export type InvoiceStatus = "Brouillon" | "Envoyée" | "Payée" | "Non Payée" | "Partiellement Payée" | "En Retard";

export interface Invoice {
  id: string;
  clientName: string;
  dateEmission: Date;
  dateEcheance: Date;
  amount: number;
  status: InvoiceStatus;
}

export interface Expense {
    id: string;
    date: Date;
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
    date: Date;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
}


// Mock Data
// La liste de clients est maintenant gérée dans Firestore.
// Les données ci-dessous sont conservées pour les autres parties de l'application.

export const services: Service[] = [
  { id: "SERV001", name: "Nettoyage Standard Résidentiel", category: "Nettoyage Résidentiel", rate: "CAD$50/heure", unit: "heure", description: "Nettoyage de base pour appartements et maisons.", price: 50, colorClassName: 'bg-blue-500' },
  { id: "SERV002", name: "Grand Ménage de Printemps", category: "Nettoyage Résidentiel", rate: "CAD$250", unit: "forfait", description: "Nettoyage en profondeur de toutes les pièces.", price: 250, colorClassName: 'bg-green-500' },
  { id: "SERV003", name: "Nettoyage de Bureaux", category: "Nettoyage Commercial", rate: "CAD$0.15/m²", unit: "m²", description: "Entretien régulier des locaux professionnels.", price: 0.15, colorClassName: 'bg-indigo-500' },
  { id: "SERV004", name: "Nettoyage Après Chantier", category: "Nettoyage Spécialisé", rate: "Devis", unit: "sur devis", description: "Remise en état après travaux de construction ou rénovation.", price: 300, colorClassName: 'bg-purple-500' },
  { id: "SERV005", name: "Lavage de Vitres", category: "Nettoyage Spécialisé", rate: "CAD$5/fenêtre", unit: "fenêtre", description: "Nettoyage intérieur et extérieur des vitres.", price: 5, colorClassName: 'bg-sky-500' },
  { id: "PROD001", name: "Produit Nettoyant XYZ", category: "Produit", rate: "CAD$15/unité", unit: "unité", description: "Produit de nettoyage multi-surfaces.", price: 15, colorClassName: "bg-gray-500" },
];

const today_date = new Date();
const todayStr = `${today_date.getFullYear()}-${String(today_date.getMonth() + 1).padStart(2, '0')}-${String(today_date.getDate()).padStart(2, '0')}`;
const tomorrow = new Date(today_date);
tomorrow.setDate(today_date.getDate() + 1);
const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

export const appointments: Appointment[] = [
  { id: '1', clientId: '1', clientName: 'Jean Dupont', serviceId: 'SERV001', serviceName: 'Nettoyage Standard Résidentiel', date: todayStr, startTime: '09:00', endTime: '10:00', description: 'Nettoyage standard', workDone: '', address: '123 Rue Principale, 75001 Paris', phone: '0123456789', smsReminder: false, serviceColorClassName: 'bg-blue-500', status: "À venir" },
  { id: '2', clientId: '2', clientName: 'Marie Curie', serviceId: 'SERV002', serviceName: 'Grand Ménage de Printemps', date: todayStr, startTime: '11:00', endTime: '12:30', description: 'Grand ménage', workDone: 'Tout est propre', address: '456 Avenue des Sciences, Lyon', phone: '0987654321', smsReminder: true, serviceColorClassName: 'bg-green-500', status: "En cours" },
  { id: '3', clientId: '3', clientName: 'Pierre Martin', serviceId: 'SERV005', serviceName: 'Lavage de Vitres', date: tomorrowStr, startTime: '14:00', endTime: '15:00', description: 'Nettoyage vitres', workDone: '', address: '789 Boulevard Liberté, Marseille', phone: '0612345678', smsReminder: false, serviceColorClassName: 'bg-sky-500', status: "À venir" },
];

export const quotes: Quote[] = [
  { id: "DEV001", clientName: "Entreprise Alpha", date: new Date(2023, 10, 15), amount: 1250.00, status: "Envoyé" },
  { id: "DEV002", clientName: "Société Beta", date: new Date(2023, 10, 20), amount: 875.50, status: "Accepté" },
  { id: "DEV003", clientName: "Organisation Gamma", date: new Date(2023, 11, 1), amount: 2100.75, status: "Refusé" },
  { id: "DEV004", clientName: "Particulier Delta", date: new Date(2023, 11, 5), amount: 350.00, status: "En attente" },
];

export const invoices: Invoice[] = [
  { id: "FAC001", clientName: "Entreprise Alpha", dateEmission: new Date(2023, 10, 20), dateEcheance: new Date(2023, 11, 20), amount: 1500.00, status: "Payée" },
  { id: "FAC002", clientName: "Société Beta", dateEmission: new Date(2023, 11, 1), dateEcheance: new Date(2023, 12, 1), amount: 950.50, status: "Envoyée" },
  { id: "FAC003", clientName: "Organisation Gamma", dateEmission: new Date(2023, 9, 15), dateEcheance: new Date(2023, 10, 15), amount: 2500.75, status: "En Retard" },
  { id: "FAC004", clientName: "Particulier Delta", dateEmission: new Date(2023, 11, 10), dateEcheance: new Date(2024, 0, 10), amount: 420.00, status: "Brouillon" },
  { id: "FAC005", clientName: "Jean Dupont", dateEmission: new Date(2023, 10, 5), dateEcheance: new Date(2023, 11, 5), amount: 780.00, status: "Non Payée" },
];

export const expenses: Expense[] = [
    { id: "EXP001", date: new Date(2023, 10, 15), category: "Fournitures de bureau", description: "Achat de papier et stylos", amount: 45.50, receiptUrl: "https://placehold.co/100x100.png", status: "Vérifié" },
    { id: "EXP002", date: new Date(2023, 10, 18), category: "Carburant", description: "Plein d'essence véhicule utilitaire", amount: 72.30, receiptUrl: null, status: "En attente" },
    { id: "EXP003", date: new Date(2023, 11, 2), category: "Matériel de nettoyage", description: "Produits désinfectants", amount: 120.00, receiptUrl: "https://placehold.co/100x100.png", status: "Vérifié" },
    { id: "EXP004", date: new Date(2023, 11, 5), category: "Repas d'affaires", description: "Déjeuner client M. Dupont", amount: 35.80, receiptUrl: null, status: "Rejeté" },
];

export const payments: Payment[] = [
    { id: "PAY001", invoiceId: "FAC001", clientName: "Entreprise Alpha", date: new Date(2023, 10, 20), amount: 1500.00, method: "Carte de crédit", status: "Réussi" },
    { id: "PAY002", invoiceId: "FAC002", clientName: "Société Beta", date: new Date(2023, 11, 5), amount: 950.50, method: "Virement bancaire", status: "En attente" },
    { id: "PAY003", invoiceId: "FAC00X", clientName: "Client Inconnu", date: new Date(2023, 9, 18), amount: 200.00, method: "PayPal", status: "Échoué" },
    { id: "PAY004", invoiceId: "FAC005", clientName: "Jean Dupont", date: new Date(2023, 10, 10), amount: 780.00, method: "Carte de crédit", status: "Réussi" },
    { id: "PAY005", invoiceId: "FAC001", clientName: "Entreprise Alpha", date: new Date(2023, 10, 25), amount: -100.00, method: "Carte de crédit", status: "Remboursé" },
];
