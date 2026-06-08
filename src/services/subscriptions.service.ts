import type { Subscription, SubscriptionStatus, SubscriptionPlan, PlanDefinition } from '../types/dashboard';
import { MOCK_ARTISTS } from '../data/mock/artists';
import { getAllArtists, updateArtist } from './artists.service';

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'plan-a',
    name: 'Plan A',
    price: 10,
    features: [
      '1 song upload',
      'Spotify, Apple Music + all music apps',
      'No TikTok or Instagram upload',
    ],
  },
  {
    id: 'plan-b',
    name: 'Plan B',
    price: 15,
    features: [
      '1 song upload',
      'Spotify, Apple Music + 200 more apps',
      'TikTok, Instagram + all social media apps',
    ],
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 30,
    features: [
      'Unlimited song uploads per year',
      'Spotify, Apple Music + 200 more apps',
      'TikTok, Instagram + all social media apps',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 150,
    features: [
      'Unlimited uploads a year',
      'All music apps',
      'All social media apps',
      '1 free radio promotion',
      'Free editorial playlist pitching',
      '1 free cover art graphics',
    ],
  },
  {
    id: 'diamond',
    name: 'Diamond',
    price: 500,
    features: [
      'Unlimited uploads a year',
      'All music apps',
      'All social media apps',
      '3 free radio promotions',
      'Free editorial playlist pitching',
      '2 free cover art graphics',
      '10 free web blog placements',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 1000,
    features: [
      'Unlimited uploads a year',
      'All music apps',
      'All social media apps',
      '5 free radio promotions',
      'Free editorial playlist pitching',
      '5 free cover art graphics',
      '50 free web blog placements',
      'Free promo on TikTok, Instagram & Facebook',
    ],
  },
  {
    id: 'platinum-pro',
    name: 'Platinum Pro',
    price: 5000,
    features: [
      'Unlimited uploads a year',
      'All music apps',
      'All social media apps',
      '10 free radio promotions',
      'Free editorial playlist pitching',
      '10 free cover art graphics',
      '100 free web blog placements',
      'Free promo on TikTok, Instagram & Facebook',
      'Free promo on Spotify, Audiomack & YouTube',
      'Free management service',
      'Free music video',
    ],
  },
];

export function getAllSubscriptions(): Subscription[] {
  return getAllArtists().map((a) => a.subscription);
}

export function getSubscriptionByArtist(artistId: string): Subscription | undefined {
  return getAllArtists().find((a) => a.id === artistId)?.subscription;
}

export function updateSubscription(
  artistId: string,
  patch: Partial<Subscription>,
): Subscription | null {
  const artist = getAllArtists().find((a) => a.id === artistId);
  if (!artist) return null;
  const updated = { ...artist.subscription, ...patch };
  updateArtist(artistId, { subscription: updated });
  return updated;
}

export function renewSubscription(
  artistId: string,
  plan: SubscriptionPlan,
  months: number = 12,
): Subscription | null {
  const planDef = PLAN_DEFINITIONS.find((p) => p.id === plan);
  if (!planDef) return null;

  const start = new Date();
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + months);

  return updateSubscription(artistId, {
    plan,
    status: 'active',
    startDate: start.toISOString().split('T')[0],
    expiryDate: expiry.toISOString().split('T')[0],
    price: planDef.price,
  });
}

export function setSubscriptionStatus(
  artistId: string,
  status: SubscriptionStatus,
): Subscription | null {
  return updateSubscription(artistId, { status });
}

export function getExpiringSubscriptions(withinDays: number = 30): Subscription[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + withinDays);
  return getAllSubscriptions().filter((s) => {
    const expiry = new Date(s.expiryDate);
    return s.status === 'active' && expiry <= cutoff;
  });
}

export function getPlanDefinition(plan: SubscriptionPlan): PlanDefinition | undefined {
  return PLAN_DEFINITIONS.find((p) => p.id === plan);
}

// Initialise store reference (avoids circular init issues)
void MOCK_ARTISTS;
