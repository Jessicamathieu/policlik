
import { InvoiceForm } from "@/components/factures/invoice-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NouvelleFacturePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Créer une Nouvelle Facture</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour générer une nouvelle facture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
