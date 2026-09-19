import type { LucideIcon } from 'lucide-react';

/* ---------- Navigation ---------- */

export type SectionId = 'home' | 'events' | 'projects' | 'gallery' | 'about';

/* ---------- Shared accent palette keys ---------- */

export type AccentColor = 'indigo' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';

/* ---------- Feature cards (club domains) ---------- */

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: AccentColor;
  membersActive: number;
  cadence: string;
}

/* ---------- Projects ---------- */

export type ProjectCategory = 'robotics' | 'eco' | 'space';
export type ProjectStatus = 'In Progress' | 'Peer Review' | 'Recruiting' | 'Completed';
export type ProjectTab = ProjectCategory | 'all';

export interface Contributor {
  name: string;
  role: string;
}

export interface Milestone {
  label: string;
  date: string;
  done: boolean;
  /** The milestone currently being worked on */
  current?: boolean;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  status: ProjectStatus;
  /** 0 – 100 */
  progress: number;
  summary: string;
  lead: Contributor;
  team: Contributor[];
  milestones: Milestone[];
  tags: string[];
  updatedAt: string;
}

/* ---------- Announcements / notices ---------- */

export type NoticeStatus = 'live' | 'upcoming' | 'registration';

export interface Notice {
  id: string;
  status: NoticeStatus;
  title: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  /** Seats remaining (status: registration) */
  seatsLeft?: number;
  /** Current viewer count (status: live) */
  watching?: number;
}

/* ---------- Hero / misc ---------- */

export interface HeroStat {
  id: string;
  value: string;
  label: string;
}

export interface GalleryTileData {
  id: string;
  title: string;
  meta: string;
  category: string;
  icon: LucideIcon;
  gradient: string;
}

export interface AboutValue {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}
