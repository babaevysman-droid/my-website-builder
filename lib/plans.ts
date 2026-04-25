import { PlanType } from '@/types';

export const PLAN_LIMITS: Record<PlanType, number> = {
  free: 1,
  pro: 10,
  business: 100,
};

export function canCreateSite(plan: PlanType, currentSitesCount: number) {
  return currentSitesCount < PLAN_LIMITS[plan];
}

export function shouldShowWatermark(plan: PlanType) {
  return plan === 'free';
}