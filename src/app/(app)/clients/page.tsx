
"use client";

import { useState, useCallback, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileDown, Upload } from "lucide-react";
import { ClientList } from "@/components/clients/client-list";

const ImportClientsModal = lazy(() => 
  import("@/components/clients/import-clients-modal").then(module => ({ default: module.ImportClientsModal }))
);

const AddClientModal = lazy(() => 
  import("@/components/clients/add-client-modal").then(module => ({ default: module.AddClientModal }))
);


export default function ClientsPage() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSuccess = useCallback(() => {
        setRefreshKey(oldKey => oldKey + 1);
        setIsImportModalOpen(false);
        setIsAddModalOpen(false);
    }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Clients</h1>
          <p className="text-muted-foreground">Consultez, gérez et importez votre base de données clients.</p>
          <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Importer
          </Button>

          {isImportModalOpen && (
            <Suspense fallback={null}>
              <ImportClientsModal 
                open={isImportModalOpen} 
                onOpenChange={setIsImportModalOpen} 
                onImportSuccess={handleSuccess} 
              />
            </Suspense>
          )}

          <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Client
          </Button>
          
          {isAddModalOpen && (
            <Suspense fallback={null}>
              <AddClientModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onClientAdded={handleSuccess}
              />
            </Suspense>
          )}
        </div>
      </div>
      
      <ClientList key={refreshKey}/>
    </div>
  );
}
