import type { SpotlightContent, SpotlightItem, SpotlightSettings } from '../types/content';
import { apiFetch } from './httpClient';

export async function getSpotlightContent(): Promise<SpotlightContent> {
  return apiFetch<SpotlightContent>('/spotlight');
}

export async function createSpotlightItem(formData: FormData): Promise<SpotlightItem> {
  return apiFetch<SpotlightItem>('/spotlight/items', { method: 'POST', body: formData });
}

export async function updateSpotlightItem(id: string, formData: FormData): Promise<SpotlightItem> {
  return apiFetch<SpotlightItem>(`/spotlight/items/${id}`, { method: 'POST', body: formData });
}

export async function deleteSpotlightItem(id: string): Promise<void> {
  await apiFetch(`/spotlight/items/${id}`, { method: 'DELETE' });
}

export async function moveSpotlightItem(id: string, direction: 'up' | 'down'): Promise<SpotlightItem> {
  return apiFetch<SpotlightItem>(`/spotlight/items/${id}/move`, { method: 'PATCH', body: { direction } });
}

export async function updateSpotlightSettings(
  fields: Partial<Record<'artistOfMonthName' | 'artistOfMonthGenre' | 'artistOfMonthCountry', string>>,
  photo?: File | null,
): Promise<SpotlightSettings> {
  if (photo) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }
    formData.append('photo', photo);
    return apiFetch<SpotlightSettings>('/spotlight/settings', { method: 'POST', body: formData });
  }
  return apiFetch<SpotlightSettings>('/spotlight/settings', { method: 'PATCH', body: fields });
}
