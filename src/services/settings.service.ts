import type { ExchangeRate } from '../types/dashboard';
import { apiFetch } from './httpClient';

export async function getExchangeRate(): Promise<ExchangeRate> {
  return apiFetch<ExchangeRate>('/settings/exchange-rate');
}
