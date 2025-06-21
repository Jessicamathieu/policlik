
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Client } from "@/lib/data";
import { getClients } from "@/services/client-service";
import { useToast } from "@/hooks/use-toast";
import { ClientCard, ClientCardSkeleton } from "./client-card";
import { useAuth } from "@/context/auth-context";

const CLIENTS_PER_PAGE = 12;

export function ClientList() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const fetchClients = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const fetchedClients = await getClients(userId);
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
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchClients(user.uid);
    }
  }, [user, fetchClients]);

  const filteredClients = useMemo(() => clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase())
  ), [clients, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / CLIENTS_PER_PAGE);
  const paginatedClients = useMemo(() => {
      const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;
      const endIndex = startIndex + CLIENTS_PER_PAGE;
      return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);
  
  useEffect(() => {
    // Reset to page 1 when search term changes
    setCurrentPage(1);
  }, [searchTerm]);

  const renderClientGrid = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ClientCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    
    if (filteredClients.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-foreground">Aucun client trouvé.</p>
          <p className="text-sm text-muted-foreground">Essayez une autre recherche ou ajoutez un nouveau client.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {paginatedClients.map((client, index) => (
          <ClientCard key={client.id} client={client} isPrimaryColor={index % 2 === 0} />
        ))}
      </div>
    );
  }

  const renderPagination = () => {
    if (isLoading || totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center space-x-4 pt-6 mt-6 border-t">
            <Button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                variant="outline"
            >
                Précédent
            </Button>
            <span className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
            </span>
            <Button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
            >
                Suivant
            </Button>
        </div>
    );
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Liste des Clients</CardTitle>
        <CardDescription className="opacity-75">
            Total : {filteredClients.length} client(s) trouvé(s).
        </CardDescription>
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
        {renderClientGrid()}
        {renderPagination()}
      </CardContent>
    </Card>
  );
}
