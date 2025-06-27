
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Building, Bell, ShieldCheck, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Gérez les paramètres de votre compte et de l'application.</p>
        <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6 bg-muted text-muted-foreground"> 
          <TabsTrigger value="profile"><UserCircle className="mr-2 h-4 w-4 inline-block" />Profil</TabsTrigger>
          <TabsTrigger value="organization"><Building className="mr-2 h-4 w-4 inline-block" />Organisation</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 inline-block" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><ShieldCheck className="mr-2 h-4 w-4 inline-block" />Sécurité</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4 inline-block" />Apparence</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-md bg-card text-card-foreground"> 
            <CardHeader>
              <CardTitle className="text-card-foreground">Paramètres du Profil</CardTitle>
              <CardDescription className="opacity-75">Mettez à jour vos informations personnelles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">Nom complet</Label>
                <Input id="name" defaultValue="Utilisateur Test" className="bg-background text-foreground placeholder:text-muted-foreground border-input"/> 
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Adresse e-mail</Label>
                <Input id="email" type="email" defaultValue="test@example.com" className="bg-background text-foreground placeholder:text-muted-foreground border-input"/> 
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization">
          <Card className="shadow-md bg-card text-card-foreground"> 
            <CardHeader>
              <CardTitle className="text-card-foreground">Paramètres de l'Organisation</CardTitle>
              <CardDescription className="opacity-75">Gérez les informations de votre entreprise.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="orgName" className="text-card-foreground">Nom de l'entreprise</Label>
                <Input id="orgName" defaultValue="Polimik Inc." className="bg-background text-foreground placeholder:text-muted-foreground border-input"/> 
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgAddress" className="text-card-foreground">Adresse</Label>
                <Input id="orgAddress" defaultValue="123 Rue de l'Exemple, 75000 Paris" className="bg-background text-foreground placeholder:text-muted-foreground border-input"/> 
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sauvegarder les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
            <Card className="bg-card text-card-foreground"> 
                <CardHeader>
                    <CardTitle className="text-card-foreground">Préférences de Notification</CardTitle>
                    <CardDescription className="opacity-75">Configurez comment vous recevez les alertes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-card-foreground opacity-75">Paramètres de notification à venir.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="security">
            <Card className="bg-card text-card-foreground"> 
                <CardHeader>
                    <CardTitle className="text-card-foreground">Sécurité du Compte</CardTitle>
                    <CardDescription className="opacity-75">Gérez votre mot de passe et les options de sécurité.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-card-foreground opacity-75">Options de sécurité (changement de mot de passe, 2FA) à venir.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="appearance">
            <Card className="bg-card text-card-foreground"> 
                <CardHeader>
                    <CardTitle className="text-card-foreground">Apparence</CardTitle>
                    <CardDescription className="opacity-75">Personnalisez l'apparence de l'application.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-card-foreground opacity-75">Options de thème (Clair/Sombre) à venir.</p>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
