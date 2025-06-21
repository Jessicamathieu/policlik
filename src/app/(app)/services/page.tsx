
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, Edit3, Trash2, FileDown, Upload } from "lucide-react";
import { type Service } from "@/lib/data";
import { getServices } from "@/services/service-service";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ImportServicesModal } from "@/components/services/import-services-modal";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const fetchedServices = await getServices();
      fetchedServices.sort((a, b) => a.name.localeCompare(b.name));
      setServices(fetchedServices);
    } catch (error) {
      console.error("Échec de la récupération des services:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger la liste des services. Vérifiez la configuration Firebase et votre connexion.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.subCategory && service.subCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderTableContent = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-5 w-4/5 bg-muted" /></TableCell>
          <TableCell><Skeleton className="h-5 w-3/5 bg-muted" /></TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-3/5 bg-muted" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-2/5 bg-muted" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto bg-muted rounded-md" /></TableCell>
        </TableRow>
      ));
    }

    if (filteredServices.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Aucun service trouvé. Commencez par ajouter ou importer des services.
                </TableCell>
            </TableRow>
        );
    }

    return filteredServices.map((service) => (
      <TableRow key={service.id} className="border-b-border">
        <TableCell className="font-medium text-foreground">{service.name}</TableCell>
        <TableCell className="text-foreground">{service.category}</TableCell>
        <TableCell className="hidden sm:table-cell text-foreground">{service.subCategory || '-'}</TableCell>
        <TableCell className="hidden md:table-cell text-foreground">{service.price ? `CAD$${service.price.toFixed(2)}` : '-'}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost" className="text-muted-foreground hover:bg-muted/50">
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
    ));
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Liste des Services</h1>
          <p className="text-muted-foreground">Gérez vos services prédéfinis et leurs tarifs associés.</p>
        </div>
        <div className="flex gap-2">
            <ImportServicesModal onImportSuccess={fetchServices}>
                <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
                    <Upload className="mr-2 h-4 w-4" /> Importer
                </Button>
            </ImportServicesModal>
            <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
                <FileDown className="mr-2 h-4 w-4" /> Exporter
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Service
            </Button>
        </div>
      </div>

      <Card className="shadow-md bg-card text-card-foreground"> 
        <CardHeader>
          <CardTitle className="text-card-foreground">Services Proposés</CardTitle>
          <CardDescription className="opacity-75">Ajoutez, modifiez ou supprimez des services de votre catalogue.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Rechercher un service par nom ou catégorie..." 
                className="pl-8 w-full sm:w-1/2 lg:w-1/3 bg-background text-foreground placeholder:text-muted-foreground border-input" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            /> 
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b-border">
                <TableHead className="text-muted-foreground">Nom du Service</TableHead>
                <TableHead className="text-muted-foreground">Catégorie</TableHead>
                <TableHead className="hidden sm:table-cell text-muted-foreground">Sous-Catégorie</TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">Prix</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableContent()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
