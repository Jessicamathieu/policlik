"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, Users, Calendar, DollarSign, FileText, CalendarPlus, UserPlus, FilePlus } from "lucide-react";
import Link from "next/link";
import { type Appointment } from "@/lib/data";
import { getAppointmentsForUser } from "@/services/appointment-service";
import { getClients } from "@/services/client-service";
import { getInvoices } from "@/services/invoice-service";
import type { Invoice } from "@/lib/data";
import { format, isFuture, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/context/auth-context";
import { TaskCard } from "@/components/dashboard/task-card";

// Main component
export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clientCount: 0, monthlyRevenue: 0, pendingInvoices: 0 });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
         <div key={index} className="flex overflow-hidden rounded-xl bg-card shadow-lg">
            <div className="w-2 bg-muted"></div>
            <div className="flex-1 p-6">
                <div className="mb-4 h-8 w-32 rounded-full bg-muted" />
                <div className="mt-2 space-y-2">
                    <Skeleton className="h-10 w-3/5 bg-muted" />
                    <Skeleton className="h-4 w-4/5 bg-muted" />
                </div>
            </div>
        </div>
      ));
    }
    return (
        <>
            <div className="flex overflow-hidden rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="w-2 bg-[#2743e3]"></div>
                <div className="flex-1 bg-card p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#2743e3] px-3 py-1 text-sm font-bold text-white">
                        <DollarSign className="h-4 w-4" />
                        <span>Revenu</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-4xl font-bold text-card-foreground">CAD${stats.monthlyRevenue.toFixed(2)}</div>
                        <p className="text-sm text-muted-foreground mt-1">Basé sur les factures payées du mois</p>
                    </div>
                </div>
            </div>
            <div className="flex overflow-hidden rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="w-2 bg-[#0ccc34]"></div>
                <div className="flex-1 bg-card p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0ccc34] px-3 py-1 text-sm font-bold text-white">
                        <Users className="h-4 w-4" />
                        <span>Clients</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-4xl font-bold text-card-foreground">+{stats.clientCount}</div>
                        <p className="text-sm text-muted-foreground mt-1">Nombre total de clients</p>
                    </div>
                </div>
            </div>
            <div className="flex overflow-hidden rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
                <div className="w-2 bg-[#fb9026]"></div>
                <div className="flex-1 bg-card p-6">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fb9026] px-3 py-1 text-sm font-bold text-white">
                        <FileText className="h-4 w-4" />
                        <span>Factures</span>
                    </div>
                    <div className="mt-2">
                        <div className="text-4xl font-bold text-card-foreground">{stats.pendingInvoices} en attente</div>
                        <p className="text-sm text-muted-foreground mt-1">Factures non payées</p>
                    </div>
                </div>
            </div>
        </>
    );
  };
  
  const renderUpcomingAppointments = () => {
    if (isLoading) {
        return (
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
        );
    }
    if (upcomingAppointments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                <Calendar className="h-12 w-12 text-primary" />
                <p className="font-semibold">Aucun rendez-vous à venir.</p>
                <p className="text-sm">Planifiez votre prochain service dès maintenant.</p>
                <Button asChild variant="secondary" className="mt-4">
                    <Link href="/agenda">Planifier un RDV</Link>
                </Button>
            </div>
        );
    }
    return (
        <div className="space-y-6">
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
        </div>
    );
  }

  // Ajout d'un filtre pour les tâches du jour
  const today = new Date();
  const todayTasks = upcomingAppointments.filter(app => {
    const appDate = parseISO(app.date);
    return isToday(appDate);
  });
  const weekTasks = upcomingAppointments.filter(app => {
    const appDate = parseISO(app.date);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    return appDate >= startOfWeek && appDate <= endOfWeek;
  });

  // Final component structure
  return (
    <div className="flex flex-col gap-8">
      {/* Section Tâches du jour/semaine */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Tâches du jour</h2>
        <div className="space-y-4">
          {todayTasks.length === 0 ? (
            <div className="text-muted-foreground">Aucune tâche aujourd'hui.</div>
          ) : (
            todayTasks.map(app => <TaskCard key={app.id} appointment={app} />)
          )}
        </div>
        <h2 className="text-xl font-bold text-primary mt-8 mb-2">Tâches de la semaine</h2>
        <div className="space-y-4">
          {weekTasks.length === 0 ? (
            <div className="text-muted-foreground">Aucune tâche cette semaine.</div>
          ) : (
            weekTasks.map(app => <TaskCard key={app.id} appointment={app} />)
          )}
        </div>
      </div>
      <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Tableau de Bord</h1>
          <p className="text-muted-foreground">Aperçu rapide de votre activité.</p>
          <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
      </div>

      <div className="flex overflow-hidden rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="w-2 bg-[#2743e3]"></div>
          <div className="flex-1 bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#2743e3] px-3 py-1 text-sm font-bold text-white">
                      <Calendar className="h-4 w-4" />
                      <span>Rendez-vous à venir</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                      <Button asChild variant="outline" className="bg-card hover:bg-muted text-foreground">
                          <Link href="/agenda" className="flex items-center">
                              <CalendarPlus className="mr-2 h-4 w-4 text-primary" />
                              Nouveau RDV
                          </Link>
                      </Button>
                      <Button asChild variant="outline" className="bg-card hover:bg-muted text-foreground">
                          <Link href="/clients" className="flex items-center">
                              <UserPlus className="mr-2 h-4 w-4 text-primary" />
                              Nouveau Client
                          </Link>
                      </Button>
                      <Button asChild variant="outline" className="bg-card hover:bg-muted text-foreground">
                          <Link href="/factures/nouveau?type=facture">
                              <FilePlus className="mr-2 h-4 w-4 text-primary" />
                              Nouvelle Facture
                          </Link>
                      </Button>
                  </div>
              </div>
              
              <div className="mt-4">
                  {renderUpcomingAppointments()}
              </div>
          </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {renderStatCards()}
      </div>
    </div>
  );
}
