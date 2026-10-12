import { useState, useEffect } from 'react';
import { getAllDistroReleases, updateDistroRelease, deleteDistroRelease } from '../../services/distroReleases.service';
import { API_BASE_URL } from '../../services/httpClient';
import AddDistroReleaseForm from '../../components/admin/AddDistroReleaseForm';
import type { DistroRelease } from '../../types/content';

interface EditFormState {
  title: string;
  artistName: string;
  releaseUrl: string;
  coverFile: File | null;
}

const EMPTY_EDIT_FORM: EditFormState = { title: '', artistName: '', releaseUrl: '', coverFile: null };

export default function AdminDistroReleasesPage() {
  const [releases, setReleases] = useState<DistroRelease[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>(EMPTY_EDIT_FORM);

  useEffect(() => {
    void getAllDistroReleases().then(setReleases);
  }, []);

  function startEdit(r: DistroRelease) {
    setEditingId(r.id);
    setEditForm({ title: r.title, artistName: r.artistName, releaseUrl: r.releaseUrl ?? '', coverFile: null });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: string) {
    const formData = new FormData();
    formData.append('title', editForm.title.trim());
    formData.append('artistName', editForm.artistName.trim());
    formData.append('releaseUrl', editForm.releaseUrl.trim());
    if (editForm.coverFile) formData.append('cover', editForm.coverFile);

    const updated = await updateDistroRelease(id, formData);
    setReleases((prev) => prev.map((r) => (r.id === id ? updated : r)));
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this release? This cannot be undone.')) return;
    await deleteDistroRelease(id);
    setReleases((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Distro Releases</h1>
          <p className="text-sm text-muted mt-1">{releases.length} releases shown in "Released through Dwad" on the Distro page</p>
        </div>
        {!showAddForm && (
          <button className="dash-btn dash-btn--gold" onClick={() => setShowAddForm(true)}>+ Add Release</button>
        )}
      </div>

      {showAddForm && (
        <AddDistroReleaseForm
          onCancel={() => setShowAddForm(false)}
          onCreated={(release) => {
            setReleases((prev) => [release, ...prev]);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col gap-3">
        {releases.map((r) => (
          <div key={r.id} className="dash-panel flex flex-col gap-3 py-3 px-4">
            {editingId === r.id ? (
              <div className="flex flex-col gap-2">
                <input className="dash-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" />
                <input className="dash-input" value={editForm.artistName} onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })} placeholder="Artist Name" />
                <input className="dash-input" value={editForm.releaseUrl} onChange={(e) => setEditForm({ ...editForm, releaseUrl: e.target.value })} placeholder="Release Link (optional)" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-ink-2">{r.coverArtUrl ? 'Replace Cover (optional)' : 'Add Cover (JPG/PNG)'}</label>
                  <input type="file" accept=".jpg,.jpeg,.png" className="dash-input" onChange={(e) => setEditForm({ ...editForm, coverFile: e.target.files?.[0] ?? null })} />
                </div>
                <div className="flex justify-end gap-2">
                  <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={cancelEdit}>Cancel</button>
                  <button className="dash-btn dash-btn--gold text-xs py-1.5 px-3" onClick={() => void saveEdit(r.id)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {r.coverArtUrl ? (
                  <img src={`${API_BASE_URL}/storage/${r.coverArtUrl}`} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="dash-avatar shrink-0">{r.title.charAt(0)}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{r.title}</div>
                  <div className="text-xs text-muted truncate">{r.artistName}</div>
                </div>
                <button className="dash-action-btn shrink-0" onClick={() => startEdit(r)}>Edit</button>
                <button className="dash-action-btn dash-action-btn--reject shrink-0" onClick={() => handleDelete(r.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {releases.length === 0 && <p className="text-sm text-muted py-4">No releases added yet.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block dash-panel p-0!">
        <div className="overflow-x-auto">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Release</th>
                <th>Artist</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {releases.map((r) => (
                <tr key={r.id}>
                  {editingId === r.id ? (
                    <>
                      <td>
                        <div className="flex items-center gap-2.5">
                          {r.coverArtUrl ? (
                            <img src={`${API_BASE_URL}/storage/${r.coverArtUrl}`} alt="" className="w-9 h-9 rounded object-cover" />
                          ) : (
                            <div className="dash-avatar dash-avatar--sm">{r.title.charAt(0)}</div>
                          )}
                          <input className="dash-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                        </div>
                      </td>
                      <td><input className="dash-input" value={editForm.artistName} onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })} /></td>
                      <td>
                        <div className="flex flex-col gap-1.5 min-w-48">
                          <input className="dash-input" value={editForm.releaseUrl} onChange={(e) => setEditForm({ ...editForm, releaseUrl: e.target.value })} placeholder="https://open.spotify.com/track/..." />
                          <input type="file" accept=".jpg,.jpeg,.png" className="dash-input text-xs" title={r.coverArtUrl ? 'Replace cover' : 'Add cover'} onChange={(e) => setEditForm({ ...editForm, coverFile: e.target.files?.[0] ?? null })} />
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={cancelEdit}>Cancel</button>
                          <button className="dash-action-btn dash-action-btn--approve" onClick={() => void saveEdit(r.id)}>Save</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <div className="flex items-center gap-2.5">
                          {r.coverArtUrl ? (
                            <img src={`${API_BASE_URL}/storage/${r.coverArtUrl}`} alt="" className="w-9 h-9 rounded object-cover" />
                          ) : (
                            <div className="dash-avatar dash-avatar--sm">{r.title.charAt(0)}</div>
                          )}
                          <div className="font-medium">{r.title}</div>
                        </div>
                      </td>
                      <td className="text-muted">{r.artistName}</td>
                      <td>
                        {r.releaseUrl ? (
                          <a href={r.releaseUrl} target="_blank" rel="noreferrer" className="dash-action-link">Open →</a>
                        ) : (
                          <span className="text-muted text-sm">—</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button className="dash-action-btn" onClick={() => startEdit(r)}>Edit</button>
                          <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleDelete(r.id)}>Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {releases.length === 0 && <p className="dash-empty px-5">No releases added yet.</p>}
      </div>

    </div>
  );
}
