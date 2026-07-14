import type { Payout } from '../types/dashboard';
import { apiFetch } from './httpClient';

export async function recordPayout(artistId: string, amountUsd: number, note?: string, period?: string): Promise<Payout> {
  return apiFetch<Payout>('/payouts', { method: 'POST', body: { artistId, amountUsd, note, period } });
}

export async function getPayoutHistory(artistId: string): Promise<Payout[]> {
  return apiFetch<Payout[]>(`/payouts/artist/${artistId}`);
}
