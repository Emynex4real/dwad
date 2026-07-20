import { useState, useRef, type FormEvent } from 'react';
import { createProduction } from '../../services/productions.service';
import { ApiError } from '../../services/httpClient';
import type { Production } from '../../types/content';

interface AddProductionFormProps {
  onCreated: (production: Production) => void;
  onCancel: () => void;
}

export default function AddProductionForm({ onCreated, onCancel }: AddProductionFormProps) {
  const [title, setTitle] = useState('');
  const [artistName, setArtistName] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !artistName.trim()) {
      setError('Title and artist name are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('artistName', artistName.trim());
    if (spotifyUrl.trim()) formData.append('spotifyUrl', spotifyUrl.trim());
    if (audioFile) formData.append('audio', audioFile);
    if (coverFile) formData.append('cover', coverFile);

    setSubmitting(true);
    try {
      const production = await createProduction(formData);
      onCreated(production);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add this song. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dash-panel">
      <h2 className="text-sm font-semibold text-ink mb-4">Add Song</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Title</label>
            <input className="dash-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Artist Name</label>
            <input className="dash-input" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-ink-2">Spotify URL (optional)</label>
            <input className="dash-input" value={spotifyUrl} onChange={(e) => setSpotifyUrl(e.target.value)} placeholder="https://open.spotify.com/track/..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Audio File (WAV or MP3)</label>
            <input ref={audioRef} type="file" accept=".wav,.mp3" className="dash-input" onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Cover Art (optional, JPG/PNG)</label>
            <input ref={coverRef} type="file" accept=".jpg,.jpeg,.png" className="dash-input" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>

        {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <button type="button" className="dash-btn dash-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="dash-btn dash-btn--gold" disabled={submitting}>
            {submitting ? 'Uploading…' : 'Add Song'}
          </button>
        </div>
      </form>
    </div>
  );
}
