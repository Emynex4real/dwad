import { useState, useEffect } from 'react';
import { getAllProductions, updateProduction, deleteProduction } from '../../services/productions.service';
import { API_BASE_URL } from '../../services/httpClient';
import AddProductionForm from '../../components/admin/AddProductionForm';
import type { Production } from '../../types/content';

interface EditFormState {
  title: string;
  artistName: string;
  spotifyUrl: string;
  audioFile: File | null;
  coverFile: File | null;
}

const EMPTY_EDIT_FORM: EditFormState = { title: '', artistName: '', spotifyUrl: '', audioFile: null, coverFile: null };

export default function AdminProductionsPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(EMPTY_EDIT_FORM);

  useEffect(() => {
    void getAllProductions().then(setProductions);
  }, []);

  function startEdit(p: Production) {
    setEditingId(p.id);
    setEditForm({ title: p.title, artistName: p.artistName, spotifyUrl: p.spotifyUrl ?? '', audioFile: null, coverFile: null });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const formData = new FormData();
    formData.append('title', editForm.title.trim());
    formData.append('artistName', editForm.artistName.trim());
    formData.append('spotifyUrl', editForm.spotifyUrl.trim());
    if (editForm.audioFile) formData.append('audio', editForm.audioFile);
    if (editForm.coverFile) formData.append('cover', editForm.coverFile);

    const updated = await updateProduction(id, formData);
    setProductions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this song? This cannot be undone.')) return;
    await deleteProduction(id);
    setProductions((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Songs We Produce</h1>
          <p className="text-sm text-muted mt-1">{productions.length} songs shown on the Studio pages</p>
        </div>
        {!showAddForm && (
          <button className="dash-btn dash-btn--gold" onClick={() => setShowAddForm(true)}>+ Add Song</button>
        )}
      </div>

      {showAddForm && (
        <AddProductionForm
          onCancel={() => setShowAddForm(false)}
          onCreated={(production) => {
            setProductions((prev) => [...prev, production]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col gap-3">
        {productions.map((p) => (
          <div key={p.id} className="dash-panel flex flex-col gap-3 py-3 px-4">
            {editingId === p.id ? (
              <div className="flex flex-col gap-2">
                <input className="dash-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                <input className="dash-input" value={editForm.artistName} onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })} placeholder="Artist Name" />
                <input className="dash-input" value={editForm.spotifyUrl} onChange={(e) => setEditForm({ ...editForm, spotifyUrl: e.target.value })} placeholder="Spotify URL (optional)" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-2">{p.audioFileUrl ? 'Replace Audio (optional)' : 'Add Audio (WAV or MP3)'}</label>
                  <input type="file" accept=".wav,.mp3" className="dash-input" onChange={(e) => setEditForm({ ...editForm, audioFile: e.target.files?.[0] ?? null })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-2">{p.coverArtUrl ? 'Replace Cover (optional)' : 'Add Cover (JPG/PNG)'}</label>
                  <input type="file" accept=".jpg,.jpeg,.png" className="dash-input" onChange={(e) => setEditForm({ ...editForm, coverFile: e.target.files?.[0] ?? null })} />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={cancelEdit}>Cancel</button>
                  <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" onClick={() => void saveEdit(p.id)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {p.coverArtUrl ? (
                  <img src={`${API_BASE_URL}/storage/${p.coverArtUrl}`} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="dash-avatar shrink-0">{p.title.charAt(0)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{p.title}</div>
                  <div className="text-xs text-muted truncate">{p.artistName}</div>
                </div>
                {p.audioFileUrl ? (
                  <audio controls src={`${API_BASE_URL}/storage/${p.audioFileUrl}`} className="h-8 max-w-32" />
                ) : (
                  <span className="text-xs text-muted shrink-0">No audio</span>
                )}
                <button className="dash-action-btn shrink-0" onClick={() => startEdit(p)}>Edit</button>
                <button className="dash-action-btn dash-action-btn--reject shrink-0" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {productions.length === 0 && <p className="text-sm text-muted py-4">No songs added yet.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block dash-panel p-0!">
        <div className="overflow-x-auto">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Song</th>
                <th>Artist</th>
                <th>Preview</th>
                <th>Spotify</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productions.map((p) => (
                <tr key={p.id}>
                  {editingId === p.id ? (
                    <>
                      <td>
                        <div className="flex items-center gap-2.5">
                          {p.coverArtUrl ? (
                            <img src={`${API_BASE_URL}/storage/${p.coverArtUrl}`} alt="" className="w-9 h-9 rounded object-cover" />
                          ) : (
                            <div className="dash-avatar dash-avatar--sm">{p.title.charAt(0)}</div>
                          )}
                          <input className="dash-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                        </div>
                      </td>
                      <td><input className="dash-input" value={editForm.artistName} onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })} /></td>
                      <td>
                        <div className="flex flex-col gap-1.5 min-w-48">
                          <input type="file" accept=".wav,.mp3" className="dash-input text-xs" title={p.audioFileUrl ? 'Replace audio' : 'Add audio'} onChange={(e) => setEditForm({ ...editForm, audioFile: e.target.files?.[0] ?? null })} />
                          <input type="file" accept=".jpg,.jpeg,.png" className="dash-input text-xs" title={p.coverArtUrl ? 'Replace cover' : 'Add cover'} onChange={(e) => setEditForm({ ...editForm, coverFile: e.target.files?.[0] ?? null })} />
                        </div>
                      </td>
                      <td><input className="dash-input" value={editForm.spotifyUrl} onChange={(e) => setEditForm({ ...editForm, spotifyUrl: e.target.value })} placeholder="https://open.spotify.com/track/..." /></td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={cancelEdit}>Cancel</button>
                          <button className="dash-action-btn dash-action-btn--approve" onClick={() => void saveEdit(p.id)}>Save</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="flex items-center gap-2.5">
                          {p.coverArtUrl ? (
                            <img src={`${API_BASE_URL}/storage/${p.coverArtUrl}`} alt="" className="w-9 h-9 rounded object-cover" />
                          ) : (
                            <div className="dash-avatar dash-avatar--sm">{p.title.charAt(0)}</div>
                          )}
                          <div className="font-medium">{p.title}</div>
                        </div>
                      </td>
                      <td className="text-muted">{p.artistName}</td>
                      <td>
                        {p.audioFileUrl ? (
                          <audio controls src={`${API_BASE_URL}/storage/${p.audioFileUrl}`} className="h-8 max-w-56" />
                        ) : (
                          <span className="text-muted text-sm">No audio</span>
                        )}
                      </td>
                      <td>
                        {p.spotifyUrl ? (
                          <a href={p.spotifyUrl} target="_blank" rel="noreferrer" className="dash-action-link">Open →</a>
                        ) : (
                          <span className="text-muted text-sm">—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={() => startEdit(p)}>Edit</button>
                          <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {productions.length === 0 && <p className="dash-empty px-5">No songs added yet.</p>}
      </div>

    </div>
  );
}
