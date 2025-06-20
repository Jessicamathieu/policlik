
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/icons";
import { LogOut, UserCircle, Settings } from "lucide-react";
import { appNavItems, pageColors as navPageColors } from "@/config/nav";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";


// Helper function to determine the active tab base href for Tabs value
const getCurrentBasePathForTabs = (currentPathname: string, navItems: NavItem[]): string => {
  const sortedNavItems = [...navItems].sort((a, b) => (b.href?.length || 0) - (a.href?.length || 0));
  for (const item of sortedNavItems) {
    if (item.href && currentPathname.startsWith(item.href)) {
      return item.href;
    }
  }
  for (const item of sortedNavItems) {
    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.href && currentPathname.startsWith(subItem.href)) {
          return item.href!; 
        }
      }
    }
  }
  return navItems.find(item => item.href === '/dashboard')?.href || currentPathname;
};


export function AppHeader() {
  const pathname = usePathname();
  const activeTabValue = getCurrentBasePathForTabs(pathname, appNavItems);

  const gradientStops = navPageColors.map((pc, index, arr) => ({
    offset: arr.length === 1 ? "100%" : `${(index / (arr.length - 1)) * 100}%`,
    color: pc.color,
  }));

  return (
    <header className="sticky top-0 z-30 flex w-full flex-col bg-background shadow-sm">
      {/* Top Part: Logo and User Actions */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Icons.Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-lg">Polimik Gestion</span>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar utilisateur" data-ai-hint="user avatar" />
                <AvatarFallback>PG</AvatarFallback>
              </Avatar>
              <span className="sr-only">Ouvrir le menu utilisateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Utilisateur Test</p>
                <p className="text-xs leading-none text-muted-foreground">
                  test@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { window.location.href = '/login';}}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom Part: Navigation Tabs */}
      <nav className="w-full bg-background">
        <Tabs value={activeTabValue} className="w-full">
          <TabsList className="container mx-auto h-12 justify-start rounded-none bg-transparent p-0 -mb-px overflow-x-auto px-4 sm:px-6 md:px-8">
            {appNavItems.map((item) => {
              if (!item.href) return null; 
              const Icon = item.icon;
              const isActive = activeTabValue === item.href;

              return (
                <TabsTrigger
                  key={item.title}
                  value={item.href}
                  asChild
                  className={cn(
                    "h-full rounded-none px-4 text-sm transition-all duration-150 ease-in-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive ? "font-medium" : "hover:opacity-100"
                  )}
                  style={
                    {
                      backgroundColor: item.color,
                      color: item.contrastColor,
                      '--item-focus-ring-color': item.color,
                      ...(!isActive && { opacity: 0.85 }), 
                    } as React.CSSProperties
                  }
                >
                  <Link href={item.href} style={{color: item.contrastColor }}>
                    {Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
                    {item.title}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        {/* Spilled Paint SVG Separator */}
        <div className="relative w-full h-3 md:h-4 -mt-px"> 
          <svg width="100%" height="100%" viewBox="0 0 1200 15" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pageColorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {gradientStops.map(stop => (
                  <stop key={stop.offset} offset={stop.offset} style={{stopColor: stop.color, stopOpacity:1}} />
                ))}
              </linearGradient>
            </defs>
            <path d="M0 8 C 50 2, 100 10, 150 7 S 250 2, 300 8 S 400 13, 450 8 S 550 3, 600 8 S 700 13, 750 8 S 850 3, 900 8 S 1000 13, 1050 8 S 1150 2, 1200 8" 
                  stroke="url(#pageColorGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </nav>
    </header>
  );
}
