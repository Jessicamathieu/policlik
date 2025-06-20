
"use client";

import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster";
import { getActiveNavItemConfig, pageColors } from "@/config/nav";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import "./globals.css"; // Importation des styles globaux
import { hexToHSL } from "@/lib/utils";

// Si vous utilisez next/font pour PT Sans, décommentez et configurez ici :
// import { PT_Sans } from 'next/font/google';
// const ptSans = PT_Sans({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pt-sans' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    const defaultPrimaryColor = pageColors[0].color; // Couleur par défaut si non trouvée
    
    const primaryColorHex = activeNavItem?.color || defaultPrimaryColor;
    const hsl = hexToHSL(primaryColorHex);

    if (hsl) {
      document.documentElement.style.setProperty('--primary-h', String(hsl.h));
      document.documentElement.style.setProperty('--primary-s', `${hsl.s}%`);
      document.documentElement.style.setProperty('--primary-l', `${hsl.l}%`);

      // Déterminer la couleur de premier plan en fonction de la luminosité de la couleur primaire
      // Heuristique simple : si la primaire est claire (L > 50), premier plan sombre, sinon clair.
      if (hsl.l > 60) { // Seuil ajusté pour mieux s'adapter aux couleurs claires comme le gris #F0F2F5
        document.documentElement.style.setProperty('--primary-foreground-h', '220'); // HSL pour un bleu/gris foncé
        document.documentElement.style.setProperty('--primary-foreground-s', '40%');
        document.documentElement.style.setProperty('--primary-foreground-l', '15%');
      } else { // Primaire sombre, premier plan clair (blanc)
        document.documentElement.style.setProperty('--primary-foreground-h', '0');
        document.documentElement.style.setProperty('--primary-foreground-s', '0%');
        document.documentElement.style.setProperty('--primary-foreground-l', '100%');
      }
    }
  }, [pathname]);

  return (
    // Ajoutez la classe de la police ici si vous utilisez next/font : className={ptSans.variable}
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col font-body bg-background text-foreground">
        <AppHeader />
        {/* Le contenu des pages (children) sera typiquement src/app/(app)/layout.tsx puis la page spécifique */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
