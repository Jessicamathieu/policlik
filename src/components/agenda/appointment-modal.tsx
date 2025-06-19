
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, Phone, PlusCircle, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";

// This would come from your data layer
const mockClients = [
  { id: "1", name: "Jean Dupont", address: "123 Rue Principale, Paris" },
  { id: "2", name: "Marie Curie", address: "456 Avenue des Sciences, Lyon" },
  { id: "3", name: "Pierre Martin", address: "789 Boulevard Liberté, Marseille" },
];

// Mock service data (ideally fetched or from a shared source)
const mockServices = [
  { id: "SERV001", name: "Nettoyage Standard Résidentiel" },
  { id: "SERV002", name: "Grand Ménage de Printemps" },
  { id: "SERV003", name: "Nettoyage de Bureaux" },
  { id: "SERV004", name: "Nettoyage Après Chantier" },
  { id: "SERV005", name: "Lavage de Vitres" },
];

const appointmentStatuses = ["Planifié", "Confirmé", "Terminé", "Annulé", "Reporté"];

interface AppointmentModalProps {
  trigger?: React.ReactNode;
  appointment?: any; // Replace 'any' with your Appointment type
  onSave: (appointmentData: any) => void;
}

export function AppointmentModal({ trigger, appointment, onSave }: AppointmentModalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedClient, setSelectedClient] = React.useState(appointment?.clientId || "");
  const [selectedService, setSelectedService] = React.useState(appointment?.serviceId || "");
  const [appointmentDate, setAppointmentDate] = React.useState<Date | undefined>(appointment?.date ? new Date(appointment.date) : new Date());
  const [startTime, setStartTime] = React.useState(appointment?.startTime || "09:00");
  const [endTime, setEndTime] = React.useState(appointment?.endTime || "10:00");
  const [description, setDescription] = React.useState(appointment?.description || "");
  const [workDone, setWorkDone] = React.useState(appointment?.workDone || "");
  const [address, setAddress] = React.useState(appointment?.address || "");
  const [phone, setPhone] = React.useState(appointment?.phone || "");
  const [status, setStatus] = React.useState(appointment?.status || "Planifié");
  const [clientSearch, setClientSearch] = React.useState("");

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.address.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  React.useEffect(() => {
    if (appointment) {
      setSelectedClient(appointment.clientId || "");
      setSelectedService(appointment.serviceId || "");
      setAppointmentDate(appointment.date ? new Date(appointment.date) : new Date());
      setStartTime(appointment.startTime || "09:00");
      setEndTime(appointment.endTime || "10:00");
      setDescription(appointment.description || "");
      setWorkDone(appointment.workDone || "");
      setAddress(appointment.address || (mockClients.find(c => c.id === appointment.clientId)?.address || ""));
      setPhone(appointment.phone || "");
      setStatus(appointment.status || "Planifié");
    } else {
      // Reset form for new appointment
      setSelectedClient("");
      setSelectedService("");
      setAppointmentDate(new Date());
      setStartTime("09:00");
      setEndTime("10:00");
      setDescription("");
      setWorkDone("");
      setAddress("");
      setPhone("");
      setStatus("Planifié");
    }
  }, [appointment, isOpen]);

  const handleSave = () => {
    const clientData = mockClients.find(c => c.id === selectedClient);
    const serviceData = mockServices.find(s => s.id === selectedService);
    const appointmentData = {
      id: appointment?.id || Date.now().toString(),
      clientId: selectedClient,
      clientName: clientData?.name,
      serviceId: selectedService,
      serviceName: serviceData?.name,
      date: appointmentDate ? format(appointmentDate, "yyyy-MM-dd") : undefined,
      startTime,
      endTime,
      description,
      workDone,
      address: address || clientData?.address,
      phone,
      status,
    };
    onSave(appointmentData);
    setIsOpen(false);
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId);
    const client = mockClients.find(c => c.id === clientId);
    if (client) {
      setAddress(client.address);
      // Potentially set phone if available on client object
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{appointment ? "Modifier le Rendez-vous" : "Nouveau Rendez-vous"}</DialogTitle>
          <DialogDescription>
            {appointment ? "Mettez à jour les détails du rendez-vous." : "Planifiez un nouveau rendez-vous pour un client."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right col-span-1">
              Client
            </Label>
            <div className="col-span-3">
              <Select onValueChange={handleClientChange} value={selectedClient}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input 
                      placeholder="Rechercher client..." 
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  {filteredClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.address})
                    </SelectItem>
                  ))}
                   <Button variant="ghost" className="w-full justify-start mt-1 text-primary">
                    <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Client
                  </Button>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service" className="text-right col-span-1">
              Service
            </Label>
            <div className="col-span-3">
              <Select onValueChange={setSelectedService} value={selectedService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {mockServices.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right col-span-1">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !appointmentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {appointmentDate ? format(appointmentDate, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={appointmentDate}
                  onSelect={setAppointmentDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startTime" className="text-right col-span-1">
              Heure début
            </Label>
            <Input 
              id="startTime" 
              type="time" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
              className="col-span-3" 
              step="900" // 15 minutes
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endTime" className="text-right col-span-1">
              Heure fin
            </Label>
            <Input 
              id="endTime" 
              type="time" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
              className="col-span-3" 
              step="900" // 15 minutes
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right col-span-1">
              Adresse
            </Label>
            <div className="col-span-3 relative">
              <Input 
                id="address" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Adresse du rendez-vous"
              />
              {address && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                  aria-label="Ouvrir dans Google Maps"
                >
                  <MapPin className="h-5 w-5"/>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right col-span-1">
              Téléphone
            </Label>
             <div className="col-span-3 relative">
              <Input 
                id="phone" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Numéro de téléphone"
              />
              {phone && (
                <a 
                  href={`tel:${phone}`} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                  aria-label="Appeler le numéro"
                >
                  <Phone className="h-5 w-5"/>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2 col-span-1">
              Description
            </Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="col-span-3 min-h-[80px]" 
              placeholder="Détails du rendez-vous, travaux à effectuer..."
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="workDone" className="text-right pt-2 col-span-1">
              Travail Effectué
            </Label>
            <Textarea 
              id="workDone" 
              value={workDone} 
              onChange={(e) => setWorkDone(e.target.value)} 
              className="col-span-3 min-h-[80px]" 
              placeholder="Résumé des travaux réalisés (si applicable)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right col-span-1">
              Statut
            </Label>
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                {appointmentStatuses.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {appointment ? "Sauvegarder" : "Créer Rendez-vous"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    