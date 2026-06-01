import type { Subscription, SubscriptionStatus, SubscriptionPlan, PlanDefinition } from '../types/dashboard';
import { MOCK_ARTISTS } from '../data/mock/artists';
import { getAllArtists, updateArtist } from './artists.service';

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9,
    features: [
      'Distribute up to 2 releases/month',
      '200+ streaming platforms',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: [
      'Distribute up to 10 releases/month',
      '200+ streaming platforms',
      'Advanced analytics & revenue tracking',
      'Priority support',
      'UPC & ISRC codes included',
      'Release scheduling',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 49,
    features: [
      'Unlimited releases',
      '200+ streaming platforms',
      'Full analytics suite',
      'Dedicated account manager',
      'UPC & ISRC codes included',
      'Release scheduling & pre-save campaigns',
      'Radio promotion priority',
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
