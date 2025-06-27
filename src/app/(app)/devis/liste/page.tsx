
"use client";

import { useState } from "react";
import { QuoteList } from "@/components/devis/quote-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type QuoteStatus } from "@/lib/data";

const statuses: { value: QuoteStatus | 'all', label: string }[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Envoyé', label: 'Envoyé' },
    { value: 'Accepté', label: 'Accepté' },
    { value: 'Refusé', label: 'Refusé' },
    { value: 'Converti', label: 'Converti' },
];

export default function QuoteListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Liste des Devis</h1>
          <p className="text-muted-foreground">Consultez et gérez tous les devis soumis.</p>
          <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
        </div>
         <div className="flex gap-2">
           <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/factures/nouveau?type=devis">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Devis Manuel
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="bg-card text-card-foreground shadow-md"> 
        <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="text-card-foreground">Devis Soumis</CardTitle>
                <CardDescription className="opacity-75">Suivez le statut de chaque devis et prenez les actions nécessaires.</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow w-full sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
                    <Input 
                      placeholder="Rechercher par ID, client..." 
                      className="pl-8 w-full sm:w-auto bg-background text-foreground placeholder:text-muted-foreground border-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    /> 
                </div>
                 <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as QuoteStatus | 'all')}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background text-foreground border-input"> 
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
          <QuoteList searchTerm={searchTerm} statusFilter={statusFilter} /> 
        </CardContent>
      </Card>
    </div>
  );
}
