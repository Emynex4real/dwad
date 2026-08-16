import { useState } from 'react';
import { API_BASE_URL, ApiError } from '../../services/httpClient';
import { createSpotlightItem, deleteSpotlightItem, moveSpotlightItem, updateSpotlightItem } from '../../services/spotlight.service';
import type { SpotlightItem, SpotlightSection } from '../../types/content';

const SECTION_BACKEND_KEY: Record<SpotlightSection, string> = {
  roster: 'roster',
  topTalents: 'top_talents',
  topHits: 'top_hits',
  videos: 'videos',
  topClassics: 'top_classics',
  coverWall: 'cover_wall',
};

export interface SpotlightSectionConfig {
  section: SpotlightSection;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  showImage: boolean;
  imageRequired?: boolean;
  showVideoId?: boolean;
  showExternalUrl?: boolean;
}

interface ItemFormState {
  primaryText: string;
  secondaryText: string;
  videoId: string;
  externalUrl: string;
  image: File | null;
}

const EMPTY_FORM: ItemFormState = { primaryText: '', secondaryText: '', videoId: '', externalUrl: '', image: null };

interface SpotlightItemsSectionProps {
  config: SpotlightSectionConfig;
  initialItems: SpotlightItem[];
}

export default function SpotlightItemsSection({ config, initialItems }: SpotlightItemsSectionProps) {
  const [items, setItems] = useState<SpotlightItem[]>(initialItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<ItemFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ItemFormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function describeError(err: unknown, fallback: string): string {
    return err instanceof ApiError ? err.message : fallback;
  }

  async function handleAdd() {
    setError('');
    const formData = new FormData();
    formData.append('section', SECTION_BACKEND_KEY[config.section]);
    formData.append('primaryText', addForm.primaryText.trim());
    formData.append('secondaryText', addForm.secondaryText.trim());
    if (config.showVideoId) formData.append('videoId', addForm.videoId.trim());
    if (config.showExternalUrl) formData.append('externalUrl', addForm.externalUrl.trim());
    if (addForm.image) formData.append('image', addForm.image);

    setSubmitting(true);
    try {
      const created = await createSpotlightItem(formData);
      setItems((prev) => [...prev, created]);
      setAddForm(EMPTY_FORM);
      setShowAddForm(false);
    } catch (err) {
      setError(describeError(err, 'Could not add this item. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: SpotlightItem) {
    setEditingId(item.id);
    setEditForm({
      primaryText: item.primaryText ?? '',
      secondaryText: item.secondaryText ?? '',
      videoId: item.videoId ?? '',
      externalUrl: item.externalUrl ?? '',
      image: null,
    });
  }

  async function saveEdit(id: string) {
    setError('');
    const formData = new FormData();
    formData.append('primaryText', editForm.primaryText.trim());
    formData.append('secondaryText', editForm.secondaryText.trim());
    if (config.showVideoId) formData.append('videoId', editForm.videoId.trim());
    if (config.showExternalUrl) formData.append('externalUrl', editForm.externalUrl.trim());
    if (editForm.image) formData.append('image', editForm.image);

    setSubmitting(true);
    try {
      const updated = await updateSpotlightItem(id, formData);
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      setEditingId(null);
    } catch (err) {
      setError(describeError(err, 'Could not save this item. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setError('');
    try {
      await deleteSpotlightItem(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(describeError(err, 'Could not delete this item. Please try again.'));
    }
  }

  async function handleMove(id: string, direction: 'up' | 'down') {
    setError('');
    const index = items.findIndex((it) => it.id === id);
    const neighborIndex = direction === 'up' ? index - 1 : index + 1;
    if (index === -1 || neighborIndex < 0 || neighborIndex >= items.length) return;

    try {
      await moveSpotlightItem(id, direction);
      setItems((prev) => {
        const next = [...prev];
        [next[index], next[neighborIndex]] = [next[neighborIndex], next[index]];
        return next;
      });
    } catch (err) {
      setError(describeError(err, 'Could not reorder this item. Please try again.'));
    }
  }

  return (
    <div className="dash-panel p-0!">
      <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{config.title}</h2>
          <p className="text-xs text-muted mt-0.5">{config.description}</p>
        </div>
        {!showAddForm && (
          <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3 shrink-0" onClick={() => setShowAddForm(true)}>+ Add</button>
        )}
      </div>

      {error && <div className="text-xs text-red-400 px-5 pb-3">{error}</div>}

      {showAddForm && (
        <div className="px-5 pb-4 flex flex-col gap-2 border-b border-line">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className="dash-input" placeholder={config.primaryLabel} value={addForm.primaryText} onChange={(e) => setAddForm({ ...addForm, primaryText: e.target.value })} />
            {config.secondaryLabel && (
              <input className="dash-input" placeholder={config.secondaryLabel} value={addForm.secondaryText} onChange={(e) => setAddForm({ ...addForm, secondaryText: e.target.value })} />
            )}
            {config.showVideoId && (
              <input className="dash-input" placeholder="YouTube video id (e.g. dQw4w9WgXcQ)" value={addForm.videoId} onChange={(e) => setAddForm({ ...addForm, videoId: e.target.value })} />
            )}
            {config.showExternalUrl && (
              <input className="dash-input" placeholder="Spotify URL (optional)" value={addForm.externalUrl} onChange={(e) => setAddForm({ ...addForm, externalUrl: e.target.value })} />
            )}
            {config.showImage && (
              <input type="file" accept=".jpg,.jpeg,.png,.webp" className="dash-input" onChange={(e) => setAddForm({ ...addForm, image: e.target.files?.[0] ?? null })} />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={() => { setShowAddForm(false); setAddForm(EMPTY_FORM); }}>Cancel</button>
            <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" disabled={submitting} onClick={() => void handleAdd()}>
              {submitting ? 'Adding…' : 'Add'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col divide-y divide-line">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-3 px-5 py-3">
            {editingId === item.id ? (
              <div className="flex-1 flex flex-col gap-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input className="dash-input" placeholder={config.primaryLabel} value={editForm.primaryText} onChange={(e) => setEditForm({ ...editForm, primaryText: e.target.value })} />
                  {config.secondaryLabel && (
                    <input className="dash-input" placeholder={config.secondaryLabel} value={editForm.secondaryText} onChange={(e) => setEditForm({ ...editForm, secondaryText: e.target.value })} />
                  )}
                  {config.showVideoId && (
                    <input className="dash-input" placeholder="YouTube video id" value={editForm.videoId} onChange={(e) => setEditForm({ ...editForm, videoId: e.target.value })} />
                  )}
                  {config.showExternalUrl && (
                    <input className="dash-input" placeholder="Spotify URL" value={editForm.externalUrl} onChange={(e) => setEditForm({ ...editForm, externalUrl: e.target.value })} />
                  )}
                  {config.showImage && (
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" className="dash-input" onChange={(e) => setEditForm({ ...editForm, image: e.target.files?.[0] ?? null })} />
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button className="dash-action-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  <button className="dash-action-btn dash-action-btn--approve" disabled={submitting} onClick={() => void saveEdit(item.id)}>Save</button>
                </div>
              </div>
            ) : (
              <>
                {config.showImage && (
                  item.imagePath ? (
                    <img src={`${API_BASE_URL}/storage/${item.imagePath}`} alt="" className="w-11 h-11 rounded object-cover shrink-0" />
                  ) : (
                    <div className="dash-avatar dash-avatar--sm shrink-0">{(item.primaryText ?? '?').charAt(0)}</div>
                  )
                )}
                <div className="flex-1 min-w-0">
                  {item.primaryText && <div className="text-sm font-medium text-ink truncate">{item.primaryText}</div>}
                  {item.secondaryText && <div className="text-xs text-muted truncate">{item.secondaryText}</div>}
                  {config.showVideoId && item.videoId && <div className="text-xs text-muted truncate">youtube: {item.videoId}</div>}
                </div>
                {item.externalUrl && (
                  <a href={item.externalUrl} target="_blank" rel="noreferrer" className="dash-action-link shrink-0">Open →</a>
                )}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="dash-action-btn" disabled={index === 0} onClick={() => void handleMove(item.id, 'up')} title="Move up">↑</button>
                  <button className="dash-action-btn" disabled={index === items.length - 1} onClick={() => void handleMove(item.id, 'down')} title="Move down">↓</button>
                  <button className="dash-action-btn" onClick={() => startEdit(item)}>Edit</button>
                  <button className="dash-action-btn dash-action-btn--reject" onClick={() => void handleDelete(item.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="dash-empty px-5 py-4">No items yet.</p>}
      </div>
    </div>
  );
}
