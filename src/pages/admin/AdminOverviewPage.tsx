import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtists } from '../../services/artists.service';
import { getAllTracks, getPendingTracks } from '../../services/tracks.service';
import { getAllSubscriptions, getExpiringSubscriptions } from '../../services/subscriptions.service';

export default function AdminOverviewPage() {
  const artists = useMemo(() => getAllArtists(), []);
  const tracks = useMemo(() => getAllTracks(), []);
  const pending = useMemo(() => getPendingTracks(), []);
  const subscriptions = useMemo(() => getAllSubscriptions(), []);
  const expiring = useMemo(() => getExpiringSubscriptions(30), []);

  const active = subscriptions.filter((s) => s.status === 'active').length;
  const expired = subscriptions.filter((s) => s.status === 'expired').length;
  const live = tracks.filter((t) => t.status === 'live').length;
  const monthlyRevenue = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0);

  const recentTracks = [...tracks]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Overview</h1>
        <p className="dash-page__sub">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card__label">Total Artists</div>
          <div className="stat-card__value">{artists.length}</div>
          <div className="stat-card__note">Registered on platform</div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Active Subscriptions</div>
          <div className="stat-card__value">{active}</div>
          <div className="stat-card__note">{expired} expired</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Pending Uploads</div>
          <div className="stat-card__value">{pending.length}</div>
          <div className="stat-card__note">Awaiting review</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Live Releases</div>
          <div className="stat-card__value">{live}</div>
          <div className="stat-card__note">Across all platforms</div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Monthly Revenue</div>
          <div className="stat-card__value">${monthlyRevenue}</div>
          <div className="stat-card__note">Subscription income</div>
        </div>
      </div>

      <div className="dash-two-col">
        {/* Recent submissions */}
        <div className="dash-panel">
          <div className="dash-panel__header">
            <h2 className="dash-panel__title">Recent Submissions</h2>
            <Link to="/admin/uploads" className="dash-panel__link">View all →</Link>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Track</th>
                <th>Artist</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTracks.map((t) => {
                const artist = artists.find((a) => a.id === t.artistId);
                return (
                  <tr key={t.id}>
                    <td className="font-medium">{t.title}</td>
                    <td className="text-muted">{artist?.name ?? '—'}</td>
                    <td><span className={`dash-badge dash-badge--${t.status}`}>{t.status}</span></td>
                    <td className="text-muted text-sm">{new Date(t.submittedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expiring subscriptions */}
        <div className="dash-panel">
          <div className="dash-panel__header">
            <h2 className="dash-panel__title">Expiring Soon</h2>
            <Link to="/admin/subscriptions" className="dash-panel__link">Manage →</Link>
          </div>
          {expiring.length === 0 ? (
            <p className="dash-empty">No subscriptions expiring in the next 30 days.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Plan</th>
                  <th>Expires</th>
                </tr>
              </thead>
              <tbody>
                {expiring.map((s) => {
                  const artist = artists.find((a) => a.id === s.artistId);
                  return (
                    <tr key={s.id}>
                      <td className="font-medium">{artist?.name ?? '—'}</td>
                      <td><span className="dash-badge dash-badge--plan">{s.plan}</span></td>
                      <td className="text-muted text-sm">{new Date(s.expiryDate).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
