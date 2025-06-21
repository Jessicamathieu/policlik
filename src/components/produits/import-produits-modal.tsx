
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { GenericImportModal } from "@/components/shared/generic-import-modal";
import { addProductsBatch, type NewProductData } from "@/services/product-service";

interface ImportProduitsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

const requiredHeaders = ["categorie", "sous_categorie", "code", "nom", "prix"];
const previewTableHeaders = ["Nom", "Code", "Catégorie", "Sous-Catégorie", "Prix"];

const getRowValue = (row: { [key: string]: string }, headerName: string, headers: string[]): string => {
  const actualHeader = headers.find(fh => fh.trim().toLowerCase() === headerName.toLowerCase());
  return actualHeader ? row[actualHeader] || "" : "";
};

const productRowMapper = (row: { [key: string]: string }, headers: string[]): NewProductData | null => {
  const priceValue = getRowValue(row, "prix", headers).replace(',', '.');
  const productData: NewProductData = {
    name: getRowValue(row, "nom", headers),
    code: getRowValue(row, "code", headers),
    category: getRowValue(row, "categorie", headers),
    subCategory: getRowValue(row, "sous_categorie", headers),
    price: parseFloat(priceValue) || 0,
  };

  return productData.name ? productData : null;
};

const renderProductPreviewRow = (product: NewProductData, index: number) => (
  <TableRow key={index}>
    <TableCell>{product.name}</TableCell>
    <TableCell>{product.code}</TableCell>
    <TableCell>{product.category}</TableCell>
    <TableCell>{product.subCategory}</TableCell>
    <TableCell>{product.price ? `CAD$${product.price.toFixed(2)}` : '-'}</TableCell>
  </TableRow>
);

export function ImportProduitsModal({ open, onOpenChange, onImportSuccess }: ImportProduitsModalProps) {
  return (
    <GenericImportModal
      open={open}
      onOpenChange={onOpenChange}
      onImportSuccess={onImportSuccess}
      title="Importer des Produits depuis un fichier CSV"
      description={`Sélectionnez un fichier CSV avec les colonnes requises: ${requiredHeaders.join(', ')}.`}
      requiredHeaders={requiredHeaders}
      previewTableHeaders={previewTableHeaders}
      rowMapper={productRowMapper}
      renderPreviewRow={renderProductPreviewRow}
      batchImportFunction={addProductsBatch}
    />
  );
}
