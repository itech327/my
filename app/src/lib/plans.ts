import type { Plan } from './types';

// Placeholder plans. /replica-launch sets the real pricing from research.
export const PLANS: Plan[] = [
  { id: 'free', name: 'تجربة', priceUsd: 0, periodMonths: 0, seconds: 60 },
  { id: 'starter', name: 'بداية', priceUsd: 5, periodMonths: 1, seconds: 30 * 60 },
  { id: 'creator', name: 'صانع محتوى', priceUsd: 14, periodMonths: 1, seconds: 150 * 60, highlight: true },
  { id: 'pro', name: 'محترف', priceUsd: 45, periodMonths: 3, seconds: 8 * 3600 },
  { id: 'studio', name: 'استوديو', priceUsd: 65, periodMonths: 6, seconds: 18 * 3600 },
];

export const planById = (id: string) => PLANS.find((p) => p.id === id);
