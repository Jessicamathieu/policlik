
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, FileDown, Edit, CalendarPlus, FilePlus, Trash2, Phone, MapPin, Mail as MailIcon, Upload } from "lucide-react";
import Link from "next/link";
import { type Client } from "@/lib/data";
import { getClients } from "@/services/client-service";
import { ImportClientsModal } from "@/components/clients/import-clients-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const fetchedClients = await getClients();
      fetchedClients.sort((a, b) => a.name.localeCompare(b.name));
      setClients(fetchedClients);
    } catch (error) {
      console.error("Échec de la récupération des clients:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la liste des clients. Vérifiez la configuration Firebase et votre connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderClientCards = () => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex flex-col shadow-md rounded-xl overflow-hidden bg-background border text-foreground">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 bg-muted/30 border-b">
            <div>
              <Skeleton className="h-6 w-3/5 mb-2 bg-muted" />
              <Skeleton className="h-4 w-4/5 bg-muted" />
            </div>
          </CardHeader>
          <CardContent className="p-4 text-sm space-y-3 flex-grow">
            <Skeleton className="h-5 w-full bg-muted" />
            <Skeleton className="h-5 w-full bg-muted" />
          </CardContent>
          <CardFooter className="p-4 bg-muted/30 text-sm border-t">
            <Skeleton className="h-5 w-full bg-muted" />
          </CardFooter>
        </Card>
      ));
    }
    
    if (filteredClients.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-foreground">Aucun client trouvé.</p>
          <p className="text-sm text-muted-foreground">Commencez par ajouter un nouveau client ou en importer.</p>
        </div>
      );
    }

    return filteredClients.map((client, index) => {
      const isPrimaryColor = index % 2 === 0;

      const headerClasses = cn(
          "flex flex-row items-start justify-between space-y-0 p-4 border-b transition-colors duration-300",
          isPrimaryColor ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
      );

      const titleLinkClasses = cn(
          isPrimaryColor ? "text-primary-foreground hover:underline" : "text-foreground hover:text-primary"
      );

      const emailLinkClasses = cn(
          "text-xs flex items-center gap-1",
          isPrimaryColor ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground hover:text-primary"
      );
      
      const dropdownTriggerClasses = cn(
          "h-8 w-8 -mt-1 -mr-1",
          isPrimaryColor ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20" : "text-muted-foreground hover:bg-muted"
      );

      return (
        <Card 
          key={client.id} 
          className="flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden bg-background border text-foreground"
        >
          <CardHeader className={headerClasses}>
            <div>
              <CardTitle className="text-lg font-semibold leading-tight">
                <Link href={`/clients/${client.id}`} className={titleLinkClasses}>
                  {client.name}
                </Link>
              </CardTitle>
              {client.email && (
                 <Link href={`mailto:${client.email}`} className={emailLinkClasses}>
                   <MailIcon className="h-3 w-3"/> {client.email}
                 </Link>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost" className={dropdownTriggerClasses}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Ouvrir menu pour {client.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end"> 
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href={`/clients/${client.id}/modifier`} className="flex items-center cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" /> Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href={`/agenda?clientId=${client.id}&action=nouveau`} className="flex items-center cursor-pointer">
                    <CalendarPlus className="mr-2 h-4 w-4" /> Nouveau RDV
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href={`/factures/nouveau?clientId=${client.id}`} className="flex items-center cursor-pointer">
                     <FilePlus className="mr-2 h-4 w-4" /> Nouvelle Facture
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive flex items-center cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-4 text-sm space-y-2.5 flex-grow text-foreground">
            {client.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2.5 text-muted-foreground" />
                <Link href={`tel:${client.phone}`} className="hover:text-primary">{client.phone}</Link>
              </div>
            )}
            {client.address && (
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
                <Link 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 hover:text-primary"
                >
                  {client.address}
                </Link>
              </div>
            )}
          </CardContent>
          {client.totalSpent && (
            <CardFooter className="p-4 bg-muted/30 text-sm border-t"> 
              <div className="flex items-center justify-between w-full text-foreground">
                <span className="text-muted-foreground">Total Dépensé:</span>
                <span className="font-semibold">{client.totalSpent}</span>
              </div>
            </CardFooter>
          )}
        </Card>
      );
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Clients</h1>
          <p className="text-muted-foreground">Consultez, gérez et importez votre base de données clients.</p> 
        </div>
        <div className="flex gap-2">
          <ImportClientsModal onImportSuccess={fetchClients}>
            <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
              <Upload className="mr-2 h-4 w-4" /> Importer
            </Button>
          </ImportClientsModal>
          <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Client
          </Button>
        </div>
      </div>

      <Card className="bg-card text-card-foreground"> 
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription className="opacity-75">Recherchez, filtrez et gérez vos clients.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un client par nom, email, adresse..." 
              className="pl-8 w-full sm:w-1/2 lg:w-1/3 bg-background border-input text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {renderClientCards()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
