import type { LocalizedPricing, PricingGroup, PricingPlan } from '../types/content';
import { apiFetch } from './httpClient';

export async function getLocalizedPricing(base: string = 'USD'): Promise<LocalizedPricing> {
  return apiFetch<LocalizedPricing>(`/pricing/localized?base=${base}`);
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  return apiFetch<PricingPlan[]>('/pricing/plans');
}

export interface PricingPlanUpdate {
  label?: string;
  price?: number;
  features?: string[];
  featured?: boolean;
}

export async function updatePricingPlan(id: string, updates: PricingPlanUpdate): Promise<PricingPlan> {
  return apiFetch<PricingPlan>(`/pricing/plans/${id}`, { method: 'PATCH', body: updates });
}

export interface PricingPlanInput {
  label: string;
  price: number;
  features: string[];
  groupKey: PricingGroup;
  featured?: boolean;
}

export async function createPricingPlan(input: PricingPlanInput): Promise<PricingPlan> {
  return apiFetch<PricingPlan>('/pricing/plans', { method: 'POST', body: input });
}

export async function deletePricingPlan(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/pricing/plans/${id}`, { method: 'DELETE' });
}
