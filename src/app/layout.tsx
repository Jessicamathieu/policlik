"use client";

import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster";
import { getActiveNavItemConfig } from "@/config/nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css"; // Si tu as un global CSS

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeColor, setActiveColor] = useState<string>('#2743e3'); // Polimik blue par défaut
  const [activeContrastColor, setActiveContrastColor] = useState<string>('#FFFFFF');

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    let newActiveColor = '#2743e3';
    let newActiveContrastColor = '#FFFFFF';

    if (activeNavItem?.color && activeNavItem?.contrastColor) {
      newActiveColor = activeNavItem.color;
      newActiveContrastColor = activeNavItem.contrastColor;
    } else {
      const dashboardItem = getActiveNavItemConfig('/dashboard');
      if (dashboardItem?.color && dashboardItem?.contrastColor) {
        newActiveColor = dashboardItem.color;
        newActiveContrastColor = dashboardItem.contrastColor;
      }
    }
    setActiveColor(newActiveColor);
    setActiveContrastColor(newActiveContrastColor);

    document.documentElement.style.setProperty('--page-main-color', newActiveColor);
    document.documentElement.style.setProperty('--page-main-contrast-color', newActiveContrastColor);
  }, [pathname]);

  // Palette Service Polimik (bleu, vert, orange, blanc, jaune)
  const cardColors = [
    "#2743e3", // bleu Polimik
    "#0ccc34", // vert accent
    "#fb9026", // orange accent
    "#fff",    // blanc
    "#FFFF00", // jaune accent
  ];

  // Texte foncé sur blanc/jaune, blanc sinon
  const getTextColor = (bg: string) => {
    if (bg === "#fff" || bg === "#FFFF00") return "#232323";
    return "#fff";
  };

  // Toujours traiter children comme un array
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <html lang="fr">
      <body 
        className="flex min-h-screen w-full flex-col bg-[color:var(--page-main-color)] text-[color:var(--page-main-contrast-color)]"
        style={{
          backgroundColor: activeColor,
          color: activeContrastColor
        }}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {childrenArray.map((child, i) => (
              <div
                key={i}
                className="rounded-2xl shadow-xl p-7 min-h-[130px] flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-2xl duration-150 cursor-pointer border"
                style={{
                  background: cardColors[i % cardColors.length],
                  color: getTextColor(cardColors[i % cardColors.length]),
                  border: cardColors[i % cardColors.length] === "#fff" ? '2px solid #2743e3' : 'none',
                  boxShadow: "0 8px 32px 0 rgba(39,67,227,0.12)",
                }}
              >
                {child}
              </div>
            ))}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
