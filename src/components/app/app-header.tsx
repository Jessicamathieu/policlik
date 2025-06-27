
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
import { LogOut, UserCircle, Settings } from "lucide-react";
import { appNavItems } from "@/config/nav";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";


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
  const { user, signOut } = useAuth();
  const activeTabValue = getCurrentBasePathForTabs(pathname, appNavItems);

  return (
    <header className="sticky top-0 z-30 flex w-full flex-col bg-background">
      {/* Top Part: Logo and User Actions */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
           <Image
            src="/logo-PoliCliK.png"
            alt="PolicliK Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt="Avatar utilisateur" data-ai-hint="user avatar" />
                <AvatarFallback>{user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Ouvrir le menu utilisateur</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              {user ? (
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.displayName ? user.email : ''}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Chargement...</p>
                </div>
              )}
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
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bottom Part: Navigation Tabs */}
      <nav className="w-full bg-background">
        <Tabs value={activeTabValue} className="w-full">
          <TabsList className="grid h-12 w-full grid-cols-8 rounded-none bg-transparent p-0">
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
                    "h-full rounded-none p-0 text-sm transition-all duration-150 ease-in-out",
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
                  <Link href={item.href} style={{color: item.contrastColor }} className="flex h-full w-full items-center justify-center gap-2 px-3 lg:px-4">
                    {Icon && <Icon className="h-4 w-4 shrink-0" />}
                    <span className="hidden lg:inline">{item.title}</span>
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
