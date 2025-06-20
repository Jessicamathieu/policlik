// This page can serve as a container or redirect for quote-related sub-pages.
// For now, we can redirect to the quote list or provide an overview.
// Let's make it a simple overview for now.

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PlusCircle, ListChecks } from "lucide-react";
import Link from "next/link";

export default function DevisPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Gestion des Devis</h1>
        <p className="text-primary-foreground">Créez, envoyez et suivez vos devis clients.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <PlusCircle className="h-6 w-6 text-primary" />
              Nouvelle Demande de Devis
            </CardTitle>
            <CardDescription>Permettez à vos clients de soumettre des demandes en ligne ou créez-en une manuellement.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/devis/demandes">Créer / Voir Formulaire</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <ListChecks className="h-6 w-6 text-primary" />
              Liste des Devis
            </CardTitle>
            <CardDescription>Consultez tous les devis soumis, suivez leur statut et convertissez-les en rendez-vous.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/devis/liste">Voir la Liste des Devis</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-md hover:shadow-xl transition-shadow duration-300 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <FileText className="h-6 w-6 text-primary" />
              Statistiques Devis
            </CardTitle>
            <CardDescription>Aperçu rapide: X devis en attente, Y acceptés, Z refusés.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
                <p><strong>En attente:</strong> 5</p>
                <p><strong>Acceptés:</strong> 23</p>
                <p><strong>Refusés:</strong> 2</p>
            </div>
             <Button variant="outline" className="w-full mt-4">Voir Rapports Détaillés</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
