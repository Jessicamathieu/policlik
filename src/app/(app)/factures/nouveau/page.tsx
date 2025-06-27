
"use client";

import { DocumentForm } from "@/components/factures/invoice-form";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';


function NouveauDocumentPageComponent() {
    const searchParams = useSearchParams();
    const isQuote = searchParams.get('type') === 'devis';
    const title = isQuote ? 'Créer un Nouveau Devis' : 'Créer une Nouvelle Facture';
    const description = isQuote ? 'Remplissez les informations ci-dessous pour générer un nouveau devis.' : 'Remplissez les informations ci-dessous pour générer une nouvelle facture.';

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-headline">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
              <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
            </div>
            <Card className="shadow-xl">
                <CardContent className="pt-6">
                  <DocumentForm />
                </CardContent>
            </Card>
        </div>
    );
}


export default function NouveauDocumentPage() {
    return (
        <Suspense fallback={<div>Chargement du formulaire...</div>}>
            <NouveauDocumentPageComponent />
        </Suspense>
    )
}
