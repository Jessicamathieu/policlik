
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { AgendaControls } from '@/components/agenda/agenda-controls';
import { CalendarView } from '@/components/agenda/calendar-view';
import { useToast } from '@/hooks/use-toast';

// Définition locale du type Appointment pour cette page
interface Appointment {
  id: string;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  date: string; // yyyy-MM-dd
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  description: string;
  workDone?: string;
  address?: string;
  phone?: string;
  smsReminder?: boolean;
}

export default function AgendaPage() {
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("day");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); 
  const { toast } = useToast();

  const handleViewChange = useCallback((view: "day" | "week" | "month") => {
    setCurrentView(view);
  }, []);

  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setAppointments([
      { id: '1', clientId: '1', clientName: 'Jean Dupont', serviceId: 'SERV001', serviceName: 'Nettoyage Standard Résidentiel', date: todayStr, startTime: '09:00', endTime: '10:00', description: 'Nettoyage standard', workDone: '', address: '123 Rue Principale, Paris', phone: '0123456789', smsReminder: false },
      { id: '2', clientId: '2', clientName: 'Marie Curie', serviceId: 'SERV002', serviceName: 'Grand Ménage de Printemps', date: todayStr, startTime: '11:00', endTime: '12:30', description: 'Grand ménage', workDone: 'Tout est propre', address: '456 Avenue des Sciences, Lyon', phone: '0987654321', smsReminder: true },
      { id: '3', clientId: '3', clientName: 'Pierre Martin', serviceId: 'SERV005', serviceName: 'Lavage de Vitres', date: tomorrowStr, startTime: '14:00', endTime: '15:00', description: 'Nettoyage vitres', workDone: '', address: '789 Boulevard Liberté, Marseille', phone: '0612345678', smsReminder: false },
    ]);
  }, []);

  const handleNewAppointmentSave = useCallback((appointmentData: Appointment) => {
    console.log("Nouveau rendez-vous:", appointmentData);
    setAppointments(prev => [...prev, { ...appointmentData, id: String(Date.now()) }]);
    toast({
      title: "Rendez-vous créé",
      description: `Le rendez-vous pour ${appointmentData.clientName || 'un client'} concernant ${appointmentData.serviceName || 'un service'} a été ajouté.`,
    });
  }, [toast]);

  const handleAppointmentUpdate = useCallback((updatedAppointmentData: Appointment) => {
    setAppointments(prev => prev.map(app => app.id === updatedAppointmentData.id ? updatedAppointmentData : app));
    toast({
      title: "Rendez-vous mis à jour",
      description: `Le rendez-vous pour ${updatedAppointmentData.clientName || 'un client'} concernant ${updatedAppointmentData.serviceName || 'un service'} a été modifié.`,
    });
  }, [toast]);

  const handlePrintAppointments = useCallback(() => {
    if (currentView === "month") {
      console.log("Impression de la vue mois demandée. Rendez-vous à imprimer :", displayedAppointments);
      alert("Fonction d'impression pour la vue Mois : les données des rendez-vous sont dans la console. L'impression réelle et la sélection des champs seront implémentées.");
      // Pour une impression basique de la page (peut être amélioré avec CSS print):
      // setTimeout(() => window.print(), 100); // setTimeout pour laisser le temps à l'alerte de se fermer
    } else {
      alert(`La fonction d'impression n'est pas encore optimisée pour la vue '${currentView}'. Elle imprimera la page actuelle.`);
      // setTimeout(() => window.print(), 100);
    }
  }, [currentView, displayedAppointments]);

  // Filter appointments for the current view and date
  const displayedAppointments = appointments.filter(app => {
    const appDate = new Date(app.date + "T00:00:00"); // Assurer que la date est interprétée comme locale
    
    if (currentView === "day") {
      return appDate.toDateString() === currentDate.toDateString();
    }
    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); 
      startOfWeek.setHours(0,0,0,0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23,59,59,999);
      return appDate >= startOfWeek && appDate <= endOfWeek;
    }
    if (currentView === "month") {
      return appDate.getFullYear() === currentDate.getFullYear() && appDate.getMonth() === currentDate.getMonth();
    }
    return true; 
  });

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Agenda des Rendez-vous</h1>
      <AgendaControls 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onNewAppointmentSave={handleNewAppointmentSave} 
        onPrintAppointments={handlePrintAppointments}
      />
      <div className="flex-grow overflow-auto">
        <CalendarView 
          appointments={displayedAppointments} 
          currentDate={currentDate} 
          view={currentView}
          onAppointmentUpdate={handleAppointmentUpdate}
          onNewAppointmentSave={handleNewAppointmentSave}
        />
      </div>
    </div>
  );
}
