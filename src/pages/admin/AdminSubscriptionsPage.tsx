import { useState, useMemo } from 'react';
import { getAllArtists } from '../../services/artists.service';
import {
  renewSubscription,
  setSubscriptionStatus,
  getExpiringSubscriptions,
  PLAN_DEFINITIONS,
} from '../../services/subscriptions.service';
import { sendNotification } from '../../services/notifications.service';
import type { ArtistProfile, SubscriptionPlan } from '../../types/dashboard';

export default function AdminSubscriptionsPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>(() => getAllArtists());
  const expiring = useMemo(() => getExpiringSubscriptions(30), []);

  const stats = useMemo(() => ({
    active:    artists.filter((a) => a.subscription.status === 'active').length,
    expired:   artists.filter((a) => a.subscription.status === 'expired').length,
    suspended: artists.filter((a) => a.subscription.status === 'suspended').length,
    mrr:       artists.filter((a) => a.subscription.status === 'active').reduce((s, a) => s + a.subscription.price, 0),
  }), [artists]);

  function handleRenew(artistId: string, plan: SubscriptionPlan) {
    renewSubscription(artistId, plan);
    sendNotification(artistId, 'subscription_renewed', 'Subscription Renewed',
      `Your ${plan} plan has been renewed successfully.`);
    setArtists(getAllArtists());
  }

  function handleSuspend(artistId: string) {
    setSubscriptionStatus(artistId, 'suspended');
    setArtists(getAllArtists());
  }

  function handleReactivate(artistId: string) {
    setSubscriptionStatus(artistId, 'active');
    setArtists(getAllArtists());
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Subscriptions</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card stat-card--gold"><div className="stat-card__label">Active</div><div className="stat-card__value">{stats.active}</div></div>
        <div className="stat-card"><div className="stat-card__label">Expired</div><div className="stat-card__value">{stats.expired}</div></div>
        <div className="stat-card"><div className="stat-card__label">Suspended</div><div className="stat-card__value">{stats.suspended}</div></div>
        <div className="stat-card stat-card--gold"><div className="stat-card__label">MRR</div><div className="stat-card__value">${stats.mrr}</div></div>
      </div>

      {/* Plan overview */}
      <div className="dash-panel">
        <h2 className="text-sm font-semibold text-ink mb-4">Plan Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLAN_DEFINITIONS.map((plan) => {
            const count = artists.filter(
              (a) => a.subscription.plan === plan.id && a.subscription.status === 'active',
            ).length;
            return (
              <div key={plan.id} className="rounded-lg border border-line bg-bg-3 p-4 flex flex-col gap-2">
                <div className="text-[11px] tracking-widest uppercase text-gold">{plan.name}</div>
                <div className="font-serif text-2xl text-ink">
                  ${plan.price}<span className="text-sm font-sans text-muted">/yr</span>
                </div>
                <div className="text-xs text-muted">{count} active artists</div>
                <ul className="flex flex-col gap-1 pt-2 border-t border-line">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-gold">{f}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-ink">All Subscriptions</h2>
        {artists.map((artist) => {
          const sub = artist.subscription;
          const isExpiring = expiring.some((e) => e.artistId === artist.id);
          return (
            <div key={artist.id} className={`dash-panel flex flex-col gap-3 ${isExpiring ? 'border-amber-500/30' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="dash-avatar dash-avatar--sm">{artist.name.charAt(0)}</div>
                  <span className="text-sm font-medium text-ink">{artist.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="dash-badge dash-badge--plan">{sub.plan}</span>
                  <span className={`dash-badge dash-badge--${sub.status}`}>{sub.status}{isExpiring ? ' ⚠' : ''}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Expires {new Date(sub.expiryDate).toLocaleDateString()}</span>
                <span>${sub.price}/yr</span>
              </div>
              <div className="flex gap-2 flex-wrap pt-1 border-t border-line">
                <select
                  className="dash-input dash-input--xs flex-1"
                  defaultValue={sub.plan}
                  onChange={(e) => handleRenew(artist.id, e.target.value as SubscriptionPlan)}
                >
                  {PLAN_DEFINITIONS.map((p) => (
                    <option key={p.id} value={p.id}>Renew {p.name}</option>
                  ))}
                </select>
                {sub.status === 'active'
                  ? <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleSuspend(artist.id)}>Suspend</button>
                  : <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleReactivate(artist.id)}>Reactivate</button>
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block dash-panel p-0!">
        <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">All Subscriptions</h2>
        <div className="overflow-x-auto pb-2">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Artist</th><th>Plan</th><th>Status</th><th>Expires</th><th>Price</th><th>Auto Renew</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => {
                const sub = artist.subscription;
                const isExpiring = expiring.some((e) => e.artistId === artist.id);
                return (
                  <tr key={artist.id} className={isExpiring ? 'dash-table-row--warn' : ''}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="dash-avatar dash-avatar--sm">{artist.name.charAt(0)}</div>
                        <span className="font-medium">{artist.name}</span>
                      </div>
                    </td>
                    <td><span className="dash-badge dash-badge--plan">{sub.plan}</span></td>
                    <td><span className={`dash-badge dash-badge--${sub.status}`}>{sub.status}{isExpiring ? ' ⚠' : ''}</span></td>
                    <td className="text-muted text-sm">{new Date(sub.expiryDate).toLocaleDateString()}</td>
                    <td>${sub.price}/yr</td>
                    <td className="text-muted">{sub.autoRenew ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="dash-row-actions">
                        <select
                          className="dash-input dash-input--xs"
                          defaultValue={sub.plan}
                          onChange={(e) => handleRenew(artist.id, e.target.value as SubscriptionPlan)}
                        >
                          {PLAN_DEFINITIONS.map((p) => (
                            <option key={p.id} value={p.id}>Renew {p.name}</option>
                          ))}
                        </select>
                        {sub.status === 'active'
                          ? <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleSuspend(artist.id)}>Suspend</button>
                          : <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleReactivate(artist.id)}>Reactivate</button>
                        }
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
