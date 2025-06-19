import type { NavItem } from '@/types';
import { LayoutDashboard, CalendarDays, Users, FileText, Truck, Briefcase, Settings, CreditCard, DollarSign } from 'lucide-react';

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
        icon: FileText, // Sub-items might not need icons if clear by context
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
