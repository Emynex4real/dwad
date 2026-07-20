import type { Beat } from '../types/content';
import { apiFetch } from './httpClient';

export async function getAllBeats(): Promise<Beat[]> {
  return apiFetch<Beat[]>('/beats');
}

export async function createBeat(formData: FormData): Promise<Beat> {
  return apiFetch<Beat>('/beats', { method: 'POST', body: formData });
}

export async function updateBeat(id: string, formData: FormData): Promise<Beat> {
  return apiFetch<Beat>(`/beats/${id}`, { method: 'POST', body: formData });
}

export async function deleteBeat(id: string): Promise<void> {
  await apiFetch(`/beats/${id}`, { method: 'DELETE' });
}
