
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentModal } from './appointment-modal'; 
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay, parseISO, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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

const slotHeightPx = 50; 
const startHourGrid = 6; 

export const CalendarView = React.memo(function CalendarView({ appointments, currentDate, view, onAppointmentUpdate, onNewAppointmentSave }: CalendarViewProps) {
  const timeSlots = generateTimeSlots(startHourGrid, 20, 30); 

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotInitialData, setSlotInitialData] = useState<Partial<Appointment> | undefined>(undefined);
  const [formattedDateHeader, setFormattedDateHeader] = useState<string>('');

  useEffect(() => {
    if (!currentDate) return;

    if (view === "day") {
      setFormattedDateHeader(
        format(currentDate, 'EEEE dd MMMM yyyy', { locale: fr })
      );
    } else if (view === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1, locale: fr }); 
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1, locale: fr });
      setFormattedDateHeader(
        `Semaine du ${format(weekStart, 'dd MMMM', { locale: fr })} au ${format(weekEnd, 'dd MMMM yyyy', { locale: fr })}`
      );
    } else if (view === "month") {
        setFormattedDateHeader(
            format(currentDate, 'MMMM yyyy', { locale: fr })
        );
    }
  }, [currentDate, view]);

  const handleSlotClick = useCallback((dateForSlot: Date, slotStartTime?: string) => {
    setSlotInitialData({
      date: format(dateForSlot, "yyyy-MM-dd"),
      startTime: slotStartTime || "09:00", 
    });
    setIsSlotModalOpen(true);
  }, []);
  
  const renderDayView = () => (
    // The calendar grid itself will be on the white page background.
    // It uses `bg-card` for its cells, which is now dynamic/colored. This might be too much color.
    // Let's make the grid cells use `bg-background` (white) and borders, then appointments are colored.
    <div className="grid grid-cols-[auto_1fr] gap-px bg-border border rounded-lg shadow-sm overflow-hidden">
      <div className="sticky left-0 z-10 bg-muted text-foreground"> {/* Time column header and cells use muted/foreground for light bg */}
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium sticky top-0 bg-muted z-10">Heure</div>
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
      <div className="relative bg-background"> {/* Day column uses page background (white) */}
        <div className="h-10 border-b flex items-center justify-center p-2 text-sm font-medium sticky top-0 bg-muted z-10 text-foreground"> {/* Day header use muted/foreground */}
          {formattedDateHeader || ' '}
        </div>
        {timeSlots.map((slot, slotIndex) => (
          <div 
            key={slotIndex} 
            className="border-b relative cursor-pointer hover:bg-muted/50 transition-colors" // Cells are white, hover makes them slightly gray
            style={{ height: `${slotHeightPx}px` }} 
            onClick={() => handleSlotClick(currentDate, slot)}
            role="button"
            tabIndex={0}
            aria-label={`Créer un rendez-vous à ${slot} le ${format(currentDate, 'dd/MM/yyyy', {locale: fr})}`}
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
                  className={cn(
                    "absolute left-1 right-1 p-1.5 text-left text-xs rounded shadow-md transition-colors duration-150 ease-in-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 hover:opacity-90",
                    app.serviceColorClassName || 'bg-primary', // Use primary (dynamic color)
                    'text-primary-foreground' // Text on appointment is primary-foreground (white)
                  )}
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
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1, locale: fr }); 
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: endOfWeek(weekStart, { weekStartsOn: 1, locale: fr }) });

    return (
      // Week view grid on white page background
      <div className="border rounded-lg shadow-sm overflow-x-auto bg-background text-foreground">
        <div className="h-10 flex items-center justify-center p-2 text-sm font-semibold sticky top-0 bg-muted z-30 border-b text-foreground"> {/* Header muted on white */}
            {formattedDateHeader || ' '}
        </div>
        <div className="grid grid-cols-[auto_repeat(7,minmax(140px,1fr))] gap-px bg-border">
            <div 
              className="sticky left-0 top-10 z-20 bg-muted h-12 border-b flex items-center justify-center p-2 text-sm font-medium text-muted-foreground" // Time col header
            >
                Heure
            </div>
            {daysOfWeek.map(day => (
                <div 
                  key={`header-${day.toISOString()}`} 
                  className="sticky top-10 z-20 bg-muted h-12 border-b p-2 text-xs font-medium text-center flex flex-col items-center justify-center text-foreground" // Day headers
                >
                  <span className="font-semibold">{format(day, 'EEE', { locale: fr })}</span>
                  <span className="font-normal text-lg">{format(day, 'd', { locale: fr })}</span>
                </div>
            ))}

            {timeSlots.map((slot) => (
                <React.Fragment key={`timeslot-row-${slot}`}>
                    <div 
                        className="sticky left-0 z-10 bg-muted p-2 text-xs flex items-center justify-center font-semibold text-foreground" // Time slots
                        style={{ height: `${slotHeightPx}px` }}
                    >
                        {slot}
                    </div>

                    {daysOfWeek.map(day => (
                        <div 
                            key={`slot-${day.toISOString()}-${slot}`} 
                            className="bg-background relative cursor-pointer hover:bg-muted/50 transition-colors border-r border-b" // Day cells are white
                            style={{ height: `${slotHeightPx}px` }}
                            onClick={() => handleSlotClick(day, slot)}
                            role="button"
                            tabIndex={0}
                            aria-label={`Créer un rendez-vous à ${slot} le ${format(day, 'dd/MM/yyyy', {locale: fr})}`}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSlotClick(day, slot);}}
                        >
                        </div>
                    ))}
                </React.Fragment>
            ))}
            
            {daysOfWeek.map((day, dayIndex) => (
                <div 
                    key={`appointment-area-${day.toISOString()}`} 
                    className="relative" 
                    style={{ 
                        gridColumnStart: dayIndex + 2, 
                        gridRowStart: 3, // After header row and day name row
                        gridRowEnd: timeSlots.length + 3, 
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
                                          className={cn(
                                            "absolute left-1 right-1 p-1 text-left text-xs rounded shadow-md transition-colors duration-150 ease-in-out overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 hover:opacity-90",
                                            app.serviceColorClassName || 'bg-primary', // Colored appointments
                                            'text-primary-foreground' // White text on appointments
                                          )}
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

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const gridStartDay = startOfWeek(monthStart, { weekStartsOn: 1, locale: fr }); 
    const gridEndDay = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1, locale: fr });
    const daysInGrid = eachDayOfInterval({ start: gridStartDay, end: gridEndDay });
    const dayHeaders = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    return (
      // Month view card itself is on white page bg, but it will become colored as it's a Card.
      // Let's change the outer Card to a div with standard page background styling.
      <div className="shadow-md border rounded-lg bg-background text-foreground">
        <div className="p-4 border-b"> {/* Header for month view title */}
          <h2 className="font-headline text-center text-xl text-foreground">
            {formattedDateHeader || "Mois"}
          </h2>
        </div>
        <div className="p-1 sm:p-2 md:p-4">
          <div className="grid grid-cols-7 gap-px bg-border border rounded-md overflow-hidden">
            {dayHeaders.map(header => (
              <div key={header} className="text-center font-medium text-sm py-2 bg-muted text-muted-foreground"> {/* Day headers light gray */}
                {header}
              </div>
            ))}
            {daysInGrid.map((day, index) => {
              const appointmentsForDay = appointments.filter(app => 
                isSameDay(parseISO(app.date + "T00:00:00"), day)
              ).sort((a,b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[100px] sm:min-h-[120px] p-1.5 sm:p-2 relative flex flex-col cursor-pointer hover:bg-muted/30 transition-colors",
                    isSameMonth(day, currentDate) ? "bg-background" : "bg-muted/40", // Day cells white, off-month gray
                    "border-r border-b" // Add borders to cells
                  )}
                  onClick={() => handleSlotClick(day)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ajouter un rendez-vous le ${format(day, 'dd MMMM yyyy', {locale: fr})}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSlotClick(day);}}
                >
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium self-start",
                      !isSameMonth(day, currentDate) && "text-muted-foreground/70",
                      isSameDay(day, new Date()) && "text-primary font-bold" // Today highlighted with primary color (dynamic)
                    )}
                  >
                    {format(day, 'd')}
                  </span>
                  <div className="mt-1 space-y-0.5 overflow-y-auto flex-grow max-h-[80px] sm:max-h-[100px]">
                    {appointmentsForDay.slice(0, 2).map(app => (
                       <AppointmentModal
                          key={app.id}
                          appointment={app}
                          onSave={onAppointmentUpdate}
                          trigger={
                            <button 
                              className={cn(
                                "w-full text-left text-[10px] sm:text-xs rounded px-1 py-0.5 block truncate focus:outline-none focus:ring-1 focus:ring-ring hover:opacity-90",
                                app.serviceColorClassName || 'bg-primary', // Appointments colored
                                'text-primary-foreground' // Text on appointments white
                              )}
                              onClick={(e) => e.stopPropagation()} 
                              aria-label={`Rendez-vous: ${app.clientName || app.serviceName} de ${app.startTime} à ${app.endTime}`}
                            >
                              {app.startTime} {app.clientName || app.serviceName || 'RDV'}
                            </button>
                          }
                        />
                    ))}
                    {appointmentsForDay.length > 2 && (
                      <div className="text-[10px] sm:text-xs text-muted-foreground text-center pt-0.5">
                        + {appointmentsForDay.length - 2} autre(s)
                      </div>
                    )}
                  </div>
                </div>
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
      </div>
    );
  };

  if (!currentDate) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Chargement de l'agenda...</p>
        </div>
    );
  }

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
});
