
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Users, Calendar, DollarSign, PlusCircle, FileText } from "lucide-react";
import Link from "next/link";
import { type Appointment } from "@/lib/data";
import { getAppointmentsForUser } from "@/services/appointment-service";
import { getClients } from "@/services/client-service";
import { getInvoices } from "@/services/invoice-service";
import type { Invoice } from "@/lib/data";
import { format, isFuture, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/context/auth-context";

// Main component
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clientCount: 0, monthlyRevenue: 0, pendingInvoices: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleAIPrompt = () => {
    const promptText = window.prompt("Qu’est-ce que tu veux créer ? (ex. : Facture, RDV, Client)");
    if (promptText) {
      console.log("Demande à l'IA :", promptText);
      // Future AI call can be placed here
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;

      setIsLoading(true);
      try {
        const [clients, allAppointments, allInvoices] = await Promise.all([
          getClients(user.uid),
          getAppointmentsForUser(user.uid),
          getInvoices(user.uid)
        ]);

        const clientCount = clients.length;
        
        const todayForStats = new Date();
        const monthlyRevenue = allInvoices
          .filter(inv => {
              const emissionDate = parseISO(inv.dateEmission);
              return inv.status === 'Payée' && 
                     emissionDate.getMonth() === todayForStats.getMonth() &&
                     emissionDate.getFullYear() === todayForStats.getFullYear();
          })
          .reduce((sum, inv) => sum + inv.amount, 0);

        const pendingInvoicesCount = allInvoices
            .filter(inv => inv.status === 'Envoyée' || inv.status === 'Non Payée' || inv.status === 'En Retard').length;

        setStats({ clientCount, monthlyRevenue, pendingInvoices: pendingInvoicesCount });

        const upcoming = allAppointments
          .filter(app => {
            const appDate = parseISO(app.date);
            return isToday(appDate) || isFuture(appDate);
          })
          .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime() || a.startTime.localeCompare(b.startTime))
          .slice(0, 5);

        setUpcomingAppointments(upcoming);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderStatCards = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
         <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-2/3 bg-muted" />
              <Skeleton className="h-6 w-6 bg-muted rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2 bg-muted" />
              <Skeleton className="h-4 w-full mt-1 bg-muted" />
            </CardContent>
        </Card>
      ));
    }
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenu (Mois en cours)</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">CAD${stats.monthlyRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Basé sur les factures payées</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{stats.clientCount}</div>
                    <p className="text-xs text-muted-foreground">Nombre total de clients</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Factures en Attente</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
                    <p className="text-xs text-muted-foreground">Factures non réglées ou en retard</p>
                </CardContent>
            </Card>
        </>
    );
  };
  
  const renderUpcomingAppointments = () => {
    if (isLoading) {
        return (
             <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Skeleton className="h-14 w-14 rounded-md bg-muted" />
                            <div className="ml-4 space-y-2">
                                <Skeleton className="h-4 w-[250px] bg-muted" />
                                <Skeleton className="h-4 w-[200px] bg-muted" />
                            </div>
                            <Skeleton className="ml-auto h-8 w-20 rounded-md bg-muted" />
                        </div>
                    ))}
                </div>
            </CardContent>
        );
    }
    if (upcomingAppointments.length === 0) {
        return (
            <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                <Calendar className="h-12 w-12 mb-4" />
                <p className="font-semibold">Aucun rendez-vous à venir.</p>
                <p className="text-sm">Planifiez votre prochain service dès maintenant.</p>
                <Button asChild variant="secondary" className="mt-4">
                    <Link href="/agenda">Planifier un RDV</Link>
                </Button>
            </CardContent>
        );
    }
    return (
        <CardContent className="space-y-6">
            {upcomingAppointments.map(app => (
                <div key={app.id} className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center p-2 rounded-md bg-muted aspect-square h-14 text-center">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {format(parseISO(app.date), 'MMM', { locale: fr })}
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                            {format(parseISO(app.date), 'd')}
                        </span>
                    </div>
                    <div className="flex-grow">
                        <p className="font-semibold text-foreground">{app.clientName}</p>
                        <p className="text-sm text-muted-foreground">{app.serviceName}</p>
                        <p className="text-sm text-muted-foreground">{app.startTime} - {app.endTime}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/agenda?date=${app.date}`}>
                            Voir
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            ))}
        </CardContent>
    );
  }

  // Final component structure
  return (
    <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Tableau de Bord</h1>
                <p className="text-muted-foreground">Aperçu rapide de votre activité.</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <h3 className="text-lg font-semibold text-foreground mb-2">Actions rapides</h3>
              <Button
                onClick={handleAIPrompt}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Demander à l’IA
              </Button>
            </div>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Rendez-vous à venir
                </CardTitle>
                <CardDescription>
                    Vos 5 prochains rendez-vous planifiés.
                </CardDescription>
            </CardHeader>
            {renderUpcomingAppointments()}
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {renderStatCards()}
        </div>

    </div>
  );
}
