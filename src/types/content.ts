// ── Marketing content managed via the admin panel ──────────────────────────────
// Distinct from types/dashboard.ts: this is public-facing marketing content
// (songs we produce, beats for sale), not internal dashboard/artist data.

export interface Production {
  id: string;
  title: string;
  artistName: string;
  coverArtUrl: string | null;
  audioFileUrl: string | null;
  spotifyUrl: string | null;
  createdAt: string;
}

const BeatType = { Lease: 'lease', Purchase: 'purchase' } as const;
export type BeatType = typeof BeatType[keyof typeof BeatType];

export interface Beat {
  id: string;
  title: string;
  bpm: string | null;
  type: BeatType;
  price: number | null;
  audioFileUrl: string | null;
  createdAt: string;
}

export interface LocalizedPricing {
  currencyCode: string;
  rate: number;
}

export interface PricingPlan {
  id: string;
  label: string;
  price: number;
  updatedAt: string;
}

export interface LiveTrack {
  id: string;
  title: string;
  artistName: string;
  coverArtUrl: string;
  releaseLink: string | null;
  releaseDate: string;
}
