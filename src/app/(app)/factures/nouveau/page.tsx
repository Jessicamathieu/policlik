
"use client";

import { DocumentForm } from "@/components/factures/invoice-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react';


function NouveauDocumentPageComponent() {
    const searchParams = useSearchParams();
    const isQuote = searchParams.get('type') === 'devis';
    const title = isQuote ? 'Créer un Nouveau Devis' : 'Créer une Nouvelle Facture';
    const description = isQuote ? 'Remplissez les informations ci-dessous pour générer un nouveau devis.' : 'Remplissez les informations ci-dessous pour générer une nouvelle facture.';

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl">
                <CardHeader>
                <CardTitle className="text-2xl font-headline">{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
                </CardHeader>
                <CardContent>
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
