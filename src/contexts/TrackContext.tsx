import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { TrackUpload } from '../types/dashboard';
import { getAllTracks, getTracksByArtist } from '../services/tracks.service';
import { useAuth } from '../hooks/useAuth';
import { TrackContext } from '../hooks/useTracks';

export function TrackProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tracks, setTracks] = useState<TrackUpload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadedForUserId = useRef<string | null>(null);
  const prevUserId = useRef<string | undefined>(undefined);

  if (user?.id !== prevUserId.current) {
    prevUserId.current = user?.id;
    if (!user) setTracks([]);
  }

  useEffect(() => {
    if (!user) {
      loadedForUserId.current = null;
      return;
    }
    if (loadedForUserId.current === user.id) return;
    const currentUser = user;

    async function load() {
      setIsLoading(true);
      if (currentUser.role === 'admin') {
        setTracks(await getAllTracks());
      } else if (currentUser.artistId) {
        setTracks(await getTracksByArtist(currentUser.artistId));
      } else {
        setTracks([]);
      }
      loadedForUserId.current = currentUser.id;
      setIsLoading(false);
    }
    void load();
  }, [user]);

  const getTracksForArtist = useCallback(
    (artistId: string) => tracks.filter((t) => t.artistId === artistId),
    [tracks],
  );

  const refreshTracks = useCallback(async () => {
    if (!user) return;
    if (user.role === 'admin') {
      setTracks(await getAllTracks());
    } else if (user.artistId) {
      setTracks(await getTracksByArtist(user.artistId));
    }
  }, [user]);

  const updateTrackInCache = useCallback((id: string, patch: Partial<TrackUpload>) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const addTrackToCache = useCallback((track: TrackUpload) => {
    setTracks((prev) => [...prev, track]);
  }, []);

  return (
    <TrackContext.Provider value={{ tracks, isLoading, getTracksForArtist, refreshTracks, updateTrackInCache, addTrackToCache }}>
      {children}
    </TrackContext.Provider>
  );
}
