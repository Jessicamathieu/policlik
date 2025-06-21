
'use server';
/**
 * @fileOverview Un flux Genkit pour générer le contenu HTML d'une facture.
 *
 * - generateInvoiceHtml - Fonction principale pour générer l'HTML de la facture.
 * - GenerateInvoiceHtmlInput - Type d'entrée pour la génération de l'HTML de la facture.
 * - GenerateInvoiceHtmlOutput - Type de sortie, contenant la chaîne HTML.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const InvoiceLineItemSchema = z.object({
  description: z.string().describe('Description du service ou produit.'),
  quantity: z.number().describe('Quantité.'),
  unitPrice: z.string().describe('Prix unitaire (ex: "CAD$50.00").'),
  totalPrice: z.string().describe('Prix total pour la ligne (ex: "CAD$100.00").'),
});
export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;

const GenerateInvoiceHtmlInputSchema = z.object({
  companyName: z.string().default('Service Polimik').describe("Nom de l'entreprise émettrice."),
  companyAddressL1: z.string().default('200 33e Rue').describe("Ligne 1 de l'adresse de l'entreprise."),
  companyAddressL2: z.string().default('Notre-Dame-des-Pins G0M 1K0').describe("Ligne 2 de l'adresse de l'entreprise."),
  companyPhone: z.string().default('418-774-1548').describe("Téléphone de l'entreprise."),
  companyEmail: z.string().default('info@servicepolimik.ca').describe("Email de l'entreprise."),
  companyLogoUrl: z.string().optional().describe("URL du logo de l'entreprise (optionnel, à remplacer)."),

  clientName: z.string().describe('Nom du client.'),
  clientAddressL1: z.string().optional().describe("Ligne 1 de l'adresse du client."),
  clientAddressL2: z.string().optional().describe("Ligne 2 de l'adresse du client."),
  clientEmail: z.string().optional().describe('Email du client.'),

  invoiceNumber: z.string().describe('Numéro de la facture.'),
  invoiceDate: z.string().describe('Date d\'émission de la facture (ex: "19 juin 2024").'),
  dueDate: z.string().optional().describe('Date d\'échéance de la facture (ex: "19 juillet 2024").'),

  lineItems: z.array(InvoiceLineItemSchema).describe('Liste des lignes de la facture.'),

  subTotal: z.string().describe('Sous-total (ex: "CAD$200.00").'),
  tpsRate: z.string().optional().describe('Taux TPS (ex: "5%").'),
  tpsAmount: z.string().optional().describe('Montant TPS (ex: "CAD$10.00").'),
  tvqRate: z.string().optional().describe('Taux TVQ (ex: "9.975%").'),
  tvqAmount: z.string().optional().describe('Montant TVQ (ex: "CAD$19.95").'),
  total: z.string().describe('Total général (ex: "CAD$229.95").'),

  termsAndConditions: z.string().default('Le paiement est dû à réception de la facture.').describe('Termes et conditions.'),
  footerMessage: z.string().default('Merci pour votre confiance envers Service Polimik – lavage à l’eau pure 💧').describe('Message en pied de page.'),
});
export type GenerateInvoiceHtmlInput = z.infer<typeof GenerateInvoiceHtmlInputSchema>;

const GenerateInvoiceHtmlOutputSchema = z.object({
  htmlContent: z.string().describe('Le contenu HTML de la facture générée.'),
});
export type GenerateInvoiceHtmlOutput = z.infer<typeof GenerateInvoiceHtmlOutputSchema>;

export async function generateInvoiceHtml(input: GenerateInvoiceHtmlInput): Promise<GenerateInvoiceHtmlOutput> {
  return generateInvoiceHtmlFlow(input);
}

const generateInvoiceHtmlFlow = ai.defineFlow(
  {
    name: 'generateInvoiceHtmlFlow',
    inputSchema: GenerateInvoiceHtmlInputSchema,
    outputSchema: GenerateInvoiceHtmlOutputSchema,
  },
  async (input: GenerateInvoiceHtmlInput) => {
    const {
      companyName, companyAddressL1, companyAddressL2, companyPhone, companyEmail, companyLogoUrl,
      clientName, clientAddressL1, clientAddressL2,
      invoiceNumber, invoiceDate, dueDate,
      lineItems,
      subTotal, tpsRate, tpsAmount, tvqRate, tvqAmount, total,
      termsAndConditions, footerMessage
    } = input;

    const primaryColor = '#2563eb'; // Bleu primaire (similaire à celui de l'image et du thème)
    const lightBgColor = '#f0f4ff'; // Un bleu très clair pour certains fonds ou accents
    const textColor = '#1f2937'; // Texte foncé
    const whiteColor = '#ffffff';

    let logoHtml = '<!-- Logo Service Polimik -->';
    if (companyLogoUrl) {
      logoHtml = `<img src="${companyLogoUrl}" alt="${companyName} Logo" style="max-height: 80px; width: auto; margin-bottom: 20px;" />`;
    } else {
      // Placeholder simple si pas de logo URL
      logoHtml = `<div style="background-color: ${primaryColor}; color: ${whiteColor}; padding: 10px 20px; font-size: 24px; font-weight: bold; border-radius: 8px; margin-bottom: 20px; display: inline-block;">${companyName.substring(0,2).toUpperCase()}</div>`
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture ${invoiceNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: ${whiteColor}; color: ${textColor}; font-size: 12px; }
          .container { width: 100%; max-width: 800px; margin: 0 auto; padding: 30px; background-color: ${whiteColor}; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding-bottom:20px; border-bottom: 2px solid ${primaryColor}; }
          .company-info { text-align: left; }
          .company-info p { margin: 2px 0; }
          .invoice-title { text-align: right; }
          .invoice-title h1 { font-size: 36px; color: ${primaryColor}; margin: 0; text-transform: uppercase; }
          .invoice-details, .client-details { margin-bottom: 30px; }
          .invoice-details p, .client-details p { margin: 3px 0; }
          .section-title { font-weight: bold; color: ${primaryColor}; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #cccccc; padding: 10px; text-align: left; }
          th { background-color: ${primaryColor}; color: ${whiteColor}; font-weight: bold; text-transform: uppercase; }
          .line-item-description { width: 50%; }
          .line-item-quantity, .line-item-price { text-align: right; }
          .totals { margin-left: auto; width: 40%; margin-bottom:30px; }
          .totals table { width: 100%; }
          .totals td { border: none; padding: 5px 0; }
          .totals .label { text-align: right; font-weight: bold; padding-right: 10px; }
          .totals .amount { text-align: right; }
          .totals .grand-total td { font-size: 16px; font-weight: bold; color: ${primaryColor}; border-top: 2px solid ${primaryColor}; padding-top:10px;}
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #dddddd; font-size: 11px; color: #555555; }
          .terms { margin-bottom: 20px; padding: 15px; background-color: ${lightBgColor}; border-radius: 5px; font-size: 11px;}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              ${logoHtml}
              <p><strong>${companyName}</strong></p>
              <p>${companyAddressL1}</p>
              <p>${companyAddressL2}</p>
              <p>Tél: ${companyPhone}</p>
              <p>Email: ${companyEmail}</p>
            </div>
            <div class="invoice-title">
              <h1>Facture</h1>
              <p><strong>N°:</strong> ${invoiceNumber}</p>
              <p><strong>Date:</strong> ${invoiceDate}</p>
              ${dueDate ? `<p><strong>Échéance:</strong> ${dueDate}</p>` : ''}
            </div>
          </div>

          <div class="client-details">
            <p class="section-title">Facturé à :</p>
            <p><strong>${clientName}</strong></p>
            ${clientAddressL1 ? `<p>${clientAddressL1}</p>` : ''}
            ${clientAddressL2 ? `<p>${clientAddressL2}</p>` : ''}
            ${input.clientEmail ? `<p>${input.clientEmail}</p>` : ''}
          </div>

          <table>
            <thead>
              <tr>
                <th class="line-item-description">Description</th>
                <th>Quantité</th>
                <th class="line-item-price">Prix Unitaire</th>
                <th class="line-item-price">Total</th>
              </tr>
            </thead>
            <tbody>
              ${lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="line-item-quantity">${item.quantity}</td>
                  <td class="line-item-price">${item.unitPrice}</td>
                  <td class="line-item-price">${item.totalPrice}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td class="label">Sous-total:</td>
                <td class="amount">${subTotal}</td>
              </tr>
              ${tpsAmount ? `
                <tr>
                  <td class="label">TPS ${tpsRate ? `(${tpsRate})` : ''}:</td>
                  <td class="amount">${tpsAmount}</td>
                </tr>
              ` : ''}
              ${tvqAmount ? `
                <tr>
                  <td class="label">TVQ ${tvqRate ? `(${tvqRate})` : ''}:</td>
                  <td class="amount">${tvqAmount}</td>
                </tr>
              ` : ''}
              <tr class="grand-total">
                <td class="label">Total:</td>
                <td class="amount">${total}</td>
              </tr>
            </table>
          </div>
          
          ${termsAndConditions ? `
          <div class="terms">
            <p class="section-title">Termes & conditions :</p>
            <p>${termsAndConditions}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>${footerMessage}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { htmlContent };
  }
);

    
