import { clsx, type ClassValue } from 'clsx';
import confetti from 'canvas-confetti';
import { UserProfile, UserSkill, Experience, Education, Project } from '../types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatMonthYear(dateString?: string): string {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatCurrency(amount: string | number, currency: string = 'KES'): string {
  if (typeof amount === 'string') return amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  if (!name) return 'CL';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function safeExternalUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  const candidate = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  try {
    const url = new URL(candidate);
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function calculateProfileStrength(
  profile: Partial<UserProfile> | null,
  skills: UserSkill[] = [],
  experience: Experience[] = [],
  education: Education[] = [],
  projects: Project[] = []
): { score: number; checklist: { label: string; completed: boolean; points: number }[] } {
  const checklist = [
    { label: 'Basic profile info & headline', completed: Boolean(profile?.headline && profile?.bio), points: 20 },
    { label: 'Location & contact details', completed: Boolean(profile?.location && profile?.phone), points: 15 },
    { label: 'Add at least 3 skills', completed: skills.length >= 3, points: 20 },
    { label: 'Education history', completed: education.length > 0, points: 15 },
    { label: 'Work or attachment experience', completed: experience.length > 0, points: 15 },
    { label: 'Showcase at least 1 project', completed: projects.length > 0, points: 15 },
  ];

  const score = checklist.reduce((acc, item) => (item.completed ? acc + item.points : acc), 0);

  return { score: Math.min(100, score), checklist };
}

export function fireCelebrationConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#0f2b5c', '#10b981', '#3b82f6', '#059669', '#f59e0b'],
  });
}

