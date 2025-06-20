
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Search, FileDown, Filter, Eye, Receipt } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PaymentStatus = "Réussi" | "En attente" | "Échoué" | "Remboursé";
type PaymentMethod = "Carte de crédit" | "Virement bancaire" | "PayPal" | "Espèces";

const paymentStatusColors: Record<PaymentStatus, string> = {
  "Réussi": "bg-green-500 text-white border-green-700",
  "En attente": "bg-yellow-400 text-black border-yellow-600",
  "Échoué": "bg-red-500 text-white border-red-700",
  "Remboursé": "bg-purple-500 text-white border-purple-700",
};

// Mock payment data
const payments = [
  { id: "PAY001", invoiceId: "FAC001", clientName: "Entreprise Alpha", date: new Date(2023, 10, 20), amount: 1500.00, method: "Carte de crédit" as PaymentMethod, status: "Réussi" as PaymentStatus },
  { id: "PAY002", invoiceId: "FAC002", clientName: "Société Beta", date: new Date(2023, 11, 5), amount: 950.50, method: "Virement bancaire" as PaymentMethod, status: "En attente" as PaymentStatus },
  { id: "PAY003", invoiceId: "FAC00X", clientName: "Client Inconnu", date: new Date(2023, 9, 18), amount: 200.00, method: "PayPal" as PaymentMethod, status: "Échoué" as PaymentStatus },
  { id: "PAY004", invoiceId: "FAC005", clientName: "Jean Dupont", date: new Date(2023, 10, 10), amount: 780.00, method: "Carte de crédit" as PaymentMethod, status: "Réussi" as PaymentStatus },
  { id: "PAY005", invoiceId: "FAC001", clientName: "Entreprise Alpha", date: new Date(2023, 10, 25), amount: -100.00, method: "Carte de crédit" as PaymentMethod, status: "Remboursé" as PaymentStatus },
];

export default function PaiementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Suivi des Paiements</h1>
          <p className="text-primary-foreground">Consultez l'historique et le statut de tous les paiements.</p>
        </div>
         <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <FileDown className="mr-2 h-4 w-4" /> Exporter
          </Button>
      </div>

      <Card>
         <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>Historique des Paiements</CardTitle>
                <CardDescription>Suivez tous les paiements reçus et leur statut.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-card-foreground opacity-50" />
                    <Input 
                      placeholder="Rechercher paiement..." 
                      className="pl-8 w-full sm:w-auto bg-background border-input text-foreground placeholder:text-muted-foreground" 
                    />
                </div>
                 <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-[180px] bg-background border-input text-foreground">
                        <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.keys(paymentStatusColors).map(status => (
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
                <TableHead className="text-primary-foreground/80">Date</TableHead>
                <TableHead className="text-primary-foreground/80">Client</TableHead>
                <TableHead className="hidden sm:table-cell text-primary-foreground/80">Facture ID</TableHead>
                <TableHead className="hidden md:table-cell text-primary-foreground/80">Méthode</TableHead>
                <TableHead className="text-right text-primary-foreground/80">Montant</TableHead>
                <TableHead className="text-center text-primary-foreground/80">Statut</TableHead>
                <TableHead className="text-right text-primary-foreground/80">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="border-primary-foreground/20">
                  <TableCell>{format(payment.date, "dd MMM yyyy", { locale: fr })}</TableCell>
                  <TableCell className="font-medium">{payment.clientName}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                     <Link href={`/factures/${payment.invoiceId}`} className="hover:underline text-primary-foreground">
                        {payment.invoiceId}
                     </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{payment.method}</TableCell>
                  <TableCell className={`text-right font-semibold ${payment.amount < 0 ? 'text-red-400' : 'text-green-400'}`}> {/* Adjusted for visibility on primary bg */}
                    CAD${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("text-xs", paymentStatusColors[payment.status])}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions pour paiement {payment.id}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> Voir Détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Link href={`/factures/${payment.invoiceId}`} className="flex items-center w-full">
                            <Receipt className="mr-2 h-4 w-4" /> Voir Facture Associée
                           </Link>
                        </DropdownMenuItem>
                        {/* Add more actions like "Rembourser", "Envoyer reçu" etc. */}
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
