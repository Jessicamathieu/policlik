
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { GenericImportModal } from "@/components/shared/generic-import-modal";
import { addServicesBatch, type NewServiceData } from "@/services/service-service";

interface ImportServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

const requiredHeaders = ["service nom", "categorie", "sous_categorie", "couleur_code", "prix"];
const previewTableHeaders = ["Nom du Service", "Catégorie", "Sous-Catégorie", "Prix"];

const getRowValue = (row: { [key: string]: string }, headerName: string, headers: string[]): string => {
  const actualHeader = headers.find(fh => fh.trim().toLowerCase() === headerName.toLowerCase());
  return actualHeader ? row[actualHeader] || "" : "";
};

const serviceRowMapper = (row: { [key: string]: string }, headers: string[]): NewServiceData | null => {
  const priceValue = getRowValue(row, "prix", headers).replace(',', '.');
  const serviceData: NewServiceData = {
    name: getRowValue(row, "service nom", headers),
    category: getRowValue(row, "categorie", headers),
    subCategory: getRowValue(row, "sous_categorie", headers),
    colorCode: getRowValue(row, "couleur_code", headers),
    price: parseFloat(priceValue) || 0,
  };

  return serviceData.name ? serviceData : null;
};

const renderServicePreviewRow = (service: NewServiceData, index: number) => (
  <TableRow key={index}>
    <TableCell>{service.name}</TableCell>
    <TableCell>{service.category}</TableCell>
    <TableCell>{service.subCategory}</TableCell>
    <TableCell>{service.price ? `CAD$${service.price.toFixed(2)}` : '-'}</TableCell>
  </TableRow>
);

export function ImportServicesModal({ open, onOpenChange, onImportSuccess }: ImportServicesModalProps) {
  return (
    <GenericImportModal
      open={open}
      onOpenChange={onOpenChange}
      onImportSuccess={onImportSuccess}
      title="Importer des Services depuis un fichier CSV"
      description={`Sélectionnez un fichier CSV avec les colonnes requises: ${requiredHeaders.join(', ')}.`}
      requiredHeaders={requiredHeaders}
      previewTableHeaders={previewTableHeaders}
      rowMapper={serviceRowMapper}
      renderPreviewRow={renderServicePreviewRow}
      batchImportFunction={addServicesBatch}
    />
  );
}
