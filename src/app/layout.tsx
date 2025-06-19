
"use client"; // Garder comme composant client à cause des hooks

import "./globals.css"; // Essentiel
import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster"; // Pour les notifications
import { getActiveNavItemConfig, pageColors } from "@/config/nav"; // Pour les couleurs dynamiques
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Pour les classnames

// Si vous utilisez next/font pour PT Sans, importez et configurez ici
// import { PT_Sans } from 'next/font/google';
// const ptSans = PT_Sans({
//   weight: ['400', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Valeur par défaut pour la première pageColor ou un fallback pour éviter les erreurs undefined initialement
  const [activeColor, setActiveColor] = useState(pageColors[0]?.color || '#2743e3');
  const [activeContrastColor, setActiveContrastColor] = useState(pageColors[0]?.contrastColor || '#FFFFFF');

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    const colorToSet = activeNavItem?.color || pageColors[0]?.color || '#2743e3';
    const contrastToSet = activeNavItem?.contrastColor || pageColors[0]?.contrastColor || '#FFFFFF';

    setActiveColor(colorToSet); // Bien que non utilisé directement pour styler body ici, utile si d'autres composants dépendent de cet état local.
    setActiveContrastColor(contrastToSet); // Idem.

    // Définir les variables CSS sur la racine pour une utilisation globale par Tailwind ou d'autres composants
    document.documentElement.style.setProperty('--page-main-color', colorToSet);
    document.documentElement.style.setProperty('--page-main-contrast-color', contrastToSet);
  }, [pathname]);

  return (
    <html lang="fr"> {/* Ajouter l'attribut lang */}
      <body
        className={cn(
          "min-h-screen w-full flex flex-col bg-background text-foreground" 
          // ptSans.className // Si vous utilisez next/font, ajoutez sa className ici
          // La couleur de fond principale de la page est maintenant gérée par --background de globals.css
          // La couleur de fond de la zone de contenu spécifique à (app) sera gérée par (app)/layout.tsx
        )}
      >
        <AppHeader /> {/* Afficher l'en-tête pour toutes les pages */}
        <div className="flex-1 w-full flex flex-col"> {/* Ce div prend l'espace restant et permet au contenu de (app)/layout de s'étendre */}
            {children} {/* children sera le contenu de la page ou les layouts imbriqués */}
        </div>
        <Toaster /> {/* Toaster global pour les notifications */}
      </body>
    </html>
  );
}
