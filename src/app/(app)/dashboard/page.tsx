
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-2xl shadow-lg bg-card text-card-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-center">Bienvenue dans Polimik Gestion !</CardTitle>
          <CardDescription className="text-center pt-2">
            Pour le moment, vos bases de données de services et de produits sont vides, en attente que vous y ajoutiez des données.
            <br />
            Voici comment faire :
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 text-sm">
          <div>
            <h3 className="font-semibold text-lg mb-3">1. Pour importer vos services :</h3>
            <ul className="list-disc list-outside pl-5 space-y-3 text-muted-foreground">
              <li>
                Allez sur la page <Link href="/services" className="text-primary font-semibold hover:underline">Services</Link>.
              </li>
              <li>
                Cliquez sur le bouton <strong>"Importer"</strong>.
              </li>
              <li>
                Sélectionnez votre fichier CSV avec les en-têtes suivants :
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary">service nom</Badge>
                  <Badge variant="secondary">categorie</Badge>
                  <Badge variant="secondary">sous_categorie</Badge>
                  <Badge variant="secondary">couleur_code</Badge>
                  <Badge variant="secondary">prix</Badge>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">2. Pour importer vos produits :</h3>
            <ul className="list-disc list-outside pl-5 space-y-3 text-muted-foreground">
               <li>
                Allez sur la page <Link href="/produits" className="text-primary font-semibold hover:underline">Produits</Link>.
              </li>
              <li>
                Cliquez sur le bouton <strong>"Importer"</strong>.
              </li>
              <li>
                Sélectionnez votre fichier CSV avec les en-têtes suivants :
                 <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary">categorie</Badge>
                  <Badge variant="secondary">sous_categorie</Badge>
                  <Badge variant="secondary">code</Badge>
                  <Badge variant="secondary">nom</Badge>
                  <Badge variant="secondary">prix</Badge>
                </div>
              </li>
            </ul>
          </div>
            
          <div className="pt-4 text-center text-muted-foreground border-t">
            <p>Une fois vos données importées, votre tableau de bord affichera un résumé de votre activité.</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
