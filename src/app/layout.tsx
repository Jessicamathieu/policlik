
"use client";

import type { Metadata } from "next"; // Metadata type can still be imported but not exported from client component
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveNavItemConfig } from "@/config/nav";
import { hexToHSL } from "@/lib/utils";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

// Cannot export metadata from a Client Component for dynamic metadata.
// Static metadata can be placed in head.js or directly in <head> below.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof document === 'undefined') return;

    const activeNavItem = getActiveNavItemConfig(pathname);
    
    // Fallback to dashboard colors if no specific item found or no colors defined
    const dashboardItem = getActiveNavItemConfig('/dashboard'); // Assuming dashboard has defined colors
    const defaultPrimaryHex = dashboardItem?.color || "#3F51B5"; // Default blue
    const defaultPrimaryForegroundHex = dashboardItem?.contrastColor || "#FFFFFF"; // Default white

    let currentPrimaryHex = defaultPrimaryHex;
    let currentPrimaryForegroundHex = defaultPrimaryForegroundHex;

    if (activeNavItem?.color && activeNavItem?.contrastColor) {
      currentPrimaryHex = activeNavItem.color;
      currentPrimaryForegroundHex = activeNavItem.contrastColor;
    }
    
    const primaryHSL = hexToHSL(currentPrimaryHex);
    const primaryForegroundHSL = hexToHSL(currentPrimaryForegroundHex);
    const docStyle = document.documentElement.style;

    if (primaryHSL) {
      docStyle.setProperty('--primary-h', `${primaryHSL.h}`);
      docStyle.setProperty('--primary-s', `${primaryHSL.s}%`);
      docStyle.setProperty('--primary-l', `${primaryHSL.l}%`);

      // Cards use the primary color
      docStyle.setProperty('--card-h', `${primaryHSL.h}`);
      docStyle.setProperty('--card-s', `${primaryHSL.s}%`);
      docStyle.setProperty('--card-l', `${primaryHSL.l}%`);
    } else {
      // Fallback if hexToHSL fails for primary (should not happen with defaults)
      const fallbackPrimaryHSL = hexToHSL(defaultPrimaryHex);
      if (fallbackPrimaryHSL) {
        docStyle.setProperty('--primary-h', `${fallbackPrimaryHSL.h}`);
        docStyle.setProperty('--primary-s', `${fallbackPrimaryHSL.s}%`);
        docStyle.setProperty('--primary-l', `${fallbackPrimaryHSL.l}%`);
        docStyle.setProperty('--card-h', `${fallbackPrimaryHSL.h}`);
        docStyle.setProperty('--card-s', `${fallbackPrimaryHSL.s}%`);
        docStyle.setProperty('--card-l', `${fallbackPrimaryHSL.l}%`);
      }
    }

    if (primaryForegroundHSL) {
      docStyle.setProperty('--primary-foreground-h', `${primaryForegroundHSL.h}`);
      docStyle.setProperty('--primary-foreground-s', `${primaryForegroundHSL.s}%`);
      docStyle.setProperty('--primary-foreground-l', `${primaryForegroundHSL.l}%`);

      // Card foreground uses primary foreground
      docStyle.setProperty('--card-foreground-h', `${primaryForegroundHSL.h}`);
      docStyle.setProperty('--card-foreground-s', `${primaryForegroundHSL.s}%`);
      docStyle.setProperty('--card-foreground-l', `${primaryForegroundHSL.l}%`);
    } else {
      // Fallback if hexToHSL fails for foreground
      const fallbackFgHSL = hexToHSL(defaultPrimaryForegroundHex);
      if (fallbackFgHSL) {
        docStyle.setProperty('--primary-foreground-h', `${fallbackFgHSL.h}`);
        docStyle.setProperty('--primary-foreground-s', `${fallbackFgHSL.s}%`);
        docStyle.setProperty('--primary-foreground-l', `${fallbackFgHSL.l}%`);
        docStyle.setProperty('--card-foreground-h', `${fallbackFgHSL.h}`);
        docStyle.setProperty('--card-foreground-s', `${fallbackFgHSL.s}%`);
        docStyle.setProperty('--card-foreground-l', `${fallbackFgHSL.l}%`);
      }
    }
  }, [pathname, isMounted]);

  return (
    <html lang="fr" className={ptSans.variable} suppressHydrationWarning>
      <head>
        <title>Polimik Gestion</title>
        <meta name="description" content="Application de gestion pour Polimik." />
        {/* Add other static head elements here if needed, like favicons */}
      </head>
      <body className={`font-body antialiased bg-background text-foreground`}>
        <AppHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
