import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ArtistProfile } from '../types/dashboard';
import { getAllArtists, getArtistById } from '../services/artists.service';
import { useAuth } from '../hooks/useAuth';
import { ArtistContext } from '../hooks/useArtists';

export function ArtistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadedForUserId = useRef<string | null>(null);
  const prevUserId = useRef<string | undefined>(undefined);

  if (user?.id !== prevUserId.current) {
    prevUserId.current = user?.id;
    if (!user) setArtists([]);
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
        setArtists(await getAllArtists());
      } else if (currentUser.artistId) {
        const artist = await getArtistById(currentUser.artistId);
        setArtists(artist ? [artist] : []);
      } else {
        setArtists([]);
      }
      loadedForUserId.current = currentUser.id;
      setIsLoading(false);
    }
    void load();
  }, [user]);

  const getArtist = useCallback(
    (id: string) => artists.find((a) => a.id === id),
    [artists],
  );

  const fetchArtist = useCallback(
    async (id: string): Promise<ArtistProfile | undefined> => {
      const existing = artists.find((a) => a.id === id);
      if (existing) return existing;
      const fetched = await getArtistById(id);
      if (fetched) {
        setArtists((prev) => (prev.some((a) => a.id === id) ? prev.map((a) => (a.id === id ? fetched : a)) : [...prev, fetched]));
      }
      return fetched;
    },
    [artists],
  );

  const refreshArtists = useCallback(async () => {
    if (!user) return;
    if (user.role === 'admin') {
      setArtists(await getAllArtists());
    } else if (user.artistId) {
      const artist = await getArtistById(user.artistId);
      setArtists(artist ? [artist] : []);
    }
  }, [user]);

  const updateArtistInCache = useCallback((id: string, patch: Partial<ArtistProfile>) => {
    setArtists((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const addArtistToCache = useCallback((artist: ArtistProfile) => {
    setArtists((prev) => [...prev, artist]);
  }, []);

  const removeArtistFromCache = useCallback((id: string) => {
    setArtists((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <ArtistContext.Provider
      value={{ artists, isLoading, getArtist, fetchArtist, refreshArtists, updateArtistInCache, addArtistToCache, removeArtistFromCache }}
    >
      {children}
    </ArtistContext.Provider>
  );
}
