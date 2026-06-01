import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtistById, updateArtist, setUploadAccess } from '../../services/artists.service';
import { getTracksByArtist, updateTrackStatus } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';
import type { ArtistProfile, TrackUpload } from '../../types/dashboard';

export default function AdminArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<ArtistProfile | undefined>(() =>
    id ? getArtistById(id) : undefined,
  );
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
      <div className="dash-page">
        <p className="dash-empty">Artist not found.</p>
        <button className="dash-btn" onClick={() => navigate('/admin/artists')}>← Back</button>
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
    const newAccess = artist.uploadAccess === 'granted' ? 'locked' : 'granted';
    setUploadAccess(id, newAccess);
    setArtist(getArtistById(id));
    const msg = newAccess === 'granted'
      ? 'Your upload access has been restored. You can now submit new releases.'
      : 'Your upload access has been suspended. Please contact support for assistance.';
    sendNotification(id, 'general', 'Upload Access Updated', msg);
  }

  function handleApprove(track: TrackUpload) {
    updateTrackStatus(track.id, 'approved');
    sendNotification(
      artist!.id,
      'upload_approved',
      'Upload Approved',
      `Your track "${track.title}" has been approved and will go live on your scheduled release date.`,
      { trackId: track.id, trackTitle: track.title },
    );
    setArtist(getArtistById(id!));
  }

  function handleReject(track: TrackUpload) {
    const note = window.prompt('Rejection reason (optional):') ?? '';
    updateTrackStatus(track.id, 'rejected', note || undefined);
    sendNotification(
      artist!.id,
      'upload_rejected',
      'Upload Rejected',
      `Your track "${track.title}" was not approved. ${note ? `Reason: ${note}` : 'Please contact support for details.'}`,
      { trackId: track.id, trackTitle: track.title },
    );
    setArtist(getArtistById(id!));
  }

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <button className="dash-back-btn" onClick={() => navigate('/admin/artists')}>← Artists</button>
        <div className="dash-page__actions">
          {saved && <span className="dash-saved">Saved ✓</span>}
          {!editMode ? (
            <button className="dash-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          ) : (
            <>
              <button className="dash-btn dash-btn--ghost" onClick={() => setEditMode(false)}>Cancel</button>
              <button className="dash-btn dash-btn--gold" onClick={handleSave}>Save Changes</button>
            </>
          )}
        </div>
      </div>

      <div className="dash-two-col">
        {/* Profile */}
        <div className="dash-panel">
          <div className="dash-panel__header">
            <h2 className="dash-panel__title">Profile</h2>
            <div className="dash-artist-access">
              <span className="text-sm text-muted">Upload Access</span>
              <button
                className={`dash-toggle ${artist.uploadAccess === 'granted' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                onClick={toggleAccess}
              >
                <span className="dash-toggle__knob" />
              </button>
            </div>
          </div>

          <div className="dash-profile-avatar">
            <div className="dash-avatar dash-avatar--lg">{artist.name.charAt(0)}</div>
            <div>
              <div className="dash-profile-name">{artist.name}</div>
              <div className="text-muted text-sm">{artist.country} · {artist.genre}</div>
            </div>
          </div>

          {editMode ? (
            <div className="dash-form">
              {(['name', 'email', 'phone', 'genre'] as const).map((field) => (
                <div className="dash-form__field" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    className="dash-input"
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="dash-form__field">
                <label>Bio</label>
                <textarea
                  className="dash-input dash-textarea"
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="dash-detail-list">
              <div className="dash-detail-row"><span>Email</span><span>{artist.email}</span></div>
              <div className="dash-detail-row"><span>Phone</span><span>{artist.phone}</span></div>
              <div className="dash-detail-row"><span>Genre</span><span>{artist.genre}</span></div>
              <div className="dash-detail-row"><span>Country</span><span>{artist.country}</span></div>
              <div className="dash-detail-row"><span>Joined</span><span>{new Date(artist.joinedDate).toLocaleDateString()}</span></div>
              {artist.bio && <div className="dash-detail-bio">{artist.bio}</div>}
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="dash-panel">
          <h2 className="dash-panel__title">Subscription</h2>
          <div className="dash-detail-list">
            <div className="dash-detail-row">
              <span>Plan</span>
              <span className="dash-badge dash-badge--plan">{artist.subscription.plan}</span>
            </div>
            <div className="dash-detail-row">
              <span>Status</span>
              <span className={`dash-badge dash-badge--${artist.subscription.status}`}>{artist.subscription.status}</span>
            </div>
            <div className="dash-detail-row"><span>Price</span><span>${artist.subscription.price}/mo</span></div>
            <div className="dash-detail-row"><span>Start</span><span>{new Date(artist.subscription.startDate).toLocaleDateString()}</span></div>
            <div className="dash-detail-row"><span>Expires</span><span>{new Date(artist.subscription.expiryDate).toLocaleDateString()}</span></div>
            <div className="dash-detail-row"><span>Auto Renew</span><span>{artist.subscription.autoRenew ? 'Yes' : 'No'}</span></div>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">Tracks ({tracks.length})</h2>
        {tracks.length === 0 ? (
          <p className="dash-empty">No tracks submitted yet.</p>
        ) : (
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Status</th>
                <th>Release Date</th>
                <th>UPC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">{t.title}{t.featuring && <span className="text-muted text-sm"> ft. {t.featuring}</span>}</td>
                  <td className="text-muted">{t.genre}</td>
                  <td><span className={`dash-badge dash-badge--${t.status}`}>{t.status}</span></td>
                  <td className="text-muted text-sm">{new Date(t.releaseDate).toLocaleDateString()}</td>
                  <td className="text-mono text-sm">{t.upcCode ?? '—'}</td>
                  <td>
                    {t.status === 'pending' && (
                      <div className="dash-row-actions">
                        <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApprove(t)}>Approve</button>
                        <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleReject(t)}>Reject</button>
                      </div>
                    )}
                    {t.status !== 'pending' && <span className="text-muted text-sm">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
