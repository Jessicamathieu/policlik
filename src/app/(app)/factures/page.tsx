
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search, FileDown, Filter, Printer, CreditCard, Mail, FileText as FileTextIcon, MessageSquare, ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { type Invoice, type InvoiceStatus, getInvoices } from "@/lib/data";
import { useSortableData } from "@/hooks/use-sortable-data";

const statusColors: Record<InvoiceStatus, string> = {
  "Brouillon": "bg-gray-100 text-gray-800 border-gray-300", 
  "Envoyée": "bg-sky-100 text-sky-800 border-sky-300",
  "Payée": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Non Payée": "bg-amber-100 text-amber-800 border-amber-300",
  "Partiellement Payée": "bg-orange-100 text-orange-800 border-orange-300",
  "En Retard": "bg-rose-100 text-rose-800 border-rose-300",
};

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { items: sortedInvoices, requestSort, sortConfig } = useSortableData(invoices, { key: 'dateEmission', direction: 'descending' });
  
  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const getSortIndicator = (key: keyof Invoice) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Factures</h1>
          <p className="text-muted-foreground">Créez, suivez et gérez vos factures clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/factures/nouveau?type=facture">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Facture
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-card text-card-foreground"> 
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="text-card-foreground">Liste des Factures</CardTitle>
                <CardDescription className="opacity-75">Suivez l'état de paiement de toutes vos factures.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher facture..." 
                      className="pl-8 w-full sm:w-auto bg-background border-input text-foreground placeholder:text-muted-foreground" 
                    />
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground"> 
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent> 
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.keys(statusColors).map(status => (
                            <SelectItem key={status} value={status.toLowerCase().replace(' ', '-')}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-border">
                <TableHead className="text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('id')}>
                    ID Facture {getSortIndicator('id')}
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('clientName')}>
                    Client {getSortIndicator('clientName')}
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('dateEmission')}>
                    Date Émission {getSortIndicator('dateEmission')}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">
                   <Button variant="ghost" onClick={() => requestSort('dateEcheance')}>
                    Date Échéance {getSortIndicator('dateEcheance')}
                  </Button>
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                   <Button variant="ghost" onClick={() => requestSort('amount')}>
                    Montant {getSortIndicator('amount')}
                  </Button>
                </TableHead>
                <TableHead className="text-center text-muted-foreground">
                   <Button variant="ghost" onClick={() => requestSort('status')}>
                    Statut {getSortIndicator('status')}
                  </Button>
                </TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-b-border">
                  <TableCell className="font-medium text-card-foreground">
                    <Link href={`/factures/${invoice.id}`} className="hover:text-primary">
                      {invoice.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-card-foreground">{invoice.clientName}</TableCell>
                  <TableCell className="hidden sm:table-cell text-card-foreground">{format(parseISO(invoice.dateEmission), "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="hidden md:table-cell text-card-foreground">{format(parseISO(invoice.dateEcheance), "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-right text-card-foreground">CAD${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("text-xs font-semibold border", statusColors[invoice.status])}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-muted-foreground hover:bg-muted/50">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions pour {invoice.id}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                         <DropdownMenuItem>
                           <Link href={`/factures/${invoice.id}`} className="flex items-center w-full">
                            <Printer className="mr-2 h-4 w-4" /> Voir / Imprimer
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Link href={`/factures/nouveau?invoiceId=${invoice.id}`} className="flex items-center w-full">
                            <FileTextIcon className="mr-2 h-4 w-4" /> Modifier
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Envoyer la facture ${invoice.id} par email.`)}>
                            <Mail className="mr-2 h-4 w-4" /> Envoyer par Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Envoyer la facture ${invoice.id} par SMS.`)}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Envoyer par SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" /> Enregistrer Paiement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                            Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
