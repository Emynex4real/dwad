import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAnalyticsByArtist } from '../../services/tracks.service';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const GOLD = '#c9a667';
const GOLD_2 = '#e6c98a';
const BG_LINE = 'rgba(244,236,220,0.08)';
const CHART_COLORS = ['#c9a667', '#e6c98a', '#8a6e3d', '#f4ecdc', '#5d564c'];

export default function ArtistAnalyticsPage() {
  const { user } = useAuth();
  const analytics = useMemo(() => (user?.artistId ? getAnalyticsByArtist(user.artistId) : undefined), [user]);

  if (!analytics) {
    return (
      <div className="dash-page">
        <div className="dash-page__header"><h1 className="dash-page__title">Analytics</h1></div>
        <p className="dash-empty">No analytics data available yet.</p>
      </div>
    );
  }

  const platformData = analytics.topTracks[0]?.platforms ?? [];

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
            ${analytics.totalStreams > 0 ? (analytics.totalRevenue / analytics.totalStreams * 1000).toFixed(3) : '0.000'}
            <span className="stat-card__unit">/1K</span>
          </div>
        </div>
      </div>

      {/* Streams over time */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Streams</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.monthly} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="streamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={GOLD}   stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD}   stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={BG_LINE} strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: '#8c8275', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8c8275', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : String(v)} />
              <Tooltip contentStyle={{ background: '#14110d', border: '1px solid rgba(244,236,220,0.12)', borderRadius: 8 }} labelStyle={{ color: '#f4ecdc' }} itemStyle={{ color: GOLD_2 }} />
              <Area type="monotone" dataKey="streams" stroke={GOLD} strokeWidth={2} fill="url(#streamGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue over time */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Revenue</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={analytics.monthly} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke={BG_LINE} strokeDasharray="4 4" />
              <XAxis dataKey="month" tick={{ fill: '#8c8275', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8c8275', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v.toFixed(0)}`} />
              <Tooltip contentStyle={{ background: '#14110d', border: '1px solid rgba(244,236,220,0.12)', borderRadius: 8 }} labelStyle={{ color: '#f4ecdc' }} itemStyle={{ color: GOLD_2 }} formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
              <Bar dataKey="revenue" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Platform breakdown */}
      {platformData.length > 0 && (
        <div className="dash-two-col">
          <div className="dash-panel">
            <h2 className="dash-panel__title">Platform Breakdown</h2>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={platformData} dataKey="streams" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>
                    {platformData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#14110d', border: '1px solid rgba(244,236,220,0.12)', borderRadius: 8 }} labelStyle={{ color: '#f4ecdc' }} itemStyle={{ color: GOLD_2 }} />
                  <Legend wrapperStyle={{ color: '#8c8275', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
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
                {[...platformData].sort((a, b) => b.streams - a.streams).map((p) => {
                  const share = analytics.totalStreams > 0
                    ? ((p.streams / analytics.topTracks[0].totalStreams) * 100).toFixed(1)
                    : '0.0';
                  return (
                    <tr key={p.name}>
                      <td className="font-medium">{p.name}</td>
                      <td>{p.streams.toLocaleString()}</td>
                      <td>
                        <div className="dash-bar-cell">
                          <div className="dash-bar-cell__bar" style={{ width: `${share}%` }} />
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
      )}
    </div>
  );
}
