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
    active: artists.filter((a) => a.subscription.status === 'active').length,
    expired: artists.filter((a) => a.subscription.status === 'expired').length,
    suspended: artists.filter((a) => a.subscription.status === 'suspended').length,
    monthly: artists.filter((a) => a.subscription.status === 'active').reduce((s, a) => s + a.subscription.price, 0),
  }), [artists]);

  function handleRenew(artistId: string, plan: SubscriptionPlan) {
    renewSubscription(artistId, plan);
    sendNotification(artistId, 'subscription_renewed', 'Subscription Renewed', `Your ${plan} plan has been renewed successfully. Enjoy uninterrupted access to Dwad Music distribution.`);
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
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Subscriptions</h1>
      </div>

      {/* Stats */}
      <div className="stat-grid stat-grid--4">
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Active</div>
          <div className="stat-card__value">{stats.active}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Expired</div>
          <div className="stat-card__value">{stats.expired}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Suspended</div>
          <div className="stat-card__value">{stats.suspended}</div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">MRR</div>
          <div className="stat-card__value">${stats.monthly}</div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Plan Overview</h2>
        <div className="plan-grid">
          {PLAN_DEFINITIONS.map((plan) => {
            const count = artists.filter((a) => a.subscription.plan === plan.id && a.subscription.status === 'active').length;
            return (
              <div key={plan.id} className="plan-card">
                <div className="plan-card__name">{plan.name}</div>
                <div className="plan-card__price">${plan.price}<span>/mo</span></div>
                <div className="plan-card__count">{count} active artists</div>
                <ul className="plan-card__features">
                  {plan.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* All subscriptions */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">All Subscriptions</h2>
        <table className="dash-table dash-table--hover">
          <thead>
            <tr>
              <th>Artist</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Expires</th>
              <th>Price</th>
              <th>Auto Renew</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => {
              const sub = artist.subscription;
              const isExpiring = expiring.some((e) => e.artistId === artist.id);
              return (
                <tr key={artist.id} className={isExpiring ? 'dash-table-row--warn' : ''}>
                  <td>
                    <div className="dash-artist-cell">
                      <div className="dash-avatar dash-avatar--sm">{artist.name.charAt(0)}</div>
                      <span className="font-medium">{artist.name}</span>
                    </div>
                  </td>
                  <td><span className="dash-badge dash-badge--plan">{sub.plan}</span></td>
                  <td>
                    <span className={`dash-badge dash-badge--${sub.status}`}>
                      {sub.status}{isExpiring ? ' ⚠' : ''}
                    </span>
                  </td>
                  <td className="text-muted text-sm">{new Date(sub.expiryDate).toLocaleDateString()}</td>
                  <td>${sub.price}/mo</td>
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
                      {sub.status === 'active' && (
                        <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleSuspend(artist.id)}>Suspend</button>
                      )}
                      {sub.status !== 'active' && (
                        <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleReactivate(artist.id)}>Reactivate</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
