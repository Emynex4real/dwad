import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtists } from '../../services/artists.service';
import { getAllTracks, getPendingTracks } from '../../services/tracks.service';
import { getAllSubscriptions, getExpiringSubscriptions } from '../../services/subscriptions.service';

export default function AdminOverviewPage() {
  const artists  = useMemo(() => getAllArtists(), []);
  const tracks   = useMemo(() => getAllTracks(), []);
  const pending  = useMemo(() => getPendingTracks(), []);
  const subs     = useMemo(() => getAllSubscriptions(), []);
  const expiring = useMemo(() => getExpiringSubscriptions(30), []);

  const active  = subs.filter((s) => s.status === 'active').length;
  const expired = subs.filter((s) => s.status === 'expired').length;
  const live    = tracks.filter((t) => t.status === 'live').length;
  const mrr     = subs.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.price, 0);

  const recentTracks = [...tracks]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Overview</h1>
        <p className="text-sm text-muted mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="stat-card"><div className="stat-card__label">Total Artists</div><div className="stat-card__value">{artists.length}</div><div className="stat-card__note">Registered</div></div>
        <div className="stat-card stat-card--gold"><div className="stat-card__label">Active Subs</div><div className="stat-card__value">{active}</div><div className="stat-card__note">{expired} expired</div></div>
        <div className="stat-card"><div className="stat-card__label">Pending Uploads</div><div className="stat-card__value">{pending.length}</div><div className="stat-card__note">Awaiting review</div></div>
        <div className="stat-card"><div className="stat-card__label">Live Releases</div><div className="stat-card__value">{live}</div><div className="stat-card__note">All platforms</div></div>
        <div className="stat-card stat-card--gold col-span-2 sm:col-span-1"><div className="stat-card__label">Monthly Revenue</div><div className="stat-card__value">${mrr}</div><div className="stat-card__note">Subscription income</div></div>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent submissions */}
        <div className="dash-panel p-0!">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-ink">Recent Submissions</h2>
            <Link to="/admin/uploads" className="text-xs text-gold">View all →</Link>
          </div>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-line">
            {recentTracks.map((t) => {
              const artist = artists.find((a) => a.id === t.artistId);
              return (
                <div key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-ink truncate">{t.title}</div>
                    <div className="text-xs text-muted">{artist?.name ?? '—'}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`dash-badge dash-badge--${t.status}`}>{t.status}</span>
                    <span className="text-[11px] text-muted">{new Date(t.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto pb-2">
            <table className="dash-table">
              <thead><tr><th>Track</th><th>Artist</th><th>Status</th><th>Date</th></tr></thead>
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
        </div>

        {/* Expiring subscriptions */}
        <div className="dash-panel p-0!">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-ink">Expiring Soon</h2>
            <Link to="/admin/subscriptions" className="text-xs text-gold">Manage →</Link>
          </div>

          {expiring.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-muted">No subscriptions expiring in the next 30 days.</p>
          ) : (
            <>
              {/* Mobile */}
              <div className="sm:hidden divide-y divide-line">
                {expiring.map((s) => {
                  const artist = artists.find((a) => a.id === s.artistId);
                  return (
                    <div key={s.id} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm font-medium text-ink">{artist?.name ?? '—'}</span>
                      <div className="flex items-center gap-2">
                        <span className="dash-badge dash-badge--plan">{s.plan}</span>
                        <span className="text-[11px] text-muted">{new Date(s.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto pb-2">
                <table className="dash-table">
                  <thead><tr><th>Artist</th><th>Plan</th><th>Expires</th></tr></thead>
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
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
