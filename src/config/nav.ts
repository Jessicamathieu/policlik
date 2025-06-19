
import type { NavItem } from '@/types';
import { LayoutDashboard, CalendarDays, Users, FileText, Truck, Briefcase, Settings, CreditCard, DollarSign, FilePlus2 } from 'lucide-react';

export const appNavItems: NavItem[] = [
  {
    title: 'Tableau de Bord',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Agenda',
    href: '/agenda',
    icon: CalendarDays,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Devis',
    href: '/devis',
    icon: FileText,
    items: [
      {
        title: 'Nouvelle Demande',
        href: '/devis/demandes',
        icon: FilePlus2, 
      },
      {
        title: 'Liste des Devis',
        href: '/devis/liste',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Factures',
    href: '/factures',
    icon: CreditCard,
    items: [ // Added sub-items for Factures
      {
        title: 'Liste des Factures',
        href: '/factures', // Main page for listing
        icon: CreditCard,
      },
      {
        title: 'Nouvelle Facture',
        href: '/factures/nouveau',
        icon: FilePlus2, // Using FilePlus2 for "new"
      }
    ]
  },
  {
    title: 'Services',
    href: '/services',
    icon: Briefcase,
  },
  {
    title: 'Dépenses',
    href: '/depenses',
    icon: DollarSign,
  },
  {
    title: 'Paiements',
    href: '/paiements',
    icon: CreditCard,
  },
  // {
  //   title: 'Paramètres',
  //   href: '/settings',
  //   icon: Settings,
  // },
];
