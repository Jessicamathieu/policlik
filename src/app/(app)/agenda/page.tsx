
"use client";

import React, { useState, useCallback } from 'react';
import { AgendaControls } from '@/components/agenda/agenda-controls';
import { CalendarView } from '@/components/agenda/calendar-view';
import { useToast } from '@/hooks/use-toast';

// Mock data for appointments
const initialAppointments = [
  { id: '1', clientId: '1', clientName: 'Jean Dupont', serviceId: 'SERV001', serviceName: 'Nettoyage Standard Résidentiel', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', description: 'Nettoyage standard', workDone: '', address: '123 Rue Principale, Paris', phone: '0123456789', smsReminder: false },
  { id: '2', clientId: '2', clientName: 'Marie Curie', serviceId: 'SERV002', serviceName: 'Grand Ménage de Printemps', date: new Date().toISOString().split('T')[0], startTime: '11:00', endTime: '12:30', description: 'Grand ménage', workDone: 'Tout est propre', address: '456 Avenue des Sciences, Lyon', phone: '0987654321', smsReminder: true },
  { id: '3', clientId: '3', clientName: 'Pierre Martin', serviceId: 'SERV005', serviceName: 'Lavage de Vitres', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], startTime: '14:00', endTime: '15:00', description: 'Nettoyage vitres', workDone: '', address: '789 Boulevard Liberté, Marseille', phone: '0612345678', smsReminder: false },
];

export default function AgendaPage() {
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("day");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [currentDate, setCurrentDate] = useState(new Date()); // For navigating calendar
  const { toast } = useToast();

  const handleViewChange = useCallback((view: "day" | "week" | "month") => {
    setCurrentView(view);
  }, []);

  const handleNewAppointmentSave = useCallback((appointmentData: any) => {
    // In a real app, you'd send this to a backend
    console.log("Nouveau rendez-vous:", appointmentData);
    setAppointments(prev => [...prev, { ...appointmentData, id: String(Date.now()) }]);
    toast({
      title: "Rendez-vous créé",
      description: `Le rendez-vous pour ${appointmentData.clientName || 'un client'} concernant ${appointmentData.serviceName || 'un service'} a été ajouté.`,
    });
  }, [toast]);

  const handleAppointmentUpdate = useCallback((updatedAppointmentData: any) => {
    setAppointments(prev => prev.map(app => app.id === updatedAppointmentData.id ? updatedAppointmentData : app));
    toast({
      title: "Rendez-vous mis à jour",
      description: `Le rendez-vous pour ${updatedAppointmentData.clientName || 'un client'} concernant ${updatedAppointmentData.serviceName || 'un service'} a été modifié.`,
    });
  }, [toast]);

  // Filter appointments for the current view and date
  const displayedAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    if (currentView === "day") {
      return appDate.toDateString() === currentDate.toDateString();
    }
    // Add week/month filtering logic here for appointments list
    // For simplicity, if not 'day' view, show all appointments for now
    // This part is for the list of appointments passed to CalendarView, not the view logic inside CalendarView itself
    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Adjust to Monday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
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
      />
      <div className="flex-grow overflow-auto">
        <CalendarView 
          appointments={displayedAppointments} 
          currentDate={currentDate} 
          view={currentView}
          onAppointmentUpdate={handleAppointmentUpdate}
          onNewAppointmentSave={handleNewAppointmentSave} // Pass down the save handler
        />
      </div>
    </div>
  );
}
