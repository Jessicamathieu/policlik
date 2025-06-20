
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Search, FileDown, Filter, Printer, CreditCard, Mail, FileText as FileTextIcon, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils";

type InvoiceStatus = "Brouillon" | "Envoyée" | "Payée" | "Non Payée" | "Partiellement Payée" | "En Retard";

// Status colors will be applied on top of the card's primary background.
// Ensure these have enough contrast or consider making them text colors if badges are transparent.
const statusColors: Record<InvoiceStatus, string> = {
  "Brouillon": "bg-gray-400 text-black border-gray-500", // Darker gray for visibility
  "Envoyée": "bg-blue-500 text-white border-blue-700",
  "Payée": "bg-green-500 text-white border-green-700",
  "Non Payée": "bg-yellow-400 text-black border-yellow-600", // Brighter yellow
  "Partiellement Payée": "bg-orange-400 text-black border-orange-600", // Brighter orange
  "En Retard": "bg-red-500 text-white border-red-700",
};


// Mock invoice data
const invoices = [
  { id: "FAC001", clientName: "Entreprise Alpha", dateEmission: new Date(2023, 10, 20), dateEcheance: new Date(2023, 11, 20), amount: 1500.00, status: "Payée" as InvoiceStatus },
  { id: "FAC002", clientName: "Société Beta", dateEmission: new Date(2023, 11, 1), dateEcheance: new Date(2023, 12, 1), amount: 950.50, status: "Envoyée" as InvoiceStatus },
  { id: "FAC003", clientName: "Organisation Gamma", dateEmission: new Date(2023, 9, 15), dateEcheance: new Date(2023, 10, 15), amount: 2500.75, status: "En Retard" as InvoiceStatus },
  { id: "FAC004", clientName: "Particulier Delta", dateEmission: new Date(2023, 11, 10), dateEcheance: new Date(2024, 0, 10), amount: 420.00, status: "Brouillon" as InvoiceStatus },
  { id: "FAC005", clientName: "Jean Dupont", dateEmission: new Date(2023, 10, 5), dateEcheance: new Date(2023, 11, 5), amount: 780.00, status: "Non Payée" as InvoiceStatus },
];


export default function FacturesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Gestion des Factures</h1>
          <p className="text-primary-foreground">Créez, suivez et gérez vos factures clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/factures/nouveau">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Facture
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Liste des Factures</CardTitle>
                <CardDescription>Suivez l'état de paiement de toutes vos factures.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-card-foreground opacity-50" />
                    <Input 
                      placeholder="Rechercher facture..." 
                      className="pl-8 w-full sm:w-auto bg-background border-input text-foreground placeholder:text-muted-foreground" 
                    />
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent> {/* Popover content, should remain light/dark based on its own theme */}
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.keys(statusColors).map(status => (
                            <SelectItem key={status} value={status.toLowerCase().replace(' ', '-')}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-primary-foreground/30">
                <TableHead className="text-primary-foreground/80">ID Facture</TableHead>
                <TableHead className="text-primary-foreground/80">Client</TableHead>
                <TableHead className="hidden sm:table-cell text-primary-foreground/80">Date Émission</TableHead>
                <TableHead className="hidden md:table-cell text-primary-foreground/80">Date Échéance</TableHead>
                <TableHead className="text-right text-primary-foreground/80">Montant</TableHead>
                <TableHead className="text-center text-primary-foreground/80">Statut</TableHead>
                <TableHead className="text-right text-primary-foreground/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-primary-foreground/20">
                  <TableCell className="font-medium">
                    <Link href={`/factures/${invoice.id}`} className="hover:underline text-primary-foreground">
                      {invoice.id}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{format(invoice.dateEmission, "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="hidden md:table-cell">{format(invoice.dateEcheance, "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-right">CAD${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("text-xs font-semibold", statusColors[invoice.status])}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions pour {invoice.id}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                         <DropdownMenuItem>
                           <Link href={`/factures/${invoice.id}`} className="flex items-center w-full">
                            <Printer className="mr-2 h-4 w-4" /> Voir / Imprimer
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Link href={`/factures/nouveau?invoiceId=${invoice.id}`} className="flex items-center w-full"> {/* TODO: Update to edit link */}
                            <FileTextIcon className="mr-2 h-4 w-4" /> Modifier
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Envoyer la facture ${invoice.id} par email.`)}>
                            <Mail className="mr-2 h-4 w-4" /> Envoyer par Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => alert(`Envoyer la facture ${invoice.id} par SMS.`)}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Envoyer par SMS
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" /> Enregistrer Paiement
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                            Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Add pagination if many invoices */}
        </CardContent>
      </Card>
    </div>
  );
}
