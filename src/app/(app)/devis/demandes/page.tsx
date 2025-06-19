import { QuoteRequestForm } from "@/components/devis/quote-request-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuoteRequestPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-center font-headline">Demande de Devis en Ligne</h1>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Vos Informations</CardTitle>
          <CardDescription>
            Veuillez remplir ce formulaire pour obtenir un devis personnalisé. Nous vous répondrons dans les plus brefs délais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuoteRequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
