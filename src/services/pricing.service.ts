import type { LocalizedPricing } from '../types/content';
import { apiFetch } from './httpClient';

export async function getLocalizedPricing(): Promise<LocalizedPricing> {
  return apiFetch<LocalizedPricing>('/pricing/localized');
}
