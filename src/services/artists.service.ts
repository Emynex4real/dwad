import type { ArtistProfile, UploadAccess } from '../types/dashboard';
import { MOCK_ARTISTS } from '../data/mock/artists';

// In-memory store — swap this for fetch() calls to your backend
let store: ArtistProfile[] = structuredClone(MOCK_ARTISTS);

export function getAllArtists(): ArtistProfile[] {
  return store;
}

export function getArtistById(id: string): ArtistProfile | undefined {
  return store.find((a) => a.id === id);
}

export function getArtistByEmail(email: string): ArtistProfile | undefined {
  return store.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function updateArtist(id: string, patch: Partial<ArtistProfile>): ArtistProfile | null {
  const idx = store.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...patch };
  return store[idx];
}

export function setUploadAccess(artistId: string, access: UploadAccess): ArtistProfile | null {
  return updateArtist(artistId, { uploadAccess: access });
}

export function deleteArtist(id: string): boolean {
  const before = store.length;
  store = store.filter((a) => a.id !== id);
  return store.length < before;
}

export function createArtist(artist: Omit<ArtistProfile, 'id' | 'joinedDate'>): ArtistProfile {
  const newArtist: ArtistProfile = {
    ...artist,
    id: `artist-${Date.now()}`,
    joinedDate: new Date().toISOString().split('T')[0],
  };
  store.push(newArtist);
  return newArtist;
}
