
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, FileText, DollarSign, PlusCircle, LineChart, MapPin, Phone, CalendarClock } from "lucide-react";
import Link from "next/link";
import { format, isToday, parseISO } from "date-fns"; 
import { appointments } from "@/lib/data";

const mockTodaysAppointments = appointments.filter(appt => isToday(parseISO(appt.date)));

export default function DashboardPage() {
  const summaryCards = [
    { title: "Rendez-vous Aujourd'hui", value: mockTodaysAppointments.length.toString(), icon: CalendarDays, description: `${mockTodaysAppointments.filter(a => a.status === "À venir").length} à venir` },
    { title: "Devis en Attente", value: "12", icon: FileText, description: "À traiter rapidement" },
    { title: "Clients Actifs", value: "128", icon: Users, description: "+5 cette semaine" },
    { title: "Revenus (Mois)", value: "CAD$ 7,250", icon: DollarSign, description: "Objectif: CAD$10,000" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Tableau de Bord</h1>
          <p className="text-primary-foreground">Bienvenue sur Polimik Gestion ! Voici un aperçu de votre activité.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/agenda?action=nouveau">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Rendez-vous
            </Link>
          </Button>
          <Button variant="outline" asChild className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
             <Link href="/devis/demandes">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Devis
            </Link>
          </Button>
        </div>
      </div>

      
      <div className="grid gap-6">
        <Card className="bg-card text-card-foreground"> 
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2 text-xl text-card-foreground">
              <CalendarClock className="h-6 w-6 text-card-foreground" />
              Rendez-vous du Jour
            </CardTitle>
            <CardDescription className="text-card-foreground opacity-75">Vos interventions prévues pour aujourd'hui.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTodaysAppointments.length > 0 ? (
              mockTodaysAppointments.map((appt) => (
                <Card key={appt.id} className="shadow-md border bg-background text-foreground overflow-hidden hover:shadow-lg transition-shadow"> 
                  <CardHeader className="p-4 bg-muted/50 border-b"> 
                    <CardTitle className="text-lg font-semibold text-foreground">{appt.clientName}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">{appt.serviceName}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center text-sm text-foreground">
                      <CalendarDays className="h-4 w-4 mr-2 opacity-70" />
                      <span>{appt.startTime} - {appt.endTime}</span>
                      {appt.status && (
                        <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                          appt.status === "À venir" ? "bg-blue-500 text-white" : 
                          appt.status === "En cours" ? "bg-yellow-500 text-black" :
                          "bg-green-500 text-white"
                        }`}>
                          {appt.status}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start text-sm text-foreground">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 opacity-70 shrink-0" />
                      <Link 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appt.address || '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {appt.address}
                      </Link>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <Phone className="h-4 w-4 mr-2 opacity-70" />
                      <Link 
                        href={`tel:${appt.phone}`}
                        className="hover:text-primary transition-colors"
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
            <Button variant="outline" className="mt-4 w-full border-input text-foreground hover:bg-accent hover:text-accent-foreground" asChild>
              <Link href="/agenda">Voir l'agenda complet</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card text-card-foreground border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{item.title}</CardTitle>
              <item.icon className="h-5 w-5 text-card-foreground opacity-70" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{item.value}</div>
              <p className="text-xs text-card-foreground opacity-75">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
