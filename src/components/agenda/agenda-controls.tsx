"use client";

import { Button } from "@/components/ui/button";
import { AppointmentModal } from "./appointment-modal";
import { PlusCircle, Calendar, Rows, Columns } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AgendaControlsProps {
  currentView: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onNewAppointmentSave: (appointmentData: any) => void; // Replace 'any' with your Appointment type
}

export function AgendaControls({ currentView, onViewChange, onNewAppointmentSave }: AgendaControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-card rounded-lg shadow">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Vue :</span>
        <Select value={currentView} onValueChange={(value: "day" | "week" | "month") => onViewChange(value)}>
          <SelectTrigger className="w-[120px] sm:w-[150px]">
            <SelectValue placeholder="Choisir la vue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day"><Calendar className="inline-block mr-2 h-4 w-4" /> Jour</SelectItem>
            <SelectItem value="week"><Rows className="inline-block mr-2 h-4 w-4" /> Semaine</SelectItem>
            <SelectItem value="month"><Columns className="inline-block mr-2 h-4 w-4" /> Mois</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline">Client</Button>
        <Button variant="outline">Éditer</Button>
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
