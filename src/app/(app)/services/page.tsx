import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, Edit3, Trash2 } from "lucide-react";

// Mock service data
const services = [
  { id: "SERV001", name: "Nettoyage Standard Résidentiel", category: "Nettoyage Résidentiel", rate: "CAD$50/heure", unit: "heure", description: "Nettoyage de base pour appartements et maisons." },
  { id: "SERV002", name: "Grand Ménage de Printemps", category: "Nettoyage Résidentiel", rate: "CAD$250", unit: "forfait", description: "Nettoyage en profondeur de toutes les pièces." },
  { id: "SERV003", name: "Nettoyage de Bureaux", category: "Nettoyage Commercial", rate: "CAD$0.15/m²", unit: "m²", description: "Entretien régulier des locaux professionnels." },
  { id: "SERV004", name: "Nettoyage Après Chantier", category: "Nettoyage Spécialisé", rate: "Devis", unit: "sur devis", description: "Remise en état après travaux de construction ou rénovation." },
  { id: "SERV005", name: "Lavage de Vitres", category: "Nettoyage Spécialisé", rate: "CAD$5/fenêtre", unit: "fenêtre", description: "Nettoyage intérieur et extérieur des vitres." },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Liste des Services</h1>
          <p className="text-primary-foreground">Gérez vos services prédéfinis et leurs tarifs associés.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Service
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Services Proposés</CardTitle>
          <CardDescription>Ajoutez, modifiez ou supprimez des services de votre catalogue.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un service par nom ou catégorie..." className="pl-8 w-full sm:w-1/2 lg:w-1/3" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Service</TableHead>
                <TableHead className="hidden sm:table-cell">Catégorie</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead className="hidden md:table-cell">Unité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{service.category}</TableCell>
                  <TableCell>{service.rate}</TableCell>
                  <TableCell className="hidden md:table-cell">{service.unit}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions pour {service.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add pagination if many services */}
    </div>
  );
}
