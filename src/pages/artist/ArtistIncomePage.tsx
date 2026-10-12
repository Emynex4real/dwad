import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useArtists } from '../../hooks/useArtists';
import { getArtistAnalytics } from '../../services/analytics.service';
import { updatePayout } from '../../services/artists.service';
import { getPayoutHistory } from '../../services/payouts.service';
import type { ArtistAnalytics, PayoutMethod, Payout } from '../../types/dashboard';

function parsePayoutDetails(raw: string): { accountNumber: string; accountName: string; bankName: string } {
  const line = (label: string) => {
    const match = raw.match(new RegExp(`^${label}:\\s*(.*)$`, 'im'));
    return match ? match[1].trim() : '';
  };
  return {
    accountNumber: line('Account number'),
    accountName: line('Account name'),
    bankName: line('Bank name'),
  };
}

export default function ArtistIncomePage() {
  const { user } = useAuth();
  const { getArtist, updateArtistInCache } = useArtists();
  const artist = user?.artistId ? getArtist(user.artistId) : undefined;
  const [analytics, setAnalytics] = useState<ArtistAnalytics | undefined>(undefined);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | ''>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [payoutSaved, setPayoutSaved] = useState(false);
  const [payoutFormInitFor, setPayoutFormInitFor] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user?.artistId) return;
    void getArtistAnalytics(user.artistId).then(setAnalytics);
    void getPayoutHistory(user.artistId).then(setPayouts);
  }, [user]);

  if (artist && artist.id !== payoutFormInitFor) {
    setPayoutFormInitFor(artist.id);
    setPayoutMethod(artist.payoutMethod ?? '');
    const parsed = parsePayoutDetails(artist.payoutDetails ?? '');
    setAccountNumber(parsed.accountNumber);
    setAccountName(parsed.accountName);
    setBankName(parsed.bankName);
  }

  async function handleSavePayout() {
    if (!user?.artistId) return;
    const payoutDetails = `Account number: ${accountNumber}\nAccount name: ${accountName}\nBank name: ${bankName}`;
    await updatePayout(user.artistId, payoutMethod || null, payoutDetails);
    updateArtistInCache(user.artistId, { payoutMethod: payoutMethod || undefined, payoutDetails });
    setPayoutSaved(true);
    setTimeout(() => setPayoutSaved(false), 3000);
  }

  if (!analytics || !artist) return null;

  const earned = analytics.totalRevenue;
  const paid = +(earned - analytics.pendingPayout).toFixed(2);

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
              const status = m.revenue <= 0 ? null : m.pendingUsd <= 0 ? 'Paid' : m.paidUsd > 0 ? 'Partially Paid' : 'Pending';
              return (
                <tr key={m.period}>
                  <td className="font-medium">{m.month}</td>
                  <td>{m.streams.toLocaleString()}</td>
                  <td className="income-amount">${m.revenue.toFixed(2)}</td>
                  <td className="text-muted text-sm">${perStream}/1K</td>
                  <td>
                    {status && (
                      <span className={`dash-badge dash-badge--${status === 'Paid' ? 'live' : 'pending'}`}>{status}</span>
                    )}
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
          <label className="income-info__label" htmlFor="payout-method" style={{ display: 'block', marginBottom: 8 }}>
            Payout Method
          </label>
          <select
            id="payout-method"
            className="dash-input select-field"
            value={payoutMethod}
            onChange={(e) => setPayoutMethod(e.target.value as PayoutMethod)}
          >
            <option value="">Select a method…</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
        </div>

        <div style={{ marginTop: 20 }} className="flex flex-col gap-4">
          {[
            { id: 'payout-account-number', label: 'Account number', value: accountNumber, onChange: setAccountNumber },
            { id: 'payout-account-name', label: 'Account name', value: accountName, onChange: setAccountName },
            { id: 'payout-bank-name', label: 'Bank name', value: bankName, onChange: setBankName },
          ].map((field) => (
            <div key={field.id}>
              <label className="income-info__label" htmlFor={field.id} style={{ display: 'block', marginBottom: 8 }}>
                {field.label}
              </label>
              <input
                id={field.id}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-line)',
                  color: 'var(--color-ink)',
                  padding: '12px 14px',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button className="dash-btn dash-btn--gold" onClick={handleSavePayout}>Save Payout Info</button>
            {payoutSaved && <span className="dash-saved">Saved ✓</span>}
          </div>
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

      {/* Payout history */}
      {payouts.length > 0 && (
        <div className="dash-panel">
          <h2 className="dash-panel__title">Payout History</h2>
          <div className="divide-y divide-line">
            {payouts.map((p) => (
              <div key={p.id} className="flex justify-between items-center py-2.5 text-sm">
                <div>
                  <div className="text-ink">
                    {new Date(p.paidAt).toLocaleDateString()}
                    {p.period && <span className="text-muted"> · for {p.period}</span>}
                  </div>
                  {p.note && <div className="text-xs text-muted">{p.note}</div>}
                </div>
                <span className="income-amount font-medium">${p.amountUsd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
