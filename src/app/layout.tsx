"use client";

import "./globals.css";
import { AppHeader } from "@/components/app/app-header";
import { getActiveNavItemConfig } from "@/config/nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PT_Sans } from "next/font/google";

/* --- police globale --- */
const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-pt-sans",
});

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  /* --- couleur d’accent pour tes onglets (pas le fond) --- */
  const [accentColor, setAccentColor]   = useState("#2743e3");
  const [accentContrast, setAccentText] = useState("#FFFFFF");

  useEffect(() => {
    const nav = getActiveNavItemConfig(pathname);
    if (nav?.color && nav?.contrastColor) {
      setAccentColor(nav.color);
      setAccentText(nav.contrastColor);
    } else {
      const def = getActiveNavItemConfig("/dashboard");
      setAccentColor(def?.color ?? "#2743e3");
      setAccentText(def?.contrastColor ?? "#FFFFFF");
    }

    /* Variables CSS si d’autres composants en ont besoin */
    document.documentElement.style.setProperty("--page-main-color", accentColor);
    document.documentElement.style.setProperty(
      "--page-main-contrast-color",
      accentContrast
    );
  }, [pathname, accentColor, accentContrast]);

  return (
    <html lang="fr" className={ptSans.className}>
      <body className="flex min-h-screen w-full flex-col bg-white text-[#232323]">
        {/* --- ‼️ Header unique pour toute l’app --- */}
        <AppHeader />

        {/* --- zone de contenu (pas de cartes imposées) --- */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative">
          {children}
        </main>
      </body>
    </html>
  );
}
