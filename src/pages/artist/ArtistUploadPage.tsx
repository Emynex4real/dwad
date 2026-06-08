import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getArtistById } from '../../services/artists.service';
import { submitTrack } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';

const GENRES = [
  'Afrobeats', 'Afro Soul', 'Alt Pop', 'Hip Hop', 'R&B', 'Gospel',
  'Highlife', 'Street Pop', 'Electronic', 'Pop', 'Reggae', 'Other',
];

const TERMS = [
  'Make sure your song has no copyright, samples, or is a cover song. No refunds will be issued for copyright issues.',
  'Choose a unique artist name before uploading to avoid name clashes with existing artists.',
  'If another artist shares your name, your song may be misattributed. Dwad assumes no responsibility for this.',
  'Verify your artist name does not already exist on Spotify and Apple Music before submitting.',
  'If you have uploaded on Spotify and Apple Music before, paste your profile or song links in the form accordingly.',
  'Do not buy streams. Your account will be permanently closed for fake, artificial, or purchased streams.',
  'You cannot upload a song that is already on streaming platforms, except Audiomack.',
  'Only songs uploaded after 3 months can be taken down.',
];

interface SingleForm {
  artistName: string;
  whatsapp: string;
  title: string;
  featuring: string;
  producer: string;
  genre: string;
  releaseDate: string;
  previouslyReleased: '' | 'yes' | 'no';
  profileLink: string;
  notes: string;
}

interface AlbumForm {
  artistName: string;
  whatsapp: string;
  albumTitle: string;
  albumType: '' | 'Album' | 'EP' | 'Mixtape';
  trackCount: string;
  producer: string;
  genre: string;
  releaseDate: string;
  previouslyReleased: '' | 'yes' | 'no';
  profileLink: string;
  notes: string;
}

const SINGLE_INIT: SingleForm = {
  artistName: '', whatsapp: '', title: '', featuring: '', producer: '',
  genre: '', releaseDate: '', previouslyReleased: '', profileLink: '', notes: '',
};

const ALBUM_INIT: AlbumForm = {
  artistName: '', whatsapp: '', albumTitle: '', albumType: '', trackCount: '',
  producer: '', genre: '', releaseDate: '', previouslyReleased: '', profileLink: '', notes: '',
};

export default function ArtistUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const artist = user?.artistId ? getArtistById(user.artistId) : undefined;

  const [agreed, setAgreed] = useState(false);
  const [uploadType, setUploadType] = useState<'single' | 'album' | null>(null);

  const [single, setSingle] = useState<SingleForm>({ ...SINGLE_INIT, artistName: artist?.name ?? '' });
  const [album, setAlbum] = useState<AlbumForm>({ ...ALBUM_INIT, artistName: artist?.name ?? '' });

  const [audioFiles, setAudioFiles] = useState<FileList | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!artist) return null;

  const locked = artist.uploadAccess === 'locked';
  const expired = artist.subscription.status === 'expired';

  if (locked || expired) {
    return (
      <div className="flex flex-col gap-5 max-w-300">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Upload Music</h1>
        </div>
        <div className="dash-panel flex flex-col items-center text-center gap-5 py-14 px-6">
          <div className="w-14 h-14 rounded-full bg-bg-3 border border-line flex items-center justify-center text-2xl text-muted">⊘</div>
          <div>
            <h2 className="text-base font-semibold text-ink mb-2">
              {expired ? 'Subscription Expired' : 'Upload Access Suspended'}
            </h2>
            <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
              {expired
                ? 'Your subscription has expired. Renew your plan to regain upload access.'
                : 'Your upload access has been suspended. Please contact support.'}
            </p>
          </div>
          <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="dash-btn dash-btn--gold">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  function handleSingle(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setSingle((f) => ({ ...f, [name]: value }));
  }

  function handleAlbum(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setAlbum((f) => ({ ...f, [name]: value }));
  }

  async function handleSingleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!single.whatsapp.trim())   { setError('WhatsApp number is required.'); return; }
    if (!single.title.trim())      { setError('Track title is required.'); return; }
    if (!single.producer.trim())   { setError('Producer name is required.'); return; }
    if (!single.genre)             { setError('Genre is required.'); return; }
    if (!single.releaseDate)       { setError('Release date is required.'); return; }
    if (!single.previouslyReleased) { setError('Please indicate if this song was previously released.'); return; }
    if (!audioFiles?.length)       { setError('Please upload your audio file.'); return; }
    if (!coverArt)                 { setError('Please upload your cover art.'); return; }

    const today = new Date().toISOString().split('T')[0];
    if (single.releaseDate < today) { setError('Release date must be in the future.'); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const track = submitTrack({
      artistId: artist.id,
      title: single.title.trim(),
      genre: single.genre,
      releaseDate: single.releaseDate,
      platforms: ['Spotify', 'Apple Music', 'Boomplay', 'TikTok', 'YouTube Music', 'Audiomack', 'Tidal', 'Deezer', 'Amazon Music'],
      ...(single.featuring.trim() ? { featuring: single.featuring.trim() } : {}),
    });

    sendNotification(
      artist.id,
      'upload_submitted',
      'Upload Received',
      `We've received your single "${track.title}". Our team will review it within 2–3 business days.`,
      { trackId: track.id, trackTitle: track.title },
    );

    setSubmitting(false);
    navigate('/artist/releases');
  }

  async function handleAlbumSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!album.whatsapp.trim())   { setError('WhatsApp number is required.'); return; }
    if (!album.albumTitle.trim()) { setError('Album title is required.'); return; }
    if (!album.albumType)         { setError('Please select Album, EP, or Mixtape.'); return; }
    if (!album.trackCount.trim()) { setError('Number of tracks is required.'); return; }
    if (!album.producer.trim())   { setError('Producer name is required.'); return; }
    if (!album.genre)             { setError('Genre is required.'); return; }
    if (!album.releaseDate)       { setError('Release date is required.'); return; }
    if (!album.previouslyReleased) { setError('Please indicate if this was previously released.'); return; }
    if (!audioFiles?.length)      { setError('Please upload your audio files.'); return; }
    if (!coverArt)                { setError('Please upload your cover art.'); return; }

    const today = new Date().toISOString().split('T')[0];
    if (album.releaseDate < today) { setError('Release date must be in the future.'); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));

    const track = submitTrack({
      artistId: artist.id,
      title: album.albumTitle.trim(),
      genre: album.genre,
      releaseDate: album.releaseDate,
      platforms: ['Spotify', 'Apple Music', 'Boomplay', 'TikTok', 'YouTube Music', 'Audiomack', 'Tidal', 'Deezer', 'Amazon Music'],
    });

    sendNotification(
      artist.id,
      'upload_submitted',
      'Album Upload Received',
      `We've received your ${album.albumType} "${track.title}". Our team will review it within 2–3 business days.`,
      { trackId: track.id, trackTitle: track.title },
    );

    setSubmitting(false);
    navigate('/artist/releases');
  }

  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Upload Music</h1>
        <p className="text-sm text-muted mt-1">Submit a new release for distribution. Our team reviews within 2–3 business days.</p>
      </div>

      {/* ── Terms & Conditions ─────────────────────────────────────────────── */}
      <div className="dash-panel" style={{ borderColor: agreed ? 'var(--color-line)' : 'var(--color-gold)' }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gold text-base">⚠</span>
          <h2 className="dash-panel__title" style={{ margin: 0 }}>Very Important — Read Before Uploading</h2>
        </div>
        <ol className="flex flex-col gap-2.5" style={{ paddingLeft: '16px', listStyleType: 'decimal' }}>
          {TERMS.map((t, i) => (
            <li key={i} className="text-sm text-muted leading-relaxed" style={{ paddingLeft: '4px' }}>{t}</li>
          ))}
        </ol>
        <label className="flex items-center gap-3 mt-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-gold cursor-pointer"
          />
          <span className="text-sm text-ink font-medium">
            I have read and agree to all the conditions above
          </span>
        </label>
      </div>

      {/* ── Upload type selector ───────────────────────────────────────────── */}
      {agreed && (
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => { setUploadType('single'); setError(''); setAudioFiles(null); setCoverArt(null); }}
            className={[
              'dash-panel flex flex-col items-center gap-3 py-8 cursor-pointer transition-colors border-2',
              uploadType === 'single' ? 'border-gold' : 'border-transparent',
            ].join(' ')}
            style={{ background: 'var(--color-bg-2)' }}
          >
            <span className="text-3xl">♪</span>
            <div>
              <div className="text-sm font-semibold text-ink">Upload Single</div>
              <div className="text-xs text-muted mt-0.5">1 track</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => { setUploadType('album'); setError(''); setAudioFiles(null); setCoverArt(null); }}
            className={[
              'dash-panel flex flex-col items-center gap-3 py-8 cursor-pointer transition-colors border-2',
              uploadType === 'album' ? 'border-gold' : 'border-transparent',
            ].join(' ')}
            style={{ background: 'var(--color-bg-2)' }}
          >
            <span className="text-3xl">◫</span>
            <div>
              <div className="text-sm font-semibold text-ink">Upload Album / EP</div>
              <div className="text-xs text-muted mt-0.5">Multiple tracks</div>
            </div>
          </button>
        </div>
      )}

      {/* ── Single form ────────────────────────────────────────────────────── */}
      {agreed && uploadType === 'single' && (
        <div className="dash-panel">
          <form onSubmit={handleSingleSubmit} className="flex flex-col gap-6">

            {/* Section 1 — Your Details */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">01 · Your Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Artist Stage Name" required>
                  <input name="artistName" className="dash-input" value={single.artistName} onChange={handleSingle} placeholder="Your stage name" maxLength={100} required />
                </Field>
                <Field label="Active WhatsApp Number" required>
                  <input name="whatsapp" className="dash-input" value={single.whatsapp} onChange={handleSingle} placeholder="e.g. +234 801 234 5678" maxLength={20} required />
                </Field>
              </div>
            </div>

            <div className="h-px" style={{ background: 'var(--color-line)' }} />

            {/* Section 2 — Track Details */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">02 · Track Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Track Title" required>
                  <input name="title" className="dash-input" value={single.title} onChange={handleSingle} placeholder="e.g. Midnight Frequency" maxLength={100} required />
                </Field>
                <Field label="Featuring Artist(s)">
                  <input name="featuring" className="dash-input" value={single.featuring} onChange={handleSingle} placeholder="e.g. Wizkid (optional)" maxLength={100} />
                </Field>
                <Field label="Producer Name" required>
                  <input name="producer" className="dash-input" value={single.producer} onChange={handleSingle} placeholder="e.g. Sarz" maxLength={100} required />
                </Field>
                <Field label="Genre" required>
                  <select name="genre" className="dash-input select-field" value={single.genre} onChange={handleSingle} required>
                    <option value="">Select a genre</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Release Date" required>
                  <input name="releaseDate" type="date" className="dash-input" value={single.releaseDate} onChange={handleSingle} min={tomorrow} required />
                </Field>
                <Field label="Previously released on streaming platforms?" required>
                  <select name="previouslyReleased" className="dash-input select-field" value={single.previouslyReleased} onChange={handleSingle} required>
                    <option value="">Select an option</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
              </div>
              {single.previouslyReleased === 'yes' && (
                <div className="mt-4">
                  <Field label="Paste your Spotify / Apple Music profile or song link" required>
                    <input name="profileLink" className="dash-input" value={single.profileLink} onChange={handleSingle} placeholder="https://open.spotify.com/artist/..." maxLength={300} required />
                  </Field>
                </div>
              )}
            </div>

            <div className="h-px" style={{ background: 'var(--color-line)' }} />

            {/* Section 3 — Files */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">03 · Upload Files</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Audio File (WAV or MP3)" required>
                  <div
                    className="dash-input flex items-center justify-between gap-3 cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => audioRef.current?.click()}
                  >
                    <span className="text-sm truncate" style={{ color: audioFiles?.length ? 'var(--color-ink)' : 'var(--color-muted)' }}>
                      {audioFiles?.length ? audioFiles[0].name : 'Choose file…'}
                    </span>
                    <span className="text-xs text-gold shrink-0">Browse</span>
                  </div>
                  <input ref={audioRef} type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" className="hidden" onChange={(e) => setAudioFiles(e.target.files)} />
                </Field>
                <Field label="Cover Art (JPG or PNG, 3000×3000px)" required>
                  <div
                    className="dash-input flex items-center justify-between gap-3 cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => coverRef.current?.click()}
                  >
                    <span className="text-sm truncate" style={{ color: coverArt ? 'var(--color-ink)' : 'var(--color-muted)' }}>
                      {coverArt ? coverArt.name : 'Choose file…'}
                    </span>
                    <span className="text-xs text-gold shrink-0">Browse</span>
                  </div>
                  <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="hidden" onChange={(e) => setCoverArt(e.target.files?.[0] ?? null)} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Additional Notes (optional)">
                  <textarea name="notes" className="dash-input" value={single.notes} onChange={handleSingle} placeholder="Any special instructions for our team…" rows={3} style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
                </Field>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-line">
              <button type="button" className="dash-btn dash-btn--ghost w-full sm:w-auto justify-center" onClick={() => setUploadType(null)}>Back</button>
              <button type="submit" className="dash-btn dash-btn--gold w-full sm:w-auto justify-center" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Single'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ── Album / EP form ────────────────────────────────────────────────── */}
      {agreed && uploadType === 'album' && (
        <div className="dash-panel">
          <form onSubmit={handleAlbumSubmit} className="flex flex-col gap-6">

            {/* Section 1 — Your Details */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">01 · Your Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Artist Stage Name" required>
                  <input name="artistName" className="dash-input" value={album.artistName} onChange={handleAlbum} placeholder="Your stage name" maxLength={100} required />
                </Field>
                <Field label="Active WhatsApp Number" required>
                  <input name="whatsapp" className="dash-input" value={album.whatsapp} onChange={handleAlbum} placeholder="e.g. +234 801 234 5678" maxLength={20} required />
                </Field>
              </div>
            </div>

            <div className="h-px" style={{ background: 'var(--color-line)' }} />

            {/* Section 2 — Album Details */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">02 · Album Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Album / EP Title" required>
                  <input name="albumTitle" className="dash-input" value={album.albumTitle} onChange={handleAlbum} placeholder="e.g. Lagos Nights" maxLength={100} required />
                </Field>
                <Field label="Type" required>
                  <select name="albumType" className="dash-input select-field" value={album.albumType} onChange={handleAlbum} required>
                    <option value="">Select type</option>
                    <option value="Album">Album</option>
                    <option value="EP">EP</option>
                    <option value="Mixtape">Mixtape</option>
                  </select>
                </Field>
                <Field label="Number of Tracks" required>
                  <input name="trackCount" type="number" min="2" max="30" className="dash-input" value={album.trackCount} onChange={handleAlbum} placeholder="e.g. 8" required />
                </Field>
                <Field label="Producer Name" required>
                  <input name="producer" className="dash-input" value={album.producer} onChange={handleAlbum} placeholder="e.g. Sarz" maxLength={100} required />
                </Field>
                <Field label="Genre" required>
                  <select name="genre" className="dash-input select-field" value={album.genre} onChange={handleAlbum} required>
                    <option value="">Select a genre</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Release Date" required>
                  <input name="releaseDate" type="date" className="dash-input" value={album.releaseDate} onChange={handleAlbum} min={tomorrow} required />
                </Field>
                <Field label="Previously released on streaming platforms?" required>
                  <select name="previouslyReleased" className="dash-input select-field" value={album.previouslyReleased} onChange={handleAlbum} required>
                    <option value="">Select an option</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </Field>
              </div>
              {album.previouslyReleased === 'yes' && (
                <div className="mt-4">
                  <Field label="Paste your Spotify / Apple Music profile or song link" required>
                    <input name="profileLink" className="dash-input" value={album.profileLink} onChange={handleAlbum} placeholder="https://open.spotify.com/artist/..." maxLength={300} required />
                  </Field>
                </div>
              )}
            </div>

            <div className="h-px" style={{ background: 'var(--color-line)' }} />

            {/* Section 3 — Files */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">03 · Upload Files</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Audio Files (WAV or MP3 — all tracks)" required>
                  <div
                    className="dash-input flex items-center justify-between gap-3 cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => audioRef.current?.click()}
                  >
                    <span className="text-sm truncate" style={{ color: audioFiles?.length ? 'var(--color-ink)' : 'var(--color-muted)' }}>
                      {audioFiles?.length ? `${audioFiles.length} file${audioFiles.length > 1 ? 's' : ''} selected` : 'Choose files…'}
                    </span>
                    <span className="text-xs text-gold shrink-0">Browse</span>
                  </div>
                  <input ref={audioRef} type="file" accept=".wav,.mp3,audio/wav,audio/mpeg" multiple className="hidden" onChange={(e) => setAudioFiles(e.target.files)} />
                </Field>
                <Field label="Cover Art (JPG or PNG, 3000×3000px)" required>
                  <div
                    className="dash-input flex items-center justify-between gap-3 cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => coverRef.current?.click()}
                  >
                    <span className="text-sm truncate" style={{ color: coverArt ? 'var(--color-ink)' : 'var(--color-muted)' }}>
                      {coverArt ? coverArt.name : 'Choose file…'}
                    </span>
                    <span className="text-xs text-gold shrink-0">Browse</span>
                  </div>
                  <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" className="hidden" onChange={(e) => setCoverArt(e.target.files?.[0] ?? null)} />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Additional Notes (optional)">
                  <textarea name="notes" className="dash-input" value={album.notes} onChange={handleAlbum} placeholder="Track listing, featured artists per track, special instructions…" rows={4} style={{ resize: 'vertical', fontFamily: 'var(--font-sans)' }} />
                </Field>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-line">
              <button type="button" className="dash-btn dash-btn--ghost w-full sm:w-auto justify-center" onClick={() => setUploadType(null)}>Back</button>
              <button type="submit" className="dash-btn dash-btn--gold w-full sm:w-auto justify-center" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Album / EP'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-2">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      {children}
    </div>
  );
}
