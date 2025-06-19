"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentModal } from './appointment-modal'; // To edit appointments

interface Appointment {
  id: string;
  clientName: string;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  description: string;
  status: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
  currentDate: Date; // To determine which day/week/month to show
  view: "day" | "week" | "month";
  onAppointmentUpdate: (appointmentData: any) => void;
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


export function CalendarView({ appointments, currentDate, view, onAppointmentUpdate }: CalendarViewProps) {
  const timeSlots = generateTimeSlots(6, 20, 15); // 6 AM to 8 PM, 15-min intervals

  const renderDayView = () => (
    <div className="grid grid-cols-[auto_1fr] gap-px bg-border border rounded-lg shadow-sm overflow-hidden">
      {/* Time column */}
      <div className="sticky left-0 z-10 bg-card">
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium text-muted-foreground sticky top-0 bg-card z-10">Heure</div>
        {timeSlots.map((slot, index) => (
          <div key={slot} className={`h-10 flex items-center justify-center p-2 text-xs border-b ${index % 4 === 3 ? 'font-semibold' : ''}`}>
            {slot}
          </div>
        ))}
      </div>
      {/* Appointments column */}
      <div className="relative bg-card">
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium sticky top-0 bg-card z-10">
          {currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        {timeSlots.map((slot, slotIndex) => (
          <div key={slotIndex} className="h-10 border-b relative">
            {/* Placeholder for dropping/creating new appointments */}
          </div>
        ))}
        {/* Render appointments */}
        {appointments.filter(app => {
          // Basic date check for demo; needs proper date comparison for multi-day views
          const appDate = new Date(app.id); // Assuming ID might contain date info for demo
          return appDate.toDateString() === currentDate.toDateString();
        }).map(app => {
          const startMinutes = timeToMinutes(app.startTime);
          const endMinutes = timeToMinutes(app.endTime);
          const durationMinutes = endMinutes - startMinutes;

          const topOffset = (startMinutes - (6 * 60)) / 15 * 40; // 40px per slot (10px height * 4 quarter hours)
          const height = (durationMinutes / 15) * 40; // 10px height per 15 min slot

          return (
            <AppointmentModal 
              key={app.id}
              appointment={app}
              onSave={onAppointmentUpdate}
              trigger={
                <button
                  className="absolute left-1 right-1 p-2 text-left text-xs bg-primary/80 text-primary-foreground rounded-md shadow-md hover:bg-primary transition-colors duration-150 ease-in-out overflow-hidden"
                  style={{
                    top: `${topOffset / 4}px`, // Adjusting because parent slots are 10px high, so 40px / 4 = 10px
                    height: `${height / 4}px`, // Same adjustment
                    minHeight: '20px' // Ensure it's clickable
                  }}
                  aria-label={`Rendez-vous: ${app.clientName} de ${app.startTime} à ${app.endTime}`}
                >
                  <p className="font-semibold truncate">{app.clientName}</p>
                  <p className="truncate">{app.startTime} - {app.endTime}</p>
                  <p className="text-xs truncate opacity-80">{app.description}</p>
                </button>
              }
            />
          );
        })}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-center">Vue Semaine à implémenter.</p>
        {/* Placeholder for week view */}
        <div className="grid grid-cols-8 gap-px bg-border border rounded-lg overflow-hidden mt-4">
          <div className="p-2 text-sm font-medium bg-card">Heure</div>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 text-sm font-medium bg-card text-center">{day}</div>
          ))}
          {/* Simplified: just show one day's appointments for demo */}
          {renderDayView()} 
        </div>
      </CardContent>
    </Card>
  );

  const renderMonthView = () => (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-center">Vue Mois à implémenter.</p>
        {/* Placeholder for month view - could use ShadCN Calendar for navigation then show details */}
        <div className="mt-4 p-6 bg-muted/30 rounded-lg">
            <p>Affichage du calendrier mensuel ici. Cliquez sur un jour pour voir les détails.</p>
        </div>
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
