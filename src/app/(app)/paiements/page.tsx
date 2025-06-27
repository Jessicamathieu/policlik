
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, FileDown, Eye, Receipt, ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Payment, type PaymentStatus, getPayments } from "@/lib/data";
import { useSortableData } from "@/hooks/use-sortable-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentCard, PaymentCardSkeleton } from "@/components/paiements/payment-card";

const paymentStatusColors: Record<PaymentStatus, string> = {
  "Réussi": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300",
  "Échoué": "bg-rose-100 text-rose-800 border-rose-300",
  "Remboursé": "bg-violet-100 text-violet-800 border-violet-300",
};

const statuses: { value: PaymentStatus | 'all', label: string }[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'Réussi', label: 'Réussi' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Échoué', label: 'Échoué' },
    { value: 'Remboursé', label: 'Remboursé' },
];

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setIsLoading(true);
    setPayments(getPayments());
    setIsLoading(false);
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => 
        (payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'all' || payment.status === statusFilter)
    );
  }, [payments, searchTerm, statusFilter]);

  const { items: sortedPayments, requestSort, sortConfig } = useSortableData(filteredPayments, { key: 'date', direction: 'descending' });

  const getSortIndicator = (key: keyof Payment) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-primary/50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const renderDesktopView = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-b-border">
          <TableHead className="text-muted-foreground">
            <Button variant="ghost" onClick={() => requestSort('date')}>
              Date {getSortIndicator('date')}
            </Button>
          </TableHead>
          <TableHead className="text-muted-foreground">
              <Button variant="ghost" onClick={() => requestSort('clientName')}>
              Client {getSortIndicator('clientName')}
            </Button>
          </TableHead>
          <TableHead className="hidden sm:table-cell text-muted-foreground">
            <Button variant="ghost" onClick={() => requestSort('invoiceId')}>
              Facture ID {getSortIndicator('invoiceId')}
            </Button>
          </TableHead>
          <TableHead className="hidden md:table-cell text-muted-foreground">
            <Button variant="ghost" onClick={() => requestSort('method')}>
              Méthode {getSortIndicator('method')}
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
        {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24 bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 bg-muted"/></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-20 bg-muted"/></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-28 bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto bg-muted"/></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 mx-auto bg-muted rounded-md"/></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto bg-muted rounded-md"/></TableCell>
                </TableRow>
            ))
        ) : sortedPayments.length > 0 ? (
          sortedPayments.map((payment) => (
            <TableRow key={payment.id} className="border-b-border">
              <TableCell className="text-card-foreground">{format(parseISO(payment.date), "dd MMM yyyy", { locale: fr })}</TableCell>
              <TableCell className="font-medium text-card-foreground">{payment.clientName}</TableCell>
              <TableCell className="hidden sm:table-cell">
                  <Link href={`/factures/${payment.invoiceId}`} className="hover:text-primary text-card-foreground">
                    {payment.invoiceId}
                  </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell text-card-foreground">{payment.method}</TableCell>
              <TableCell className={`text-right font-semibold ${payment.amount < 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                CAD${payment.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={cn("text-xs", paymentStatusColors[payment.status])}>
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost" className="text-muted-foreground hover:bg-muted/50">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions pour paiement {payment.id}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end"> 
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4 text-primary" /> Voir Détails
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={`/factures/${payment.invoiceId}`} className="flex items-center w-full">
                        <Receipt className="mr-2 h-4 w-4 text-primary" /> Voir Facture Associée
                        </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
            <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Aucun paiement trouvé.
                </TableCell>
            </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderMobileView = () => (
    <div className="space-y-4">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => <PaymentCardSkeleton key={index} />)
      ) : sortedPayments.length > 0 ? (
        sortedPayments.map((payment) => <PaymentCard key={payment.id} payment={payment} />)
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Aucun paiement trouvé pour les filtres sélectionnés.
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Suivi des Paiements</h1>
          <p className="text-muted-foreground">Consultez l'historique et le statut de tous les paiements.</p>
          <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
        </div>
          <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
      </div>

      <Card className="bg-card text-card-foreground"> 
          <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="text-card-foreground">Historique des Paiements</CardTitle>
                <CardDescription className="opacity-75">Suivez tous les paiements reçus et leur statut.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow w-full sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
                    <Input 
                      placeholder="Rechercher par client, facture..." 
                      className="pl-8 w-full bg-background border-input text-foreground placeholder:text-muted-foreground" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground"> 
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent> 
                      {statuses.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
            </div>
            </div>
        </CardHeader>
        <CardContent>
          {isMobile ? renderMobileView() : renderDesktopView()}
        </CardContent>
      </Card>
    </div>
  );
}
