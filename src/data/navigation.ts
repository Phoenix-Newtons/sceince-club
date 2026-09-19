import { CalendarDays, House, Images, Info, Microscope, type LucideIcon } from 'lucide-react';
import type { SectionId } from '../types';

export interface NavLinkItem {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLinkItem[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'projects', label: 'Projects', icon: Microscope },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'about', label: 'About', icon: Info },
];

export const MEMBER_BADGE = {
  count: '100+',
  label: 'Members Active',
} as const;
