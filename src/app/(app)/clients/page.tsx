import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, FileDown } from "lucide-react";
import Link from "next/link";

// Mock client data
const clients = [
  { id: "1", name: "Jean Dupont", email: "jean.dupont@example.com", phone: "0123456789", address: "123 Rue Principale, 75001 Paris", lastService: "2023-10-15", totalSpent: "CAD$1,250" },
  { id: "2", name: "Marie Curie", email: "marie.curie@example.com", phone: "0987654321", address: "456 Avenue des Sciences, 69007 Lyon", lastService: "2023-11-01", totalSpent: "CAD$875" },
  { id: "3", name: "Pierre Martin", email: "pierre.martin@example.com", phone: "0612345678", address: "789 Boulevard Liberté, 13001 Marseille", lastService: "2023-09-20", totalSpent: "CAD$2,100" },
  { id: "4", name: "Sophie Dubois", email: "sophie.dubois@example.com", phone: "0765432109", address: "10 Rue de la Paix, 33000 Bordeaux", lastService: "2023-11-10", totalSpent: "CAD$550" },
];

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Gestion des Clients</h1>
          <p className="text-muted-foreground">Consultez et gérez votre base de données clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Client
          </Button>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription>Recherchez, filtrez et gérez vos clients.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher un client par nom, email, adresse..." className="pl-8 w-full sm:w-1/2 lg:w-1/3" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead className="hidden md:table-cell text-right">Total Dépensé</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <Link href={`/clients/${client.id}`} className="hover:underline text-primary">
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell className="hidden md:table-cell text-right">{client.totalSpent}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ouvrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                           <Link href={`/clients/${client.id}/modifier`}>Modifier</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Link href={`/agenda?clientId=${client.id}&action=nouveau`}>Nouveau RDV</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Link href={`/factures?clientId=${client.id}&action=nouvelle`}>Nouvelle Facture</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add pagination if many clients */}
    </div>
  );
}
