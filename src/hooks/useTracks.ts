import { createContext, useContext } from 'react';
import type { TrackUpload } from '../types/dashboard';

export interface TrackContextValue {
  tracks: TrackUpload[];
  isLoading: boolean;
  getTracksForArtist: (artistId: string) => TrackUpload[];
  refreshTracks: () => Promise<void>;
  updateTrackInCache: (id: string, patch: Partial<TrackUpload>) => void;
  addTrackToCache: (track: TrackUpload) => void;
}

export const TrackContext = createContext<TrackContextValue | null>(null);

export function useTracks(): TrackContextValue {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error('useTracks must be used inside TrackProvider');
  return ctx;
}
