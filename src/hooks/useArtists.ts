import { createContext, useContext } from 'react';
import type { ArtistProfile } from '../types/dashboard';

export interface ArtistContextValue {
  artists: ArtistProfile[];
  isLoading: boolean;
  getArtist: (id: string) => ArtistProfile | undefined;
  fetchArtist: (id: string) => Promise<ArtistProfile | undefined>;
  refreshArtists: () => Promise<void>;
  updateArtistInCache: (id: string, patch: Partial<ArtistProfile>) => void;
  addArtistToCache: (artist: ArtistProfile) => void;
  removeArtistFromCache: (id: string) => void;
}

export const ArtistContext = createContext<ArtistContextValue | null>(null);

export function useArtists(): ArtistContextValue {
  const ctx = useContext(ArtistContext);
  if (!ctx) throw new Error('useArtists must be used inside ArtistProvider');
  return ctx;
}
