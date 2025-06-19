"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const quoteRequestSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  address: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères." }),
  phone: z.string().regex(/^\+?[0-9\s-()]{7,20}$/, { message: "Numéro de téléphone invalide." }),
  email: z.string().email({ message: "Adresse e-mail invalide." }),
  description: z.string().min(10, { message: "La description doit contenir au moins 10 caractères." }),
  files: z.custom<FileList>().optional(), // Using z.custom for FileList
});

type QuoteRequestFormValues = z.infer<typeof quoteRequestSchema>;

export function QuoteRequestForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);


  const form = useForm<QuoteRequestFormValues>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      description: "",
    },
  });

  async function onSubmit(data: QuoteRequestFormValues) {
    setIsLoading(true);
    console.log("Données de la demande de devis:", data);
    console.log("Fichiers sélectionnés:", selectedFiles);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);

    toast({
      title: "Demande de devis envoyée",
      description: "Nous avons bien reçu votre demande et vous contacterons bientôt.",
    });
    form.reset();
    setSelectedFiles([]);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse e-mail</FormLabel>
                <FormControl>
                  <Input placeholder="exemple@domaine.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse des travaux</FormLabel>
                <FormControl>
                  <Input placeholder="123 Rue Principale, Ville, Code Postal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input placeholder="01 23 45 67 89" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description des travaux souhaités</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Veuillez décrire le plus précisément possible les travaux à réaliser."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => ( // field is not directly used for input type="file" by react-hook-form default, manual handling for files
            <FormItem>
              <FormLabel>Télécharger des fichiers (optionnel)</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormDescription>
                Vous pouvez joindre des photos ou documents (max 5MB par fichier).
                 {selectedFiles.length > 0 && (
                    <ul className="mt-2 list-disc list-inside">
                    {selectedFiles.map((file, index) => (
                        <li key={index} className="text-xs">{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                    </ul>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full md:w-auto text-lg py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Envoyer la Demande"}
        </Button>
      </form>
    </Form>
  );
}
