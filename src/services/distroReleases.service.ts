import type { DistroRelease } from '../types/content';
import { apiFetch } from './httpClient';

export async function getAllDistroReleases(): Promise<DistroRelease[]> {
  return apiFetch<DistroRelease[]>('/distro-releases');
}

export async function createDistroRelease(formData: FormData): Promise<DistroRelease> {
  return apiFetch<DistroRelease>('/distro-releases', { method: 'POST', body: formData });
}

export async function updateDistroRelease(id: string, formData: FormData): Promise<DistroRelease> {
  return apiFetch<DistroRelease>(`/distro-releases/${id}`, { method: 'POST', body: formData });
}

export async function deleteDistroRelease(id: string): Promise<void> {
  await apiFetch(`/distro-releases/${id}`, { method: 'DELETE' });
}
