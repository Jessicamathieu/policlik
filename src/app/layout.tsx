
"use client"; 

import "./globals.css"; 
import { AppHeader } from "@/components/app/app-header";
import { Toaster } from "@/components/ui/toaster"; 
import { getActiveNavItemConfig, pageColors } from "@/config/nav"; 
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils"; 
import { hexToHSL } from "@/lib/utils"; // Import hexToHSL

// import { PT_Sans } from 'next/font/google';
// const ptSans = PT_Sans({
//   weight: ['400', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    // Use the primary blue from the style guide as the ultimate fallback
    const colorHex = activeNavItem?.color || pageColors.find(p => p.name === 'blue')?.color || '#3F51B5'; 
    const contrastColorHex = activeNavItem?.contrastColor || pageColors.find(p => p.name === 'blue')?.contrastColor || '#FFFFFF';

    const primaryHSL = hexToHSL(colorHex);
    if (primaryHSL) {
      document.documentElement.style.setProperty('--primary-h', `${primaryHSL.h}`);
      document.documentElement.style.setProperty('--primary-s', `${primaryHSL.s}%`);
      document.documentElement.style.setProperty('--primary-l', `${primaryHSL.l}%`);
    }

    const primaryFgHSL = hexToHSL(contrastColorHex);
    if (primaryFgHSL) {
      document.documentElement.style.setProperty('--primary-foreground-h', `${primaryFgHSL.h}`);
      document.documentElement.style.setProperty('--primary-foreground-s', `${primaryFgHSL.s}%`);
      document.documentElement.style.setProperty('--primary-foreground-l', `${primaryFgHSL.l}%`);
    }
  }, [pathname]);

  return (
    <html lang="fr"> 
      <body
        className={cn(
          "min-h-screen w-full flex flex-col bg-background text-foreground" 
          // ptSans.className 
        )}
      >
        <AppHeader /> 
        <div className="flex-1 w-full flex flex-col"> 
            {children} 
        </div>
        <Toaster /> 
      </body>
    </html>
  );
}
