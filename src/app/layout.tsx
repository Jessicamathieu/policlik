
"use client";

import './globals.css'; // Import global styles
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/app/app-header';
import { getActiveNavItemConfig } from '@/config/nav';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'; // Imported React for React.Children
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-pt-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeColor, setActiveColor] = useState<string>('#3F51B5'); // Default for body bg and CSS var
  const [activeContrastColor, setActiveContrastColor] = useState<string>('#FFFFFF'); // Default for body text and CSS var

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    let colorToSet = '#3F51B5'; 
    let contrastColorToSet = '#FFFFFF';

    if (activeNavItem?.color && activeNavItem?.contrastColor) {
      colorToSet = activeNavItem.color;
      contrastColorToSet = activeNavItem.contrastColor;
    } else {
      const dashboardItem = getActiveNavItemConfig('/dashboard');
      if (dashboardItem?.color && dashboardItem?.contrastColor) {
        colorToSet = dashboardItem.color;
        contrastColorToSet = dashboardItem.contrastColor;
      }
    }
    setActiveColor(colorToSet);
    setActiveContrastColor(contrastColorToSet);

    // Apply global CSS variables for dynamic theming (e.g., Tailwind primary color, AppHeader tabs)
    document.documentElement.style.setProperty('--page-main-color', colorToSet);
    document.documentElement.style.setProperty('--page-main-contrast-color', contrastColorToSet);
  }, [pathname]);

  // Card coloring logic
  const cardColors = [
    "#2743e3", // Bleu Polimik
    "#0ccc34", // Vert
    "#fb9026", // Orange
    "#FFFF00"  // Jaune
  ];
  
  // Determine if the page background is light.
  // A simple heuristic: if activeColor is not one of the vibrant card colors and not black, assume light.
  // This could be refined, e.g., by checking luminance or having a flag in pageColors config.
  const isPageBackgroundLight = !cardColors.includes(activeColor.toLowerCase()) && activeColor.toLowerCase() !== '#000000' && activeColor.toLowerCase() !== '#3f51b5';


  const childrenArray = React.Children.toArray(children);

  return (
    <html lang="fr" className={ptSans.className}>
      <body
        className="flex min-h-screen w-full flex-col"
        style={{
          backgroundColor: activeColor, 
          color: activeContrastColor,   
        }}
      >
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {childrenArray.map((child, i) => {
              // Card background color logic:
              // If page background is light, cards are colored.
              // If page background is colored, cards are white.
              const cardBgColor = isPageBackgroundLight ? cardColors[i % cardColors.length] : "#ffffff";
              
              // Card text color logic:
              let cardTextColor = "#232323"; // Default dark text
              if (isPageBackgroundLight) { // Page BG is light, cards are colored
                // If card is yellow, text is black, otherwise white
                cardTextColor = cardBgColor.toLowerCase() === "#ffff00" ? "#000000" : "#ffffff";
              } else { // Page BG is colored, cards are white
                 // Text on white cards should be dark for readability
                 cardTextColor = "#232323"; 
              }

              return (
                <div
                  key={i}
                  className={`
                    rounded-xl shadow-lg p-6 min-h-[120px] flex flex-col justify-between
                    transition-transform duration-150
                    hover:scale-[1.03] hover:shadow-2xl
                  `}
                  style={{
                    background: cardBgColor,
                    color: cardTextColor,
                    border: !isPageBackgroundLight ? "1.5px solid #e0e0e0" : "none", 
                    boxShadow: "0 2px 16px 0 rgba(39,67,227,0.10)", // Consistent shadow
                    cursor: "default" 
                  }}
                >
                  {child}
                </div>
              );
            })}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
