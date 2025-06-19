
"use client";

import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster";
import { getActiveNavItemConfig } from "@/config/nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./globals.css"; // Import global styles

// Renaming to RootLayout for convention, but keeping AppLayout if you prefer
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Default colors (will be updated by useEffect)
  const [activeColor, setActiveColor] = useState<string>('#3F51B5'); // A default blue
  const [activeContrastColor, setActiveContrastColor] = useState<string>('#FFFFFF'); // White

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    let newActiveColor = '#3F51B5'; // Fallback default blue
    let newActiveContrastColor = '#FFFFFF'; // Fallback white

    if (activeNavItem?.color && activeNavItem?.contrastColor) {
      newActiveColor = activeNavItem.color;
      newActiveContrastColor = activeNavItem.contrastColor;
    } else {
      // Fallback to dashboard colors if current item has no specific colors
      const dashboardItem = getActiveNavItemConfig('/dashboard');
      if (dashboardItem?.color && dashboardItem?.contrastColor) {
        newActiveColor = dashboardItem.color;
        newActiveContrastColor = dashboardItem.contrastColor;
      }
    }
    setActiveColor(newActiveColor);
    setActiveContrastColor(newActiveContrastColor);

    // Apply dynamic CSS variables to the <html> element for global use (e.g., by Tailwind)
    document.documentElement.style.setProperty('--page-main-color', newActiveColor);
    document.documentElement.style.setProperty('--page-main-contrast-color', newActiveContrastColor);
  }, [pathname]);

  // Couleurs de carte Splash Bacs (specific to this layout's child rendering)
  const cardColors = [
    "#FFFF00", // jaune
    "#2743e3", // bleu
    "#0ccc34", // vert
    "#fb9026", // orange
    "#fff"     // blanc
  ];

  // Fonction pour choisir couleur de texte selon fond
  const getTextColor = (bg: string) => {
    if (bg === "#FFFF00" || bg === "#fff") return "#2d2d2d"; // Dark text for yellow or white background
    return "#fff"; // White text for other backgrounds
  };

  return (
    <html lang="fr">
      <body 
        className="flex min-h-screen w-full flex-col"
        style={{ 
          backgroundColor: activeColor, 
          color: activeContrastColor 
        }}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative">
          {/* This specific grid layout for children might be intended for a dashboard-like overview.
              If children are full pages, they will be rendered within these cards. */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
              Array.isArray(children)
                ? children.map((child, i) => (
                    <div
                      key={i}
                      className="rounded-xl shadow-lg p-6 min-h-[120px] flex flex-col justify-between transition-transform hover:scale-105"
                      style={{
                        background: cardColors[i % cardColors.length],
                        color: getTextColor(cardColors[i % cardColors.length]),
                        border: cardColors[i % cardColors.length] === "#fff" ? '1.5px solid #0ccc34' : 'none',
                      }}
                    >
                      {child}
                    </div>
                  ))
                : ( // If children is a single element
                  <div
                    className="rounded-xl shadow-lg p-6 min-h-[120px] flex flex-col justify-between transition-transform hover:scale-105"
                    style={{
                      // Apply a default card style or handle as appropriate
                      background: cardColors[0], 
                      color: getTextColor(cardColors[0])
                    }}
                  >
                    {children}
                  </div>
                )
            }
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
