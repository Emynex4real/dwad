import type { Subscription, SubscriptionStatus, SubscriptionPlan, PlanDefinition } from '../types/dashboard';
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

export async function getAllSubscriptions(): Promise<Subscription[]> {
  const artists = await getAllArtists();
  return artists.map((a) => a.subscription);
}

export async function getSubscriptionByArtist(artistId: string): Promise<Subscription | undefined> {
  const artists = await getAllArtists();
  return artists.find((a) => a.id === artistId)?.subscription;
}

export async function updateSubscription(
  artistId: string,
  patch: Partial<Subscription>,
): Promise<Subscription | null> {
  const artists = await getAllArtists();
  const artist = artists.find((a) => a.id === artistId);
  if (!artist) return null;
  const updated = { ...artist.subscription, ...patch };
  await updateArtist(artistId, { subscription: updated });
  return updated;
}

export async function renewSubscription(
  artistId: string,
  plan: SubscriptionPlan,
  months: number = 12,
): Promise<Subscription | null> {
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

export async function setSubscriptionStatus(
  artistId: string,
  status: SubscriptionStatus,
): Promise<Subscription | null> {
  return updateSubscription(artistId, { status });
}

export async function getExpiringSubscriptions(withinDays: number = 30): Promise<Subscription[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + withinDays);
  const subs = await getAllSubscriptions();
  return subs.filter((s) => {
    const expiry = new Date(s.expiryDate);
    return s.status === 'active' && expiry <= cutoff;
  });
}

export function getPlanDefinition(plan: SubscriptionPlan): PlanDefinition | undefined {
  return PLAN_DEFINITIONS.find((p) => p.id === plan);
}
