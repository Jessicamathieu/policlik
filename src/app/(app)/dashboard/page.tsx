import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, FileText, DollarSign, PlusCircle, LineChart } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const summaryCards = [
    { title: "Rendez-vous Aujourd'hui", value: "5", icon: CalendarDays, color: "text-blue-500", bgColor: "bg-blue-50", description: "3 à venir" },
    { title: "Devis en Attente", value: "12", icon: FileText, color: "text-orange-500", bgColor: "bg-orange-50", description: "À traiter rapidement" },
    { title: "Clients Actifs", value: "128", icon: Users, color: "text-green-500", bgColor: "bg-green-50", description: "+5 cette semaine" },
    { title: "Revenus (Mois)", value: "€ 7,250", icon: DollarSign, color: "text-purple-500", bgColor: "bg-purple-50", description: "Objectif: €10,000" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Tableau de Bord</h1>
          <p className="text-muted-foreground">Bienvenue sur Polimik Gestion ! Voici un aperçu de votre activité.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/agenda?action=nouveau">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Rendez-vous
            </Link>
          </Button>
          <Button variant="outline" asChild>
             <Link href="/devis/demandes">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Devis
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Activité Récente</CardTitle>
            <CardDescription>Derniers rendez-vous et devis créés.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { type: "RDV", text: "Nettoyage chez M. Dupont", time: "Aujourd'hui à 14h00" },
                { type: "Devis", text: "Création du devis #00124 pour Entreprise ABC", time: "Hier à 16h30" },
                { type: "RDV", text: "Entretien annuel pour Mme. Martin", time: "Demain à 09h00" },
              ].map((activity, i) => (
                 <li key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-3">
                    {activity.type === "RDV" ? <CalendarDays className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-orange-500" />}
                    <div>
                      <p className="font-medium text-sm">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={activity.type === "RDV" ? "/agenda" : "/devis/liste"}>Voir</Link>
                  </Button>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="mt-4 w-full">Voir toute l'activité</Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Aperçu des Revenus</CardTitle>
            <CardDescription>Graphique simplifié des revenus mensuels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full bg-muted/50 rounded-md flex items-center justify-center">
              <LineChart className="h-16 w-16 text-primary/50" />
              <p className="ml-4 text-muted-foreground">Graphique des revenus à venir</p>
            </div>
             <p className="text-sm text-muted-foreground mt-2 text-center">Données de démonstration. Intégration graphique complète à venir.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
