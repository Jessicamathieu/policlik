
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
const dashboardItem = getActiveNavItemConfig('/dashboard'); // Assuming dashboard is a safe default
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
<main
className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto relative"
style={{
backgroundColor: 'var(--page-main-color)',
color: 'var(--page-main-contrast-color)'
}}
>
{children}
</main>
</div>
);
}
