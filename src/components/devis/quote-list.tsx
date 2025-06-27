
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
import { MoreHorizontal, FileText, CheckCircle, XCircle, Mail, CalendarPlus, Trash2, Edit3, ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getQuotes, type Quote, type QuoteStatus } from "@/lib/data";
import { useSortableData } from "@/hooks/use-sortable-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuoteCard, QuoteCardSkeleton } from "./quote-card";
import { Skeleton } from "../ui/skeleton";

const statusColors: Record<QuoteStatus, string> = {
  "Envoyé": "bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200",
  "Accepté": "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  "Refusé": "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  "Converti": "bg-violet-100 text-violet-800 border-violet-300 hover:bg-violet-200",
};

interface QuoteListProps {
  searchTerm: string;
  statusFilter: QuoteStatus | 'all';
}

export function QuoteList({ searchTerm, statusFilter }: QuoteListProps) {
  const [quotes, setQuotes] = React.useState<Quote[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const isMobile = useIsMobile();
  
  React.useEffect(() => {
    setIsLoading(true);
    setQuotes(getQuotes());
    setIsLoading(false);
  }, []);

  const filteredQuotes = React.useMemo(() => {
    return quotes.filter(quote => 
        (quote.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
         quote.clientName.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || quote.status === statusFilter)
    );
  }, [quotes, searchTerm, statusFilter]);

  const { items: sortedQuotes, requestSort, sortConfig } = useSortableData(filteredQuotes);

  const handleSendEmail = (quoteId: string) => alert(`Envoyer email pour devis ${quoteId}`);
  const handleConvertToAppointment = (quoteId: string) => alert(`Convertir devis ${quoteId} en RDV`);
  const handleEditQuote = (quoteId: string) => alert(`Modifier devis ${quoteId}`);
  const handleDeleteQuote = (quoteId: string) => alert(`Supprimer devis ${quoteId}`);
  
  const getSortIndicator = (key: keyof Quote) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-primary/50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const renderDesktopView = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-b-card-foreground/30">
          <TableHead className="text-card-foreground opacity-80">
            <Button variant="ghost" onClick={() => requestSort('id')}>
                ID Devis {getSortIndicator('id')}
            </Button>
          </TableHead>
          <TableHead className="text-card-foreground opacity-80">
            <Button variant="ghost" onClick={() => requestSort('clientName')}>
                Client {getSortIndicator('clientName')}
            </Button>
          </TableHead>
          <TableHead className="text-card-foreground opacity-80">
            <Button variant="ghost" onClick={() => requestSort('date')}>
                Date {getSortIndicator('date')}
            </Button>
          </TableHead>
          <TableHead className="text-right text-card-foreground opacity-80">
            <Button variant="ghost" onClick={() => requestSort('amount')}>
                Montant {getSortIndicator('amount')}
            </Button>
          </TableHead>
          <TableHead className="text-center text-card-foreground opacity-80">
            <Button variant="ghost" onClick={() => requestSort('status')}>
                Statut {getSortIndicator('status')}
            </Button>
          </TableHead>
          <TableHead className="text-right text-card-foreground opacity-80">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-20 bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-24 bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mx-auto bg-muted rounded-md"/></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto bg-muted rounded-md"/></TableCell>
                </TableRow>
            ))
        ) : sortedQuotes.length > 0 ? (
          sortedQuotes.map((quote) => (
            <TableRow key={quote.id} className="border-b-card-foreground/20">
              <TableCell className="font-medium text-card-foreground">{quote.id}</TableCell>
              <TableCell className="text-card-foreground">{quote.clientName}</TableCell>
              <TableCell className="text-card-foreground">{format(parseISO(quote.date), "dd MMM yyyy", { locale: fr })}</TableCell>
              <TableCell className="text-right text-card-foreground">CAD${quote.amount.toFixed(2)}</TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={cn("text-xs", statusColors[quote.status])}>
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditQuote(quote.id)}>
                      <Edit3 className="mr-2 h-4 w-4 text-primary" /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert(`Voir détails pour ${quote.id}`)}>
                      <FileText className="mr-2 h-4 w-4 text-primary" /> Voir Détails
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSendEmail(quote.id)}>
                      <Mail className="mr-2 h-4 w-4 text-primary" /> Envoyer par Email
                    </DropdownMenuItem>
                    {quote.status === "Accepté" && (
                      <DropdownMenuItem onClick={() => handleConvertToAppointment(quote.id)}>
                        <CalendarPlus className="mr-2 h-4 w-4 text-primary" /> Convertir en RDV
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
          ))
        ) : (
            <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Aucun devis trouvé.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderMobileView = () => (
    <div className="space-y-4">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, index) => <QuoteCardSkeleton key={index} />)
      ) : sortedQuotes.length > 0 ? (
        sortedQuotes.map((quote) => <QuoteCard key={quote.id} quote={quote} />)
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Aucun devis trouvé pour les filtres sélectionnés.
        </div>
      )}
    </div>
  );

  return isMobile ? renderMobileView() : renderDesktopView();
}
