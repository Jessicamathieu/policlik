
"use client";

import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import Papa from "papaparse";

interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ImportClientsModalProps {
  children: React.ReactNode;
}

const requiredHeaders = ["name", "email", "phone", "address"];

export function ImportClientsModal({ children }: ImportClientsModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ClientData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();

  const processFile = useCallback((selectedFile: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setParsedData([]);
    setHeaders([]);

    Papa.parse<ClientData>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fileHeaders = results.meta.fields || [];
        setHeaders(fileHeaders);
        
        const validData = results.data.map(row => ({
          name: row.name || "",
          email: row.email || "",
          phone: row.phone || "",
          address: row.address || "",
        }));

        setParsedData(validData);
        setIsLoading(false);
      },
      error: (error) => {
        toast({
          title: "Erreur de lecture du fichier",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      },
    });
  }, [toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile!);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile!);
  };

  const hasMissingHeaders = useMemo(() => {
    if (parsedData.length === 0 && !file) return false;
    if (headers.length === 0) return false;
    return !requiredHeaders.every(header => headers.includes(header));
  }, [headers, parsedData, file]);

  const handleImport = async () => {
    if (hasMissingHeaders) {
      toast({
        title: "En-têtes manquants",
        description: `Le fichier CSV doit contenir les en-têtes suivants: ${requiredHeaders.join(", ")}.`,
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    console.log("Données à importer:", parsedData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Importation réussie",
      description: `${parsedData.length} clients ont été importés (simulation).`,
    });
    
    setIsLoading(false);
    setFile(null);
    setParsedData([]);
    setHeaders([]);
    setOpen(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Importer des Clients depuis un fichier CSV</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier CSV avec les colonnes: {requiredHeaders.join(', ')}.
          </DialogDescription>
        </DialogHeader>

        <div
          className="mt-4 border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('csv-input')?.click()}
        >
          <Input
            id="csv-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            Glissez-déposez votre fichier ici, ou <span className="text-primary font-semibold">cliquez pour sélectionner</span>.
          </p>
          {file && <p className="mt-2 text-sm font-semibold text-foreground">{file.name}</p>}
        </div>

        {hasMissingHeaders && (
           <div className="mt-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
             <AlertCircle className="h-5 w-5 shrink-0"/>
             <div>
                <p className="font-semibold">En-têtes manquants ou incorrects</p>
                <p>Les en-têtes détectés sont : <code className="text-xs bg-destructive/20 p-1 rounded">{headers.join(", ")}</code></p>
                <p>Les en-têtes requis sont : <code className="text-xs bg-destructive/20 p-1 rounded">{requiredHeaders.join(", ")}</code></p>
             </div>
           </div>
        )}

        {parsedData.length > 0 && !hasMissingHeaders && (
          <div className="mt-4">
            <h3 className="font-semibold">Aperçu des données ({parsedData.length} lignes)</h3>
            <ScrollArea className="h-64 mt-2 border rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-muted">
                  <TableRow>
                    {requiredHeaders.map(header => <TableHead key={header}>{header}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 100).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleImport} disabled={isLoading || parsedData.length === 0 || hasMissingHeaders}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Importer les Clients"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
