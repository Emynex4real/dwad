import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getArtistAnalytics } from '../../services/analytics.service';
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

function AreaSparkline({ data }: { data: MonthlyStats[] }) {
  const max = Math.max(...data.map((d) => d.streams), 1);
  const W = 600;
  const H = 160;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.streams / max) * (H - 20);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `${pts[0].split(',')[0]},${H} ` + polyline + ` ${pts[pts.length - 1].split(',')[0]},${H}`;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '160px', display: 'block' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaGrad)" />
        <polyline points={polyline} fill="none" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * W;
          const y = H - (d.streams / max) * (H - 20);
          return <circle key={i} cx={x} cy={y} r="4" fill={GOLD} stroke="var(--color-bg)" strokeWidth="2" />;
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 0', borderTop: '1px solid var(--color-line)' }}>
        {data.map((d) => (
          <span key={d.month} style={{ fontSize: '10px', color: 'var(--color-muted)', flex: 1, textAlign: 'center' }}>{d.month}</span>
        ))}
      </div>
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

export default function ArtistAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ArtistAnalytics | undefined>(undefined);

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

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Analytics</h1>
        <p className="dash-page__sub">Streams and revenue across all your releases.</p>
      </div>

      {/* Top stats */}
      <div className="stat-grid stat-grid--4">
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Streams</div>
          <div className="stat-card__value">{analytics.totalStreams.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Total Revenue</div>
          <div className="stat-card__value">${analytics.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Pending Payout</div>
          <div className="stat-card__value">${analytics.pendingPayout.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Avg per Stream</div>
          <div className="stat-card__value">
            ${analytics.totalStreams > 0
              ? (analytics.totalRevenue / analytics.totalStreams * 1000).toFixed(3)
              : '0.000'}
            <span className="stat-card__unit">/1K</span>
          </div>
        </div>
      </div>

      {/* Monthly Streams area chart */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Streams</h2>
        <AreaSparkline data={analytics.monthly} />
      </div>

      {/* Monthly Revenue bar chart */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Revenue</h2>
        <BarChart
          data={analytics.monthly}
          dataKey="revenue"
          color={GOLD}
          formatter={(v) => `$${v.toFixed(0)}`}
        />
      </div>

      {/* Platform breakdown */}
      <PlatformBreakdown tracks={analytics.topTracks} />
    </div>
  );
}
