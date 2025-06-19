
import type { NavItem } from '@/types';
import { LayoutDashboard, CalendarDays, Users, FileText, Briefcase, Settings, CreditCard, DollarSign, FilePlus2 } from 'lucide-react';

// Définition des couleurs et de leurs contrastes
const pageColors = [
  { color: '#2743e3', contrastColor: '#FFFFFF', name: 'blue' }, // Bleu
  { color: '#0ccc34', contrastColor: '#FFFFFF', name: 'green' }, // Vert
  { color: '#fb9026', contrastColor: '#FFFFFF', name: 'orange' }, // Orange
  { color: '#ffff00', contrastColor: '#000000', name: 'yellow' }, // Jaune
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
        color: pageColors[3].color, // Hérite de la couleur parente ou peut être spécifique
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
    color: pageColors[0].color, // Cycle back to blue
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
    color: pageColors[1].color, // Cycle to green
    contrastColor: pageColors[1].contrastColor,
  },
  {
    title: 'Dépenses',
    href: '/depenses',
    icon: DollarSign,
    color: pageColors[2].color, // Cycle to orange
    contrastColor: pageColors[2].contrastColor,
  },
  {
    title: 'Paiements',
    href: '/paiements',
    icon: CreditCard, // Changed icon for variety
    color: pageColors[3].color, // Cycle to yellow
    contrastColor: pageColors[3].contrastColor,
  },
  // {
  //   title: 'Paramètres',
  //   href: '/settings',
  //   icon: Settings,
  //   color: pageColors[0].color, // Example, or a neutral color
  //   contrastColor: pageColors[0].contrastColor,
  // },
];

// Helper function to find NavItem and its color, including searching in sub-items
export const getActiveNavItemConfig = (pathname: string): NavItem | undefined => {
  for (const item of appNavItems) {
    if (item.href && pathname.startsWith(item.href!)) {
      if (item.items) {
        const activeSubItem = item.items.find(subItem => subItem.href && pathname.startsWith(subItem.href!));
        if (activeSubItem) return activeSubItem;
      }
      return item;
    }
  }
  // Fallback if only a parent path is matched without direct href (e.g. /devis matching the Devis group)
  for (const item of appNavItems) {
    if (item.href && pathname.startsWith(item.href.split('/')[1])) { // match base path segment
        return item;
    }
  }
  return appNavItems.find(item => item.href === '/dashboard'); // Default
};
