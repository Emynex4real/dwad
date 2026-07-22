import type { LocalizedPricing, CurrencyRate } from '../types/content';
import { apiFetch } from './httpClient';

export async function getLocalizedPricing(base: string = 'USD'): Promise<LocalizedPricing> {
  return apiFetch<LocalizedPricing>(`/pricing/localized?base=${base}`);
}

export async function getAdminCurrencyRates(): Promise<CurrencyRate[]> {
  return apiFetch<CurrencyRate[]>('/pricing/rates');
}

export async function updateCurrencyRate(code: string, rate: number): Promise<void> {
  await apiFetch(`/pricing/rates/${code}`, { method: 'PATCH', body: { rate } });
}

export async function clearCurrencyRate(code: string): Promise<void> {
  await apiFetch(`/pricing/rates/${code}`, { method: 'DELETE' });
}
