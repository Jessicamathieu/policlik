
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
import { appNavItems, getActiveNavItemConfig } from "@/config/nav";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";


// Helper function to determine the active tab base href for Tabs value
const getCurrentBasePathForTabs = (currentPathname: string, navItems: NavItem[]): string => {
  const sortedNavItems = [...navItems].sort((a, b) => (b.href?.length || 0) - (a.href?.length || 0));
  for (const item of sortedNavItems) {
    if (item.href && currentPathname.startsWith(item.href)) {
      // If it has items, usually the top-level href is the tab value
      return item.href;
    }
  }
  // Fallback for sub-items if no direct parent match was found above (though typically parent href should match)
  for (const item of sortedNavItems) {
    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.href && currentPathname.startsWith(subItem.href)) {
          return item.href!; // Return parent href for tab group
        }
      }
    }
  }
  return navItems.find(item => item.href === '/dashboard')?.href || currentPathname;
};


export function AppHeader() {
  const pathname = usePathname();
  const activeTabValue = getCurrentBasePathForTabs(pathname, appNavItems);

  return (
    <header className="sticky top-0 z-30 flex w-full flex-col border-b bg-background shadow-sm">
      {/* Top Part: Logo and User Actions */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Icons.Logo className="h-6 w-6 text-primary" /> {/* text-primary will now be dynamic */}
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
      <nav className="w-full border-t bg-background">
        <Tabs value={activeTabValue} className="w-full">
          <TabsList className="container mx-auto h-12 justify-start rounded-none bg-transparent p-0 -mb-px overflow-x-auto">
            {appNavItems.map((item) => {
              if (!item.href) return null; // Skip items that are just group titles
              const Icon = item.icon;
              const isActive = activeTabValue === item.href;

              return (
                <TabsTrigger
                  key={item.title}
                  value={item.href}
                  asChild
                  className={cn(
                    "h-full rounded-none px-4 text-sm font-medium transition-all duration-150 ease-in-out",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--page-main-color)]", // Dynamic ring color
                    isActive
                      ? 'shadow-[inset_0_-2px_0_0_var(--page-main-color)]' // Active indicator uses dynamic color
                      : 'text-muted-foreground hover:text-[var(--page-main-color)] hover:opacity-90' 
                  )}
                  style={
                    isActive 
                    ? { 
                        backgroundColor: item.color || 'var(--page-main-color)', 
                        color: item.contrastColor || 'var(--page-main-contrast-color)',
                        // @ts-ignore
                        '--page-main-color': item.color, // Make sure var is available for shadow
                      } 
                    : {}
                  }
                >
                  <Link href={item.href}>
                    {Icon && <Icon className="mr-2 h-4 w-4 shrink-0" />}
                    {item.title}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </nav>
    </header>
  );
}
