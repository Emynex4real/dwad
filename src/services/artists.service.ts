import type { ArtistProfile, UploadAccess, PayoutMethod } from '../types/dashboard';
import { apiFetch, ApiError } from './httpClient';

export async function getAllArtists(): Promise<ArtistProfile[]> {
  return apiFetch<ArtistProfile[]>('/artists');
}

export async function getArtistById(id: string): Promise<ArtistProfile | undefined> {
  try {
    return await apiFetch<ArtistProfile>(`/artists/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return undefined;
    throw err;
  }
}

export async function updateArtist(
  id: string,
  patch: Partial<ArtistProfile> & { password?: string },
): Promise<ArtistProfile | null> {
  try {
    return await apiFetch<ArtistProfile>(`/artists/${id}`, { method: 'PATCH', body: patch });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function setUploadAccess(artistId: string, access: UploadAccess): Promise<ArtistProfile | null> {
  try {
    return await apiFetch<ArtistProfile>(`/artists/${artistId}/upload-access`, {
      method: 'PATCH',
      body: { uploadAccess: access },
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export async function updatePayout(
  artistId: string,
  payoutMethod: PayoutMethod | null,
  payoutDetails: string,
): Promise<ArtistProfile> {
  return apiFetch<ArtistProfile>(`/artists/${artistId}/payout`, {
    method: 'PATCH',
    body: { payoutMethod, payoutDetails },
  });
}

export async function deleteArtist(id: string): Promise<boolean> {
  try {
    await apiFetch(`/artists/${id}`, { method: 'DELETE' });
    return true;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return false;
    throw err;
  }
}

export type NewArtist = Omit<ArtistProfile, 'id' | 'joinedDate' | 'subscription' | 'status'> & {
  password: string;
  subscription: Omit<ArtistProfile['subscription'], 'id' | 'artistId'>;
};

export async function createArtist(artist: NewArtist): Promise<ArtistProfile> {
  return apiFetch<ArtistProfile>('/artists', { method: 'POST', body: artist });
}

export async function approveArtist(id: string): Promise<ArtistProfile | null> {
  try {
    return await apiFetch<ArtistProfile>(`/artists/${id}/approve`, { method: 'PATCH' });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
