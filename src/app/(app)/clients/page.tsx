
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown, Upload } from "lucide-react";
import { ImportClientsModal } from "@/components/clients/import-clients-modal";
import { ClientList } from "@/components/clients/client-list";

export default function ClientsPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleImportSuccess = useCallback(() => {
        setRefreshKey(oldKey => oldKey + 1);
    }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Clients</h1>
          <p className="text-muted-foreground">Consultez, gérez et importez votre base de données clients.</p>
        </div>
        <div className="flex gap-2">
          <ImportClientsModal onImportSuccess={handleImportSuccess}>
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
      
      <ClientList key={refreshKey}/>
    </div>
  );
}
