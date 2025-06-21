
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Users, Calendar, DollarSign, PlusCircle, FileText } from "lucide-react";
import Link from "next/link";
import { getAppointments, getInvoices, type Appointment, type Invoice } from "@/lib/data";
import { getClients } from "@/services/client-service";
import { format, isFuture, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

// Main component
export default function DashboardPage() {
  const [stats, setStats] = useState({ clientCount: 0, monthlyRevenue: 0, pendingInvoices: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Use Promise.all to fetch data in parallel
        const [clients, allAppointments, allInvoices] = await Promise.all([
          getClients(),
          getAppointments(),
          getInvoices()
        ]);

        // Calculate stats
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

        // Filter upcoming appointments
        const upcoming = allAppointments
          .filter(app => {
            const appDate = parseISO(app.date);
            return isToday(appDate) || isFuture(appDate);
          })
          .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime() || a.startTime.localeCompare(b.startTime))
          .slice(0, 5); // Limit to 5 for the dashboard view

        setUpcomingAppointments(upcoming);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // In a real app, you might set an error state and show a toast notification
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <Button asChild>
                <Link href="/factures/nouveau?type=facture"><PlusCircle className="mr-2 h-4 w-4" />Créer une Facture</Link>
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {renderStatCards()}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Rendez-vous à venir</CardTitle>
                    <CardDescription>
                        Vos 5 prochains rendez-vous planifiés.
                    </CardDescription>
                </CardHeader>
                {renderUpcomingAppointments()}
            </Card>

            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button asChild variant="secondary" className="justify-start text-base py-6">
                        <Link href="/clients/nouveau">
                            <Users className="mr-2 h-5 w-5"/> Nouveau Client
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="justify-start text-base py-6">
                        <Link href="/agenda">
                           <Calendar className="mr-2 h-5 w-5"/> Planifier un RDV
                        </Link>
                    </Button>
                    <Button asChild variant="secondary" className="justify-start text-base py-6">
                        <Link href="/factures/nouveau?type=devis">
                           <FileText className="mr-2 h-5 w-5"/> Créer un Devis
                        </Link>
                    </Button>
                     <Button asChild variant="secondary" className="justify-start text-base py-6">
                        <Link href="/depenses">
                           <DollarSign className="mr-2 h-5 w-5"/> Nouvelle Dépense
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
