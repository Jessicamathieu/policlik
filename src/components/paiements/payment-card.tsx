
"use client";

import { type Payment, type PaymentStatus } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Receipt } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const paymentStatusColors: Record<PaymentStatus, string> = {
  "Réussi": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300",
  "Échoué": "bg-rose-100 text-rose-800 border-rose-300",
  "Remboursé": "bg-violet-100 text-violet-800 border-violet-300",
};

interface PaymentCardProps {
  payment: Payment;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <Card className="transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between p-4 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">
            {payment.clientName}
          </CardTitle>
          <CardDescription>
            Paiement pour Facture{' '}
            <Link href={`/factures/${payment.invoiceId}`} className="text-primary hover:underline">
              {payment.invoiceId}
            </Link>
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-1 text-muted-foreground hover:bg-muted/50">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions pour paiement {payment.id}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4 text-primary" /> Voir Détails
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/factures/${payment.invoiceId}`} className="flex items-center w-full cursor-pointer">
                <Receipt className="mr-2 h-4 w-4 text-primary" /> Voir Facture
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-sm space-y-2">
        <div className="flex justify-between items-center">
          <span className={cn(
            'font-semibold text-lg',
            payment.amount < 0 ? 'text-destructive' : 'text-emerald-600'
          )}>
            CAD${payment.amount.toFixed(2)}
          </span>
          <Badge variant="outline" className={cn("text-xs", paymentStatusColors[payment.status])}>
            {payment.status}
          </Badge>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{payment.method}</span>
          <span>{format(parseISO(payment.date), "dd MMM yyyy", { locale: fr })}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentCardSkeleton() {
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
