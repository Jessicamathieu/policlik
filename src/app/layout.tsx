
"use client";

import "./globals.css"; // Placé en premier pour que les variables CSS soient disponibles
import { AppHeader } from "@/components/app/app-header";
import { getActiveNavItemConfig, pageColors } from "@/config/nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PT_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { hexToHSL } from "@/lib/utils";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pt-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const activeNav = getActiveNavItemConfig(pathname);
    let currentPrimaryColor = pageColors[0].color; // Default to first color (blue)
    let currentPrimaryForeground = pageColors[0].contrastColor;

    if (activeNav?.color && activeNav?.contrastColor) {
      currentPrimaryColor = activeNav.color;
      currentPrimaryForeground = activeNav.contrastColor;
    }

    const primaryHsl = hexToHSL(currentPrimaryColor);
    const primaryForegroundHsl = hexToHSL(currentPrimaryForeground);

    if (primaryHsl) {
      document.documentElement.style.setProperty('--primary-h', `${primaryHsl.h}`);
      document.documentElement.style.setProperty('--primary-s', `${primaryHsl.s}%`);
      document.documentElement.style.setProperty('--primary-l', `${primaryHsl.l}%`);
    }
    if (primaryForegroundHsl) {
      document.documentElement.style.setProperty('--primary-foreground-h', `${primaryForegroundHsl.h}`);
      document.documentElement.style.setProperty('--primary-foreground-s', `${primaryForegroundHsl.s}%`);
      document.documentElement.style.setProperty('--primary-foreground-l', `${primaryForegroundHsl.l}%`);
    }
  }, [pathname]);

  return (
    <html lang="fr" className={ptSans.variable}>
      <body className="flex min-h-screen w-full flex-col bg-background text-foreground font-body">
        <AppHeader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
