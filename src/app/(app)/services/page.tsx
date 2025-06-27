
"use client";

import { useState, useEffect, useMemo, useCallback, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, Edit3, Trash2, FileDown, Upload, ArrowUpDown, Briefcase, Package } from "lucide-react";
import { type Service, type Product } from "@/lib/data";
import { getServices } from "@/services/service-service";
import { getProducts } from "@/services/product-service";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useSortableData } from "@/hooks/use-sortable-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ImportServicesModal = lazy(() => 
  import("@/components/services/import-services-modal").then(module => ({ default: module.ImportServicesModal }))
);
const ImportProduitsModal = lazy(() => 
  import("@/components/produits/import-produits-modal").then(module => ({ default: module.ImportProduitsModal }))
);

type CatalogueItem = (Service | Product) & { itemType: 'Service' | 'Produit' };

export default function CataloguePage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportServiceModalOpen, setIsImportServiceModalOpen] = useState(false);
  const [isImportProduitModalOpen, setIsImportProduitModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedServices, fetchedProducts] = await Promise.all([
        getServices(),
        getProducts()
      ]);
      
      const servicesWithType: CatalogueItem[] = fetchedServices.map(s => ({ ...s, itemType: 'Service' }));
      const productsWithType: CatalogueItem[] = fetchedProducts.map(p => ({ ...p, itemType: 'Produit' }));

      setItems([...servicesWithType, ...productsWithType]);

    } catch (error) {
      console.error("Échec de la récupération du catalogue:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger le catalogue de services et produits.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleImportSuccess = useCallback(() => {
    fetchItems();
    setIsImportServiceModalOpen(false);
    setIsImportProduitModalOpen(false);
  }, [fetchItems]);

  const filteredItems = useMemo(() => items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ('code' in item && item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.subCategory && item.subCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [items, searchTerm]);

  const { items: sortedItems, requestSort, sortConfig } = useSortableData(filteredItems, { key: 'name', direction: 'ascending' });
  
  const getSortIndicator = (key: keyof CatalogueItem | 'price' | 'code') => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-primary/50" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const renderTableContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-5 w-24 bg-muted" /></TableCell>
          <TableCell><Skeleton className="h-5 w-4/5 bg-muted" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 bg-muted" /></TableCell>
          <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-3/5 bg-muted" /></TableCell>
          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-3/5 bg-muted" /></TableCell>
          <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24 bg-muted" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto bg-muted rounded-md" /></TableCell>
        </TableRow>
      ));
    }

    if (sortedItems.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Aucun service ou produit trouvé. Commencez par en ajouter ou en importer.
                </TableCell>
            </TableRow>
        );
    }

    return sortedItems.map((item) => (
      <TableRow key={`${item.itemType}-${item.id}`} className="border-b-border">
        <TableCell>
          <Badge variant="outline" className={cn('font-medium', item.itemType === 'Service' ? 'border-sky-300 text-sky-800 bg-sky-50' : 'border-lime-300 text-lime-800 bg-lime-50')}>
            {item.itemType === 'Service' ? <Briefcase className="mr-1 h-3 w-3" /> : <Package className="mr-1 h-3 w-3" />}
            {item.itemType}
          </Badge>
        </TableCell>
        <TableCell className="font-medium text-foreground">{item.name}</TableCell>
        <TableCell className="text-muted-foreground">{'code' in item && item.code ? item.code : 'N/A'}</TableCell>
        <TableCell className="hidden sm:table-cell text-foreground">{item.category}</TableCell>
        <TableCell className="hidden md:table-cell text-foreground">{item.subCategory || '-'}</TableCell>
        <TableCell className="hidden lg:table-cell text-foreground font-semibold">{item.price ? `CAD$${item.price.toFixed(2)}` : '-'}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost" className="text-muted-foreground hover:bg-muted/50">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions pour {item.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"> 
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Edit3 className="mr-2 h-4 w-4 text-primary" /> Modifier
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
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Catalogue</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de services et produits.</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground" onClick={() => setIsImportServiceModalOpen(true)}>
                <Upload className="mr-2 h-4 w-4" /> Importer Services
            </Button>
            <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground" onClick={() => setIsImportProduitModalOpen(true)}>
                <Upload className="mr-2 h-4 w-4" /> Importer Produits
            </Button>
            {isImportServiceModalOpen && (
              <Suspense fallback={null}>
                <ImportServicesModal
                  open={isImportServiceModalOpen}
                  onOpenChange={setIsImportServiceModalOpen}
                  onImportSuccess={handleImportSuccess}
                />
              </Suspense>
            )}
            {isImportProduitModalOpen && (
              <Suspense fallback={null}>
                <ImportProduitsModal 
                  open={isImportProduitModalOpen} 
                  onOpenChange={setIsImportProduitModalOpen} 
                  onImportSuccess={handleImportSuccess}
                />
              </Suspense>
            )}
            <Button variant="outline" className="text-foreground border-input hover:bg-accent hover:text-accent-foreground">
                <FileDown className="mr-2 h-4 w-4" /> Exporter
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Nouvel Article
            </Button>
        </div>
      </div>

      <Card className="shadow-md bg-card text-card-foreground"> 
        <CardHeader>
          <CardTitle className="text-card-foreground">Services & Produits</CardTitle>
          <CardDescription className="opacity-75">Consultez, modifiez ou supprimez des articles de votre catalogue.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary" />
            <Input 
                placeholder="Rechercher par nom, code ou catégorie..." 
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
                <TableHead className="w-[120px] text-muted-foreground">
                    <Button variant="ghost" onClick={() => requestSort('itemType')}>
                        Type {getSortIndicator('itemType')}
                    </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('name')}>
                    Nom {getSortIndicator('name')}
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">
                   <Button variant="ghost" onClick={() => requestSort('code' as any)}>
                    Code {getSortIndicator('code' as any)}
                  </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('category')}>
                    Catégorie {getSortIndicator('category')}
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('subCategory')}>
                    Sous-Catégorie {getSortIndicator('subCategory')}
                  </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-muted-foreground">
                  <Button variant="ghost" onClick={() => requestSort('price')}>
                    Prix {getSortIndicator('price')}
                  </Button>
                </TableHead>
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
