
"use client";

import { Button } from "@/components/ui/button";
import { AppointmentModal } from "./appointment-modal";
import { PlusCircle, Calendar as CalendarIconLucide, Rows, Columns, Printer, CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";


export interface AgendaControlsProps {
  currentView: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onNewAppointmentSave: (appointmentData: any) => void;
  onPrintAppointments: () => void; 
  printStartDate?: Date;
  setPrintStartDate: (date?: Date) => void;
  printEndDate?: Date;
  setPrintEndDate: (date?: Date) => void;
}

export function AgendaControls({ 
  currentView, 
  onViewChange, 
  onNewAppointmentSave, 
  onPrintAppointments,
  printStartDate,
  setPrintStartDate,
  printEndDate,
  setPrintEndDate
}: AgendaControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-card rounded-lg shadow">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Vue :</span>
        <Select value={currentView} onValueChange={(value: "day" | "week" | "month") => onViewChange(value)}>
          <SelectTrigger className="w-[120px] sm:w-[150px]">
            <SelectValue placeholder="Choisir la vue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day"><CalendarIconLucide className="inline-block mr-2 h-4 w-4" /> Jour</SelectItem>
            <SelectItem value="week"><Rows className="inline-block mr-2 h-4 w-4" /> Semaine</SelectItem>
            <SelectItem value="month"><Columns className="inline-block mr-2 h-4 w-4" /> Mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {currentView === "month" && (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[150px] justify-start text-left font-normal",
                    !printStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {printStartDate ? format(printStartDate, "dd/MM/yy", { locale: fr }) : <span>Début impression</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={printStartDate}
                  onSelect={setPrintStartDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[150px] justify-start text-left font-normal",
                    !printEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {printEndDate ? format(printEndDate, "dd/MM/yy", { locale: fr }) : <span>Fin impression</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={printEndDate}
                  onSelect={setPrintEndDate}
                  initialFocus
                  locale={fr}
                  disabled={(date) =>
                    printStartDate ? date < printStartDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </>
        )}
        <Button variant="outline" onClick={onPrintAppointments}>
          <Printer className="mr-2 h-4 w-4" /> Imprimer
        </Button>
        <AppointmentModal
          trigger={
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Nouveau Rendez-vous
            </Button>
          }
          onSave={onNewAppointmentSave}
        />
      </div>
    </div>
  );
}
