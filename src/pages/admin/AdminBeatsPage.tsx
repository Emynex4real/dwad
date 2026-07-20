import { useState, useEffect } from 'react';
import { getAllBeats, updateBeat, deleteBeat } from '../../services/beats.service';
import { API_BASE_URL } from '../../services/httpClient';
import AddBeatForm from '../../components/admin/AddBeatForm';
import type { Beat, BeatType } from '../../types/content';

interface EditFormState {
  title: string;
  bpm: string;
  type: BeatType;
  price: string;
  audioFile: File | null;
}

const EMPTY_EDIT_FORM: EditFormState = { title: '', bpm: '', type: 'lease', price: '', audioFile: null };

export default function AdminBeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(EMPTY_EDIT_FORM);

  useEffect(() => {
    void getAllBeats().then(setBeats);
  }, []);

  function startEdit(b: Beat) {
    setEditingId(b.id);
    setEditForm({ title: b.title, bpm: b.bpm ?? '', type: b.type, price: b.price != null ? String(b.price) : '', audioFile: null });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const formData = new FormData();
    formData.append('title', editForm.title.trim());
    formData.append('bpm', editForm.bpm.trim());
    formData.append('type', editForm.type);
    formData.append('price', editForm.price.trim());
    if (editForm.audioFile) formData.append('audio', editForm.audioFile);

    const updated = await updateBeat(id, formData);
    setBeats((prev) => prev.map((b) => (b.id === id ? updated : b)));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this beat? This cannot be undone.')) return;
    await deleteBeat(id);
    setBeats((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Beats</h1>
          <p className="text-sm text-muted mt-1">{beats.length} beats shown on the Beats page</p>
        </div>
        {!showAddForm && (
          <button className="dash-btn dash-btn--gold" onClick={() => setShowAddForm(true)}>+ Add Beat</button>
        )}
      </div>

      {showAddForm && (
        <AddBeatForm
          onCancel={() => setShowAddForm(false)}
          onCreated={(beat) => {
            setBeats((prev) => [...prev, beat]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col gap-3">
        {beats.map((b) => (
          <div key={b.id} className="dash-panel flex flex-col gap-3 py-3 px-4">
            {editingId === b.id ? (
              <div className="flex flex-col gap-2">
                <input className="dash-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                <input className="dash-input" value={editForm.bpm} onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })} placeholder="BPM (optional)" />
                <select className="dash-input select-field" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value as BeatType })}>
                  <option value="lease">Lease</option>
                  <option value="purchase">Purchase</option>
                </select>
                <input type="number" step="0.01" min="0" className="dash-input" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} placeholder="Price (USD, optional)" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-2">{b.audioFileUrl ? 'Replace Audio (optional)' : 'Add Audio (WAV or MP3)'}</label>
                  <input type="file" accept=".wav,.mp3" className="dash-input" onChange={(e) => setEditForm({ ...editForm, audioFile: e.target.files?.[0] ?? null })} />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={cancelEdit}>Cancel</button>
                  <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" onClick={() => void saveEdit(b.id)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{b.title}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {b.bpm && <span className="text-[11px] text-muted">{b.bpm}</span>}
                    <span className={`dash-badge dash-badge--${b.type === 'purchase' ? 'live' : 'pending'}`}>{b.type}</span>
                    {b.price != null && <span className="text-[11px] text-gold">${b.price.toFixed(2)}</span>}
                  </div>
                </div>
                {b.audioFileUrl ? (
                  <audio controls src={`${API_BASE_URL}/storage/${b.audioFileUrl}`} className="h-8 max-w-28" />
                ) : (
                  <span className="text-xs text-muted shrink-0">No audio</span>
                )}
                <button className="dash-action-btn shrink-0" onClick={() => startEdit(b)}>Edit</button>
                <button className="dash-action-btn dash-action-btn--reject shrink-0" onClick={() => handleDelete(b.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {beats.length === 0 && <p className="text-sm text-muted py-4">No beats added yet.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block dash-panel p-0!">
        <div className="overflow-x-auto">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>BPM</th>
                <th>Type</th>
                <th>Price</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beats.map((b) => (
                <tr key={b.id}>
                  {editingId === b.id ? (
                    <>
                      <td><input className="dash-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></td>
                      <td><input className="dash-input" value={editForm.bpm} onChange={(e) => setEditForm({ ...editForm, bpm: e.target.value })} /></td>
                      <td>
                        <select className="dash-input select-field" value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value as BeatType })}>
                          <option value="lease">Lease</option>
                          <option value="purchase">Purchase</option>
                        </select>
                      </td>
                      <td><input type="number" step="0.01" min="0" className="dash-input" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} /></td>
                      <td>
                        <input type="file" accept=".wav,.mp3" className="dash-input text-xs min-w-40" title={b.audioFileUrl ? 'Replace audio' : 'Add audio'} onChange={(e) => setEditForm({ ...editForm, audioFile: e.target.files?.[0] ?? null })} />
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={cancelEdit}>Cancel</button>
                          <button className="dash-action-btn dash-action-btn--approve" onClick={() => void saveEdit(b.id)}>Save</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="font-medium">{b.title}</td>
                      <td className="text-muted">{b.bpm ?? '—'}</td>
                      <td><span className={`dash-badge dash-badge--${b.type === 'purchase' ? 'live' : 'pending'}`}>{b.type}</span></td>
                      <td className="text-muted">{b.price != null ? `$${b.price.toFixed(2)}` : '—'}</td>
                      <td>
                        {b.audioFileUrl ? (
                          <audio controls src={`${API_BASE_URL}/storage/${b.audioFileUrl}`} className="h-8 max-w-56" />
                        ) : (
                          <span className="text-muted text-sm">No audio</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={() => startEdit(b)}>Edit</button>
                          <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleDelete(b.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {beats.length === 0 && <p className="dash-empty px-5">No beats added yet.</p>}
      </div>

    </div>
  );
}
