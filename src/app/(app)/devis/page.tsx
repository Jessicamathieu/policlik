
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PlusCircle, ListChecks } from "lucide-react";
import Link from "next/link";

export default function DevisPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Devis</h1>
        <p className="text-muted-foreground">Créez, envoyez et suivez vos devis clients.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-card-foreground">
              <PlusCircle className="h-6 w-6 text-card-foreground opacity-90" />
              Nouvelle Demande de Devis
            </CardTitle>
            <CardDescription className="opacity-75">Permettez à vos clients de soumettre des demandes en ligne ou créez-en une manuellement.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/devis/demandes">Créer / Voir Formulaire</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-card-foreground">
              <ListChecks className="h-6 w-6 text-card-foreground opacity-90" />
              Liste des Devis
            </CardTitle>
            <CardDescription className="opacity-75">Consultez tous les devis soumis, suivez leur statut et convertissez-les en rendez-vous.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/devis/liste">Voir la Liste des Devis</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 lg:col-span-1 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-card-foreground">
              <FileText className="h-6 w-6 text-card-foreground opacity-90" />
              Statistiques Devis
            </CardTitle>
            <CardDescription className="opacity-75">Aperçu rapide: X devis en attente, Y acceptés, Z refusés.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-card-foreground opacity-75">
                <p><strong>En attente:</strong> 5</p>
                <p><strong>Acceptés:</strong> 23</p>
                <p><strong>Refusés:</strong> 2</p>
            </div>
             <Button variant="outline" className="w-full mt-4 border-input text-foreground hover:bg-accent hover:text-accent-foreground">Voir Rapports Détaillés</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
