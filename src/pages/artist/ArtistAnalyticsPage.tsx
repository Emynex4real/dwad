import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getArtistAnalytics } from '../../services/analytics.service';
import AreaSparkline from '../../components/ui/AreaSparkline';
import type { MonthlyStats, TrackStats, ArtistAnalytics } from '../../types/dashboard';

const GOLD = '#c9a667';
const PLATFORM_COLORS = ['#c9a667', '#e6c98a', '#8a6e3d', '#a08040', '#5d564c'];

function BarChart({ data, dataKey, color, formatter }: {
  data: MonthlyStats[];
  dataKey: 'streams' | 'revenue';
  color: string;
  formatter: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d[dataKey]), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '200px', padding: '0 4px' }}>
      {data.map((d) => {
        const pct = (d[dataKey] / max) * 100;
        return (
          <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{formatter(d[dataKey])}</span>
            <div
              title={`${d.month}: ${formatter(d[dataKey])}`}
              style={{
                width: '100%',
                height: `${pct}%`,
                minHeight: '4px',
                background: color,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.4s ease',
              }}
            />
            <span style={{ fontSize: '10px', color: 'var(--color-muted)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function PlatformBreakdown({ tracks }: { tracks: TrackStats[] }) {
  const platformTotals = new Map<string, number>();
  for (const track of tracks) {
    for (const p of track.platforms) {
      platformTotals.set(p.name, (platformTotals.get(p.name) ?? 0) + p.streams);
    }
  }
  const platforms = Array.from(platformTotals, ([name, streams]) => ({ name, streams }));
  if (platforms.length === 0) return null;
  const total = platforms.reduce((s, p) => s + p.streams, 0) || 1;
  const sorted = [...platforms].sort((a, b) => b.streams - a.streams);

  return (
    <div className="dash-two-col">
      <div className="dash-panel">
        <h2 className="dash-panel__title">Platform Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
          {sorted.map((p, i) => {
            const pct = ((p.streams / total) * 100).toFixed(1);
            return (
              <div key={p.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-ink-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PLATFORM_COLORS[i % PLATFORM_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
                    {p.name}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{pct}%</span>
                </div>
                <div style={{ height: '5px', background: 'var(--color-line)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: PLATFORM_COLORS[i % PLATFORM_COLORS.length], borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="dash-panel">
        <h2 className="dash-panel__title">Platform Stats</h2>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Platform</th>
              <th>Streams</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const share = ((p.streams / total) * 100).toFixed(1);
              return (
                <tr key={p.name}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: PLATFORM_COLORS[i % PLATFORM_COLORS.length], display: 'inline-block', flexShrink: 0 }} />
                    {p.name}
                  </td>
                  <td>{p.streams.toLocaleString()}</td>
                  <td>
                    <div className="dash-bar-cell">
                      <div className="dash-bar-cell__bar" style={{ width: `${Math.min(parseFloat(share), 100)}px` }} />
                      <span>{share}%</span>
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

const PERIOD_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '3',   label: 'Last 3 Months' },
  { value: '6',   label: 'Last 6 Months' },
  { value: '12',  label: 'Last 12 Months' },
] as const;

export default function ArtistAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ArtistAnalytics | undefined>(undefined);
  const [trackFilter, setTrackFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState<typeof PERIOD_OPTIONS[number]['value']>('all');

  useEffect(() => {
    if (!user?.artistId) return;
    void getArtistAnalytics(user.artistId).then(setAnalytics);
  }, [user]);

  if (!analytics) {
    return (
      <div className="dash-page">
        <div className="dash-page__header">
          <h1 className="dash-page__title">Analytics</h1>
        </div>
        <p className="dash-empty">No analytics data available yet.</p>
      </div>
    );
  }

  const selectedTrack = trackFilter === 'all' ? undefined : analytics.topTracks.find((t) => t.trackId === trackFilter);
  const monthlySource = selectedTrack ? selectedTrack.monthly : analytics.monthly;
  const filteredMonthly = periodFilter === 'all' ? monthlySource : monthlySource.slice(-Number(periodFilter));

  const totalStreams = filteredMonthly.reduce((s, m) => s + m.streams, 0);
  const totalRevenue = filteredMonthly.reduce((s, m) => s + m.revenue, 0);
  const pendingPayout = filteredMonthly.reduce((s, m) => s + m.pendingUsd, 0);

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Analytics</h1>
        <p className="dash-page__sub">Streams and revenue across all your releases.</p>
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-2">Track</label>
          <select className="dash-input select-field" value={trackFilter} onChange={(e) => setTrackFilter(e.target.value)}>
            <option value="all">All Tracks</option>
            {analytics.topTracks.map((t) => <option key={t.trackId} value={t.trackId}>{t.title}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-2">Period</label>
          <select className="dash-input select-field" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value as typeof periodFilter)}>
            {PERIOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Top stats */}
      <div className="stat-grid stat-grid--4">
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Streams</div>
          <div className="stat-card__value">{totalStreams.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Total Revenue</div>
          <div className="stat-card__value">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Pending Payout</div>
          <div className="stat-card__value">${pendingPayout.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Avg per Stream</div>
          <div className="stat-card__value">
            ${totalStreams > 0 ? (totalRevenue / totalStreams * 1000).toFixed(3) : '0.000'}
            <span className="stat-card__unit">/1K</span>
          </div>
        </div>
      </div>

      {/* Monthly Streams area chart */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Streams</h2>
        <AreaSparkline data={filteredMonthly} />
      </div>

      {/* Monthly Revenue bar chart */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Revenue</h2>
        <BarChart
          data={filteredMonthly}
          dataKey="revenue"
          color={GOLD}
          formatter={(v) => `$${v.toFixed(0)}`}
        />
      </div>

      {/* Platform breakdown */}
      <PlatformBreakdown tracks={selectedTrack ? [selectedTrack] : analytics.topTracks} />
    </div>
  );
}
