
"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Table, TableBody, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import Papa from "papaparse";

interface CsvRowData {
  [key: string]: string;
}

export interface GenericImportModalProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
  title: string;
  description: string;
  requiredHeaders: string[];
  previewTableHeaders: string[];
  rowMapper: (row: CsvRowData, headers: string[]) => T | null;
  renderPreviewRow: (item: T, index: number) => React.ReactNode;
  batchImportFunction: (data: T[]) => Promise<void>;
}

export function GenericImportModal<T>({
  open,
  onOpenChange,
  onImportSuccess,
  title,
  description,
  requiredHeaders,
  previewTableHeaders,
  rowMapper,
  renderPreviewRow,
  batchImportFunction,
}: GenericImportModalProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<T[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setIsLoading(false);
    setFile(null);
    setParsedData([]);
    setHeaders([]);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const processFile = useCallback((selectedFile: File) => {
    if (!selectedFile) return;

    resetState();
    setFile(selectedFile);
    setIsLoading(true);

    Papa.parse<CsvRowData>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const fileHeaders = results.meta.fields || [];
        setHeaders(fileHeaders);

        const validData = results.data
          .map(row => rowMapper(row, fileHeaders))
          .filter((item): item is T => item !== null);

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
  }, [toast, rowMapper, resetState]);

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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const hasMissingHeaders = useMemo(() => {
    if (!file) return false;
    const presentHeaders = headers.map(h => h.trim().toLowerCase());
    return !requiredHeaders.every(rh => presentHeaders.includes(rh.toLowerCase()));
  }, [headers, file, requiredHeaders]);

  const handleImport = useCallback(async () => {
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
      await batchImportFunction(parsedData);
      toast({
        title: "Importation réussie",
        description: `${parsedData.length} éléments ont été ajoutés à la base de données.`,
      });
      resetState();
      onOpenChange(false);
      onImportSuccess();
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      let errorMessage = "Une erreur est survenue lors de l'ajout des éléments à la base de données.";
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
  }, [hasMissingHeaders, parsedData, onImportSuccess, toast, onOpenChange, batchImportFunction, requiredHeaders, resetState]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div
          className="mt-4 border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
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
            <AlertCircle className="h-5 w-5 shrink-0" />
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
                  {parsedData.slice(0, 100).map((row, index) => renderPreviewRow(row, index))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleImport} disabled={isLoading || parsedData.length === 0 || hasMissingHeaders}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Importer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
