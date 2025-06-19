"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDownIcon } from "lucide-react";

interface AppSidebarNavProps {
  items: NavItem[];
}

export function AppSidebarNav({ items }: AppSidebarNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        const Icon = item.icon;
        const isActive = item.href ? pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) : false;
        const isParentActive = item.items?.some(subItem => pathname.startsWith(subItem.href));

        if (item.items && item.items.length > 0) {
          return (
            <SidebarMenuItem key={index}>
               <Accordion type="single" collapsible className="w-full" defaultValue={isParentActive ? `item-${index}`: undefined}>
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger 
                    className={cn(
                      "flex items-center w-full justify-between rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      (isActive || isParentActive) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                      "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>svg.lucide-chevron-down]:group-data-[collapsible=icon]:hidden"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSub className="ml-3.5 mt-1">
                      {item.items.map((subItem, subIndex) => {
                        const SubIcon = subItem.icon;
                        const isSubItemActive = pathname === subItem.href || (subItem.href !== '/' && pathname.startsWith(subItem.href));
                        return (
                          <SidebarMenuSubItem key={subIndex}>
                            <Link href={subItem.disabled ? "#" : subItem.href} legacyBehavior passHref>
                              <SidebarMenuSubButton
                                isActive={isSubItemActive}
                                aria-disabled={subItem.disabled}
                                className={cn(subItem.disabled && "cursor-not-allowed opacity-60")}
                              >
                                {SubIcon && <SubIcon className="h-4 w-4" />}
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </Link>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenuItem>
          );
        }

        return (
          <SidebarMenuItem key={index}>
            <Link href={item.disabled ? "#" : item.href} legacyBehavior passHref>
              <SidebarMenuButton
                isActive={isActive}
                disabled={item.disabled}
                aria-disabled={item.disabled}
                tooltip={item.title} // Show tooltip when collapsed
                className={cn(item.disabled && "cursor-not-allowed opacity-60")}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
