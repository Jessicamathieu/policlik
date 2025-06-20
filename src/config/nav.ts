
import type { NavItem } from '@/types';
import { LayoutDashboard, CalendarDays, Users, FileText, Briefcase, Settings, CreditCard, DollarSign, FilePlus2 } from 'lucide-react';

// Définition des couleurs et de leurs contrastes
// Exporting pageColors to be used in AppHeader for the gradient and RootLayout for HSL updates
export const pageColors = [
  { color: '#3F51B5', contrastColor: '#FFFFFF', name: 'blue' }, // Polimik Dark Blue (Primary Style Guide)
  { color: '#0ccc34', contrastColor: '#FFFFFF', name: 'green' }, 
  { color: '#FF9800', contrastColor: '#FFFFFF', name: 'orange' }, // Polimik Orange (Accent Style Guide)
  { color: '#F0F2F5', contrastColor: '#000000', name: 'light-gray' }, // Polimik Light Gray (Background Style Guide) - Text black for contrast
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
    color: pageColors[3].color, // Light gray
    contrastColor: pageColors[3].contrastColor, // Black text
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
    title: 'Services',
    href: '/services',
    icon: Briefcase,
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
    color: pageColors[3].color, // Light gray
    contrastColor: pageColors[3].contrastColor, // Black text
  },
];

// Refined getActiveNavItemConfig
export const getActiveNavItemConfig = (pathname: string): NavItem | undefined => {
  let bestMatch: NavItem | undefined = undefined;
  let bestMatchLength = 0;

  const checkItems = (items: NavItem[]) => {
    for (const item of items) {
      if (item.href && pathname.startsWith(item.href)) {
        if (item.href.length > bestMatchLength) {
          bestMatch = item;
          bestMatchLength = item.href.length;
        }
      }
      if (item.items) {
        checkItems(item.items); // Recursively check sub-items
      }
    }
  };

  checkItems(appNavItems);
  
  // If the bestMatch is a parent of an exact match, prefer the exact match if available
  if (bestMatch && bestMatch.items) {
    const exactSubItemMatch = bestMatch.items.find(sub => sub.href === pathname);
    if (exactSubItemMatch) {
      return exactSubItemMatch;
    }
  }
  if (bestMatch?.href === pathname) return bestMatch;

  // If bestMatch is a prefix, and it has sub-items, check if one of them is a more precise default for this path
  if (bestMatch && bestMatch.items && bestMatch.href !== pathname) {
     const defaultChild = bestMatch.items.find(sub => sub.href === bestMatch!.href); // e.g. /factures item linking to /factures
     if (defaultChild) return defaultChild;
  }


  return bestMatch || appNavItems.find(item => item.href === '/dashboard'); // Default to dashboard
};
