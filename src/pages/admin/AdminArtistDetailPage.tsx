import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtistById, updateArtist, setUploadAccess } from '../../services/artists.service';
import { getTracksByArtist, updateTrackStatus } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';
import type { ArtistProfile, TrackUpload } from '../../types/dashboard';

export default function AdminArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<ArtistProfile | undefined>(() => id ? getArtistById(id) : undefined);
  const tracks = useMemo(() => (id ? getTracksByArtist(id) : []), [id]);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(() => ({
    name: artist?.name ?? '',
    email: artist?.email ?? '',
    phone: artist?.phone ?? '',
    genre: artist?.genre ?? '',
    bio: artist?.bio ?? '',
  }));
  const [saved, setSaved] = useState(false);

  if (!artist) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">Artist not found.</p>
        <button className="dash-btn self-start" onClick={() => navigate('/admin/artists')}>← Back</button>
      </div>
    );
  }

  function handleSave() {
    if (!id) return;
    updateArtist(id, form);
    setArtist(getArtistById(id));
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggleAccess() {
    if (!id || !artist) return;
    const next = artist.uploadAccess === 'granted' ? 'locked' : 'granted';
    setUploadAccess(id, next);
    setArtist(getArtistById(id));
    sendNotification(id, 'general', 'Upload Access Updated',
      next === 'granted'
        ? 'Your upload access has been restored.'
        : 'Your upload access has been suspended. Please contact support.');
  }

  function handleApprove(track: TrackUpload) {
    updateTrackStatus(track.id, 'approved');
    sendNotification(artist!.id, 'upload_approved', 'Upload Approved',
      `Your track "${track.title}" has been approved.`,
      { trackId: track.id, trackTitle: track.title });
    setArtist(getArtistById(id!));
  }

  function handleReject(track: TrackUpload) {
    const note = window.prompt('Rejection reason (optional):') ?? '';
    updateTrackStatus(track.id, 'rejected', note || undefined);
    sendNotification(artist!.id, 'upload_rejected', 'Upload Rejected',
      `Your track "${track.title}" was not approved.${note ? ` Reason: ${note}` : ''}`,
      { trackId: track.id, trackTitle: track.title });
    setArtist(getArtistById(id!));
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button className="dash-back-btn self-start" onClick={() => navigate('/admin/artists')}>← Artists</button>
        <div className="flex items-center gap-2 flex-wrap">
          {saved && <span className="dash-saved">Saved ✓</span>}
          {!editMode
            ? <button className="dash-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            : <>
                <button className="dash-btn dash-btn--ghost" onClick={() => setEditMode(false)}>Cancel</button>
                <button className="dash-btn dash-btn--gold" onClick={handleSave}>Save Changes</button>
              </>
          }
        </div>
      </div>

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
            </div>
          ) : (
            <div className="divide-y divide-line">
              {[
                { label: 'Email',   value: artist.email },
                { label: 'Phone',   value: artist.phone },
                { label: 'Genre',   value: artist.genre },
                { label: 'Country', value: artist.country },
                { label: 'Joined',  value: new Date(artist.joinedDate).toLocaleDateString() },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-2.5 text-sm">
                  <span className="text-muted">{row.label}</span>
                  <span className="text-ink text-right">{row.value}</span>
                </div>
              ))}
              {artist.bio && <p className="pt-3 text-sm text-muted italic">{artist.bio}</p>}
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="dash-panel">
          <h2 className="text-sm font-semibold text-ink mb-4">Subscription</h2>
          <div className="divide-y divide-line">
            {[
              { label: 'Plan',       value: <span className="dash-badge dash-badge--plan">{artist.subscription.plan}</span> },
              { label: 'Status',     value: <span className={`dash-badge dash-badge--${artist.subscription.status}`}>{artist.subscription.status}</span> },
              { label: 'Price',      value: `$${artist.subscription.price}/mo` },
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
        </div>

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
                        {t.status === 'pending' ? (
                          <div className="dash-row-actions">
                            <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApprove(t)}>Approve</button>
                            <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleReject(t)}>Reject</button>
                          </div>
                        ) : <span className="text-muted text-sm">—</span>}
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
