
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { AgendaControls, type AgendaControlsProps } from '@/components/agenda/agenda-controls';
import { CalendarView } from '@/components/agenda/calendar-view';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  serviceColorClassName?: string;
}

export default function AgendaPage() {
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("day");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); 
  const [printStartDate, setPrintStartDate] = useState<Date | undefined>(undefined);
  const [printEndDate, setPrintEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleViewChange = useCallback((view: "day" | "week" | "month") => {
    setCurrentView(view);
  }, []);

  useEffect(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = format(tomorrow, "yyyy-MM-dd");
    setAppointments([
      { id: '1', clientId: '1', clientName: 'Jean Dupont', serviceId: 'SERV001', serviceName: 'Nettoyage Standard Résidentiel', date: todayStr, startTime: '09:00', endTime: '10:00', description: 'Nettoyage standard', workDone: '', address: '123 Rue Principale, Paris', phone: '0123456789', smsReminder: false, serviceColorClassName: 'bg-blue-500' },
      { id: '2', clientId: '2', clientName: 'Marie Curie', serviceId: 'SERV002', serviceName: 'Grand Ménage de Printemps', date: todayStr, startTime: '11:00', endTime: '12:30', description: 'Grand ménage', workDone: 'Tout est propre', address: '456 Avenue des Sciences, Lyon', phone: '0987654321', smsReminder: true, serviceColorClassName: 'bg-green-500' },
      { id: '3', clientId: '3', clientName: 'Pierre Martin', serviceId: 'SERV005', serviceName: 'Lavage de Vitres', date: tomorrowStr, startTime: '14:00', endTime: '15:00', description: 'Nettoyage vitres', workDone: '', address: '789 Boulevard Liberté, Marseille', phone: '0612345678', smsReminder: false, serviceColorClassName: 'bg-sky-500' },
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

  const displayedAppointments = appointments.filter(app => {
    // Ensure app.date is treated as local date, not UTC, by appending T00:00:00
    const appDate = new Date(app.date + "T00:00:00"); 
    
    if (currentView === "day") {
      return appDate.getFullYear() === currentDate.getFullYear() &&
             appDate.getMonth() === currentDate.getMonth() &&
             appDate.getDate() === currentDate.getDate();
    }
    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Monday as start of week
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

  const handlePrintAppointments = useCallback(() => {
    let appointmentsToPrint = displayedAppointments;
    let printMessage = `Impression de la vue ${currentView} demandée.`;

    if (currentView === "month" && printStartDate && printEndDate) {
      appointmentsToPrint = appointments.filter(app => {
        const appDate = new Date(app.date + "T00:00:00");
        // Ensure printStartDate and printEndDate are at the beginning/end of their respective days for comparison
        const start = new Date(printStartDate);
        start.setHours(0,0,0,0);
        const end = new Date(printEndDate);
        end.setHours(23,59,59,999);
        return appDate >= start && appDate <= end;
      });
      printMessage = `Impression des rendez-vous entre ${format(printStartDate, "dd/MM/yyyy", { locale: fr })} et ${format(printEndDate, "dd/MM/yyyy", { locale: fr })}.`;
    } else if (currentView !== "month" && (printStartDate || printEndDate)) {
       alert(`La fonction d'impression avec sélection de dates n'est optimisée que pour la vue 'Mois'. Pour la vue '${currentView}', elle imprimera les RDVs actuellement affichés.`);
    }
    
    console.log(printMessage, "Rendez-vous à imprimer :", appointmentsToPrint);
    alert(`${printMessage} Les données des rendez-vous sont dans la console. L'impression réelle et la sélection des champs seront implémentées.`);
    
  }, [currentView, appointments, displayedAppointments, printStartDate, printEndDate]);


  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">Agenda des Rendez-vous</h1>
      <AgendaControls 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onNewAppointmentSave={handleNewAppointmentSave} 
        onPrintAppointments={handlePrintAppointments}
        printStartDate={printStartDate}
        setPrintStartDate={setPrintStartDate}
        printEndDate={printEndDate}
        setPrintEndDate={setPrintEndDate}
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

    