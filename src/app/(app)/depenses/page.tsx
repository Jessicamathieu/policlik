
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search, FileDown, Filter, Camera, Edit3, Trash2, ArrowUpDown } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { getExpenses, type Expense } from "@/lib/data";
import { useSortableData } from "@/hooks/use-sortable-data";

const statusBadgeColors = {
  "Vérifié": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300",
  "Rejeté": "bg-rose-100 text-rose-800 border-rose-300",
};

export default function DepensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { items: sortedExpenses, requestSort, sortConfig } = useSortableData(expenses, { key: 'date', direction: 'descending' });

  useEffect(() => {
    setExpenses(getExpenses());
  }, []);

  const getSortIndicator = (key: keyof Expense) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-primary/50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Suivi des Dépenses</h1>
          <p className="text-muted-foreground">Enregistrez et gérez toutes vos dépenses professionnelles.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <Camera className="mr-2 h-4 w-4" /> Photographier Reçu
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Dépense
          </Button>
        </div>
      </div>

      <Card className="shadow-md bg-card text-card-foreground"> 
         <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="text-card-foreground">Liste des Dépenses</CardTitle>
                <CardDescription className="opacity-75">Suivez vos dépenses et transférez-les vers QuickBooks après vérification.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
                    <Input placeholder="Rechercher dépense..." className="pl-8 w-full sm:w-auto bg-background text-foreground placeholder:text-muted-foreground border-input" /> 
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background text-foreground border-input"> 
                        <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent> 
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        <SelectItem value="supplies">Fournitures</SelectItem>
                        <SelectItem value="fuel">Carburant</SelectItem>
                        <SelectItem value="equipment">Matériel</SelectItem>
                        <SelectItem value="meal">Repas</SelectItem>
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
                  <Button variant="ghost" onClick={() => requestSort('date')}>
                    Date {getSortIndicator('date')}
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('category')}>
                    Catégorie {getSortIndicator('category')}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Description</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('amount')}>
                    Montant {getSortIndicator('amount')}
                  </Button>
                </TableHead>
                <TableHead className="text-center hidden sm:table-cell text-muted-foreground">Reçu</TableHead>
                <TableHead className="text-center text-muted-foreground">
                   <Button variant="ghost" onClick={() => requestSort('status')}>
                    Statut {getSortIndicator('status')}
                  </Button>
                </TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedExpenses.map((expense) => (
                <TableRow key={expense.id} className="border-b-border">
                  <TableCell className="text-card-foreground">{format(parseISO(expense.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-card-foreground">{expense.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-card-foreground">{expense.description}</TableCell>
                  <TableCell className="text-right text-card-foreground">CAD${expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {expense.receiptUrl ? (
                      <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Voir</a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={"outline"}
                      className={cn("text-xs", statusBadgeColors[expense.status as keyof typeof statusBadgeColors])}
                    >
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-muted-foreground hover:bg-muted/50">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions pour {expense.id}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end"> 
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4 text-primary" /> Modifier
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           {expense.receiptUrl ? 
                           <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                               <Camera className="mr-2 h-4 w-4 text-primary" /> Voir Reçu
                           </a> : 
                           <span className="flex items-center w-full opacity-50 cursor-not-allowed">
                               <Camera className="mr-2 h-4 w-4" /> Pas de Reçu
                           </span>
                           }
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-6 flex justify-end">
            <Button variant="outline" className="border-input text-foreground hover:bg-accent hover:text-accent-foreground">Transférer vers QuickBooks</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
