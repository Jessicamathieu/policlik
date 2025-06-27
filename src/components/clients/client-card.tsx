
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, CalendarPlus, FilePlus, Trash2, Phone, MapPin, Mail as MailIcon } from 'lucide-react';
import type { Client } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';

interface ClientCardProps {
  client: Client;
  onDelete: (clientId: string) => void;
}

export function ClientCard({ client, onDelete }: ClientCardProps) {
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  return (
    <>
      <Card 
        className="flex flex-col transition-all duration-300"
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 border-b">
          <div>
            <CardTitle className="text-lg font-semibold leading-tight">
              <Link href={`/clients/${client.id}`} className="hover:text-primary">
                {client.name}
              </Link>
            </CardTitle>
            {client.email && (
               <Link href={`mailto:${client.email}`} className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary">
                 <MailIcon className="h-3 w-3 text-primary"/> {client.email}
               </Link>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-1 text-muted-foreground hover:bg-muted">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Ouvrir menu pour {client.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end"> 
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/clients/${client.id}/modifier`} className="flex items-center cursor-pointer">
                  <Edit className="mr-2 h-4 w-4 text-primary" /> Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href={`/agenda?clientId=${client.id}&action=nouveau`} className="flex items-center cursor-pointer">
                  <CalendarPlus className="mr-2 h-4 w-4 text-primary" /> Nouveau RDV
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                 <Link href={`/factures/nouveau?clientId=${client.id}`} className="flex items-center cursor-pointer">
                   <FilePlus className="mr-2 h-4 w-4 text-primary" /> Nouvelle Facture
                 </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive-foreground focus:bg-destructive flex items-center cursor-pointer"
                onClick={() => setIsDeleteAlertOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 text-sm space-y-2.5 flex-grow">
          {client.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2.5 text-primary" />
              <Link href={`tel:${client.phone}`} className="hover:text-primary">{client.phone}</Link>
            </div>
          )}
          {client.address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2.5 mt-0.5 text-primary shrink-0" />
              <Link 
                href={`https://maps.google.com/?q=${encodeURIComponent(client.address)}`} 
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
          <div className="flex items-center justify-between w-full">
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
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le client "{client.name}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(client.id)} className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


export function ClientCardSkeleton() {
  return (
    <div className="card-dynamic-border">
      <div className="p-4 border-b flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 bg-muted" />
          <Skeleton className="h-4 w-40 bg-muted" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md bg-muted" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-full bg-muted" />
        <Skeleton className="h-5 w-4/5 bg-muted" />
      </div>
      <div className="p-4 border-t">
        <Skeleton className="h-5 w-1/2 bg-muted" />
      </div>
    </div>
  );
}
