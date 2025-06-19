
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentModal } from './appointment-modal'; 
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface CalendarViewProps {
  appointments: Appointment[];
  currentDate: Date; 
  view: "day" | "week" | "month";
  onAppointmentUpdate: (appointmentData: Partial<Appointment>) => void;
  onNewAppointmentSave: (appointmentData: Partial<Appointment>) => void; // For creating new appointments
}

// Helper to generate time slots
const generateTimeSlots = (startHour: number, endHour: number, interval: number): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
};

// Helper to convert "HH:mm" to minutes from midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};


export function CalendarView({ appointments, currentDate, view, onAppointmentUpdate, onNewAppointmentSave }: CalendarViewProps) {
  const timeSlots = generateTimeSlots(6, 20, 30); // 6 AM to 8 PM, 30-min intervals
  const slotHeightPx = 20; // Height of a 30-minute slot in pixels

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotInitialData, setSlotInitialData] = useState<Partial<Appointment> | undefined>(undefined);
  const [formattedDateHeader, setFormattedDateHeader] = useState<string>('');

  useEffect(() => {
    if (currentDate) {
      setFormattedDateHeader(
        currentDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })
      );
    }
  }, [currentDate]);

  const handleSlotClick = (slotStartTime: string) => {
    setSlotInitialData({
      date: format(currentDate, "yyyy-MM-dd"),
      startTime: slotStartTime,
    });
    setIsSlotModalOpen(true);
  };

  const renderDayView = () => (
    <div className="grid grid-cols-[auto_1fr] gap-px bg-border border rounded-lg shadow-sm overflow-hidden">
      {/* Time column */}
      <div className="sticky left-0 z-10 bg-card">
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium text-muted-foreground sticky top-0 bg-card z-10">Heure</div>
        {timeSlots.map((slot, index) => (
          <div 
            key={slot} 
            className={`flex items-center justify-center p-2 text-xs border-b ${index % 2 === 0 ? 'font-semibold' : ''}`}
            style={{ height: `${slotHeightPx * 2}px` }} 
          >
            {index % 2 === 0 ? slot : ''} 
          </div>
        ))}
      </div>
      {/* Appointments column */}
      <div className="relative bg-card">
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium sticky top-0 bg-card z-10">
          {formattedDateHeader || ' '}
        </div>
        {timeSlots.map((slot, slotIndex) => (
          <div 
            key={slotIndex} 
            className="border-b relative cursor-pointer hover:bg-muted/50 transition-colors"
            style={{ height: `${slotHeightPx}px` }} 
            onClick={() => handleSlotClick(slot)}
            role="button"
            tabIndex={0}
            aria-label={`Créer un rendez-vous à ${slot}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSlotClick(slot);}}
          >
          </div>
        ))}
        {/* Render appointments */}
        {appointments.filter(app => {
          const appDate = new Date(app.date + 'T00:00:00'); 
          return appDate.toDateString() === currentDate.toDateString();
        }).map(app => {
          const startHour = 6; 
          const startMinutes = timeToMinutes(app.startTime);
          const endMinutes = timeToMinutes(app.endTime);
          const durationMinutes = endMinutes - startMinutes;

          const topOffset = ((startMinutes - (startHour * 60)) / 30) * slotHeightPx; 
          const height = (durationMinutes / 30) * slotHeightPx;

          return (
            <AppointmentModal 
              key={app.id}
              appointment={app}
              onSave={onAppointmentUpdate} 
              trigger={
                <button
                  className="absolute left-1 right-1 p-1.5 text-left text-xs bg-primary/90 text-primary-foreground rounded shadow-md hover:bg-primary transition-colors duration-150 ease-in-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  style={{
                    top: `${topOffset}px`, 
                    height: `${Math.max(height, slotHeightPx)}px`, // Ensure min height for visibility
                    minHeight: `${slotHeightPx}px` 
                  }}
                  aria-label={`Rendez-vous: ${app.clientName} de ${app.startTime} à ${app.endTime}`}
                >
                  <p className="font-semibold truncate text-[11px] leading-tight">{app.clientName || 'Rendez-vous'}</p>
                  <p className="truncate text-[10px] leading-tight">{app.startTime} - {app.endTime}</p>
                  {app.serviceName && <p className="text-[10px] leading-tight truncate opacity-80">{app.serviceName}</p>}
                  {!app.serviceName && app.description && <p className="text-[10px] leading-tight truncate opacity-80">{app.description}</p>}
                </button>
              }
            />
          );
        })}
      </div>
      {isSlotModalOpen && slotInitialData && (
        <AppointmentModal
          open={isSlotModalOpen}
          onOpenChange={setIsSlotModalOpen}
          appointment={slotInitialData} 
          onSave={(newData) => {
            onNewAppointmentSave(newData); 
            setIsSlotModalOpen(false); 
          }}
        />
      )}
    </div>
  );

  const renderWeekView = () => (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-center">Vue Semaine à implémenter.</p>
        <div className="grid grid-cols-8 gap-px bg-border border rounded-lg overflow-hidden mt-4">
          <div className="p-2 text-sm font-medium bg-card text-center sticky left-0 z-10">Heure</div>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 text-sm font-medium bg-card text-center">{day}</div>
          ))}
          {timeSlots.map(slot => ( 
            <React.Fragment key={slot}>
              <div className={`h-10 flex items-center justify-center p-1 text-xs border-b bg-card sticky left-0 z-10 ${slot.endsWith(':00') ? 'font-semibold' : ''}`}>{slot.endsWith(':00') ? slot : ''}</div>
              {Array(7).fill(null).map((_, dayIndex) => (
                <div key={`${slot}-${dayIndex}`} className="h-10 border-b border-l bg-card hover:bg-muted/50 cursor-pointer">
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderMonthView = () => (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline">Liste des Rendez-vous du Mois</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments
              .sort((a, b) => { // Sort by date then by start time
                const dateA = new Date(a.date + 'T' + a.startTime);
                const dateB = new Date(b.date + 'T' + b.startTime);
                return dateA.getTime() - dateB.getTime();
              })
              .map(app => (
              <div key={app.id} className="p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-primary">{app.clientName || 'Client non spécifié'}</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Date:</span> {format(new Date(app.date + 'T00:00:00'), 'EEEE dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Heure:</span> {app.startTime} - {app.endTime}
                </p>
                {app.serviceName && (
                  <p className="text-sm text-muted-foreground"><span className="font-medium">Service:</span> {app.serviceName}</p>
                )}
                {app.address && (
                  <p className="text-sm text-muted-foreground"><span className="font-medium">Adresse:</span> {app.address}</p>
                )}
                {app.description && (
                  <p className="text-sm mt-1"><span className="font-medium">Description:</span> {app.description}</p>
                )}
                 {app.workDone && (
                  <p className="text-sm mt-1"><span className="font-medium">Travail effectué:</span> {app.workDone}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Aucun rendez-vous programmé pour ce mois.</p>
        )}
        <p className="text-xs text-muted-foreground mt-6 text-center">
          Pour imprimer cette liste avec des options de champs, utilisez le bouton "Imprimer" en haut de la page Agenda.
        </p>
      </CardContent>
    </Card>
  );


  switch (view) {
    case "day":
      return renderDayView();
    case "week":
      return renderWeekView();
    case "month":
      return renderMonthView();
    default:
      return renderDayView();
  }
}
