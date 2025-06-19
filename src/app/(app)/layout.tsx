
"use client"; // Required for useState, useEffect, usePathname

import { AppHeader } from "@/components/app/app-header";
import { getActiveNavItemConfig } from "@/config/nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeColor, setActiveColor] = useState<string>('#3F51B5'); // Default primary
  const [activeContrastColor, setActiveContrastColor] = useState<string>('#FFFFFF'); // Default primary foreground

  useEffect(() => {
    const activeNavItem = getActiveNavItemConfig(pathname);
    if (activeNavItem?.color && activeNavItem?.contrastColor) {
      setActiveColor(activeNavItem.color);
      setActiveContrastColor(activeNavItem.contrastColor);
    } else {
      // Fallback to default theme colors if no specific nav item color is found
      const dashboardItem = getActiveNavItemConfig('/dashboard');
      setActiveColor(dashboardItem?.color || '#3F51B5');
      setActiveContrastColor(dashboardItem?.contrastColor || '#FFFFFF');
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen w-full flex-col" style={{
      // @ts-ignore
      '--page-main-color': activeColor,
      '--page-main-contrast-color': activeContrastColor,
    }}>
      <AppHeader />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background overflow-auto relative">
        {/* Dynamic colored shape background */}
        <div
          className="absolute inset-0 z-[-1] opacity-100" // Using higher opacity for solid color shape
          style={{
            backgroundColor: 'var(--page-main-color)',
            // This clip-path attempts to mimic the general feel of the example image's background shape
            // It creates a large colored area primarily on the right and extending to the bottom.
            clipPath: 'polygon(35% 0%, 100% 0%, 100% 100%, 15% 100%)',
          }}
        />
        {children}
      </main>
    </div>
  );
}
