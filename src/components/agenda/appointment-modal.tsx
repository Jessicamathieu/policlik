
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, MapPin, Phone, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useCallback, useState } from "react";
import { type Service, type Client } from "@/lib/data";
import { getClients } from "@/services/client-service";
import { getServices } from "@/services/service-service";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { saveAppointment, type SaveAppointmentInput } from "@/ai/flows/save-appointment-flow";


interface Appointment {
  id?: string;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  date?: string | Date; // yyyy-MM-dd or Date object
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  description?: string;
  workDone?: string;
  address?: string;
  phone?: string;
  smsReminder?: boolean;
  serviceColorClassName?: string;
  servicePrice?: number;
}

interface AppointmentModalProps {
  appointment?: Partial<Appointment>;
  onSaveSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppointmentModal({ appointment, onSaveSuccess, open, onOpenChange }: AppointmentModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [selectedClient, setSelectedClient] = React.useState(appointment?.clientId || "");
  const [selectedService, setSelectedService] = React.useState(appointment?.serviceId || "");
  const [appointmentDate, setAppointmentDate] = React.useState<Date | undefined>();
  const [startTime, setStartTime] = React.useState(appointment?.startTime || "09:00");
  const [endTime, setEndTime] = React.useState(appointment?.endTime || "10:00");
  const [description, setDescription] = React.useState(appointment?.description || "");
  const [workDone, setWorkDone] = React.useState(appointment?.workDone || "");
  const [address, setAddress] = React.useState(appointment?.address || "");
  const [phone, setPhone] = React.useState(appointment?.phone || "");
  const [smsReminder, setSmsReminder] = React.useState(appointment?.smsReminder || false);
  const [clientSearch, setClientSearch] = React.useState("");

  React.useEffect(() => {
    const fetchData = async () => {
      if (open && user?.uid) {
        try {
          const [fetchedClients, fetchedServices] = await Promise.all([
            getClients(user.uid),
            getServices()
          ]);
          
          fetchedClients.sort((a, b) => a.name.localeCompare(b.name));
          setClients(fetchedClients);

          fetchedServices.sort((a, b) => a.name.localeCompare(b.name));
          setServices(fetchedServices);

        } catch (error) {
          console.error("Failed to fetch clients or services for modal:", error);
          toast({
            title: "Erreur de chargement",
            description: "Impossible de charger les clients ou les services.",
            variant: "destructive"
          });
        }
      }
    };
    fetchData();
  }, [open, toast, user]);

  React.useEffect(() => {
    if (open) {
      const initialDate = appointment?.date 
        ? (typeof appointment.date === 'string' ? parseISO(appointment.date) : appointment.date) 
        : new Date();
      
      const client = clients.find(c => c.id === appointment?.clientId);

      setSelectedClient(appointment?.clientId || "");
      setSelectedService(appointment?.serviceId || "");
      setAppointmentDate(initialDate instanceof Date && !isNaN(initialDate.valueOf()) ? initialDate : new Date());
      setStartTime(appointment?.startTime || "09:00");
      setEndTime(appointment?.endTime || "10:00");
      setDescription(appointment?.description || "");
      setWorkDone(appointment?.workDone || "");
      setAddress(appointment?.address || client?.address || "");
      setPhone(appointment?.phone || client?.phone || "");
      setSmsReminder(appointment?.smsReminder || false);
      if (!appointment?.clientId) setClientSearch("");
    }
  }, [appointment, open, clients]);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.address.toLowerCase().includes(clientSearch.toLowerCase())
  );
  
  const handleSave = useCallback(async () => {
    if (!user?.uid) {
      toast({ title: "Erreur", description: "Vous devez être connecté.", variant: "destructive" });
      return;
    }
    if (!selectedClient || !selectedService || !appointmentDate) {
        toast({ title: "Champs Requis", description: "Veuillez sélectionner un client, un service et une date.", variant: "destructive" });
        return;
    }

    const clientData = clients.find(c => c.id === selectedClient);
    const serviceData = services.find(s => s.id === selectedService);

    if (!clientData || !serviceData) {
        toast({ title: "Données Invalides", description: "Client ou service non trouvé.", variant: "destructive" });
        return;
    }

    setIsLoading(true);

    const appointmentData: SaveAppointmentInput = {
      clientId: selectedClient,
      clientName: clientData.name,
      serviceId: selectedService,
      serviceName: serviceData.name,
      servicePrice: serviceData.price || 0,
      date: format(appointmentDate, "yyyy-MM-dd"),
      startTime,
      endTime,
      description,
      workDone,
      address, 
      phone,     
      smsReminder,
      serviceColorClassName: serviceData.colorClassName,
      ownerId: user.uid,
    };
    
    try {
        await saveAppointment(appointmentData);
        toast({ title: "Rendez-vous Enregistré", description: `Le rendez-vous pour ${clientData.name} a été créé avec succès.` });
        onSaveSuccess();
        onOpenChange(false);
    } catch(error) {
        console.error("Failed to save appointment:", error);
        toast({ title: "Erreur", description: "Impossible de sauvegarder le rendez-vous.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }

  }, [
      selectedClient, 
      selectedService, 
      appointmentDate, 
      startTime, 
      endTime, 
      description, 
      workDone, 
      address, 
      phone, 
      smsReminder, 
      clients, 
      services, 
      onSaveSuccess, 
      onOpenChange,
      user,
      toast,
  ]);

  const handleClientChange = useCallback((clientId: string) => {
    setSelectedClient(clientId);
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setAddress(client.address);
      setPhone(client.phone || "");
    } else {
      setAddress("");
      setPhone("");
    }
  }, [clients]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-headline">{appointment?.id ? "Modifier le Rendez-vous" : "Nouveau Rendez-vous"}</DialogTitle>
            <DialogDescription>
              {appointment?.id ? "Mettez à jour les détails du rendez-vous." : "Planifiez un nouveau rendez-vous."}
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
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center">
                          <span className={cn("w-3 h-3 rounded-full mr-2", service.colorClassName || 'bg-gray-400')}></span>
                          {service.name}
                        </div>
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
                step="1800" 
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
                step="1800" 
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
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} 
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
              <div className="text-right col-span-1"> 
                <Label htmlFor="smsReminder">SMS Rappel</Label>
              </div>
              <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox
                  id="smsReminder"
                  checked={smsReminder}
                  onCheckedChange={(checked) => setSmsReminder(Boolean(checked))}
                  />
                  <Label htmlFor="smsReminder" className="text-sm font-normal cursor-pointer">
                      Notifier le client par SMS avant le RDV (confirme en répondant).
                  </Label>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Annuler</Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (appointment?.id ? "Sauvegarder" : "Créer Rendez-vous")}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
