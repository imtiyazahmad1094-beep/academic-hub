import { AcademicProgram, ProgramStatus } from '../types';

// Reference date for temporal calculations in the app environment (2026-09-18)
export const TODAY_ISO = '2026-09-18';

export function getDaysDifference(targetDateIso: string, fromDateIso: string = TODAY_ISO): number {
  const target = new Date(targetDateIso);
  const from = new Date(fromDateIso);
  
  // Set both to midnight UTC to calculate accurate integer days difference
  const targetUtc = Date.UTC(target.getFullYear(), target.getMonth(), target.getDate());
  const fromUtc = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  
  const diffTime = targetUtc - fromUtc;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const getDaysUntil = getDaysDifference;

export function getProgramStatus(dateIso: string): ProgramStatus {
  const diff = getDaysDifference(dateIso);
  if (diff < 0) {
    return 'expired'; // Solid Red
  } else if (diff >= 0 && diff <= 3) {
    return 'approaching'; // Blinking Red (very near)
  } else {
    return 'upcoming'; // Normal state standard theme colors
  }
}

export function getWordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getDayOfWeek(dateIso: string): string {
  if (!dateIso) return '';
  const date = new Date(dateIso + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()] || '';
}

export function formatFriendlyDate(dateIso: string): string {
  if (!dateIso) return '';
  const date = new Date(dateIso + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getRelativeTimeString(dateIso: string): string {
  const diff = getDaysDifference(dateIso);
  if (diff < 0) {
    const abs = Math.abs(diff);
    return abs === 1 ? 'Ended yesterday' : `Ended ${abs} days ago`;
  } else if (diff === 0) {
    return 'Happening Today!';
  } else if (diff === 1) {
    return 'Happening Tomorrow!';
  } else if (diff <= 3) {
    return `In ${diff} days (Approaching soon!)`;
  } else {
    return `In ${diff} days`;
  }
}
