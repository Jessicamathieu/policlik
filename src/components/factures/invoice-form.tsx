
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, PlusCircle, Trash2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

// Mock data (replace with actual data fetching)
const mockClients = [
  { id: "1", name: "Jean Dupont", email: "jean.dupont@example.com" },
  { id: "2", name: "Marie Curie", email: "marie.curie@example.com" },
  { id: "3", name: "Pierre Martin", email: "pierre.martin@example.com" },
  { id: "4", name: "Entreprise Alpha", email: "contact@alpha.com" },
  { id: "5", name: "Société Beta", email: "info@beta.org" },
];

const mockServices = [
  { id: "SERV001", name: "Nettoyage Standard Résidentiel", price: 50 },
  { id: "SERV002", name: "Grand Ménage de Printemps", price: 250 },
  { id: "SERV003", name: "Nettoyage de Bureaux", price: 0.15 }, // per m², example
  { id: "SERV005", name: "Lavage de Vitres", price: 5 }, // per window
  { id: "PROD001", name: "Produit Nettoyant XYZ", price: 15 },
];

const lineItemSchema = z.object({
  serviceId: z.string().min(1, "Veuillez sélectionner un service/produit."),
  description: z.string().min(1, "La description est requise.").max(200),
  quantity: z.coerce.number().min(0.01, "La quantité doit être supérieure à 0."),
  unitPrice: z.coerce.number().min(0, "Le prix unitaire ne peut être négatif."),
});

const invoiceSchema = z.object({
  invoiceId: z.string().min(1, "L'ID de la facture est requis.").default(`FAC-${Date.now().toString().slice(-6)}`),
  clientId: z.string().min(1, "Veuillez sélectionner un client."),
  issueDate: z.date({ required_error: "La date d'émission est requise." }),
  dueDate: z.date({ required_error: "La date d'échéance est requise." }),
  lineItems: z.array(lineItemSchema).min(1, "Au moins une ligne de facture est requise."),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0), // Tax rate in percentage
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function InvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [clientSearch, setClientSearch] = React.useState("");

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceId: `FAC-${Date.now().toString().slice(-6)}`,
      clientId: searchParams.get("clientId") || "",
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      lineItems: [{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
      taxRate: 0, // Default no tax
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchLineItems = form.watch("lineItems");
  const watchTaxRate = form.watch("taxRate");

  const subtotal = React.useMemo(() => {
    return watchLineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0);
  }, [watchLineItems]);

  const taxes = React.useMemo(() => {
    return subtotal * ((watchTaxRate || 0) / 100);
  }, [subtotal, watchTaxRate]);

  const total = React.useMemo(() => {
    return subtotal + taxes;
  }, [subtotal, taxes]);

  async function onSubmit(data: InvoiceFormValues) {
    setIsLoading(true);
    console.log("Données de la facture:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: "Facture Créée",
      description: `La facture ${data.invoiceId} pour ${mockClients.find(c=>c.id === data.clientId)?.name} a été sauvegardée.`,
    });
    router.push("/factures");
  }

  const handleServiceChange = (index: number, serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    if (service) {
      update(index, {
        ...watchLineItems[index],
        serviceId: service.id,
        description: service.name,
        unitPrice: service.price,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="invoiceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID de la Facture</FormLabel>
                <FormControl>
                  <Input placeholder="FAC-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <div className="p-2">
                        <Input 
                        placeholder="Rechercher client..." 
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="mb-2"
                        />
                    </div>
                    {filteredClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
           <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d'Émission</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date d'Échéance</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Line Items Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium font-headline">Lignes de Facture</h3>
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-x-4 gap-y-2 p-4 border rounded-md relative">
              <div className="col-span-12 md:col-span-3">
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.serviceId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>Service/Produit</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleServiceChange(index, value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockServices.map(service => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-4">
                 <FormField
                    control={form.control}
                    name={`lineItems.${index}.description`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className={cn(index !== 0 && "sr-only")}>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Description" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>
              <div className="col-span-6 md:col-span-1">
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>Qté</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1" {...field} step="0.01" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>Prix Unitaire</FormLabel>
                       <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <FormControl>
                            <Input type="number" placeholder="0.00" {...field} step="0.01" className="pl-7"/>
                        </FormControl>
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12 md:col-span-2 flex items-end">
                <p className="text-sm w-full text-right font-medium">
                  Total: CAD${((watchLineItems[index]?.quantity || 0) * (watchLineItems[index]?.unitPrice || 0)).toFixed(2)}
                </p>
              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 text-destructive hover:bg-destructive/10 h-7 w-7 md:top-1/2 md:-translate-y-1/2 md:right-[-45px]"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Supprimer ligne</span>
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ serviceId: "", description: "", quantity: 1, unitPrice: 0 })}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </div>

        {/* Totals Section */}
        <div className="space-y-2 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 text-right font-medium">Sous-total:</div>
                <div className="text-right">CAD${subtotal.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2 text-right font-medium flex items-center justify-end gap-2">
                    Taxe (%):
                    <FormField
                        control={form.control}
                        name="taxRate"
                        render={({ field }) => (
                            <FormItem className="w-20">
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} step="0.01" className="h-8 text-right" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="text-right">CAD${taxes.toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t pt-2 mt-2">
                <div className="col-span-2 text-right font-bold text-lg">Total Général:</div>
                <div className="text-right font-bold text-lg">CAD${total.toFixed(2)}</div>
            </div>
        </div>


        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes / Termes de Paiement</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex: Paiement dû sous 30 jours. Merci pour votre confiance."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/factures')}>
                Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : "Sauvegarder la Facture"}
            </Button>
        </div>
      </form>
    </Form>
  );
}
