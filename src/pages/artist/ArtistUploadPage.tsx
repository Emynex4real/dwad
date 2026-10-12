import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useArtists } from '../../hooks/useArtists';
import { useTracks } from '../../hooks/useTracks';
import { submitTrack, deleteTrack } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';
import { ApiError } from '../../services/httpClient';
import type { TrackSubmissionDetails } from '../../types/dashboard';

const GENRES = [
  'Afrobeats', 'Afro Soul', 'Alt Pop', 'Hip Hop', 'R&B', 'Gospel',
  'Highlife', 'Street Pop', 'Electronic', 'Pop', 'Reggae', 'Other',
];

const TERMS = [
  'Make sure your song has no copyright, uncleared samples…',
  'Do not use a stolen beat or unlicensed instrumental. No refunds will be issued for beat issues.',
  'Choose a unique artist name before uploading to avoid name clashes with existing artists.',
  'If another artist shares your name, your song may be misattributed. Dwad assumes no responsibility for this.',
  'Verify your artist name does not already exist on Spotify and Apple Music before submitting.',
  'If you have uploaded on Spotify and Apple Music before, paste your profile or song links in the form accordingly.',
  'Do not buy streams. Your account will be permanently closed for fake, artificial, or purchased streams.',
];

interface SingleForm {
  artistName: string;
  realName: string;
  country: string;
  whatsapp: string;
  title: string;
  featuring: string;
  featuringPreviouslyReleased: '' | 'yes' | 'no';
  featuringProfileLink: string;
  producer: string;
  genre: string;
  releaseDate: string;
  previouslyReleased: '' | 'yes' | 'no';
  profileLink: string;
  notes: string;
}

interface AlbumForm {
  artistName: string;
  realName: string;
  country: string;
  whatsapp: string;
  albumTitle: string;
  albumType: '' | 'Album' | 'EP' | 'Mixtape';
  trackCount: string;
  producer: string;
  genre: string;
  releaseDate: string;
}

interface AlbumSong {
  id: string;
  title: string;
  featuring: string;
  featuringPreviouslyReleased: '' | 'yes' | 'no';
  featuringProfileLink: string;
  previouslyReleased: '' | 'yes' | 'no';
  profileLink: string;
  audioFile: File | null;
  producer: string;
}

const MAX_ALBUM_TRACKS = 30;

const SINGLE_INIT: SingleForm = {
  artistName: '', realName: '', country: '', whatsapp: '', title: '', featuring: '',
  featuringPreviouslyReleased: '', featuringProfileLink: '',
  producer: '', genre: '', releaseDate: '', previouslyReleased: '', profileLink: '', notes: '',
};

const ALBUM_INIT: AlbumForm = {
  artistName: '', realName: '', country: '', whatsapp: '', albumTitle: '', albumType: '',
  trackCount: '', producer: '', genre: '', releaseDate: '',
};

export default function ArtistUploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getArtist } = useArtists();
  const { addTrackToCache } = useTracks();
  const artist = user?.artistId ? getArtist(user.artistId) : undefined;

  const [agreed, setAgreed] = useState(false);
  const [uploadType, setUploadType] = useState<'single' | 'album' | null>(null);

  const [single, setSingle] = useState<SingleForm>(SINGLE_INIT);
  const [album, setAlbum] = useState<AlbumForm>(ALBUM_INIT);
  const [albumSongs, setAlbumSongs] = useState<AlbumSong[]>([]);

  const [audioFiles, setAudioFiles] = useState<FileList | null>(null);
  const [coverArt, setCoverArt] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('');
  const [error, setError] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsSigned, setTermsSigned] = useState([false, false, false, false]);
  const [pendingSubmit, setPendingSubmit] = useState<'single' | 'album' | null>(null);
  const [tomorrow] = useState(() => new Date(Date.now() + 86_400_000).toISOString().split('T')[0]);
  const [nameDefaultedFor, setNameDefaultedFor] = useState<string | undefined>(undefined);

  if (artist && artist.id !== nameDefaultedFor) {
    setNameDefaultedFor(artist.id);
    setSingle((f) => ({ ...f, artistName: f.artistName || artist.name }));
    setAlbum((f) => ({ ...f, artistName: f.artistName || artist.name }));
  }

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

    if (name === 'trackCount') {
      const count = Math.max(0, Math.min(MAX_ALBUM_TRACKS, parseInt(value, 10) || 0));
      setAlbumSongs((prev) => {
        const next = prev.slice(0, count);
        while (next.length < count) next.push({ id: crypto.randomUUID(), title: '', featuring: '', featuringPreviouslyReleased: '', featuringProfileLink: '', previouslyReleased: '', profileLink: '', audioFile: null, producer: '' });
        return next;
      });
    }
  }

  function updateAlbumSong(id: string, patch: Partial<AlbumSong>) {
    setAlbumSongs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function handleSingleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!single.realName.trim())   { setError('Artist real name is required.'); return; }
    if (!single.country.trim())    { setError('Country is required.'); return; }
    if (!single.whatsapp.trim())   { setError('WhatsApp number is required.'); return; }
    if (!single.title.trim())      { setError('Track title is required.'); return; }
    if (!single.producer.trim())   { setError('Producer name is required.'); return; }
    if (!single.genre)             { setError('Genre is required.'); return; }
    if (!single.releaseDate)       { setError('Release date is required.'); return; }
    if (!single.previouslyReleased) { setError('Please indicate if this song was previously released.'); return; }
    if (single.featuring.trim() && !single.featuringPreviouslyReleased) { setError('Please indicate if the featuring artist has released music on streaming platforms before.'); return; }
    if (single.featuringPreviouslyReleased === 'yes' && !single.featuringProfileLink.trim()) { setError('Please paste the featuring artist\'s profile or song link.'); return; }
    if (!audioFiles?.length)       { setError('Please upload your audio file.'); return; }
    if (!coverArt)                 { setError('Please upload your cover art.'); return; }

    const today = new Date().toISOString().split('T')[0];
    if (single.releaseDate < today) { setError('Release date must be in the future.'); return; }

    setTermsSigned([false, false, false]);
    setPendingSubmit('single');
    setTermsOpen(true);
  }

  function buildUploadFormData(fields: Record<string, string>, audioFileList: FileList | File[] | null): FormData {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    Array.from(audioFileList ?? []).forEach((file) => formData.append('audio[]', file));
    if (coverArt) formData.append('cover', coverArt);
    return formData;
  }

  async function doSingleSubmit() {
    if (!artist) return;
    setSubmitting(true);
    setUploadProgress(0);
    setUploadStage('Uploading…');

    const details: TrackSubmissionDetails = {
      stageName: single.artistName.trim(),
      realName: single.realName.trim(),
      country: single.country.trim(),
      whatsapp: single.whatsapp.trim(),
      producer: single.producer.trim(),
      ...(single.previouslyReleased ? { previouslyReleased: single.previouslyReleased } : {}),
      ...(single.previouslyReleased === 'yes' ? { profileLink: single.profileLink.trim() } : {}),
      ...(single.featuring.trim() && single.featuringPreviouslyReleased
        ? { featuringPreviouslyReleased: single.featuringPreviouslyReleased }
        : {}),
      ...(single.featuring.trim() && single.featuringPreviouslyReleased === 'yes'
        ? { featuringProfileLink: single.featuringProfileLink.trim() }
        : {}),
      notes: single.notes.trim(),
    };

    try {
      const track = await submitTrack(buildUploadFormData({
        artistId: artist.id,
        title: single.title.trim(),
        genre: single.genre,
        releaseDate: single.releaseDate,
        platforms: JSON.stringify(['Spotify', 'Apple Music', 'Boomplay', 'TikTok', 'YouTube Music', 'Audiomack', 'Tidal', 'Deezer', 'Amazon Music']),
        details: JSON.stringify(details),
        ...(single.featuring.trim() ? { featuring: single.featuring.trim() } : {}),
      }, audioFiles), (pct) => setUploadProgress(pct));
      addTrackToCache(track);

      void sendNotification(
        artist.id,
        'upload_submitted',
        'Upload Received',
        `We've received your single "${track.title}". Our team will review it within 2–3 business days.`,
        { trackId: track.id, trackTitle: track.title },
      );

      navigate('/artist/releases');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upload failed. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  }

  function handleAlbumSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!album.realName.trim())    { setError('Artist real name is required.'); return; }
    if (!album.country.trim())     { setError('Country is required.'); return; }
    if (!album.whatsapp.trim())    { setError('WhatsApp number is required.'); return; }
    if (!album.albumTitle.trim())  { setError('Album title is required.'); return; }
    if (!album.albumType)          { setError('Please select Album, EP, or Mixtape.'); return; }
    if (!album.trackCount.trim())  { setError('Number of tracks is required.'); return; }
    if (!album.producer.trim())    { setError('Producer name is required.'); return; }
    if (!album.genre)              { setError('Genre is required.'); return; }
    if (!album.releaseDate)        { setError('Release date is required.'); return; }
    if (albumSongs.length === 0)   { setError('Please enter the number of tracks.'); return; }
    if (albumSongs.some((s) => !s.title.trim())) { setError('Please enter a title for every track.'); return; }
    if (albumSongs.some((s) => !s.audioFile))    { setError('Please upload an audio file for every track.'); return; }
    if (albumSongs.some((s) => !s.previouslyReleased)) { setError('Please indicate if each song was previously released, for every track.'); return; }
    if (albumSongs.some((s) => s.previouslyReleased === 'yes' && !s.profileLink.trim())) { setError('Please paste the profile or song link for every track that was previously released.'); return; }
    if (albumSongs.some((s) => s.featuring.trim() && !s.featuringPreviouslyReleased)) { setError('Please indicate if the featuring artist has released music on streaming platforms before, for every track with a featuring artist.'); return; }
    if (albumSongs.some((s) => s.featuringPreviouslyReleased === 'yes' && !s.featuringProfileLink.trim())) { setError("Please paste the featuring artist's profile or song link for every track that needs it."); return; }
    if (!coverArt)                 { setError('Please upload your cover art.'); return; }

    const today = new Date().toISOString().split('T')[0];
    if (album.releaseDate < today) { setError('Release date must be in the future.'); return; }

    setTermsSigned([false, false, false]);
    setPendingSubmit('album');
    setTermsOpen(true);
  }

  async function doAlbumSubmit() {
    if (!artist) return;
    setSubmitting(true);
    setUploadProgress(0);
    setUploadStage('');

    const albumId = crypto.randomUUID();
    const platforms = JSON.stringify(['Spotify', 'Apple Music', 'Boomplay', 'TikTok', 'YouTube Music', 'Audiomack', 'Tidal', 'Deezer', 'Amazon Music']);
    const total = albumSongs.length;

    const createdTrackIds: string[] = [];
    try {
      let firstTrackId = '';
      for (let i = 0; i < total; i++) {
        const song = albumSongs[i];
        setUploadStage(`Uploading track ${i + 1} of ${total}: "${song.title}"`);
        const details: TrackSubmissionDetails = {
          stageName: album.artistName.trim(),
          realName: album.realName.trim(),
          country: album.country.trim(),
          whatsapp: album.whatsapp.trim(),
          producer: song.producer.trim() || album.producer.trim(),
          ...(song.previouslyReleased ? { previouslyReleased: song.previouslyReleased } : {}),
          ...(song.previouslyReleased === 'yes' ? { profileLink: song.profileLink.trim() } : {}),
          ...(song.featuring.trim() && song.featuringPreviouslyReleased
            ? { featuringPreviouslyReleased: song.featuringPreviouslyReleased }
            : {}),
          ...(song.featuring.trim() && song.featuringPreviouslyReleased === 'yes'
            ? { featuringProfileLink: song.featuringProfileLink.trim() }
            : {}),
        };
        const track = await submitTrack(buildUploadFormData({
          artistId: artist.id,
          title: song.title.trim(),
          genre: album.genre,
          releaseDate: album.releaseDate,
          platforms,
          details: JSON.stringify(details),
          albumId,
          albumTitle: album.albumTitle.trim(),
          albumType: album.albumType,
          ...(song.featuring.trim() ? { featuring: song.featuring.trim() } : {}),
        }, song.audioFile ? [song.audioFile] : []), (pct) => {
          setUploadProgress(Math.round(((i + pct / 100) / total) * 100));
        });
        addTrackToCache(track);
        createdTrackIds.push(track.id);
        if (!firstTrackId) firstTrackId = track.id;
      }

      void sendNotification(
        artist.id,
        'upload_submitted',
        'Album Upload Received',
        `We've received your ${album.albumType} "${album.albumTitle}" (${albumSongs.length} tracks). Our team will review it within 2–3 business days.`,
        { trackId: firstTrackId, trackTitle: album.albumTitle },
      );

      navigate('/artist/releases');
    } catch (err) {
      if (createdTrackIds.length > 0) {
        await Promise.allSettled(createdTrackIds.map((id) => deleteTrack(id)));
      }
      const baseMessage = err instanceof ApiError ? err.message : 'Upload failed. Please check your connection and try again.';
      setError(`${baseMessage} Any songs already uploaded for this album have been removed — please try again.`);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
      setUploadStage('');
    }
  }

  async function handleTermsConfirm() {
    setTermsOpen(false);
    if (pendingSubmit === 'single') await doSingleSubmit();
    else if (pendingSubmit === 'album') await doAlbumSubmit();
    setPendingSubmit(null);
  }

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
            onClick={() => { setUploadType('album'); setError(''); setAudioFiles(null); setCoverArt(null); setAlbumSongs([]); }}
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
                <Field label="Artist Real Name (Surname & First Name)" required>
                  <input name="realName" className="dash-input" value={single.realName} onChange={handleSingle} placeholder="e.g. Okafor Emmanuel" maxLength={100} required />
                </Field>
                <Field label="Country" required>
                  <input name="country" className="dash-input" value={single.country} onChange={handleSingle} placeholder="e.g. Nigeria" maxLength={60} required />
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
                  <p className="text-xs text-muted mb-1.5">(We advise a minimum of 2-3 weeks from the date of uploading)</p>
                  <input name="releaseDate" type="date" className="dash-input" value={single.releaseDate} onChange={handleSingle} min={tomorrow} required />
                </Field>
                <Field label="Have you released music on streaming platforms before?" required>
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
              {single.featuring.trim() !== '' && (
                <div className="mt-4">
                  <Field label="Has the featuring artist released music on streaming platforms before?" required>
                    <select name="featuringPreviouslyReleased" className="dash-input select-field" value={single.featuringPreviouslyReleased} onChange={handleSingle} required>
                      <option value="">Select an option</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </Field>
                </div>
              )}
              {single.featuring.trim() !== '' && single.featuringPreviouslyReleased === 'yes' && (
                <div className="mt-4">
                  <Field label="Paste the featuring artist's Spotify / Apple Music profile or song link" required>
                    <input name="featuringProfileLink" className="dash-input" value={single.featuringProfileLink} onChange={handleSingle} placeholder="https://open.spotify.com/artist/..." maxLength={300} required />
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

            {submitting && <UploadProgressBar percent={uploadProgress} stage={uploadStage} />}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-line">
              <button type="button" className="dash-btn dash-btn--ghost w-full sm:w-auto justify-center" onClick={() => setUploadType(null)} disabled={submitting}>Back</button>
              <button type="submit" className="dash-btn dash-btn--gold w-full sm:w-auto justify-center" disabled={submitting}>
                {submitting ? `Submitting… ${uploadProgress}%` : 'Submit Single'}
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
                <Field label="Artist Real Name (Surname & First Name)" required>
                  <input name="realName" className="dash-input" value={album.realName} onChange={handleAlbum} placeholder="e.g. Okafor Emmanuel" maxLength={100} required />
                </Field>
                <Field label="Country" required>
                  <input name="country" className="dash-input" value={album.country} onChange={handleAlbum} placeholder="e.g. Nigeria" maxLength={60} required />
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
                <Field label="Main Producer Name (used for any track where you don't enter one below)" required>
                  <input name="producer" className="dash-input" value={album.producer} onChange={handleAlbum} placeholder="e.g. Sarz" maxLength={100} required />
                </Field>
                <Field label="Genre" required>
                  <select name="genre" className="dash-input select-field" value={album.genre} onChange={handleAlbum} required>
                    <option value="">Select a genre</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Release Date" required>
                  <p className="text-xs text-muted mb-1.5">(We advise a minimum of 2-3 weeks from the date of uploading)</p>
                  <input name="releaseDate" type="date" className="dash-input" value={album.releaseDate} onChange={handleAlbum} min={tomorrow} required />
                </Field>
              </div>
            </div>

            <div className="h-px" style={{ background: 'var(--color-line)' }} />

            {/* Section 3 — Cover Art */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">03 · Cover Art</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <div className="h-px" style={{ background: 'var(--color-line)' }} />

            {/* Section 4 — Tracks */}
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-gold mb-4">04 · Tracks</div>
              {albumSongs.length === 0 ? (
                <p className="text-sm text-muted">Enter the number of tracks above to list each song.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {albumSongs.map((song, i) => (
                    <div key={song.id} className="border border-line rounded-lg p-4 flex flex-col gap-3" style={{ background: 'var(--color-bg-2)' }}>
                      <div className="text-xs font-mono uppercase tracking-widest text-muted">Track {i + 1}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Track Title" required>
                          <input
                            className="dash-input"
                            value={song.title}
                            onChange={(e) => updateAlbumSong(song.id, { title: e.target.value })}
                            placeholder="e.g. Midnight Frequency"
                            maxLength={100}
                            required
                          />
                        </Field>
                        <Field label="Featuring Artist(s)">
                          <input
                            className="dash-input"
                            value={song.featuring}
                            onChange={(e) => updateAlbumSong(song.id, { featuring: e.target.value })}
                            placeholder="e.g. Wizkid (optional)"
                            maxLength={100}
                          />
                        </Field>
                      </div>
                      <Field label="Have you released this song on streaming platforms before?" required>
                        <select
                          className="dash-input select-field"
                          value={song.previouslyReleased}
                          onChange={(e) => updateAlbumSong(song.id, { previouslyReleased: e.target.value as '' | 'yes' | 'no' })}
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </Field>
                      {song.previouslyReleased === 'yes' && (
                        <Field label="Paste your Spotify / Apple Music profile or song link" required>
                          <input
                            className="dash-input"
                            value={song.profileLink}
                            onChange={(e) => updateAlbumSong(song.id, { profileLink: e.target.value })}
                            placeholder="https://open.spotify.com/artist/..."
                            maxLength={300}
                            required
                          />
                        </Field>
                      )}
                      {song.featuring.trim() !== '' && (
                        <Field label="Has the featuring artist released music on streaming platforms before?" required>
                          <select
                            className="dash-input select-field"
                            value={song.featuringPreviouslyReleased}
                            onChange={(e) => updateAlbumSong(song.id, { featuringPreviouslyReleased: e.target.value as '' | 'yes' | 'no' })}
                            required
                          >
                            <option value="">Select an option</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </Field>
                      )}
                      {song.featuring.trim() !== '' && song.featuringPreviouslyReleased === 'yes' && (
                        <Field label="Paste the featuring artist's Spotify / Apple Music profile or song link" required>
                          <input
                            className="dash-input"
                            value={song.featuringProfileLink}
                            onChange={(e) => updateAlbumSong(song.id, { featuringProfileLink: e.target.value })}
                            placeholder="https://open.spotify.com/artist/..."
                            maxLength={300}
                            required
                          />
                        </Field>
                      )}
                      <Field label="Audio File (WAV or MP3)" required>
                        <input
                          type="file"
                          accept=".wav,.mp3,audio/wav,audio/mpeg"
                          className="dash-input"
                          onChange={(e) => updateAlbumSong(song.id, { audioFile: e.target.files?.[0] ?? null })}
                          required
                        />
                      </Field>
                      <Field label="Producer Name">
                        <input
                          className="dash-input"
                          value={song.producer}
                          onChange={(e) => updateAlbumSong(song.id, { producer: e.target.value })}
                          placeholder={album.producer.trim() || 'e.g. Sarz'}
                          maxLength={100}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>
            )}

            {submitting && <UploadProgressBar percent={uploadProgress} stage={uploadStage} />}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2 border-t border-line">
              <button type="button" className="dash-btn dash-btn--ghost w-full sm:w-auto justify-center" onClick={() => setUploadType(null)} disabled={submitting}>Back</button>
              <button type="submit" className="dash-btn dash-btn--gold w-full sm:w-auto justify-center" disabled={submitting}>
                {submitting ? `Submitting… ${uploadProgress}%` : 'Submit Album / EP'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ── Terms & Confirmation Modal ── */}
      {termsOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto flex flex-col rounded-xl border" style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--color-line)' }}>
              <h2 className="font-serif text-xl font-normal text-ink">Confirmation Required</h2>
              <p className="text-sm text-muted mt-1">You are about to submit this release to be distributed to digital and social platforms worldwide (250+ platforms).</p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono tracking-wide" style={{ borderColor: 'var(--color-gold)', color: 'var(--color-gold)', background: 'rgba(184,142,67,0.1)' }}>
                ✦ 25 Services
              </div>
              <p className="text-xs text-muted mt-3">Please confirm the following:</p>
            </div>

            {/* Declarations */}
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Section 1 — Copyright */}
              <div className="border rounded-lg p-4" style={{ borderColor: termsSigned[0] ? 'var(--color-gold)' : 'var(--color-line)', background: 'var(--color-bg)' }}>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsSigned[0]}
                    onChange={() => setTermsSigned(prev => prev.map((v, idx) => idx === 0 ? !v : v))}
                    className="w-4 h-4 accent-gold cursor-pointer mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-ink leading-relaxed">
                    I have legal copyright licenses to the sound recordings, beats/instrumentals, compositions and artwork in this project. And further abide and agree to all terms as set forth in our distribution agreement.
                  </p>
                </label>
                <a href="/legal#distribution" target="_blank" rel="noreferrer" className="mt-3 ml-7 inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1 border transition-colors hover:border-gold" style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-2)' }}>
                  Distribution Agreement ↗
                </a>
              </div>

              {/* Section 2 — Track Properties */}
              <div className="border rounded-lg p-4" style={{ borderColor: termsSigned[1] ? 'var(--color-gold)' : 'var(--color-line)', background: 'var(--color-bg)' }}>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsSigned[1]}
                    onChange={() => setTermsSigned(prev => prev.map((v, idx) => idx === 1 ? !v : v))}
                    className="w-4 h-4 accent-gold cursor-pointer mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-ink leading-relaxed">
                    I confirm that I have truthfully indicated the Track Origin and Track Properties that apply for each of my tracks in order to ensure compliance with the various DSPs' requirements. I understand that there are serious consequences to misrepresenting my tracks and/or not declaring all the appropriate Track Properties.
                  </p>
                </label>
                <a href="/legal#section-consequences" target="_blank" rel="noreferrer" className="mt-3 ml-7 inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1 border transition-colors hover:border-gold" style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-2)' }}>
                  Consequences of Misrepresentation ↗
                </a>
              </div>

              {/* Section 3 — Artificial Streaming */}
              <div className="border rounded-lg p-4" style={{ borderColor: termsSigned[2] ? 'var(--color-gold)' : 'var(--color-line)', background: 'var(--color-bg)' }}>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsSigned[2]}
                    onChange={() => setTermsSigned(prev => prev.map((v, idx) => idx === 2 ? !v : v))}
                    className="w-4 h-4 accent-gold cursor-pointer mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-ink leading-relaxed">
                    I acknowledge and understand that playlisting services guaranteeing "increased streams" use techniques that result in artificial streaming, which violates music services' terms of use.{' '}
                    <a href="https://youtu.be/gTXO0QNEXgE?si=uzWlNTBgh2_bW7Ij" target="_blank" rel="noreferrer" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>
                      Watch this video to learn more.
                    </a>
                  </p>
                </label>
                <div className="mt-3 ml-7 flex flex-col gap-2">
                  <a href="https://youtu.be/gTXO0QNEXgE?si=uzWlNTBgh2_bW7Ij" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1 border w-fit transition-colors hover:border-gold" style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-2)' }}>
                    What is Artificial Streaming? ↗
                  </a>
                  <a href="https://music-tomorrow.com/blog/the-negative-impact-of-fake-streams-on-artists-algorithmic-performance" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium rounded px-2 py-1 border w-fit transition-colors hover:border-gold" style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-2)' }}>
                    The (Negative) Impact of Fake Streams on Artists' Algorithmic Performance ↗
                  </a>
                </div>

                {/* Warning box */}
                <div className="mt-4 ml-7 flex items-start gap-2 rounded-lg p-3 border" style={{ background: 'rgba(251,146,60,0.1)', borderColor: 'rgba(251,146,60,0.4)' }}>
                  <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
                  <p className="text-xs leading-relaxed" style={{ color: '#fb923c' }}>
                    Using playlisting services may actually ruin your chances of gaining more streams, and may also result in your music being banned and/or your royalties withheld.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 flex gap-3 justify-end border-t" style={{ borderColor: 'var(--color-line)' }}>
              <button
                type="button"
                className="dash-btn dash-btn--ghost"
                onClick={() => { setTermsOpen(false); setPendingSubmit(null); }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!termsSigned.every(Boolean) || submitting}
                onClick={handleTermsConfirm}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '12px 24px',
                  background: termsSigned.every(Boolean) ? '#dc2626' : 'var(--color-bg-3)',
                  color: termsSigned.every(Boolean) ? '#fff' : 'var(--color-muted)',
                  border: 'none',
                  cursor: termsSigned.every(Boolean) ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                  borderRadius: '4px',
                }}
              >
                {submitting ? 'Submitting…' : 'Confirm'}
              </button>
            </div>

          </div>
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

function UploadProgressBar({ percent, stage }: { percent: number; stage: string }) {
  return (
    <div className="flex flex-col gap-2">
      {stage && <div className="text-xs text-muted">{stage}</div>}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-3)' }}>
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${percent}%`, background: 'var(--color-gold)' }}
        />
      </div>
      <div className="text-xs text-ink font-medium text-right">{percent}%</div>
    </div>
  );
}
