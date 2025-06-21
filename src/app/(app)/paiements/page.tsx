
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, FileDown, Filter, Eye, Receipt } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type Payment, type PaymentStatus, type PaymentMethod, getPayments } from "@/lib/data";

const paymentStatusColors: Record<PaymentStatus, string> = {
  "Réussi": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300",
  "Échoué": "bg-rose-100 text-rose-800 border-rose-300",
  "Remboursé": "bg-violet-100 text-violet-800 border-violet-300",
};

export default function PaiementsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setPayments(getPayments());
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Suivi des Paiements</h1>
          <p className="text-primary-foreground">Consultez l'historique et le statut de tous les paiements.</p>
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
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher paiement..." 
                      className="pl-8 w-full sm:w-auto bg-background border-input text-foreground placeholder:text-muted-foreground" 
                    />
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground"> 
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent> 
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.keys(paymentStatusColors).map(status => (
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
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Client</TableHead>
                <TableHead className="hidden sm:table-cell text-muted-foreground">Facture ID</TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Méthode</TableHead>
                <TableHead className="text-right text-muted-foreground">Montant</TableHead>
                <TableHead className="text-center text-muted-foreground">Statut</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="border-b-border">
                  <TableCell className="text-card-foreground">{format(payment.date, "dd MMM yyyy", { locale: fr })}</TableCell>
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
                          <Eye className="mr-2 h-4 w-4" /> Voir Détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Link href={`/factures/${payment.invoiceId}`} className="flex items-center w-full">
                            <Receipt className="mr-2 h-4 w-4" /> Voir Facture Associée
                           </Link>
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
