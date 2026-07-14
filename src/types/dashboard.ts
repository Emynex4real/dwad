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

const PayoutMethod = { BankTransfer: 'bank_transfer', PayPal: 'paypal', MobileMoney: 'mobile_money' } as const;
export type PayoutMethod = typeof PayoutMethod[keyof typeof PayoutMethod];

const AccountStatus = { Pending: 'pending', Active: 'active' } as const;
export type AccountStatus = typeof AccountStatus[keyof typeof AccountStatus];

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
  status: AccountStatus;
  payoutMethod?: PayoutMethod;
  payoutDetails?: string;
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
  period: string; // 'YYYY-MM'
  streams: number;
  revenue: number; // in USD
  paidUsd: number;
  pendingUsd: number;
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

// ── Payout ────────────────────────────────────────────────────────────────────
export interface Payout {
  id: string;
  artistId: string;
  amountUsd: number;
  period?: string; // 'YYYY-MM'
  note?: string;
  recordedBy: string; // admin id
  paidAt: string; // ISO date string
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

// ── Reports (CSV upload) ───────────────────────────────────────────────────────
export interface ReportUploadSummary {
  id: string;
  filename: string;
  period: string; // 'YYYY-MM'
  totalRows: number;
  matchedGroups: number;
  pendingGroups: number;
  uploadedBy: string; // admin id
  uploadedAt: string;
}

export type PendingReportReason = 'unmatched' | 'multi_artist';
export type PendingReportStatus = 'pending' | 'resolved' | 'skipped';

export interface PendingReportRow {
  id: string;
  reportUploadId: string;
  filename: string;
  creditText: string;
  reason: PendingReportReason;
  streams: number;
  revenueUsd: number;
  status: PendingReportStatus;
  createdAt: string;
}

export interface ExchangeRate {
  gbpToUsdRate: number;
  updatedAt: string;
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
