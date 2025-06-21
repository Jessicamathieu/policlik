
import type { NavItem } from '@/types';
import { LayoutDashboard, CalendarDays, Users, FileText, Briefcase, Settings, CreditCard, DollarSign, FilePlus2, Package, BookMarked } from 'lucide-react';

// Définition des couleurs et de leurs contrastes
// Exporting pageColors to be used in AppHeader for the gradient and RootLayout for HSL updates
export const pageColors = [
  { color: '#3F51B5', contrastColor: '#FFFFFF', name: 'blue' }, // Polimik Dark Blue (Primary Style Guide)
  { color: '#0ccc34', contrastColor: '#FFFFFF', name: 'green' }, 
  { color: '#FF9800', contrastColor: '#FFFFFF', name: 'orange' }, // Polimik Orange (Accent Style Guide)
  { color: '#F0F2F5', contrastColor: '#FF9800', name: 'light-gray' }, // Polimik Light Gray (Background) -> Text Orange (Accent)
];

export const appNavItems: NavItem[] = [
  {
    title: 'Tableau de Bord',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: pageColors[0].color,
    contrastColor: pageColors[0].contrastColor,
  },
  {
    title: 'Agenda',
    href: '/agenda',
    icon: CalendarDays,
    color: pageColors[1].color,
    contrastColor: pageColors[1].contrastColor,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
    color: pageColors[2].color,
    contrastColor: pageColors[2].contrastColor,
  },
  {
    title: 'Devis',
    href: '/devis',
    icon: FileText,
    color: pageColors[3].color, 
    contrastColor: pageColors[3].contrastColor, 
    items: [
      {
        title: 'Nouvelle Demande',
        href: '/devis/demandes',
        icon: FilePlus2,
        color: pageColors[3].color, 
        contrastColor: pageColors[3].contrastColor,
      },
      {
        title: 'Liste des Devis',
        href: '/devis/liste',
        icon: FileText,
        color: pageColors[3].color,
        contrastColor: pageColors[3].contrastColor,
      },
    ],
  },
  {
    title: 'Factures',
    href: '/factures',
    icon: CreditCard,
    color: pageColors[0].color, 
    contrastColor: pageColors[0].contrastColor,
    items: [
      {
        title: 'Liste des Factures',
        href: '/factures', 
        icon: CreditCard,
        color: pageColors[0].color,
        contrastColor: pageColors[0].contrastColor,
      },
      {
        title: 'Nouvelle Facture',
        href: '/factures/nouveau',
        icon: FilePlus2, 
        color: pageColors[0].color,
        contrastColor: pageColors[0].contrastColor,
      }
    ]
  },
  {
    title: 'Catalogue',
    href: '/services',
    icon: BookMarked,
    color: pageColors[1].color, 
    contrastColor: pageColors[1].contrastColor,
  },
  {
    title: 'Dépenses',
    href: '/depenses',
    icon: DollarSign,
    color: pageColors[2].color, 
    contrastColor: pageColors[2].contrastColor,
  },
  {
    title: 'Paiements',
    href: '/paiements',
    icon: CreditCard, 
    color: pageColors[3].color, 
    contrastColor: pageColors[3].contrastColor, 
  },
];

// Refined getActiveNavItemConfig
export const getActiveNavItemConfig = (pathname: string): NavItem | undefined => {
  let bestMatch: NavItem | undefined = undefined;
  let bestMatchLength = 0;

  const checkItems = (items: NavItem[], parentItem?: NavItem) => {
    for (const item of items) {
      const currentItemWithFallbackColor = {
        ...item,
        color: item.color || parentItem?.color,
        contrastColor: item.contrastColor || parentItem?.contrastColor,
      };

      if (currentItemWithFallbackColor.href && pathname.startsWith(currentItemWithFallbackColor.href)) {
        if (currentItemWithFallbackColor.href.length > bestMatchLength) {
          bestMatch = currentItemWithFallbackColor;
          bestMatchLength = currentItemWithFallbackColor.href.length;
        }
      }
      if (item.items) {
        checkItems(item.items, currentItemWithFallbackColor); // Pass parent for color fallback
      }
    }
  };

  checkItems(appNavItems);
  
  // If the bestMatch is a parent of an exact match, prefer the exact match if available
  if (bestMatch && bestMatch.items) {
    const exactSubItemMatch = bestMatch.items.find(sub => sub.href === pathname);
    if (exactSubItemMatch) {
      return {
        ...exactSubItemMatch,
        color: exactSubItemMatch.color || bestMatch.color,
        contrastColor: exactSubItemMatch.contrastColor || bestMatch.contrastColor,
      };
    }
  }
  
  // If the found bestMatch is a parent item (e.g. /devis for path /devis/liste)
  // and an exact match for the parent path itself exists as a sub-item, prefer that sub-item.
   if (bestMatch && bestMatch.href === pathname && bestMatch.items) {
     const exactSelfAsChild = bestMatch.items.find(sub => sub.href === pathname);
     if (exactSelfAsChild) {
       return {
        ...exactSelfAsChild,
        color: exactSelfAsChild.color || bestMatch.color,
        contrastColor: exactSelfAsChild.contrastColor || bestMatch.contrastColor,
      };
     }
   }


  return bestMatch || appNavItems.find(item => item.href === '/dashboard'); // Default to dashboard
};
