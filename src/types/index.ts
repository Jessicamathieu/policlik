
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[];
  color?: string; // Added for dynamic tab/page color
  contrastColor?: string; // Added for text on colored background
}
