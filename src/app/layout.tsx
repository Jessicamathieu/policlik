
"use client";

import type { Metadata } from "next"; 
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveNavItemConfig } from "@/config/nav";
import { hexToHSL } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-context";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

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
    
    const dashboardItem = getActiveNavItemConfig('/dashboard'); 
    const defaultPrimaryHex = dashboardItem?.color || "#3F51B5"; 
    const defaultPrimaryForegroundHex = dashboardItem?.contrastColor || "#FFFFFF";

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
    } else {
      const fallbackPrimaryHSL = hexToHSL(defaultPrimaryHex);
      if (fallbackPrimaryHSL) {
        docStyle.setProperty('--primary-h', `${fallbackPrimaryHSL.h}`);
        docStyle.setProperty('--primary-s', `${fallbackPrimaryHSL.s}%`);
        docStyle.setProperty('--primary-l', `${fallbackPrimaryHSL.l}%`);
      }
    }

    if (primaryForegroundHSL) {
      docStyle.setProperty('--primary-foreground-h', `${primaryForegroundHSL.h}`);
      docStyle.setProperty('--primary-foreground-s', `${primaryForegroundHSL.s}%`);
      docStyle.setProperty('--primary-foreground-l', `${primaryForegroundHSL.l}%`);
    } else {
      const fallbackFgHSL = hexToHSL(defaultPrimaryForegroundHex);
      if (fallbackFgHSL) {
        docStyle.setProperty('--primary-foreground-h', `${fallbackFgHSL.h}`);
        docStyle.setProperty('--primary-foreground-s', `${fallbackFgHSL.s}%`);
        docStyle.setProperty('--primary-foreground-l', `${fallbackFgHSL.l}%`);
      }
    }
  }, [pathname, isMounted]);

  const isAuthPage = pathname.startsWith('/login');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => {});
      });
    }
  }, []);

  return (
    <html lang="fr" className={ptSans.variable} suppressHydrationWarning>
      <head>
        <title>PolicliK</title>
        <meta name="description" content="Application de gestion pour PolicliK." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2743e3" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`font-body antialiased bg-background text-foreground`}>
        <AuthProvider>
          {!isAuthPage && <AppHeader />}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
