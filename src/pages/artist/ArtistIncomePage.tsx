import { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAnalyticsByArtist } from '../../services/tracks.service';
import { getArtistById } from '../../services/artists.service';

export default function ArtistIncomePage() {
  const { user } = useAuth();
  const analytics = useMemo(() => (user?.artistId ? getAnalyticsByArtist(user.artistId) : undefined), [user]);
  const artist = useMemo(() => (user?.artistId ? getArtistById(user.artistId) : undefined), [user]);

  if (!analytics || !artist) return null;

  const earned = analytics.totalRevenue;
  const paid = +(earned - analytics.pendingPayout).toFixed(2);
  const [bankNote, setBankNote] = useState('');

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Income</h1>
        <p className="dash-page__sub">Royalties and payout summary.</p>
      </div>

      {/* Summary cards */}
      <div className="stat-grid stat-grid--2">
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Total Earned</div>
          <div className="stat-card__value">${earned.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Paid Out</div>
          <div className="stat-card__value">${paid.toFixed(2)}</div>
        </div>
      </div>

      {/* Monthly income table */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Monthly Breakdown</h2>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Streams</th>
              <th>Revenue (USD)</th>
              <th>Est. per Stream</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[...analytics.monthly].reverse().map((m) => {
              const perStream = m.streams > 0 ? (m.revenue / m.streams * 1000).toFixed(3) : '—';
              const isRecent = analytics.monthly.indexOf(m) >= analytics.monthly.length - 2;
              return (
                <tr key={m.month}>
                  <td className="font-medium">{m.month}</td>
                  <td>{m.streams.toLocaleString()}</td>
                  <td className="income-amount">${m.revenue.toFixed(2)}</td>
                  <td className="text-muted text-sm">${perStream}/1K</td>
                  <td>
                    <span className={`dash-badge dash-badge--${isRecent ? 'pending' : 'live'}`}>
                      {isRecent ? 'Processing' : 'Paid'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Per-track income */}
      {analytics.topTracks.length > 0 && (
        <div className="dash-panel">
          <h2 className="dash-panel__title">Income by Track</h2>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Track</th>
                <th>Streams</th>
                <th>Revenue</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topTracks.map((t) => {
                const share = earned > 0 ? ((t.totalRevenue / earned) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={t.trackId}>
                    <td className="font-medium">{t.title}</td>
                    <td>{t.totalStreams.toLocaleString()}</td>
                    <td className="income-amount">${t.totalRevenue.toFixed(2)}</td>
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
      )}

      {/* Payout info */}
      <div className="dash-panel dash-panel--info">
        <h2 className="dash-panel__title">Payout Information</h2>
        <div className="income-info">
          <div className="income-info__item">
            <span className="income-info__label">Payment Cycle</span>
            <span>Monthly</span>
          </div>
          <div className="income-info__item">
            <span className="income-info__label">Minimum Payout</span>
            <span>$100.00 USD</span>
          </div>
          <div className="income-info__item">
            <span className="income-info__label">Payment Methods</span>
            <span>Bank Transfer · PayPal · Mobile Money</span>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label className="income-info__label" htmlFor="bank-note" style={{ display: 'block', marginBottom: 8 }}>
            Note — Bank Details
          </label>
          <textarea
            id="bank-note"
            value={bankNote}
            onChange={(e) => setBankNote(e.target.value)}
            placeholder="Enter your bank name, account number, account name..."
            rows={4}
            style={{
              width: '100%',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-line)',
              color: 'var(--color-ink)',
              padding: '12px 14px',
              fontSize: '14px',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <p className="text-muted text-sm" style={{ marginBottom: 10 }}>
            For payment support, contact us directly.
          </p>
          <a
            href="https://wa.me/message/VYJP7JFQPZXSN1"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: 'var(--color-gold)',
              color: 'var(--color-bg)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
