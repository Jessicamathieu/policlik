
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, CalendarPlus, FilePlus, Trash2, Phone, MapPin, Mail as MailIcon } from 'lucide-react';
import type { Client } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ClientCardProps {
  client: Client;
  isPrimaryColor: boolean;
}

export function ClientCard({ client, isPrimaryColor }: ClientCardProps) {
  const headerClasses = cn(
    "flex flex-row items-start justify-between space-y-0 p-4 border-b transition-colors duration-300",
    isPrimaryColor ? "bg-primary text-primary-foreground" : "bg-muted/30 text-foreground"
  );

  const titleLinkClasses = cn(
    isPrimaryColor ? "text-primary-foreground hover:underline" : "text-foreground hover:text-primary"
  );

  const emailLinkClasses = cn(
    "text-xs flex items-center gap-1",
    isPrimaryColor ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-muted-foreground hover:text-primary"
  );
  
  const dropdownTriggerClasses = cn(
    "h-8 w-8 -mt-1 -mr-1",
    isPrimaryColor ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/20" : "text-muted-foreground hover:bg-muted"
  );

  return (
    <Card 
      className="flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl overflow-hidden bg-background border text-foreground"
    >
      <CardHeader className={headerClasses}>
        <div>
          <CardTitle className="text-lg font-semibold leading-tight">
            <Link href={`/clients/${client.id}`} className={titleLinkClasses}>
              {client.name}
            </Link>
          </CardTitle>
          {client.email && (
             <Link href={`mailto:${client.email}`} className={emailLinkClasses}>
               <MailIcon className="h-3 w-3"/> {client.email}
             </Link>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className={dropdownTriggerClasses}>
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Ouvrir menu pour {client.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end"> 
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
      <CardContent className="p-4 text-sm space-y-2.5 flex-grow text-foreground">
        {client.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2.5 text-muted-foreground" />
            <Link href={`tel:${client.phone}`} className="hover:text-primary">{client.phone}</Link>
          </div>
        )}
        {client.address && (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2.5 mt-0.5 text-muted-foreground shrink-0" />
            <Link 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(client.address)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 hover:text-primary"
            >
              {client.address}
            </Link>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 text-sm border-t"> 
        <div className="flex items-center justify-between w-full text-foreground">
          <span className="text-muted-foreground">Total Dépensé:</span>
          <span className="font-semibold">CAD${client.totalSpent.toFixed(2)}</span>
        </div>
      </CardFooter>
      {client.lastService && (
        <CardFooter className="p-4 text-xs border-t bg-muted/50 text-muted-foreground"> 
            Dernier service : {client.lastService}
        </CardFooter>
      )}
    </Card>
  );
}


export function ClientCardSkeleton() {
  return (
    <Card className="flex flex-col shadow-md rounded-xl overflow-hidden bg-background border text-foreground">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 bg-muted/30 border-b">
        <div>
          <Skeleton className="h-6 w-3/5 mb-2 bg-muted" />
          <Skeleton className="h-4 w-4/5 bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm space-y-3 flex-grow">
        <Skeleton className="h-5 w-full bg-muted" />
        <Skeleton className="h-5 w-full bg-muted" />
      </CardContent>
      <CardFooter className="p-4 bg-muted/30 text-sm border-t">
        <Skeleton className="h-5 w-full bg-muted" />
      </CardFooter>
    </Card>
  );
}
