import type { ArtistAnalytics } from '../types/dashboard';
import { apiFetch } from './httpClient';

export async function getAllAnalytics(): Promise<ArtistAnalytics[]> {
  return apiFetch<ArtistAnalytics[]>('/analytics');
}

export async function getArtistAnalytics(artistId: string): Promise<ArtistAnalytics> {
  return apiFetch<ArtistAnalytics>(`/analytics/artist/${artistId}`);
}
