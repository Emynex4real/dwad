import { useMemo } from 'react';
import { getAllArtists } from '../../services/artists.service';
import { getAllTracks } from '../../services/tracks.service';
import { getAllSubscriptions } from '../../services/subscriptions.service';
import { MOCK_ANALYTICS } from '../../data/mock/tracks';

export default function AdminStatsPage() {
  const artists = useMemo(() => getAllArtists(), []);
  const tracks  = useMemo(() => getAllTracks(), []);
  const subs    = useMemo(() => getAllSubscriptions(), []);

  const totalStreams  = MOCK_ANALYTICS.reduce((s, a) => s + a.totalStreams, 0);
  const totalRevenue  = MOCK_ANALYTICS.reduce((s, a) => s + a.totalRevenue, 0);
  const totalPending  = MOCK_ANALYTICS.reduce((s, a) => s + a.pendingPayout, 0);
  const activeSubs    = subs.filter((s) => s.status === 'active').length;
  const liveCount     = tracks.filter((t) => t.status === 'live').length;
  const pendingCount  = tracks.filter((t) => t.status === 'pending').length;
  const mrr           = subs.filter((s) => s.status === 'active').reduce((s, sub) => s + sub.price, 0);

  // Monthly aggregated across all artists
  const monthlyMap = new Map<string, { streams: number; revenue: number }>();
  MOCK_ANALYTICS.forEach((a) => {
    a.monthly.forEach((m) => {
      const existing = monthlyMap.get(m.month) ?? { streams: 0, revenue: 0 };
      monthlyMap.set(m.month, {
        streams: existing.streams + m.streams,
        revenue: existing.revenue + m.revenue,
      });
    });
  });
  const monthly = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6);

  // Per-artist revenue table
  const artistRevenue = MOCK_ANALYTICS.map((a) => {
    const artist = artists.find((ar) => ar.id === a.artistId);
    return {
      name: artist?.name ?? '—',
      plan: artist?.subscription.plan ?? '—',
      streams: a.totalStreams,
      revenue: a.totalRevenue,
      pending: a.pendingPayout,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Track status breakdown
  const statusBreakdown = [
    { label: 'Live',     count: tracks.filter((t) => t.status === 'live').length,     color: '#4ade80' },
    { label: 'Approved', count: tracks.filter((t) => t.status === 'approved').length,  color: '#60a5fa' },
    { label: 'Pending',  count: tracks.filter((t) => t.status === 'pending').length,   color: '#fbbf24' },
    { label: 'Rejected', count: tracks.filter((t) => t.status === 'rejected').length,  color: '#f87171' },
  ];

  const maxMonthlyRevenue = Math.max(...monthly.map((m) => m.revenue), 1);
  const maxMonthlyStreams  = Math.max(...monthly.map((m) => m.streams), 1);

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Statistics</h1>
        <p className="text-sm text-muted mt-1">Platform-wide performance across all artists.</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Streams</div>
          <div className="stat-card__value">{totalStreams.toLocaleString()}</div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Revenue</div>
          <div className="stat-card__value">${totalRevenue.toFixed(0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Pending Payouts</div>
          <div className="stat-card__value">${totalPending.toFixed(0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Active Subscriptions</div>
          <div className="stat-card__value">{activeSubs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Live Tracks</div>
          <div className="stat-card__value">{liveCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Monthly Revenue</div>
          <div className="stat-card__value">${mrr}</div>
          <div className="stat-card__note">Subscriptions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Monthly Revenue Chart */}
        <div className="dash-panel">
          <h2 className="dash-panel__title mb-4">Monthly Revenue (USD)</h2>
          <div className="flex items-end gap-2 h-36">
            {monthly.map((m) => (
              <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                <div className="text-[10px] text-gold font-mono">${m.revenue.toFixed(0)}</div>
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${(m.revenue / maxMonthlyRevenue) * 100}px`,
                    background: 'var(--color-gold)',
                    opacity: 0.8,
                    minHeight: '4px',
                  }}
                />
                <div className="text-[9px] text-muted font-mono">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Streams Chart */}
        <div className="dash-panel">
          <h2 className="dash-panel__title mb-4">Monthly Streams</h2>
          <div className="flex items-end gap-2 h-36">
            {monthly.map((m) => (
              <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                <div className="text-[10px] text-muted font-mono">{(m.streams / 1000).toFixed(1)}K</div>
                <div
                  className="w-full rounded-sm"
                  style={{
                    height: `${(m.streams / maxMonthlyStreams) * 100}px`,
                    background: 'var(--color-ink-2)',
                    opacity: 0.5,
                    minHeight: '4px',
                  }}
                />
                <div className="text-[9px] text-muted font-mono">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Track Status Breakdown */}
      <div className="dash-panel">
        <h2 className="dash-panel__title mb-4">Track Status Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statusBreakdown.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5 p-4 border border-line rounded-lg">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-muted uppercase font-mono tracking-widest">{s.label}</span>
              </div>
              <div className="text-2xl font-serif font-normal text-ink">{s.count}</div>
              <div className="text-xs text-muted">{tracks.length > 0 ? ((s.count / tracks.length) * 100).toFixed(0) : 0}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending uploads alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm">
          <span className="text-amber-400">⚠</span>
          <span className="text-ink">{pendingCount} track{pendingCount > 1 ? 's' : ''} awaiting review.</span>
        </div>
      )}

      {/* Per-artist revenue table */}
      <div className="dash-panel p-0!">
        <div className="px-5 pt-5 pb-3">
          <h2 className="dash-panel__title">Revenue by Artist</h2>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-line">
          {artistRevenue.map((a) => (
            <div key={a.name} className="px-5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="font-medium text-sm text-ink">{a.name}</div>
                <span className="dash-badge dash-badge--plan">{a.plan}</span>
              </div>
              <div className="flex gap-4 text-xs text-muted">
                <span>{a.streams.toLocaleString()} streams</span>
                <span className="text-gold">${a.revenue.toFixed(2)}</span>
                <span>Pending: ${a.pending.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto pb-2">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Plan</th>
                <th>Total Streams</th>
                <th>Total Revenue</th>
                <th>Pending Payout</th>
                <th>Avg per 1K streams</th>
              </tr>
            </thead>
            <tbody>
              {artistRevenue.map((a) => (
                <tr key={a.name}>
                  <td className="font-medium">{a.name}</td>
                  <td><span className="dash-badge dash-badge--plan">{a.plan}</span></td>
                  <td className="text-muted">{a.streams.toLocaleString()}</td>
                  <td className="income-amount">${a.revenue.toFixed(2)}</td>
                  <td className="text-muted">${a.pending.toFixed(2)}</td>
                  <td className="text-muted text-sm">
                    {a.streams > 0 ? `$${(a.revenue / a.streams * 1000).toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
