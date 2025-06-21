
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
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getQuotes, type Quote, type QuoteStatus } from "@/lib/data";

// Badge colors updated for contrast on dynamic card background
const statusColors: Record<QuoteStatus, string> = {
  "Envoyé": "bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200", // Light blue badge, dark blue text
  "Accepté": "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200", // Light green badge
  "Refusé": "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200",     // Light red badge
  "En attente": "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200", // Light yellow badge
  "Converti": "bg-violet-100 text-violet-800 border-violet-300 hover:bg-violet-200", // Light purple badge
};


export function QuoteList() {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  
  React.useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const handleSendEmail = (quoteId: string) => alert(`Envoyer email pour devis ${quoteId}`);
  const handleConvertToAppointment = (quoteId: string) => alert(`Convertir devis ${quoteId} en RDV`);
  const handleEditQuote = (quoteId: string) => alert(`Modifier devis ${quoteId}`);
  const handleDeleteQuote = (quoteId: string) => alert(`Supprimer devis ${quoteId}`);

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b-card-foreground/30">
          <TableHead className="text-card-foreground opacity-80">ID Devis</TableHead>
          <TableHead className="text-card-foreground opacity-80">Client</TableHead>
          <TableHead className="text-card-foreground opacity-80">Date</TableHead>
          <TableHead className="text-right text-card-foreground opacity-80">Montant</TableHead>
          <TableHead className="text-center text-card-foreground opacity-80">Statut</TableHead>
          <TableHead className="text-right text-card-foreground opacity-80">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.map((quote) => (
          <TableRow key={quote.id} className="border-b-card-foreground/20">
            <TableCell className="font-medium text-card-foreground">{quote.id}</TableCell>
            <TableCell className="text-card-foreground">{quote.clientName}</TableCell>
            <TableCell className="text-card-foreground">{format(parseISO(quote.date), "dd MMM yyyy", { locale: fr })}</TableCell>
            <TableCell className="text-right text-card-foreground">CAD${quote.amount.toFixed(2)}</TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className={cn("text-xs", statusColors[quote.status as QuoteStatus])}>
                {quote.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-card-foreground hover:bg-card-foreground/10">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions pour {quote.id}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end"> {/* Popover content, should remain light/dark */}
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
