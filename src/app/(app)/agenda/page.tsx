"use client";

import React, { useState, useCallback } from 'react';
import { AgendaControls } from '@/components/agenda/agenda-controls';
import { CalendarView } from '@/components/agenda/calendar-view';
import { useToast } from '@/hooks/use-toast';

// Mock data for appointments
const initialAppointments = [
  { id: '1', clientName: 'Jean Dupont', date: new Date().toISOString().split('T')[0], startTime: '09:00', endTime: '10:00', description: 'Nettoyage standard', status: 'Planifié' },
  { id: '2', clientName: 'Marie Curie', date: new Date().toISOString().split('T')[0], startTime: '11:00', endTime: '12:30', description: 'Grand ménage', status: 'Confirmé' },
  { id: '3', clientName: 'Pierre Martin', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], startTime: '14:00', endTime: '15:00', description: 'Nettoyage vitres', status: 'Planifié' },
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
      description: `Le rendez-vous pour ${appointmentData.clientName || 'un client'} a été ajouté.`,
    });
  }, [toast]);

  const handleAppointmentUpdate = useCallback((updatedAppointmentData: any) => {
    setAppointments(prev => prev.map(app => app.id === updatedAppointmentData.id ? updatedAppointmentData : app));
    toast({
      title: "Rendez-vous mis à jour",
      description: `Le rendez-vous pour ${updatedAppointmentData.clientName || 'un client'} a été modifié.`,
    });
  }, [toast]);

  // Filter appointments for the current view and date
  // This is simplified for demo. Real implementation would be more robust.
  const displayedAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    if (view === "day") {
      return appDate.toDateString() === currentDate.toDateString();
    }
    // Add week/month filtering logic here
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
        />
      </div>
    </div>
  );
}
