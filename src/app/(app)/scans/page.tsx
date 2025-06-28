"use client";

import React, { useState } from "react";
import Tesseract from "tesseract.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SheetData {
  dateService?: string;
  heure?: string;
  client?: string;
  adresse?: string;
  services?: string;
  prix?: string;
  notes?: string;
  paiement?: string;
}

const parseSheetText = (text: string): SheetData => {
  const lines = text.split(/\n|\r/).map(l => l.trim());
  const data: SheetData = {};
  const getVal = (label: RegExp) => {
    const line = lines.find(l => label.test(l));
    if (line) {
      const parts = line.split(/:|\-/);
      return parts.slice(1).join(":").trim();
    }
    return undefined;
  };
  data.dateService = getVal(/date/i);
  data.heure = getVal(/heure/i);
  data.client = getVal(/nom/i);
  data.adresse = getVal(/adresse/i);
  data.services = getVal(/services?/i);
  data.prix = getVal(/prix/i);
  data.notes = getVal(/info|notes?/i);
  data.paiement = getVal(/paiement|payment/i);
  return data;
};

export default function ScanPage() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [data, setData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setText("");
      setData(null);
    }
  };

  const runOCR = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await Tesseract.recognize(image, "fra");
      setText(result.data.text);
      setData(parseSheetText(result.data.text));
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur OCR", description: "Impossible de lire l'image." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">Numérisation Feuille</h1>
          <p className="text-muted-foreground">Téléversez une photo de la feuille remplie pour extraire les données.</p>
          <div className="mt-2 h-1 w-24 bg-primary rounded-full" />
        </div>
      </div>
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Importer une Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" capture="environment" onChange={handleFile} />
          <Button onClick={runOCR} disabled={!image || loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {loading ? "Lecture..." : "Lancer l'OCR"}
          </Button>
          {data && (
            <div className="grid gap-2">
              <Textarea value={text} className="h-32" readOnly />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Date</label>
                  <Input value={data.dateService || ""} onChange={e => setData({ ...data, dateService: e.target.value })} />
                </div>
                <div>
                  <label className="font-semibold">Heure</label>
                  <Input value={data.heure || ""} onChange={e => setData({ ...data, heure: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Client</label>
                  <Input value={data.client || ""} onChange={e => setData({ ...data, client: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Adresse</label>
                  <Input value={data.adresse || ""} onChange={e => setData({ ...data, adresse: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Services</label>
                  <Input value={data.services || ""} onChange={e => setData({ ...data, services: e.target.value })} />
                </div>
                <div>
                  <label className="font-semibold">Prix</label>
                  <Input value={data.prix || ""} onChange={e => setData({ ...data, prix: e.target.value })} />
                </div>
                <div>
                  <label className="font-semibold">Paiement</label>
                  <Input value={data.paiement || ""} onChange={e => setData({ ...data, paiement: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold">Notes</label>
                  <Textarea value={data.notes || ""} onChange={e => setData({ ...data, notes: e.target.value })} />
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Enregistrer</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

