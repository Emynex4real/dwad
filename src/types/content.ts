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

// ── Spotlight page content (admin-managed) ──────────────────────────────────
// Hall of Fame and the artist-name marquee are NOT here — both are reused as-is
// on Home/Studio/Distro/Graphics pages and were kept hardcoded on purpose.
export type SpotlightSection = 'roster' | 'topTalents' | 'topHits' | 'videos' | 'topClassics' | 'coverWall';

export interface SpotlightItem {
  id: string;
  section: SpotlightSection;
  primaryText: string | null;
  secondaryText: string | null;
  imagePath: string | null;
  videoId: string | null;
  externalUrl: string | null;
  sortOrder: number;
}

export interface SpotlightArtistOfMonth {
  name: string;
  genre: string | null;
  country: string | null;
  photoUrl: string | null;
}

export interface SpotlightSettings {
  artistOfMonth: SpotlightArtistOfMonth;
}

export interface SpotlightContent {
  settings: SpotlightSettings;
  items: Record<SpotlightSection, SpotlightItem[]>;
}
