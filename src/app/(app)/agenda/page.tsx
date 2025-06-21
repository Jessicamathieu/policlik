
"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AgendaControls } from '@/components/agenda/agenda-controls';
import { CalendarView } from '@/components/agenda/calendar-view';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { type Appointment } from '@/lib/data';
import { getAppointmentsForUser } from '@/services/appointment-service';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';

export default function AgendaPage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">("day");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date | null>(null); 
  const [printStartDate, setPrintStartDate] = useState<Date | undefined>(undefined);
  const [printEndDate, setPrintEndDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const fetchAppointments = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const fetchedAppointments = await getAppointmentsForUser(userId);
      setAppointments(fetchedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les rendez-vous.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user?.uid) {
      fetchAppointments(user.uid);
    }
     // Définit la date actuelle uniquement sur le client pour éviter les erreurs d'hydratation.
    setCurrentDate(new Date());
  }, [user, fetchAppointments]);

  const handleViewChange = useCallback((view: "day" | "week" | "month") => {
    setCurrentView(view);
  }, []);

  const handleSaveSuccess = useCallback(() => {
    if (user?.uid) {
      fetchAppointments(user.uid);
    }
  }, [user, fetchAppointments]);


  const displayedAppointments = useMemo(() => appointments.filter(app => {
    if (!currentDate) return false;
    // Assurez-vous que la date de l'application est traitée comme une date locale, et non UTC, en ajoutant T00:00:00
    const appDate = new Date(app.date + "T00:00:00"); 
    
    if (currentView === "day") {
      return appDate.getFullYear() === currentDate.getFullYear() &&
             appDate.getMonth() === currentDate.getMonth() &&
             appDate.getDate() === currentDate.getDate();
    }
    if (currentView === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)); // Lundi comme début de semaine
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
  }), [appointments, currentDate, currentView]);

  const handlePrintAppointments = useCallback(() => {
    if (!currentDate) return;
    let appointmentsToPrint = displayedAppointments;
    let printMessage = `Impression de la vue ${currentView} demandée.`;

    if (currentView === "month" && printStartDate && printEndDate) {
      appointmentsToPrint = appointments.filter(app => {
        const appDate = new Date(app.date + "T00:00:00");
        // S'assurer que printStartDate et printEndDate sont au début/fin de leurs jours respectifs pour la comparaison
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
    
  }, [currentView, appointments, displayedAppointments, printStartDate, printEndDate, currentDate]);

  // Affiche un squelette de chargement jusqu'à ce que la date actuelle soit définie côté client
  if (!currentDate || isLoading) {
    return (
      <div className="flex flex-col h-full">
        <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline text-foreground">Agenda des Rendez-vous</h1>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-card text-card-foreground rounded-lg shadow">
          <Skeleton className="h-10 w-36 bg-muted"/>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 bg-muted"/>
            <Skeleton className="h-10 w-48 bg-muted"/>
          </div>
        </div>
        <div className="flex-grow border rounded-lg shadow-sm">
          <Skeleton className="h-full w-full bg-muted/50"/>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline text-foreground">Agenda des Rendez-vous</h1>
      <AgendaControls 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onSaveSuccess={handleSaveSuccess}
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
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    </div>
  );
}
