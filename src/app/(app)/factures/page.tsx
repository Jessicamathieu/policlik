
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

// Status colors will be applied on top of the card's dynamic background.
// These need to be highly contrasting.
const statusColors: Record<InvoiceStatus, string> = {
  "Brouillon": "bg-gray-500 text-white border-gray-700", 
  "Envoyée": "bg-sky-500 text-white border-sky-700",
  "Payée": "bg-emerald-500 text-white border-emerald-700",
  "Non Payée": "bg-amber-500 text-black border-amber-700",
  "Partiellement Payée": "bg-orange-500 text-white border-orange-700",
  "En Retard": "bg-rose-600 text-white border-rose-800",
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
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Gestion des Factures</h1>
          <p className="text-muted-foreground">Créez, suivez et gérez vos factures clients.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-foreground border-foreground/30 hover:bg-accent hover:text-accent-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/factures/nouveau">
              <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Facture
            </Link>
          </Button>
        </div>
      </div>

      <Card className="bg-card text-card-foreground"> {/* Card is now colored */}
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Liste des Factures</CardTitle>
                <CardDescription className="opacity-75">Suivez l'état de paiement de toutes vos factures.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-card-foreground opacity-50" />
                    <Input 
                      placeholder="Rechercher facture..." 
                      className="pl-8 w-full sm:w-auto bg-background border-input text-foreground placeholder:text-muted-foreground" /* Input is light */
                    />
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground"> {/* Select is light */}
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
              <TableRow className="border-card-foreground/30">
                <TableHead className="text-card-foreground opacity-80">ID Facture</TableHead>
                <TableHead className="text-card-foreground opacity-80">Client</TableHead>
                <TableHead className="hidden sm:table-cell text-card-foreground opacity-80">Date Émission</TableHead>
                <TableHead className="hidden md:table-cell text-card-foreground opacity-80">Date Échéance</TableHead>
                <TableHead className="text-right text-card-foreground opacity-80">Montant</TableHead>
                <TableHead className="text-center text-card-foreground opacity-80">Statut</TableHead>
                <TableHead className="text-right text-card-foreground opacity-80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-card-foreground/20">
                  <TableCell className="font-medium">
                    <Link href={`/factures/${invoice.id}`} className="hover:underline text-card-foreground">
                      {invoice.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-card-foreground">{invoice.clientName}</TableCell>
                  <TableCell className="hidden sm:table-cell text-card-foreground">{format(invoice.dateEmission, "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="hidden md:table-cell text-card-foreground">{format(invoice.dateEcheance, "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="text-right text-card-foreground">CAD${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("text-xs font-semibold border", statusColors[invoice.status])}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-card-foreground hover:bg-card-foreground/10">
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
                           <Link href={`/factures/nouveau?invoiceId=${invoice.id}`} className="flex items-center w-full">
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
        </CardContent>
      </Card>
    </div>
  );
}
