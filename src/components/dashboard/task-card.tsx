import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Phone, MapPin } from "lucide-react";
import type { Appointment } from "@/lib/data";

interface TaskCardProps {
  appointment: Appointment;
}

export const TaskCard: React.FC<TaskCardProps> = ({ appointment }) => {
  return (
    <div className="relative flex flex-col md:flex-row items-center gap-4 rounded-xl shadow-xl bg-gradient-to-br from-[#2743e3]/90 to-[#0ccc34]/80 p-5 border-2 border-primary/30 hover:scale-[1.02] transition-transform cursor-pointer">
      <div className="flex flex-col items-center justify-center p-2 rounded-md bg-white/80 aspect-square h-16 text-center">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {appointment.date && new Date(appointment.date).toLocaleDateString("fr-FR", { month: "short" })}
        </span>
        <span className="text-2xl font-bold text-foreground">
          {appointment.date && new Date(appointment.date).getDate()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-bold text-lg text-white drop-shadow">{appointment.clientName}</span>
          <span className="inline-block rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-primary ml-2">
            {appointment.serviceName}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{appointment.address}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
          <Phone className="h-4 w-4" />
          <span>{appointment.phone}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-white/90 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{appointment.startTime} - {appointment.endTime}</span>
        </div>
      </div>
      <Button asChild variant="secondary" className="ml-auto mt-2 md:mt-0">
        <Link href={`/agenda?date=${appointment.date}&id=${appointment.id}`}>Détails</Link>
      </Button>
    </div>
  );
};
