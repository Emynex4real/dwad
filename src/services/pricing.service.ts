import type { LocalizedPricing, PricingPlan } from '../types/content';
import { apiFetch } from './httpClient';

export async function getLocalizedPricing(base: string = 'USD'): Promise<LocalizedPricing> {
  return apiFetch<LocalizedPricing>(`/pricing/localized?base=${base}`);
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  return apiFetch<PricingPlan[]>('/pricing/plans');
}

export async function updatePricingPlan(id: string, price: number): Promise<PricingPlan> {
  return apiFetch<PricingPlan>(`/pricing/plans/${id}`, { method: 'PATCH', body: { price } });
}
