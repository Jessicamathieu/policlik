
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { GenericImportModal } from "@/components/shared/generic-import-modal";
import { addClientsBatch, type NewClientData } from "@/services/client-service";

interface ImportClientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

const requiredHeaders = ["Nom", "Adresse municipale", "Ville", "Province", "Code postal", "Telephone", "Courriel"];
const previewTableHeaders = ["Nom", "Email", "Téléphone", "Adresse Complète"];

const getRowValue = (row: { [key: string]: string }, headerName: string, headers: string[]): string => {
  const actualHeader = headers.find(fh => fh.trim().toLowerCase() === headerName.toLowerCase());
  return actualHeader ? row[actualHeader] || "" : "";
};

const clientRowMapper = (row: { [key: string]: string }, headers: string[]): NewClientData | null => {
  const addressParts = [
    getRowValue(row, "Adresse municipale", headers),
    getRowValue(row, "Ville", headers),
    getRowValue(row, "Province", headers),
    getRowValue(row, "Code postal", headers)
  ].filter(Boolean).join(', ');

  const clientData: NewClientData = {
    name: getRowValue(row, "Nom", headers),
    email: getRowValue(row, "Courriel", headers),
    phone: getRowValue(row, "Telephone", headers),
    address: addressParts,
  };

  return clientData.name ? clientData : null;
};

const renderClientPreviewRow = (client: NewClientData, index: number) => (
  <TableRow key={index}>
    <TableCell>{client.name}</TableCell>
    <TableCell>{client.email}</TableCell>
    <TableCell>{client.phone}</TableCell>
    <TableCell>{client.address}</TableCell>
  </TableRow>
);

export function ImportClientsModal({ open, onOpenChange, onImportSuccess }: ImportClientsModalProps) {
  return (
    <GenericImportModal
      open={open}
      onOpenChange={onOpenChange}
      onImportSuccess={onImportSuccess}
      title="Importer des Clients depuis un fichier CSV"
      description={`Sélectionnez un fichier CSV avec les colonnes requises: ${requiredHeaders.join(', ')}.`}
      requiredHeaders={requiredHeaders}
      previewTableHeaders={previewTableHeaders}
      rowMapper={clientRowMapper}
      renderPreviewRow={renderClientPreviewRow}
      batchImportFunction={addClientsBatch}
    />
  );
}
