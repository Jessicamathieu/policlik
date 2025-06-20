
import { QuoteList } from "@/components/devis/quote-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Filter, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function QuoteListPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Liste des Devis</h1>
          <p className="text-muted-foreground">Consultez et gérez tous les devis soumis.</p>
        </div>
         <div className="flex gap-2">
           <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/devis/demandes?action=nouveauManuel">
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
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher devis..." className="pl-8 w-full sm:w-auto bg-background text-foreground placeholder:text-muted-foreground border-input" /> 
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background text-foreground border-input"> 
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent> 
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="sent">Envoyé</SelectItem>
                        <SelectItem value="accepted">Accepté</SelectItem>
                        <SelectItem value="refused">Refusé</SelectItem>
                        <SelectItem value="converted">Converti</SelectItem>
                    </SelectContent>
                </Select>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <QuoteList /> 
        </CardContent>
      </Card>
    </div>
  );
}
