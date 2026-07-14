import type { TrackUpload, TrackStatus } from '../types/dashboard';
import { apiFetch, ApiError } from './httpClient';

export async function getAllTracks(): Promise<TrackUpload[]> {
  return apiFetch<TrackUpload[]>('/tracks');
}

export async function getTracksByArtist(artistId: string): Promise<TrackUpload[]> {
  return apiFetch<TrackUpload[]>(`/tracks/artist/${artistId}`);
}

export async function getTrackById(id: string): Promise<TrackUpload | undefined> {
  try {
    return await apiFetch<TrackUpload>(`/tracks/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}

export async function updateTrackStatus(
  trackId: string,
  status: TrackStatus,
  reviewNote?: string,
): Promise<TrackUpload> {
  return apiFetch<TrackUpload>(`/tracks/${trackId}/status`, {
    method: 'PATCH',
    body: { status, ...(reviewNote ? { reviewNote } : {}) },
  });
}

export async function updateTrack(id: string, patch: Partial<TrackUpload>): Promise<TrackUpload> {
  return apiFetch<TrackUpload>(`/tracks/${id}`, { method: 'PATCH', body: patch });
}

export async function submitTrack(formData: FormData): Promise<TrackUpload> {
  return apiFetch<TrackUpload>('/tracks', { method: 'POST', body: formData });
}
