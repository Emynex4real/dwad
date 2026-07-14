import type { ExchangeRate } from '../types/dashboard';
import { apiFetch } from './httpClient';

export async function getExchangeRate(): Promise<ExchangeRate> {
  return apiFetch<ExchangeRate>('/settings/exchange-rate');
}

export async function updateExchangeRate(gbpToUsdRate: number): Promise<ExchangeRate> {
  return apiFetch<ExchangeRate>('/settings/exchange-rate', { method: 'PATCH', body: { gbpToUsdRate } });
}
