
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
import { addProductsBatch } from "@/services/product-service";
import type { NewProductData } from "@/services/product-service";

interface CsvRowData {
  [key: string]: string;
}

interface ImportProduitsModalProps {
  children: React.ReactNode;
  onImportSuccess: () => void;
}

const requiredHeaders = ["categorie", "sous_categorie", "code", "nom", "prix"];
const previewTableHeaders = ["Nom", "Code", "Catégorie", "Sous-Catégorie", "Prix"];

export function ImportProduitsModal({ children, onImportSuccess }: ImportProduitsModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<NewProductData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();

  const processFile = useCallback((selectedFile: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setParsedData([]);
    setHeaders([]);

    Papa.parse<CsvRowData>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fileHeaders = results.meta.fields || [];
        setHeaders(fileHeaders);

        const getRowValue = (row: CsvRowData, headerName: string): string => {
            const actualHeader = fileHeaders.find(fh => fh.trim().toLowerCase() === headerName.toLowerCase());
            return actualHeader ? row[actualHeader] || "" : "";
        };

        const validData = results.data.map(row => {
            const priceValue = getRowValue(row, "prix").replace(',', '.');
            const productData: NewProductData = {
                name: getRowValue(row, "nom"),
                code: getRowValue(row, "code"),
                category: getRowValue(row, "categorie"),
                subCategory: getRowValue(row, "sous_categorie"),
                price: parseFloat(priceValue) || 0,
            };
            return productData.name ? productData : null;
        }).filter((item): item is NewProductData => item !== null);

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
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const hasMissingHeaders = useMemo(() => {
    if (!file) return false;
    const presentHeaders = headers.map(h => h.trim().toLowerCase());
    return !requiredHeaders.every(rh => presentHeaders.includes(rh.toLowerCase()));
  }, [headers, file]);

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

    try {
      await addProductsBatch(parsedData);
      toast({
        title: "Importation réussie",
        description: `${parsedData.length} produits ont été ajoutés à la base de données.`,
      });
      setFile(null);
      setParsedData([]);
      setHeaders([]);
      setOpen(false);
      onImportSuccess();
    } catch (error) {
      console.error("Erreur lors de l'importation des produits:", error);
      let errorMessage = "Une erreur est survenue lors de l'ajout des produits à la base de données.";
      if (error instanceof Error && error.message.includes('permission-denied')) {
        errorMessage = "Permission refusée. Vérifiez les règles de sécurité Firestore et votre configuration Firebase.";
      }
      toast({
        title: "Erreur d'importation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <DialogTitle>Importer des Produits depuis un fichier CSV</DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier CSV avec les colonnes requises: {requiredHeaders.join(', ')}.
          </DialogDescription>
        </DialogHeader>

        <div
          className="mt-4 border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('csv-input-produits')?.click()}
        >
          <Input
            id="csv-input-produits"
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
                    {previewTableHeaders.map(header => <TableHead key={header}>{header}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.slice(0, 100).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.subCategory}</TableCell>
                      <TableCell>{row.price ? `CAD$${row.price.toFixed(2)}` : '-'}</TableCell>
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
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Importer les Produits"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
