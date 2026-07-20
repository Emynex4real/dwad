import type { Production } from '../types/content';
import { apiFetch } from './httpClient';

export async function getAllProductions(): Promise<Production[]> {
  return apiFetch<Production[]>('/productions');
}

export async function createProduction(formData: FormData): Promise<Production> {
  return apiFetch<Production>('/productions', { method: 'POST', body: formData });
}

export async function updateProduction(id: string, formData: FormData): Promise<Production> {
  return apiFetch<Production>(`/productions/${id}`, { method: 'POST', body: formData });
}

export async function deleteProduction(id: string): Promise<void> {
  await apiFetch(`/productions/${id}`, { method: 'DELETE' });
}
