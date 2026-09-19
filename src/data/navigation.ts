import { House, CalendarDays, Microscope, Images, Info, ShieldCheck, type LucideIcon } from 'lucide-react';

export interface NavLinkItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Only match exactly (no trailing segments) */
  end?: boolean;
}

export const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/projects', label: 'Projects', icon: Microscope },
  { to: '/gallery', label: 'Gallery', icon: Images },
  { to: '/about', label: 'About', icon: Info },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
];
