
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
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
import { getServices } from "@/services/service-service";
import { getProducts } from "@/services/product-service";
import { getClients } from "@/services/client-service";
import type { Service, Product, Client } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const lineItemSchema = z.object({
  serviceId: z.string().min(1, "Veuillez sélectionner un service/produit."),
  description: z.string().min(1, "La description est requise.").max(200),
  quantity: z.coerce.number().min(0.01, "La quantité doit être supérieure à 0."),
  unitPrice: z.coerce.number().min(0, "Le prix unitaire ne peut être négatif."),
});

const documentSchema = z.object({
  documentId: z.string().min(1, "L'ID du document est requis."),
  clientId: z.string().min(1, "Veuillez sélectionner un client."),
  issueDate: z.date({ required_error: "La date d'émission est requise." }),
  dueDate: z.date().optional(),
  lineItems: z.array(lineItemSchema).min(1, "Au moins une ligne est requise."),
  notes: z.string().optional(),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

type ItemForInvoice = {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'Service' | 'Produit';
};

export function DocumentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [clientSearch, setClientSearch] = React.useState("");
  const [availableItems, setAvailableItems] = React.useState<ItemForInvoice[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  
  const initialType = searchParams.get("type") === "devis" ? "quote" : "invoice";
  const [documentType, setDocumentType] = React.useState<'invoice' | 'quote'>(initialType);

  React.useEffect(() => {
    const fetchItemsAndClients = async () => {
        try {
            const [services, products, fetchedClients] = await Promise.all([
                getServices(),
                getProducts(),
                getClients()
            ]);
            
            const formattedServices: ItemForInvoice[] = services.map(s => ({
                id: `service-${s.id}`,
                name: s.name,
                description: s.name,
                price: s.price || 0,
                type: 'Service'
            }));
            
            const formattedProducts: ItemForInvoice[] = products.map(p => ({
                id: `product-${p.id}`,
                name: p.name,
                description: p.name,
                price: p.price || 0,
                type: 'Produit'
            }));

            setAvailableItems([...formattedServices, ...formattedProducts]);
            
            fetchedClients.sort((a, b) => a.name.localeCompare(b.name));
            setClients(fetchedClients);

        } catch (error) {
            console.error("Failed to fetch data for invoice form", error);
            toast({ 
                title: "Erreur de chargement", 
                description: "Impossible de charger les clients, services et produits.",
                variant: "destructive"
            })
        }
    };
    fetchItemsAndClients();
  }, [toast]);


  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentId: "",
      clientId: "",
      lineItems: [{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }],
      notes: "",
      taxRate: 0,
    },
  });

  React.useEffect(() => {
    const type = searchParams.get("type") === "devis" ? "quote" : "invoice";
    setDocumentType(type);

    form.reset({
      documentId: `${type === 'invoice' ? 'FAC' : 'DEV'}-${Date.now().toString().slice(-6)}`,
      clientId: searchParams.get("clientId") || "",
      issueDate: new Date(),
      dueDate: addDays(new Date(), 30),
      lineItems: [{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }],
      notes: type === 'quote' 
        ? 'Cette soumission est valide pour une période de 30 jours. Les prix sont sujets à changement après cette période.'
        : 'Le paiement est dû sous 30 jours. Merci pour votre confiance.',
      taxRate: 0,
    });
  }, [form, searchParams]);


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

  async function onSubmit(data: DocumentFormValues) {
    setIsLoading(true);
    const submissionData = { ...data, documentType };
    console.log(`Données du document (${documentType}):`, submissionData);
    const clientName = clients.find(c=>c.id === data.clientId)?.name;
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
        title: documentType === 'invoice' ? "Facture Créée" : "Devis Créé",
        description: `Le document ${data.documentId} pour ${clientName} a été sauvegardé.`,
    });
    
    const redirectUrl = documentType === 'invoice' ? "/factures" : "/devis/liste";
    router.push(redirectUrl);
  }
  
  const handleDocumentTypeChange = (type: 'invoice' | 'quote') => {
    if (type) {
      setDocumentType(type);
      const prefix = type === 'invoice' ? 'FAC' : 'DEV';
      form.setValue('documentId', `${prefix}-${Date.now().toString().slice(-6)}`);
      form.setValue('notes', type === 'quote' 
        ? 'Cette soumission est valide pour une période de 30 jours. Les prix sont sujets à changement après cette période.'
        : 'Le paiement est dû sous 30 jours. Merci pour votre confiance.');
    }
  };

  const handleItemChange = (index: number, itemId: string) => {
    const item = availableItems.find(i => i.id === itemId);
    if (item) {
      update(index, {
        ...watchLineItems[index],
        serviceId: itemId,
        description: item.description,
        unitPrice: item.price,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mb-8 p-4 bg-muted/50 rounded-lg">
            <FormLabel className="font-semibold">Type de Document</FormLabel>
            <RadioGroup
                value={documentType}
                onValueChange={(val) => handleDocumentTypeChange(val as 'invoice' | 'quote')}
                className="flex items-center space-x-4 mt-2"
            >
                <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                    <RadioGroupItem value="invoice" id="r-invoice" />
                </FormControl>
                <Label htmlFor="r-invoice" className="font-normal cursor-pointer">Facture</Label>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                    <RadioGroupItem value="quote" id="r-quote" />
                </FormControl>
                <Label htmlFor="r-quote" className="font-normal cursor-pointer">Devis / Soumission</Label>
                </FormItem>
            </RadioGroup>
        </div>


        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="documentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{documentType === 'invoice' ? 'ID de la Facture' : 'ID du Devis'}</FormLabel>
                <FormControl>
                  <Input placeholder={documentType === 'invoice' ? 'FAC-001' : 'DEV-001'} {...field} />
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                <FormLabel>{documentType === 'invoice' ? "Date d'Échéance" : "Valide jusqu'au"}</FormLabel>
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
          <h3 className="text-lg font-medium font-headline">Lignes du Document</h3>
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
                          handleItemChange(index, value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un item" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Services</SelectLabel>
                            {availableItems.filter(i => i.type === 'Service').map(item => (
                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                            ))}
                          </SelectGroup>
                           <SelectSeparator />
                          <SelectGroup>
                            <SelectLabel>Produits</SelectLabel>
                            {availableItems.filter(i => i.type === 'Produit').map(item => (
                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                            ))}
                          </SelectGroup>
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
              <FormLabel>Notes / Termes et Conditions</FormLabel>
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
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
                {isLoading ? "Sauvegarde..." : `Sauvegarder ${documentType === 'invoice' ? 'la Facture' : 'le Devis'}`}
            </Button>
        </div>
      </form>
    </Form>
  );
}
