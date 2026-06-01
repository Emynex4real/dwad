import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getArtistById } from '../../services/artists.service';
import { submitTrack } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';

const PLATFORMS = [
  'Spotify', 'Apple Music', 'Boomplay', 'TikTok',
  'YouTube Music', 'Audiomack', 'Tidal', 'Deezer', 'Amazon Music',
];

const GENRES = [
  'Afrobeats', 'Afro Soul', 'Alt Pop', 'Hip Hop', 'R&B', 'Gospel',
  'Highlife', 'Street Pop', 'Electronic', 'Pop', 'Reggae', 'Other',
];

interface UploadForm {
  title: string;
  featuring: string;
  genre: string;
  releaseDate: string;
  platforms: string[];
}

const INITIAL_FORM: UploadForm = {
  title: '',
  featuring: '',
  genre: '',
  releaseDate: '',
  platforms: ['Spotify', 'Apple Music', 'Boomplay', 'TikTok', 'YouTube Music'],
};

export default function ArtistUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const artist = user?.artistId ? getArtistById(user.artistId) : undefined;

  const [form, setForm] = useState<UploadForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!artist) return null;

  const locked = artist.uploadAccess === 'locked';
  const expired = artist.subscription.status === 'expired';
  const blocked = locked || expired;

  function togglePlatform(platform: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(platform)
        ? f.platforms.filter((p) => p !== platform)
        : [...f.platforms, platform],
    }));
  }

  function handleField(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Track title is required.'); return; }
    if (!form.genre) { setError('Genre is required.'); return; }
    if (!form.releaseDate) { setError('Release date is required.'); return; }
    if (form.platforms.length === 0) { setError('Select at least one platform.'); return; }

    const today = new Date().toISOString().split('T')[0];
    if (form.releaseDate < today) { setError('Release date must be in the future.'); return; }

    if (!artist) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate async

    const track = submitTrack({
      artistId: artist.id,
      title: form.title.trim(),
      ...(form.featuring.trim() ? { featuring: form.featuring.trim() } : {}),
      genre: form.genre,
      releaseDate: form.releaseDate,
      platforms: form.platforms,
    });

    sendNotification(
      artist.id,
      'upload_submitted',
      'Upload Received',
      `We've received your upload for "${track.title}". Our team will review it within 2-3 business days.`,
      { trackId: track.id, trackTitle: track.title },
    );

    setSubmitting(false);
    navigate('/artist/releases');
  }

  if (blocked) {
    return (
      <div className="dash-page">
        <div className="dash-page__header">
          <h1 className="dash-page__title">Upload Music</h1>
        </div>
        <div className="dash-panel dash-panel--blocked">
          <div className="blocked-icon">⊘</div>
          <h2>{expired ? 'Subscription Expired' : 'Upload Access Suspended'}</h2>
          <p>
            {expired
              ? 'Your subscription has expired. Renew your plan to regain upload access and continue distributing music.'
              : 'Your upload access has been suspended by your account manager. Please contact support for assistance.'}
          </p>
          <a href="mailto:support@dwadmusic.com" className="dash-btn dash-btn--gold">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Upload Music</h1>
        <p className="dash-page__sub">Submit a new release for distribution. Our team reviews within 2-3 business days.</p>
      </div>

      <div className="dash-panel dash-panel--upload">
        <form className="dash-form dash-form--upload" onSubmit={handleSubmit}>

          <div className="dash-form__row">
            <div className="dash-form__field">
              <label htmlFor="title">Track Title <span className="required">*</span></label>
              <input id="title" name="title" className="dash-input" value={form.title} onChange={handleField} placeholder="e.g. Midnight Frequency" maxLength={100} required />
            </div>
            <div className="dash-form__field">
              <label htmlFor="featuring">Featuring Artist(s)</label>
              <input id="featuring" name="featuring" className="dash-input" value={form.featuring} onChange={handleField} placeholder="e.g. M Day Yor (optional)" maxLength={100} />
            </div>
          </div>

          <div className="dash-form__row">
            <div className="dash-form__field">
              <label htmlFor="genre">Genre <span className="required">*</span></label>
              <select id="genre" name="genre" className="dash-input select-field" value={form.genre} onChange={handleField} required>
                <option value="">Select a genre</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="dash-form__field">
              <label htmlFor="releaseDate">Release Date <span className="required">*</span></label>
              <input
                id="releaseDate"
                name="releaseDate"
                type="date"
                className="dash-input"
                value={form.releaseDate}
                onChange={handleField}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Platform selection */}
          <div className="dash-form__field">
            <label>Distribution Platforms <span className="required">*</span></label>
            <div className="platform-grid">
              {PLATFORMS.map((p) => (
                <label key={p} className={`platform-chip ${form.platforms.includes(p) ? 'platform-chip--selected' : ''}`}>
                  <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} className="hidden" />
                  {p}
                </label>
              ))}
            </div>
            <span className="dash-form__hint">{form.platforms.length} platform{form.platforms.length !== 1 ? 's' : ''} selected</span>
          </div>

          {/* File upload notice */}
          <div className="upload-file-notice">
            <div className="upload-file-notice__icon">♪</div>
            <div>
              <div className="font-medium">Audio & Cover Art Files</div>
              <div className="text-muted text-sm">
                After submitting this form, you'll receive a WhatsApp or email link to upload your audio files (WAV/MP3) and cover art (3000×3000px JPG/PNG).
              </div>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="dash-form__footer">
            <button type="button" className="dash-btn dash-btn--ghost" onClick={() => navigate('/artist/releases')}>
              Cancel
            </button>
            <button type="submit" className="dash-btn dash-btn--gold" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Release'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
