
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, FileText, DollarSign, PlusCircle, LineChart, MapPin, Phone, CalendarClock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns"; // For formatting today's date if needed for mock data

// Define an interface for today's appointments
interface TodayAppointment {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  address: string;
  phone: string;
  status?: "À venir" | "Terminé" | "En cours"; // Optional status
}

// Mock data for today's appointments
// In a real app, you would fetch this data
const today = new Date();
const mockTodaysAppointments: TodayAppointment[] = [
  { id: "rdv1", clientName: "Jean Dupont", serviceName: "Nettoyage Standard", startTime: "09:00", endTime: "10:30", address: "123 Rue Principale, 75001 Paris", phone: "0123456789", status: "À venir" },
  { id: "rdv2", clientName: "Marie Curie", serviceName: "Grand Ménage", startTime: "11:00", endTime: "13:00", address: "456 Avenue des Sciences, 69007 Lyon", phone: "0987654321", status: "À venir" },
  { id: "rdv3", clientName: "Pierre Martin", serviceName: "Lavage de Vitres", startTime: "14:30", endTime: "15:30", address: "789 Boulevard Liberté, 13001 Marseille", phone: "0612345678", status: "En cours" },
];

export default function DashboardPage() {
  const summaryCards = [
    { title: "Rendez-vous Aujourd'hui", value: mockTodaysAppointments.length.toString(), icon: CalendarDays, color: "text-primary", bgColor: "bg-primary/10", description: `${mockTodaysAppointments.filter(a => a.status === "À venir").length} à venir` },
    { title: "Devis en Attente", value: "12", icon: FileText, color: "text-accent", bgColor: "bg-accent/10", description: "À traiter rapidement" },
    { title: "Clients Actifs", value: "128", icon: Users, color: "text-green-500", bgColor: "bg-green-500/10", description: "+5 cette semaine" },
    { title: "Revenus (Mois)", value: "CAD$ 7,250", icon: DollarSign, color: "text-purple-500", bgColor: "bg-purple-500/10", description: "Objectif: CAD$10,000" },
  ];

  return (
    <div className="flex flex-col gap-8">
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
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border/70">
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
        {/* Today's Appointments Section */}
        <Card className="shadow-lg md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-xl">
              <CalendarClock className="h-6 w-6 text-primary" />
              Rendez-vous du Jour
            </CardTitle>
            <CardDescription>Vos interventions prévues pour aujourd'hui.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTodaysAppointments.length > 0 ? (
              mockTodaysAppointments.map((appt) => (
                <Card key={appt.id} className="shadow-md border border-border/70 overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-4 bg-muted/30">
                    <CardTitle className="text-lg font-semibold text-primary">{appt.clientName}</CardTitle>
                    <CardDescription className="text-sm">{appt.serviceName}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{appt.startTime} - {appt.endTime}</span>
                      {appt.status && (
                        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                          appt.status === "À venir" ? "bg-blue-100 text-blue-700" :
                          appt.status === "En cours" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {appt.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                      <Link 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appt.address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary hover:underline transition-colors"
                      >
                        {appt.address}
                      </Link>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Link 
                        href={`tel:${appt.phone}`}
                        className="hover:text-primary hover:underline transition-colors"
                      >
                        {appt.phone}
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">Aucun rendez-vous programmé pour aujourd'hui.</p>
            )}
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/agenda">Voir l'agenda complet</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Revenue Overview - Kept as is */}
        <Card className="shadow-md md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Aperçu des Revenus</CardTitle>
            <CardDescription>Graphique simplifié des revenus mensuels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full bg-muted/30 rounded-md flex items-center justify-center">
              {/* Placeholder for chart */}
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
