"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  useSidebar, // Keep useSidebar import if other components might still use parts of the context, though direct usage here is removed
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { appNavItems } from "@/config/nav";
import { AppSidebarNav } from "./app-sidebar-nav";
import { Button } from "../ui/button";
import { LogOut, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// This component is no longer used in AppLayout due to the switch to tab navigation.
// It's kept in case parts of it are needed elsewhere or for future reference.
// The main navigation responsibility has moved to AppHeader with Tabs.
export function AppSidebar() {
  const isMobile = useIsMobile();
  const { state } = useSidebar(); // state might still be useful if sidebar is used in other contexts
  
  return (
    <Sidebar 
      variant="sidebar" 
      collapsible={isMobile ? "offcanvas" : "icon"}
      className="border-r hidden" // Hidden as it's replaced by tabs
    >
      <SidebarHeader className="p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Icons.Logo className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg font-headline">Polimik</span>
        </Link>
         <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full hidden">
           <Icons.Logo className="h-7 w-7 text-primary"/>
         </div>
        {!isMobile && <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AppSidebarNav items={appNavItems} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-2">
        <SidebarGroup>
           <Link href="/settings" passHref legacyBehavior>
            <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                <Settings className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Paramètres</span>
            </Button>
           </Link>
           <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2" onClick={() => { window.location.href = '/login';}}>
             <LogOut className="h-4 w-4" />
             <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
           </Button>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
