
"use client";

import { type Invoice, type InvoiceStatus } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Printer, CreditCard, Mail, FileText as FileTextIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const statusColors: Record<InvoiceStatus, string> = {
  "Brouillon": "bg-gray-100 text-gray-800 border-gray-300", 
  "Envoyée": "bg-sky-100 text-sky-800 border-sky-300",
  "Payée": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Non Payée": "bg-amber-100 text-amber-800 border-amber-300",
  "Partiellement Payée": "bg-orange-100 text-orange-800 border-orange-300",
  "En Retard": "bg-rose-100 text-rose-800 border-rose-300",
};

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <Card className="transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            <Link href={`/factures/${invoice.id}`} className="hover:text-primary">
              Facture {invoice.id}
            </Link>
          </CardTitle>
          <CardDescription>{invoice.clientName}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-1 text-muted-foreground hover:bg-muted/50">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions pour {invoice.id}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/factures/${invoice.id}`} className="flex items-center w-full cursor-pointer">
                <Printer className="mr-2 h-4 w-4 text-primary" /> Voir / Imprimer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/factures/nouveau?invoiceId=${invoice.id}`} className="flex items-center w-full cursor-pointer">
                <FileTextIcon className="mr-2 h-4 w-4 text-primary" /> Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Envoyer la facture ${invoice.id} par email.`)} className="cursor-pointer">
              <Mail className="mr-2 h-4 w-4 text-primary" /> Envoyer par Email
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4 text-primary" /> Enregistrer Paiement
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg">CAD${invoice.amount.toFixed(2)}</span>
          <Badge variant="outline" className={cn("text-xs font-semibold border", statusColors[invoice.status])}>
            {invoice.status}
          </Badge>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Émission: {format(parseISO(invoice.dateEmission), "dd MMM yyyy", { locale: fr })}</span>
          <span>Échéance: {format(parseISO(invoice.dateEcheance), "dd MMM yyyy", { locale: fr })}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function InvoiceCardSkeleton() {
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
    )
}
