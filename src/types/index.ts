import type { LucideIcon } from 'lucide-react';

/* ---------- Auth / members ---------- */

export type Role = 'admin' | 'member';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  member: Member;
}

export interface Stats {
  members: number;
  projects: number;
  facts: number;
  notices: number;
}

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

export interface ProjectDraft {
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progress: number;
  summary: string;
  leadName: string;
  tags: string[];
}

/* ---------- Announcements / notices ---------- */

export type NoticeStatus = 'live' | 'upcoming' | 'registration';

export interface Notice {
  id: string;
  featured?: boolean;
  status: NoticeStatus;
  title: string;
  description: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  seatsLeft?: number;
  watching?: number;
}

export interface NoticeDraft {
  title: string;
  description: string;
  status: NoticeStatus;
  dateLabel: string;
  timeLabel: string;
  location: string;
  featured: boolean;
}

/* ---------- Quotes ---------- */

export interface Quote {
  id: string;
  text: string;
  author: string;
  role: string;
  active: boolean;
  createdAt: string;
}

/* ---------- Did-you-know facts ---------- */

export interface Fact {
  id: string;
  fact: string;
  topic: string;
  createdAt: string;
}

/* ---------- Applications & subscribers ---------- */

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  name: string;
  email: string;
  grade: string;
  interest: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

/* ---------- Static editorial content ---------- */

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
