// ── Auth ──────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'artist';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  artistId?: string; // populated when role === 'artist'
}

// ── Subscription ──────────────────────────────────────────────────────────────
export type SubscriptionPlan = 'plan-a' | 'plan-b' | 'unlimited' | 'gold' | 'diamond' | 'platinum' | 'platinum-pro';
export type SubscriptionStatus = 'active' | 'expired' | 'suspended';

export interface Subscription {
  id: string;
  artistId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: string;  // ISO date string
  expiryDate: string; // ISO date string
  autoRenew: boolean;
  price: number;      // monthly price in USD
}

// ── Artist ────────────────────────────────────────────────────────────────────
export type UploadAccess = 'granted' | 'locked';

export interface ArtistProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  genre: string;
  country: string;
  avatarUrl?: string;
  bio: string;
  uploadAccess: UploadAccess;
  subscription: Subscription;
  joinedDate: string; // ISO date string
  socialLinks: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
    apple?: string;
  };
}

// ── Track ─────────────────────────────────────────────────────────────────────
export type TrackStatus = 'pending' | 'approved' | 'rejected' | 'live';

export interface TrackUpload {
  id: string;
  artistId: string;
  title: string;
  featuring?: string;
  genre: string;
  releaseDate: string; // ISO date string
  upcCode?: string;
  isrcCode?: string;
  releaseLink?: string;
  coverArtUrl?: string;
  audioFileUrl?: string;
  status: TrackStatus;
  submittedAt: string; // ISO date string
  reviewNote?: string;
  platforms: string[];
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export interface MonthlyStats {
  month: string; // e.g. "Jan 25"
  streams: number;
  revenue: number; // in USD
}

export interface TrackStats {
  trackId: string;
  title: string;
  totalStreams: number;
  totalRevenue: number;
  platforms: { name: string; streams: number }[];
  monthly: MonthlyStats[];
}

export interface ArtistAnalytics {
  artistId: string;
  totalStreams: number;
  totalRevenue: number;
  pendingPayout: number;
  monthly: MonthlyStats[];
  topTracks: TrackStats[];
}

// ── Notification ──────────────────────────────────────────────────────────────
export type NotificationType = 'upload_submitted' | 'upload_approved' | 'upload_rejected' | 'release_alert' | 'subscription_expired' | 'subscription_renewed' | 'general';

export interface Notification {
  id: string;
  artistId: string;     // recipient
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;    // ISO date string
  metadata?: Record<string, string>; // e.g. { trackId, trackTitle }
}

// ── Reports (CSV / HTML upload) ───────────────────────────────────────────────
export interface ReportUpload {
  id: string;
  filename: string;
  type: 'csv' | 'html';
  uploadedAt: string;
  status: 'processing' | 'applied' | 'failed';
  affectedArtists: number;
  uploadedBy: string; // admin id
}

// ── Upload Form (artist upload submission) ────────────────────────────────────
export interface UploadSubmission {
  id: string;
  artistId: string;
  artistName: string;
  trackTitle: string;
  submittedAt: string;
  status: TrackStatus;
  fileCount: number;
}

// ── Dashboard Summary (admin overview) ────────────────────────────────────────
export interface AdminSummary {
  totalArtists: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  pendingUploads: number;
  liveReleases: number;
  monthlyRevenue: number;
}

// ── Subscription plan definitions ────────────────────────────────────────────
export interface PlanDefinition {
  id: SubscriptionPlan;
  name: string;
  price: number;
  features: string[];
}
