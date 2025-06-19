
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentModal } from './appointment-modal'; 
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO } from 'date-fns';
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
  onNewAppointmentSave: (appointmentData: Partial<Appointment>) => void;
}

const generateTimeSlots = (startHour: number, endHour: number, interval: number): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const slotHeightPx = 20; // Height of a 30-minute slot
const startHourGrid = 6; // Calendar grid starts at 6 AM

export function CalendarView({ appointments, currentDate, view, onAppointmentUpdate, onNewAppointmentSave }: CalendarViewProps) {
  const timeSlots = generateTimeSlots(startHourGrid, 20, 30); 

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotInitialData, setSlotInitialData] = useState<Partial<Appointment> | undefined>(undefined);
  const [formattedDateHeader, setFormattedDateHeader] = useState<string>('');

  useEffect(() => {
    if (currentDate && view === "day") {
      setFormattedDateHeader(
        format(currentDate, 'EEEE dd MMMM yyyy', { locale: fr })
      );
    } else if (currentDate && view === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      setFormattedDateHeader(
        `Semaine du ${format(weekStart, 'dd MMMM', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`
      );
    }
  }, [currentDate, view]);

  const handleSlotClick = useCallback((dateForSlot: Date, slotStartTime: string) => {
    setSlotInitialData({
      date: format(dateForSlot, "yyyy-MM-dd"),
      startTime: slotStartTime,
    });
    setIsSlotModalOpen(true);
  }, []);
  
  const renderDayView = () => (
    <div className="grid grid-cols-[auto_1fr] gap-px bg-border border rounded-lg shadow-sm overflow-hidden">
      <div className="sticky left-0 z-10 bg-card">
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium text-muted-foreground sticky top-0 bg-card z-10">Heure</div>
        {timeSlots.map((slot) => (
          <div 
            key={slot} 
            className="flex items-center justify-center p-2 text-xs border-b font-semibold"
            style={{ height: `${slotHeightPx}px` }} 
          >
            {slot} 
          </div>
        ))}
      </div>
      <div className="relative bg-card">
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium sticky top-0 bg-card z-10">
          {formattedDateHeader || ' '}
        </div>
        {timeSlots.map((slot, slotIndex) => (
          <div 
            key={slotIndex} 
            className="border-b relative cursor-pointer hover:bg-muted/50 transition-colors"
            style={{ height: `${slotHeightPx}px` }} 
            onClick={() => handleSlotClick(currentDate, slot)}
            role="button"
            tabIndex={0}
            aria-label={`Créer un rendez-vous à ${slot} le ${format(currentDate, 'dd/MM/yyyy')}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSlotClick(currentDate, slot);}}
          >
          </div>
        ))}
        {appointments.filter(app => {
          const appDate = parseISO(app.date + 'T00:00:00');
          return isSameDay(appDate, currentDate);
        }).map(app => {
          const startMinutes = timeToMinutes(app.startTime);
          const endMinutes = timeToMinutes(app.endTime);
          const durationMinutes = endMinutes - startMinutes;
          const topOffset = ((startMinutes - (startHourGrid * 60)) / 30) * slotHeightPx; 
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
                    height: `${Math.max(height, slotHeightPx)}px`, 
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

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1 }) });

    return (
      <div className="border rounded-lg shadow-sm overflow-x-auto">
        <div className="h-10 flex items-center justify-center p-2 text-sm font-semibold sticky top-0 bg-card z-30 border-b">
            {formattedDateHeader || ' '}
        </div>
        <div className="grid grid-cols-[auto_repeat(7,minmax(140px,1fr))] gap-px bg-border">
            {/* Row 1: Header (Time column header and Day headers) */}
            <div className="sticky left-0 z-20 bg-card p-2 text-xs font-medium text-center border-r flex items-center justify-center h-12">
                Heure
            </div>
            {daysOfWeek.map(day => (
                <div key={`header-${day.toISOString()}`} className="bg-card p-2 text-xs font-medium text-center border-r flex flex-col items-center justify-center h-12">
                  <span>{format(day, 'EEE', { locale: fr })}</span>
                  <span className="font-normal">{format(day, 'dd', { locale: fr })}</span>
                </div>
            ))}

            {/* Subsequent rows: Time slots and appointment areas */}
            {/* This section combines clickable slots and appointment rendering areas */}
            {timeSlots.map((slot) => (
                <React.Fragment key={`timeslot-row-${slot}`}>
                    {/* Time Label Cell for the current 30-min slot */}
                    <div 
                        className="sticky left-0 z-20 bg-card p-2 text-xs border-r border-b flex items-center justify-center font-semibold"
                        style={{ height: `${slotHeightPx}px` }}
                    >
                        {slot}
                    </div>

                    {/* Day Cells for the current 30-min time slot (clickable for new appointments) */}
                    {daysOfWeek.map(day => (
                        <div 
                            key={`slot-${day.toISOString()}-${slot}`} 
                            className="bg-card border-r border-b relative cursor-pointer hover:bg-muted/50 transition-colors"
                            style={{ height: `${slotHeightPx}px` }}
                            onClick={() => handleSlotClick(day, slot)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Créer un rendez-vous à ${slot} le ${format(day, 'dd/MM/yyyy')}`}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSlotClick(day, slot);}}
                        >
                            {/* Background slot cell. Appointments will be overlayed. */}
                        </div>
                    ))}
                </React.Fragment>
            ))}
            
            {/* Render appointments overlayed on the grid */}
            {/* This creates a container for each day's appointments that aligns with the grid columns and rows */}
            {daysOfWeek.map((day, dayIndex) => (
                <div 
                    key={`appointment-area-${day.toISOString()}`} 
                    className="relative" 
                    style={{ 
                        gridColumnStart: dayIndex + 2, // +1 for 1-based index, +1 for time column
                        gridRowStart: 2, // After header row (row 1 is headers)
                        gridRowEnd: timeSlots.length + 2, // Span all time slot rows (length of timeSlots + header row)
                     }}
                >
                    {appointments
                        .filter(app => isSameDay(parseISO(app.date + "T00:00:00"), day))
                        .map(app => {
                            const startMinutes = timeToMinutes(app.startTime);
                            const endMinutes = timeToMinutes(app.endTime);
                            const durationMinutes = endMinutes - startMinutes;

                            const topOffset = ((startMinutes - (startHourGrid * 60)) / 30) * slotHeightPx;
                            const height = (durationMinutes / 30) * slotHeightPx;
                            
                            return (
                                <AppointmentModal
                                    key={app.id}
                                    appointment={app}
                                    onSave={onAppointmentUpdate}
                                    trigger={
                                        <button
                                            className="absolute left-px right-px p-1 text-left text-xs bg-primary/90 text-primary-foreground rounded shadow-sm hover:bg-primary transition-colors overflow-hidden focus:outline-none focus:ring-1 focus:ring-ring"
                                            style={{
                                                top: `${topOffset}px`,
                                                height: `${Math.max(height, slotHeightPx)}px`,
                                                minHeight: `${slotHeightPx}px`,
                                            }}
                                            aria-label={`Rendez-vous: ${app.clientName} de ${app.startTime} à ${app.endTime}`}
                                        >
                                            <p className="font-semibold truncate text-[10px] leading-tight">{app.clientName || 'RDV'}</p>
                                            <p className="truncate text-[9px] leading-tight">{app.startTime}-{app.endTime}</p>
                                            {app.serviceName && <p className="text-[9px] leading-tight truncate opacity-80">{app.serviceName}</p>}
                                        </button>
                                    }
                                />
                            );
                        })}
                </div>
            ))}
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
  };


  const renderMonthView = () => (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-center">
            {currentDate ? format(currentDate, 'MMMM yyyy', { locale: fr }) : "Mois"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments
              .sort((a, b) => { 
                const dateA = parseISO(a.date + 'T' + a.startTime);
                const dateB = parseISO(b.date + 'T' + b.startTime);
                return dateA.getTime() - dateB.getTime();
              })
              .map(app => (
              <div key={app.id} className="p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-primary">{app.clientName || 'Client non spécifié'}</h3>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Date:</span> {format(parseISO(app.date + 'T00:00:00'), 'EEEE dd MMMM yyyy', { locale: fr })}
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

