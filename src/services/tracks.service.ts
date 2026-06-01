import type { TrackUpload, TrackStatus, ArtistAnalytics } from '../types/dashboard';
import { MOCK_TRACKS, MOCK_ANALYTICS } from '../data/mock/tracks';

let trackStore: TrackUpload[] = structuredClone(MOCK_TRACKS);
const analyticsStore: ArtistAnalytics[] = structuredClone(MOCK_ANALYTICS);

export function getAllTracks(): TrackUpload[] {
  return trackStore;
}

export function getTracksByArtist(artistId: string): TrackUpload[] {
  return trackStore.filter((t) => t.artistId === artistId);
}

export function getTrackById(id: string): TrackUpload | undefined {
  return trackStore.find((t) => t.id === id);
}

export function getPendingTracks(): TrackUpload[] {
  return trackStore.filter((t) => t.status === 'pending');
}

export function updateTrackStatus(
  trackId: string,
  status: TrackStatus,
  reviewNote?: string,
): TrackUpload | null {
  const idx = trackStore.findIndex((t) => t.id === trackId);
  if (idx === -1) return null;
  trackStore[idx] = { ...trackStore[idx], status, ...(reviewNote ? { reviewNote } : {}) };
  return trackStore[idx];
}

export function updateTrack(id: string, patch: Partial<TrackUpload>): TrackUpload | null {
  const idx = trackStore.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  trackStore[idx] = { ...trackStore[idx], ...patch };
  return trackStore[idx];
}

export function submitTrack(track: Omit<TrackUpload, 'id' | 'submittedAt' | 'status'>): TrackUpload {
  const newTrack: TrackUpload = {
    ...track,
    id: `track-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  trackStore.push(newTrack);
  return newTrack;
}

export function getAnalyticsByArtist(artistId: string): ArtistAnalytics | undefined {
  return analyticsStore.find((a) => a.artistId === artistId);
}

export function applyReportData(data: Record<string, { streams: number; revenue: number }>): number {
  let updated = 0;
  for (const [artistId, stats] of Object.entries(data)) {
    const idx = analyticsStore.findIndex((a) => a.artistId === artistId);
    if (idx !== -1) {
      analyticsStore[idx].totalStreams += stats.streams;
      analyticsStore[idx].totalRevenue += stats.revenue;
      updated++;
    }
  }
  return updated;
}
