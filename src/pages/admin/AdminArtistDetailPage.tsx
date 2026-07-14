import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtistById, updateArtist, setUploadAccess, approveArtist, deleteArtist } from '../../services/artists.service';
import { getTracksByArtist, updateTrackStatus } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';
import { PLAN_DEFINITIONS, updateSubscription } from '../../services/subscriptions.service';
import { getArtistAnalytics } from '../../services/analytics.service';
import { recordPayout, getPayoutHistory } from '../../services/payouts.service';
import { API_BASE_URL, getStoredToken } from '../../services/httpClient';
import type { ArtistProfile, TrackUpload, SubscriptionPlan, SubscriptionStatus, ArtistAnalytics, Payout } from '../../types/dashboard';

const PAYOUT_METHOD_LABEL: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  paypal: 'PayPal',
  mobile_money: 'Mobile Money',
};

export default function AdminArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<ArtistProfile | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);
  const [tracks, setTracks] = useState<TrackUpload[]>([]);
  const [analytics, setAnalytics] = useState<ArtistAnalytics | undefined>(undefined);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');
  const [payoutPeriod, setPayoutPeriod] = useState<string | undefined>(undefined);
  const [payoutSaved, setPayoutSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    void getArtistById(id).then((a) => {
      setArtist(a);
      setLoaded(true);
    });
    void getTracksByArtist(id).then(setTracks);
    void getArtistAnalytics(id).then(setAnalytics);
    void getPayoutHistory(id).then(setPayouts);
  }, [id]);

  async function refreshPayoutData() {
    if (!id) return;
    setAnalytics(await getArtistAnalytics(id));
    setPayouts(await getPayoutHistory(id));
  }

  async function handleRecordPayout() {
    if (!id) return;
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) return;
    await recordPayout(id, amount, payoutNote.trim() || undefined, payoutPeriod);
    setPayoutAmount('');
    setPayoutNote('');
    setPayoutPeriod(undefined);
    await refreshPayoutData();
    setPayoutSaved(true);
    setTimeout(() => setPayoutSaved(false), 3000);
  }

  function startPayMonth(month: ArtistAnalytics['monthly'][number]) {
    setPayoutAmount(month.pendingUsd.toFixed(2));
    setPayoutNote(`Payout for ${month.month}`);
    setPayoutPeriod(month.period);
  }

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', genre: '', bio: '', password: '' });

  const [editSub, setEditSub] = useState(false);
  const [subForm, setSubForm] = useState({
    plan: 'plan-a' as SubscriptionPlan,
    status: 'active' as SubscriptionStatus,
    price: '',
    expiryDate: '',
    autoRenew: false,
  });

  const [saved, setSaved] = useState(false);

  if (!artist) {
    if (!loaded) return null;
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">Artist not found.</p>
        <button className="dash-btn self-start" onClick={() => navigate('/admin/artists')}>← Back</button>
      </div>
    );
  }

  function startEdit() {
    if (!artist) return;
    setForm({ name: artist.name, email: artist.email, phone: artist.phone, genre: artist.genre, bio: artist.bio, password: '' });
    setEditMode(true);
  }

  function startEditSub() {
    if (!artist) return;
    setSubForm({
      plan: artist.subscription.plan,
      status: artist.subscription.status,
      price: String(artist.subscription.price),
      expiryDate: artist.subscription.expiryDate,
      autoRenew: artist.subscription.autoRenew,
    });
    setEditSub(true);
  }

  async function handleSave() {
    if (!id) return;
    const { password, ...profile } = form;
    await updateArtist(id, password.trim() ? { ...profile, password: password.trim() } : profile);
    setArtist(await getArtistById(id));
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSaveSub() {
    if (!id) return;
    await updateSubscription(id, {
      plan: subForm.plan,
      status: subForm.status,
      price: parseFloat(subForm.price) || 0,
      expiryDate: subForm.expiryDate,
      autoRenew: subForm.autoRenew,
    });
    setArtist(await getArtistById(id));
    setEditSub(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function toggleAccess() {
    if (!id || !artist) return;
    const next = artist.uploadAccess === 'granted' ? 'locked' : 'granted';
    await setUploadAccess(id, next);
    setArtist(await getArtistById(id));
    void sendNotification(id, 'general', 'Upload Access Updated',
      next === 'granted'
        ? 'Your upload access has been restored.'
        : 'Your upload access has been suspended. Please contact support.');
  }

  async function handleApproveArtist() {
    if (!id) return;
    await approveArtist(id);
    setArtist(await getArtistById(id));
  }

  async function handleRejectArtist() {
    if (!id) return;
    if (!window.confirm('Reject and delete this pending account?')) return;
    await deleteArtist(id);
    navigate('/admin/artists');
  }

  async function handleApprove(track: TrackUpload) {
    await updateTrackStatus(track.id, 'approved');
    void sendNotification(artist!.id, 'upload_approved', 'Upload Approved',
      `Your track "${track.title}" has been approved.`,
      { trackId: track.id, trackTitle: track.title });
    setTracks(await getTracksByArtist(id!));
  }

  async function handleReject(track: TrackUpload) {
    const note = window.prompt('Rejection reason (optional):') ?? '';
    await updateTrackStatus(track.id, 'rejected', note || undefined);
    void sendNotification(artist!.id, 'upload_rejected', 'Upload Rejected',
      `Your track "${track.title}" was not approved.${note ? ` Reason: ${note}` : ''}`,
      { trackId: track.id, trackTitle: track.title });
    setTracks(await getTracksByArtist(id!));
  }

  function audioDownloadUrl(trackId: string): string {
    return `${API_BASE_URL}/tracks/${trackId}/audio?token=${getStoredToken() ?? ''}`;
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button className="dash-back-btn self-start" onClick={() => navigate('/admin/artists')}>← Artists</button>
        <div className="flex items-center gap-2 flex-wrap">
          {saved && <span className="dash-saved">Saved ✓</span>}
          {!editMode
            ? <button className="dash-btn" onClick={startEdit}>Edit Profile</button>
            : <>
                <button className="dash-btn dash-btn--ghost" onClick={() => setEditMode(false)}>Cancel</button>
                <button className="dash-btn dash-btn--gold" onClick={handleSave}>Save Changes</button>
              </>
          }
        </div>
      </div>

      {/* Pending approval banner */}
      {artist.status === 'pending' && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border border-amber-400/30 bg-amber-400/5 rounded-lg text-sm flex-wrap">
          <span className="text-ink">⚠ This account is awaiting approval and cannot log in yet.</span>
          <div className="flex gap-2">
            <button className="dash-action-btn dash-action-btn--approve" onClick={handleApproveArtist}>Approve</button>
            <button className="dash-action-btn dash-action-btn--reject" onClick={handleRejectArtist}>Reject</button>
          </div>
        </div>
      )}

      {/* Profile + Subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Profile */}
        <div className="dash-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Profile</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Upload</span>
              <button
                className={`dash-toggle ${artist.uploadAccess === 'granted' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                onClick={toggleAccess}
              >
                <span className="dash-toggle__knob" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="dash-avatar dash-avatar--lg">{artist.name.charAt(0)}</div>
            <div>
              <div className="text-base font-medium text-ink">{artist.name}</div>
              <div className="text-sm text-muted">{artist.country} · {artist.genre}</div>
            </div>
          </div>

          {editMode ? (
            <div className="flex flex-col gap-4">
              {(['name', 'email', 'phone', 'genre'] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-2 capitalize">{field}</label>
                  <input className="dash-input" value={form[field]} onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">Bio</label>
                <textarea className="dash-input dash-textarea" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">New Password</label>
                <input
                  type="password"
                  className="dash-input"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="Leave blank to keep current password"
                  autoComplete="new-password"
                />
              </div>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {[
                { label: 'Email',   value: artist.email },
                { label: 'Phone',   value: artist.phone },
                { label: 'Genre',   value: artist.genre },
                { label: 'Country', value: artist.country },
                { label: 'Joined',  value: new Date(artist.joinedDate).toLocaleDateString() },
                { label: 'Payout Method', value: artist.payoutMethod ? PAYOUT_METHOD_LABEL[artist.payoutMethod] : 'Not set' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2.5 text-sm">
                  <span className="text-muted">{row.label}</span>
                  <span className="text-ink text-right">{row.value}</span>
                </div>
              ))}
              {artist.payoutDetails && (
                <div className="pt-2.5">
                  <span className="text-muted text-sm">Payout Details</span>
                  <p className="text-sm text-ink mt-1 whitespace-pre-wrap">{artist.payoutDetails}</p>
                </div>
              )}
              {artist.bio && <p className="pt-3 text-sm text-muted italic">{artist.bio}</p>}
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="dash-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Subscription</h2>
            {!editSub
              ? <button className="dash-btn text-xs py-1.5 px-3" onClick={startEditSub}>Edit</button>
              : <div className="flex gap-2">
                  <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={() => setEditSub(false)}>Cancel</button>
                  <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" onClick={handleSaveSub}>Save</button>
                </div>
            }
          </div>

          {editSub ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">Plan</label>
                <select
                  className="dash-input select-field"
                  value={subForm.plan}
                  onChange={(e) => setSubForm((f) => ({ ...f, plan: e.target.value as SubscriptionPlan }))}
                >
                  {PLAN_DEFINITIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">Status</label>
                <select
                  className="dash-input select-field"
                  value={subForm.status}
                  onChange={(e) => setSubForm((f) => ({ ...f, status: e.target.value as SubscriptionStatus }))}
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">Price (USD)</label>
                <input
                  type="number"
                  className="dash-input"
                  value={subForm.price}
                  onChange={(e) => setSubForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">Expiry Date</label>
                <input
                  type="date"
                  className="dash-input"
                  value={subForm.expiryDate}
                  onChange={(e) => setSubForm((f) => ({ ...f, expiryDate: e.target.value }))}
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-ink-2">
                <input
                  type="checkbox"
                  checked={subForm.autoRenew}
                  onChange={(e) => setSubForm((f) => ({ ...f, autoRenew: e.target.checked }))}
                  className="accent-gold"
                />
                Auto Renew
              </label>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {[
                { label: 'Plan',       value: <span className="dash-badge dash-badge--plan">{artist.subscription.plan}</span> },
                { label: 'Status',     value: <span className={`dash-badge dash-badge--${artist.subscription.status}`}>{artist.subscription.status}</span> },
                { label: 'Price',      value: `$${artist.subscription.price}` },
                { label: 'Start',      value: new Date(artist.subscription.startDate).toLocaleDateString() },
                { label: 'Expires',    value: new Date(artist.subscription.expiryDate).toLocaleDateString() },
                { label: 'Auto Renew', value: artist.subscription.autoRenew ? 'Yes' : 'No' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2.5 text-sm">
                  <span className="text-muted">{row.label}</span>
                  <span className="text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Payouts */}
      <div className="dash-panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">Payouts</h2>
          {payoutSaved && <span className="dash-saved">Recorded ✓</span>}
        </div>

        {analytics && (
          <div className="stat-grid stat-grid--3 mb-5">
            <div className="stat-card">
              <div className="stat-card__label">Total Revenue</div>
              <div className="stat-card__value">${analytics.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Paid Out</div>
              <div className="stat-card__value">${(analytics.totalRevenue - analytics.pendingPayout).toFixed(2)}</div>
            </div>
            <div className="stat-card stat-card--gold">
              <div className="stat-card__label">Pending Payout</div>
              <div className="stat-card__value">${analytics.pendingPayout.toFixed(2)}</div>
            </div>
          </div>
        )}

        {/* Monthly breakdown — pay per month */}
        {analytics && analytics.monthly.length > 0 && (
          <div className="overflow-x-auto mb-5">
            <table className="dash-table">
              <thead>
                <tr><th>Month</th><th>Streams</th><th>Revenue</th><th>Paid</th><th>Pending</th><th>Action</th></tr>
              </thead>
              <tbody>
                {[...analytics.monthly].reverse().map((m) => (
                  <tr key={m.period}>
                    <td className="font-medium">{m.month}</td>
                    <td>{m.streams.toLocaleString()}</td>
                    <td>${m.revenue.toFixed(2)}</td>
                    <td className="text-muted">${m.paidUsd.toFixed(2)}</td>
                    <td>${m.pendingUsd.toFixed(2)}</td>
                    <td>
                      {m.pendingUsd > 0 ? (
                        <button className="dash-action-btn dash-action-btn--approve" onClick={() => startPayMonth(m)}>Pay</button>
                      ) : m.revenue > 0 ? (
                        <span className="dash-badge dash-badge--live">Paid ✓</span>
                      ) : (
                        <span className="text-muted text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Confirm / general payout form */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end mb-5">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-ink-2">
              Amount (USD){payoutPeriod && <span className="text-gold"> — for {payoutPeriod}</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="dash-input"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-ink-2">Note (optional)</label>
            <input
              className="dash-input"
              value={payoutNote}
              onChange={(e) => setPayoutNote(e.target.value)}
              placeholder="e.g. November payout"
            />
          </div>
          <div className="flex gap-2">
            {payoutPeriod && (
              <button
                className="dash-btn dash-btn--ghost"
                onClick={() => { setPayoutAmount(''); setPayoutNote(''); setPayoutPeriod(undefined); }}
              >
                Clear
              </button>
            )}
            <button className="dash-btn dash-btn--gold" onClick={handleRecordPayout}>Record Payout</button>
          </div>
        </div>

        {payouts.length === 0 ? (
          <p className="text-sm text-muted">No payouts recorded yet.</p>
        ) : (
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
                <span className="text-ink font-medium">${p.amountUsd.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tracks */}
      <div className="dash-panel p-0!">
        <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">
          Tracks ({tracks.length})
        </h2>

        {tracks.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted">No tracks submitted yet.</p>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-line">
              {tracks.map((t) => (
                <div key={t.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="text-sm font-medium text-ink">{t.title}</div>
                      {t.featuring && <div className="text-xs text-muted">ft. {t.featuring}</div>}
                    </div>
                    <span className={`dash-badge dash-badge--${t.status} shrink-0`}>{t.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>{t.genre} · {new Date(t.releaseDate).toLocaleDateString()}</span>
                    {t.upcCode && <span className="font-mono">{t.upcCode}</span>}
                  </div>
                  {t.status === 'pending' && (
                    <div className="flex gap-2 mt-2.5">
                      <button className="dash-action-btn dash-action-btn--approve flex-1" onClick={() => handleApprove(t)}>Approve</button>
                      <button className="dash-action-btn dash-action-btn--reject flex-1" onClick={() => handleReject(t)}>Reject</button>
                    </div>
                  )}
                  {(t.coverArtUrl || t.audioFileUrl) && (
                    <div className="flex gap-2 mt-2.5">
                      {t.coverArtUrl && (
                        <a href={`${API_BASE_URL}/storage/${t.coverArtUrl}`} target="_blank" rel="noreferrer" className="dash-action-btn flex-1 text-center">🖼 Cover</a>
                      )}
                      {t.audioFileUrl && (
                        <a href={audioDownloadUrl(t.id)} className="dash-action-btn flex-1 text-center">♪ Audio</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto pb-2">
              <table className="dash-table dash-table--hover">
                <thead>
                  <tr><th>Title</th><th>Genre</th><th>Status</th><th>Release Date</th><th>UPC</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {tracks.map((t) => (
                    <tr key={t.id}>
                      <td className="font-medium">
                        {t.title}
                        {t.featuring && <span className="text-muted text-sm"> ft. {t.featuring}</span>}
                      </td>
                      <td className="text-muted">{t.genre}</td>
                      <td><span className={`dash-badge dash-badge--${t.status}`}>{t.status}</span></td>
                      <td className="text-muted text-sm">{new Date(t.releaseDate).toLocaleDateString()}</td>
                      <td className="text-mono text-sm">{t.upcCode ?? '—'}</td>
                      <td>
                        <div className="dash-row-actions">
                          {t.status === 'pending' && (
                            <>
                              <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApprove(t)}>Approve</button>
                              <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleReject(t)}>Reject</button>
                            </>
                          )}
                          {t.coverArtUrl && (
                            <a href={`${API_BASE_URL}/storage/${t.coverArtUrl}`} target="_blank" rel="noreferrer" className="dash-action-btn" title="View cover art">🖼</a>
                          )}
                          {t.audioFileUrl && (
                            <a href={audioDownloadUrl(t.id)} className="dash-action-btn" title="Download audio">♪</a>
                          )}
                          {t.status !== 'pending' && !t.coverArtUrl && !t.audioFileUrl && (
                            <span className="text-muted text-sm">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
