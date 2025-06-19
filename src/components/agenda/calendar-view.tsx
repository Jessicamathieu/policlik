
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentModal } from './appointment-modal'; 
import { format } from 'date-fns';

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
  const timeSlots = generateTimeSlots(6, 20, 15); // 6 AM to 8 PM, 15-min intervals
  const slotHeightPx = 10; // Height of a 15-minute slot in pixels

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
            className={`h-${slotHeightPx} flex items-center justify-center p-2 text-xs border-b ${index % 4 === 3 ? 'font-semibold' : ''}`}
            style={{ height: `${slotHeightPx * 4}px` }} // Each displayed slot represents an hour (4 * 15 min)
          >
            {index % 4 === 0 ? slot : ''} {/* Display time only at the hour mark */}
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
            className="h-${slotHeightPx} border-b relative cursor-pointer hover:bg-muted/50 transition-colors"
            style={{ height: `${slotHeightPx}px` }}
            onClick={() => handleSlotClick(slot)}
            role="button"
            tabIndex={0}
            aria-label={`Créer un rendez-vous à ${slot}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSlotClick(slot);}}
          >
            {/* Placeholder for dropping/creating new appointments */}
          </div>
        ))}
        {/* Render appointments */}
        {appointments.filter(app => {
          const appDate = new Date(app.date + 'T00:00:00'); // Ensure date parsing is consistent
          return appDate.toDateString() === currentDate.toDateString();
        }).map(app => {
          const startHour = 6; // Calendar view starts at 6 AM
          const startMinutes = timeToMinutes(app.startTime);
          const endMinutes = timeToMinutes(app.endTime);
          const durationMinutes = endMinutes - startMinutes;

          const topOffset = ((startMinutes - (startHour * 60)) / 15) * slotHeightPx; 
          const height = (durationMinutes / 15) * slotHeightPx;

          return (
            <AppointmentModal 
              key={app.id}
              appointment={app}
              onSave={onAppointmentUpdate} // Editing existing uses onAppointmentUpdate
              trigger={
                <button
                  className="absolute left-1 right-1 p-1.5 text-left text-xs bg-primary/90 text-primary-foreground rounded shadow-md hover:bg-primary transition-colors duration-150 ease-in-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  style={{
                    top: `${topOffset}px`, 
                    height: `${height}px`,
                    minHeight: `${slotHeightPx * 2}px` // Min height for visibility, e.g., 30 min
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
      {/* Modal for creating appointments by clicking on a slot */}
      {isSlotModalOpen && slotInitialData && (
        <AppointmentModal
          open={isSlotModalOpen}
          onOpenChange={setIsSlotModalOpen}
          appointment={slotInitialData} // Pass initial start time and date
          onSave={(newData) => {
            onNewAppointmentSave(newData); // Creating new uses onNewAppointmentSave
            setIsSlotModalOpen(false); // Close modal on save
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
          {/* Placeholder: This needs full implementation similar to day view but repeated for each day */}
          {timeSlots.map(slot => (
            <React.Fragment key={slot}>
              <div className={`h-10 flex items-center justify-center p-1 text-xs border-b bg-card sticky left-0 z-10 ${slot.endsWith(':00') ? 'font-semibold' : ''}`}>{slot.endsWith(':00') ? slot : ''}</div>
              {Array(7).fill(null).map((_, dayIndex) => (
                <div key={`${slot}-${dayIndex}`} className="h-10 border-b border-l bg-card hover:bg-muted/50 cursor-pointer">
                  {/* Placeholder for appointments on this slot/day */}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderMonthView = () => (
    <Card>
      <CardContent className="p-4">
        <p className="text-muted-foreground text-center">Vue Mois à implémenter.</p>
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
