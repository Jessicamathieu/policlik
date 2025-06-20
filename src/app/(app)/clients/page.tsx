
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Search, FileDown, Edit, CalendarPlus, FilePlus, Trash2, Phone, MapPin, Mail as MailIcon } from "lucide-react";
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
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Clients</h1>
          <p className="text-muted-foreground">Consultez et gérez votre base de données clients.</p> {/* text-muted-foreground for text on white page bg */}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-foreground border-foreground/30 hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Client
          </Button>
        </div>
      </div>

      <Card className="bg-card text-card-foreground"> {/* Main card is now colored */}
        <CardHeader>
          <CardTitle>Liste des Clients</CardTitle>
          <CardDescription className="opacity-75">Recherchez, filtrez et gérez vos clients.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-card-foreground opacity-50" />
            <Input 
              placeholder="Rechercher un client par nom, email, adresse..." 
              className="pl-8 w-full sm:w-1/2 lg:w-1/3 bg-background border-input text-foreground placeholder:text-muted-foreground" /* Input remains light */
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <Card key={client.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow duration-200 rounded-xl overflow-hidden bg-card-foreground/10 border-card-foreground/20 text-card-foreground"> {/* Inner cards are lighter shade of card-foreground */}
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 bg-card-foreground/20"> {/* Header of inner card slightly darker */}
                  <div>
                    <CardTitle className="text-lg font-semibold leading-tight">
                      <Link href={`/clients/${client.id}`} className="hover:underline text-card-foreground">
                        {client.name}
                      </Link>
                    </CardTitle>
                    {client.email && (
                       <Link href={`mailto:${client.email}`} className="text-xs opacity-80 hover:opacity-100 flex items-center gap-1">
                         <MailIcon className="h-3 w-3"/> {client.email}
                       </Link>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-1 hover:bg-card-foreground/20 text-card-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Ouvrir menu pour {client.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end"> {/* Popover content, should remain light/dark based on its own theme */}
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/clients/${client.id}/modifier`} className="flex items-center cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                         <Link href={`/agenda?clientId=${client.id}&action=nouveau`} className="flex items-center cursor-pointer">
                          <CalendarPlus className="mr-2 h-4 w-4" /> Nouveau RDV
                         </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                         <Link href={`/factures/nouveau?clientId=${client.id}`} className="flex items-center cursor-pointer">
                           <FilePlus className="mr-2 h-4 w-4" /> Nouvelle Facture
                         </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive flex items-center cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-4 text-sm space-y-2.5 flex-grow text-card-foreground">
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2.5 opacity-80" />
                      <Link href={`tel:${client.phone}`} className="hover:opacity-80">{client.phone}</Link>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2.5 mt-0.5 opacity-80 shrink-0" />
                      <Link 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.address)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 hover:opacity-80"
                      >
                        {client.address}
                      </Link>
                    </div>
                  )}
                </CardContent>
                {client.totalSpent && (
                  <CardFooter className="p-4 bg-card-foreground/20 text-sm border-t border-card-foreground/30"> {/* Footer of inner card */}
                    <div className="flex items-center justify-between w-full text-card-foreground">
                      <span className="opacity-80">Total Dépensé:</span>
                      <span className="font-semibold">{client.totalSpent}</span>
                    </div>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
