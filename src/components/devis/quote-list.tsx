"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileText, CheckCircle, XCircle, Mail, CalendarPlus, Trash2, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Mock data
const mockQuotes = [
  { id: "DEV001", clientName: "Entreprise Alpha", date: new Date(2023, 10, 15), amount: 1250.00, status: "Envoyé" },
  { id: "DEV002", clientName: "Société Beta", date: new Date(2023, 10, 20), amount: 875.50, status: "Accepté" },
  { id: "DEV003", clientName: "Organisation Gamma", date: new Date(2023, 11, 1), amount: 2100.75, status: "Refusé" },
  { id: "DEV004", clientName: "Particulier Delta", date: new Date(2023, 11, 5), amount: 350.00, status: "En attente" },
];

type QuoteStatus = "Envoyé" | "Accepté" | "Refusé" | "En attente" | "Converti";

const statusColors: Record<QuoteStatus, string> = {
  "Envoyé": "bg-blue-100 text-blue-700 border-blue-300",
  "Accepté": "bg-green-100 text-green-700 border-green-300",
  "Refusé": "bg-red-100 text-red-700 border-red-300",
  "En attente": "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Converti": "bg-purple-100 text-purple-700 border-purple-300",
};


export function QuoteList() {
  // Add state for quotes if they are to be fetched or managed client-side
  // const [quotes, setQuotes] = React.useState(mockQuotes);

  const handleSendEmail = (quoteId: string) => alert(`Envoyer email pour devis ${quoteId}`);
  const handleConvertToAppointment = (quoteId: string) => alert(`Convertir devis ${quoteId} en RDV`);
  const handleEditQuote = (quoteId: string) => alert(`Modifier devis ${quoteId}`);
  const handleDeleteQuote = (quoteId: string) => alert(`Supprimer devis ${quoteId}`);


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Devis</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead className="text-center">Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockQuotes.map((quote) => (
          <TableRow key={quote.id}>
            <TableCell className="font-medium">{quote.id}</TableCell>
            <TableCell>{quote.clientName}</TableCell>
            <TableCell>{format(quote.date, "dd MMM yyyy", { locale: fr })}</TableCell>
            <TableCell className="text-right">€{quote.amount.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className={cn("text-xs", statusColors[quote.status as QuoteStatus])}>
                {quote.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions pour {quote.id}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEditQuote(quote.id)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert(`Voir détails pour ${quote.id}`)}>
                    <FileText className="mr-2 h-4 w-4" /> Voir Détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSendEmail(quote.id)}>
                    <Mail className="mr-2 h-4 w-4" /> Envoyer par Email
                  </DropdownMenuItem>
                  {quote.status === "Accepté" && (
                    <DropdownMenuItem onClick={() => handleConvertToAppointment(quote.id)}>
                      <CalendarPlus className="mr-2 h-4 w-4" /> Convertir en RDV
                    </DropdownMenuItem>
                  )}
                  {/* Example: Update status options */}
                  {quote.status !== "Accepté" && (
                    <DropdownMenuItem onClick={() => alert(`Marquer ${quote.id} comme Accepté`)}>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Marquer Accepté
                    </DropdownMenuItem>
                  )}
                   {quote.status !== "Refusé" && (
                    <DropdownMenuItem onClick={() => alert(`Marquer ${quote.id} comme Refusé`)}>
                      <XCircle className="mr-2 h-4 w-4 text-red-500" /> Marquer Refusé
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" onClick={() => handleDeleteQuote(quote.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
