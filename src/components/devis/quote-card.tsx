
"use client";

import { type Quote, type QuoteStatus } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileText, CheckCircle, XCircle, Mail, CalendarPlus, Trash2, Edit3 } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const statusColors: Record<QuoteStatus, string> = {
  "Envoyé": "bg-sky-100 text-sky-800 border-sky-300 hover:bg-sky-200",
  "Accepté": "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200",
  "Refusé": "bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200",
  "Converti": "bg-violet-100 text-violet-800 border-violet-300 hover:bg-violet-200",
};

interface QuoteCardProps {
  quote: Quote;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const handleSendEmail = (quoteId: string) => alert(`Envoyer email pour devis ${quoteId}`);
  const handleConvertToAppointment = (quoteId: string) => alert(`Convertir devis ${quoteId} en RDV`);
  const handleEditQuote = (quoteId: string) => alert(`Modifier devis ${quoteId}`);
  const handleDeleteQuote = (quoteId: string) => alert(`Supprimer devis ${quoteId}`);
  
  return (
    <Card className="transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            Devis {quote.id}
          </CardTitle>
          <CardDescription>{quote.clientName}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-1 text-muted-foreground hover:bg-muted/50">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions pour {quote.id}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEditQuote(quote.id)} className="cursor-pointer">
              <Edit3 className="mr-2 h-4 w-4 text-primary" /> Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Voir détails pour ${quote.id}`)} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4 text-primary" /> Voir Détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSendEmail(quote.id)} className="cursor-pointer">
              <Mail className="mr-2 h-4 w-4 text-primary" /> Envoyer par Email
            </DropdownMenuItem>
            {quote.status === "Accepté" && (
              <DropdownMenuItem onClick={() => handleConvertToAppointment(quote.id)} className="cursor-pointer">
                <CalendarPlus className="mr-2 h-4 w-4 text-primary" /> Convertir en RDV
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer" onClick={() => handleDeleteQuote(quote.id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">CAD${quote.amount.toFixed(2)}</span>
          <Badge variant="outline" className={cn("text-xs", statusColors[quote.status])}>
            {quote.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Date: {format(parseISO(quote.date), "dd MMM yyyy", { locale: fr })}
        </div>
      </CardContent>
    </Card>
  );
}


export function QuoteCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24 bg-muted" />
                    <Skeleton className="h-4 w-32 bg-muted" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-7 w-20 bg-muted" />
                    <Skeleton className="h-6 w-24 rounded-full bg-muted" />
                </div>
            </CardContent>
        </Card>
    );
}
