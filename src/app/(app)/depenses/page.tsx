
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search, FileDown, Filter, Camera, Edit3, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";

// Mock expense data
const expenses = [
  { id: "EXP001", date: new Date(2023, 10, 15), category: "Fournitures de bureau", description: "Achat de papier et stylos", amount: 45.50, receiptUrl: "https://placehold.co/100x100.png", status: "Vérifié" },
  { id: "EXP002", date: new Date(2023, 10, 18), category: "Carburant", description: "Plein d'essence véhicule utilitaire", amount: 72.30, receiptUrl: null, status: "En attente" },
  { id: "EXP003", date: new Date(2023, 11, 2), category: "Matériel de nettoyage", description: "Produits désinfectants", amount: 120.00, receiptUrl: "https://placehold.co/100x100.png", status: "Vérifié" },
  { id: "EXP004", date: new Date(2023, 11, 5), category: "Repas d'affaires", description: "Déjeuner client M. Dupont", amount: 35.80, receiptUrl: null, status: "Rejeté" },
];

// Badge colors updated for contrast on dynamic card background
const statusBadgeColors = {
  "Vérifié": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "En attente": "bg-amber-100 text-amber-800 border-amber-300",
  "Rejeté": "bg-rose-100 text-rose-800 border-rose-300",
};

export default function DepensesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Suivi des Dépenses</h1>
          <p className="text-muted-foreground">Enregistrez et gérez toutes vos dépenses professionnelles.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="text-foreground border-foreground/30 hover:bg-accent hover:text-accent-foreground">
            <Camera className="mr-2 h-4 w-4" /> Photographier Reçu
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Dépense
          </Button>
        </div>
      </div>

      <Card className="shadow-md bg-card text-card-foreground"> {/* Card is now colored */}
         <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Liste des Dépenses</CardTitle>
                <CardDescription className="opacity-75">Suivez vos dépenses et transférez-les vers QuickBooks après vérification.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-card-foreground opacity-50" />
                    <Input placeholder="Rechercher dépense..." className="pl-8 w-full sm:w-auto bg-background text-foreground placeholder:text-muted-foreground border-input" /> {/* Input is light */}
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background text-foreground border-input"> {/* Select is light */}
                        <SelectValue placeholder="Filtrer par catégorie" />
                    </SelectTrigger>
                    <SelectContent> {/* Popover content remains light/dark */}
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
              <TableRow className="border-b-card-foreground/30">
                <TableHead className="text-card-foreground opacity-80">Date</TableHead>
                <TableHead className="text-card-foreground opacity-80">Catégorie</TableHead>
                <TableHead className="hidden md:table-cell text-card-foreground opacity-80">Description</TableHead>
                <TableHead className="text-right text-card-foreground opacity-80">Montant</TableHead>
                <TableHead className="text-center hidden sm:table-cell text-card-foreground opacity-80">Reçu</TableHead>
                <TableHead className="text-center text-card-foreground opacity-80">Statut</TableHead>
                <TableHead className="text-right text-card-foreground opacity-80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-b-card-foreground/20">
                  <TableCell className="text-card-foreground">{format(expense.date, "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-card-foreground">{expense.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-card-foreground">{expense.description}</TableCell>
                  <TableCell className="text-right text-card-foreground">CAD${expense.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    {expense.receiptUrl ? (
                      <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-card-foreground hover:underline opacity-90">Voir</a>
                    ) : (
                      <span className="text-card-foreground opacity-70">-</span>
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
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-card-foreground hover:bg-card-foreground/10">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions pour {expense.id}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end"> {/* Popover content */}
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           {expense.receiptUrl ? 
                           <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                               <Camera className="mr-2 h-4 w-4" /> Voir Reçu
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
            <Button variant="outline" className="border-card-foreground/50 text-card-foreground hover:bg-card-foreground/10">Transférer vers QuickBooks</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
