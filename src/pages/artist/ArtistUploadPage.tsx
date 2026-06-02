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

const INITIAL: UploadForm = {
  title: '',
  featuring: '',
  genre: '',
  releaseDate: '',
  platforms: ['Spotify', 'Apple Music', 'Boomplay', 'TikTok', 'YouTube Music'],
};

export default function ArtistUploadPage() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const artist    = user?.artistId ? getArtistById(user.artistId) : undefined;

  const [form, setForm]         = useState<UploadForm>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');

  if (!artist) return null;

  const locked  = artist.uploadAccess === 'locked';
  const expired = artist.subscription.status === 'expired';
  const blocked = locked || expired;

  function togglePlatform(p: string) {
    setForm((f) => ({
      ...f,
      platforms: f.platforms.includes(p) ? f.platforms.filter((x) => x !== p) : [...f.platforms, p],
    }));
  }

  function handleField(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.title.trim())      { setError('Track title is required.'); return; }
    if (!form.genre)              { setError('Genre is required.'); return; }
    if (!form.releaseDate)        { setError('Release date is required.'); return; }
    if (!form.platforms.length)   { setError('Select at least one platform.'); return; }

    const today = new Date().toISOString().split('T')[0];
    if (form.releaseDate < today) { setError('Release date must be in the future.'); return; }
    if (!artist) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const track = submitTrack({
      artistId:    artist.id,
      title:       form.title.trim(),
      genre:       form.genre,
      releaseDate: form.releaseDate,
      platforms:   form.platforms,
      ...(form.featuring.trim() ? { featuring: form.featuring.trim() } : {}),
    });

    sendNotification(
      artist.id,
      'upload_submitted',
      'Upload Received',
      `We've received your upload for "${track.title}". Our team will review it within 2–3 business days.`,
      { trackId: track.id, trackTitle: track.title },
    );

    setSubmitting(false);
    navigate('/artist/releases');
  }

  /* ── Blocked state ─────────────────────────────────────────────────────── */
  if (blocked) {
    return (
      <div className="flex flex-col gap-5 max-w-300">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Upload Music</h1>
        </div>

        <div className="dash-panel flex flex-col items-center text-center gap-5 py-14 px-6">
          <div className="w-14 h-14 rounded-full bg-bg-3 border border-line flex items-center justify-center text-2xl text-muted">
            ⊘
          </div>
          <div>
            <h2 className="text-base font-semibold text-ink mb-2">
              {expired ? 'Subscription Expired' : 'Upload Access Suspended'}
            </h2>
            <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
              {expired
                ? 'Your subscription has expired. Renew your plan to regain upload access and keep distributing music.'
                : 'Your upload access has been suspended by your account manager. Please contact support for assistance.'}
            </p>
          </div>
          <a href="mailto:support@dwadmusic.com" className="dash-btn dash-btn--gold">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  /* ── Upload form ────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Upload Music</h1>
        <p className="text-sm text-muted mt-1">
          Submit a new release for distribution. Our team reviews within 2–3 business days.
        </p>
      </div>

      <div className="dash-panel">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Track title + Featuring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-xs font-medium text-ink-2">
                Track Title <span className="text-gold">*</span>
              </label>
              <input
                id="title"
                name="title"
                className="dash-input"
                value={form.title}
                onChange={handleField}
                placeholder="e.g. Midnight Frequency"
                maxLength={100}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="featuring" className="text-xs font-medium text-ink-2">
                Featuring Artist(s)
              </label>
              <input
                id="featuring"
                name="featuring"
                className="dash-input"
                value={form.featuring}
                onChange={handleField}
                placeholder="e.g. M Day Yor (optional)"
                maxLength={100}
              />
            </div>
          </div>

          {/* Genre + Release date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="genre" className="text-xs font-medium text-ink-2">
                Genre <span className="text-gold">*</span>
              </label>
              <select
                id="genre"
                name="genre"
                className="dash-input select-field"
                value={form.genre}
                onChange={handleField}
                required
              >
                <option value="">Select a genre</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="releaseDate" className="text-xs font-medium text-ink-2">
                Release Date <span className="text-gold">*</span>
              </label>
              <input
                id="releaseDate"
                name="releaseDate"
                type="date"
                className="dash-input"
                value={form.releaseDate}
                onChange={handleField}
                min={new Date(Date.now() + 86_400_000).toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Platform selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-ink-2">
              Distribution Platforms <span className="text-gold">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={[
                    'px-3 py-1.5 rounded-md text-xs border transition-colors cursor-pointer',
                    form.platforms.includes(p)
                      ? 'bg-gold/10 text-gold border-gold/40'
                      : 'bg-transparent text-muted border-line-strong hover:text-ink hover:border-line-strong',
                  ].join(' ')}
                >
                  {p}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted">
              {form.platforms.length} platform{form.platforms.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          {/* File notice */}
          <div className="flex gap-3 items-start p-4 rounded-lg border border-gold/20 bg-gold/5">
            <span className="text-xl text-gold shrink-0 mt-0.5">♪</span>
            <div>
              <div className="text-sm font-medium text-ink mb-1">Audio & Cover Art Files</div>
              <div className="text-xs text-muted leading-relaxed">
                After submitting this form, you'll receive a WhatsApp or email link to upload your
                audio files (WAV/MP3) and cover art (3000×3000px JPG/PNG).
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-line">
            <button
              type="button"
              className="dash-btn dash-btn--ghost w-full sm:w-auto justify-center"
              onClick={() => navigate('/artist/releases')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dash-btn dash-btn--gold w-full sm:w-auto justify-center"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit Release'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
