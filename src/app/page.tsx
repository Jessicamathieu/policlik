import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Optimisez Votre Gestion d'Entreprise avec Polimik Gestion
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Une solution complète pour la planification, la facturation, et le suivi client, conçue pour les entreprises de services.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Link href="/login">Commencer</Link>
                  </Button>
                  {/* <Button asChild variant="outline" size="lg">
                    <Link href="#features">En Savoir Plus</Link>
                  </Button> */}
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Polimik Gestion Dashboard"
                data-ai-hint="business dashboard"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-semibold">
                  Fonctionnalités Clés
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Tout ce dont vous avez besoin, au même endroit.
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  De la prise de rendez-vous à la facturation, Polimik Gestion simplifie vos opérations quotidiennes.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {[
                { title: "Agenda Intuitif", description: "Planifiez et visualisez vos rendez-vous facilement." },
                { title: "Gestion Clients", description: "Base de données complète avec historique des services." },
                { title: "Devis et Facturation", description: "Créez des devis professionnels et facturez en quelques clics." },
                { title: "Suivi des Dépenses", description: "Gardez un œil sur vos dépenses professionnelles." },
                { title: "Rapports Détaillés", description: "Analysez vos performances avec des rapports clairs." },
                { title: "Accessible Partout", description: "Application web réactive, utilisable sur tous vos appareils." },
              ].map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
