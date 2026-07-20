import { useState, useRef, type FormEvent } from 'react';
import { createBeat } from '../../services/beats.service';
import { ApiError } from '../../services/httpClient';
import type { Beat, BeatType } from '../../types/content';

interface AddBeatFormProps {
  onCreated: (beat: Beat) => void;
  onCancel: () => void;
}

export default function AddBeatForm({ onCreated, onCancel }: AddBeatFormProps) {
  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState('');
  const [type, setType] = useState<BeatType>('lease');
  const [price, setPrice] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    if (bpm.trim()) formData.append('bpm', bpm.trim());
    formData.append('type', type);
    if (price.trim()) formData.append('price', price.trim());
    if (audioFile) formData.append('audio', audioFile);

    setSubmitting(true);
    try {
      const beat = await createBeat(formData);
      onCreated(beat);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not add this beat. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="dash-panel">
      <h2 className="text-sm font-semibold text-ink mb-4">Add Beat</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Title</label>
            <input className="dash-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">BPM (optional)</label>
            <input className="dash-input" value={bpm} onChange={(e) => setBpm(e.target.value)} placeholder="e.g. 140bpm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Type</label>
            <select className="dash-input select-field" value={type} onChange={(e) => setType(e.target.value as BeatType)}>
              <option value="lease">Lease</option>
              <option value="purchase">Purchase</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Price (USD, optional)</label>
            <input type="number" step="0.01" min="0" className="dash-input" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-ink-2">Audio File (WAV or MP3)</label>
            <input ref={audioRef} type="file" accept=".wav,.mp3" className="dash-input" onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>

        {error && <div className="text-xs text-red-400 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</div>}

        <div className="flex justify-end gap-3 pt-2 border-t border-line">
          <button type="button" className="dash-btn dash-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="dash-btn dash-btn--gold" disabled={submitting}>
            {submitting ? 'Uploading…' : 'Add Beat'}
          </button>
        </div>
      </form>
    </div>
  );
}
