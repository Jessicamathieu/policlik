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
import { appNavItems } from "@/config/nav";
import type { NavItem } from "@/types";

// Helper function to determine the active tab based on the current pathname
const getCurrentBasePath = (currentPathname: string, navItems: NavItem[]): string => {
  // Sort navItems by href length descending to match more specific paths first
  // e.g., /devis/liste before /devis
  const sortedNavItems = [...navItems].sort((a, b) => {
    const lenA = a.href?.length || 0;
    const lenB = b.href?.length || 0;
    return lenB - lenA;
  });

  for (const item of sortedNavItems) {
    if (item.href && currentPathname.startsWith(item.href)) {
      return item.href;
    }
  }
  // Fallback: if on root of app section, default to dashboard or first item
  if (currentPathname === "/dashboard" && navItems.find(item => item.href === "/dashboard")) return "/dashboard";
  return navItems.length > 0 && navItems[0].href ? navItems[0].href : currentPathname;
};


export function AppHeader() {
  const pathname = usePathname();
  const activeTabValue = getCurrentBasePath(pathname, appNavItems);

  return (
    <header className="sticky top-0 z-30 flex w-full flex-col border-b bg-background shadow-sm">
      {/* Top Part: Logo and User Actions */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-0">
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
      <nav className="w-full border-t bg-background">
        <Tabs value={activeTabValue} className="w-full">
          <TabsList className="container mx-auto h-12 justify-start rounded-none bg-transparent p-0 -mb-px overflow-x-auto">
            {appNavItems.map((item) => {
              // We only render top-level items that have an href.
              // Items that are only group titles for a sidebar accordion are skipped.
              if (!item.href) return null;

              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.title}
                  value={item.href}
                  asChild
                  className="h-full data-[state=active]:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] data-[state=active]:text-primary rounded-none px-4 text-sm font-medium text-muted-foreground hover:text-primary"
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
