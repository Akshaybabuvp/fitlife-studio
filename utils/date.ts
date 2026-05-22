import {
  format,
  differenceInDays,
  isPast,
  isWithinInterval,
  addDays,
  subMonths,
} from 'date-fns';
import type { FeeStatus } from '@/types';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy');
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function formatMonth(date: string | Date): string {
  return format(new Date(date), 'MMM yyyy');
}

export function getFeeStatus(expiryDate: string): FeeStatus {
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isPast(expiry) && expiry < today) return 'expired';

  const sevenDaysFromNow = addDays(today, 7);
  if (isWithinInterval(expiry, { start: today, end: sevenDaysFromNow })) {
    return 'expiring_soon';
  }

  return 'active';
}

export function daysUntilExpiry(expiryDate: string): number {
  return differenceInDays(new Date(expiryDate), new Date());
}

export function getMonthLabel(date: Date): string {
  return format(date, 'MMM');
}

export function getMonthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function getLast6Months(): { label: string; key: string }[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i);
    return { label: getMonthLabel(d), key: getMonthKey(d) };
  });
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function getCurrentYearRange(): { start: string; end: string } {
  const now = new Date();
  return {
    start: `${now.getFullYear()}-01-01`,
    end: `${now.getFullYear()}-12-31`,
  };
}
