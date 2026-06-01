import { useState, useMemo } from 'react';
import { getAllTracks, updateTrackStatus } from '../../services/tracks.service';
import { getAllArtists } from '../../services/artists.service';
import { sendNotification } from '../../services/notifications.service';
import type { TrackUpload, TrackStatus } from '../../types/dashboard';

export default function AdminUploadsPage() {
  const artists = useMemo(() => getAllArtists(), []);
  const [tracks, setTracks] = useState<TrackUpload[]>(() => getAllTracks());
  const [statusFilter, setStatusFilter] = useState<TrackStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = tracks;
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => {
        const artist = artists.find((a) => a.id === t.artistId);
        return t.title.toLowerCase().includes(q) || artist?.name.toLowerCase().includes(q);
      });
    }
    return [...list].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [tracks, statusFilter, search, artists]);

  function refresh() { setTracks(getAllTracks()); setSelected([]); }

  function handleApprove(track: TrackUpload) {
    updateTrackStatus(track.id, 'approved');
    sendNotification(track.artistId, 'upload_approved', 'Upload Approved', `Your track "${track.title}" has been approved and is scheduled for release.`, { trackId: track.id, trackTitle: track.title });
    refresh();
  }

  function handleReject(track: TrackUpload) {
    const note = window.prompt('Rejection reason (shown to artist):') ?? '';
    updateTrackStatus(track.id, 'rejected', note || undefined);
    sendNotification(track.artistId, 'upload_rejected', 'Upload Rejected', `Your track "${track.title}" was not approved.${note ? ` Reason: ${note}` : ''}`, { trackId: track.id, trackTitle: track.title });
    refresh();
  }

  function handleMarkLive(trackId: string) {
    updateTrackStatus(trackId, 'live');
    refresh();
  }

  function toggleSelect(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function bulkApprove() {
    selected.forEach((id) => {
      const track = tracks.find((t) => t.id === id);
      if (track && track.status === 'pending') handleApprove(track);
    });
  }

  const counts = useMemo(() => ({
    all: tracks.length,
    pending: tracks.filter((t) => t.status === 'pending').length,
    approved: tracks.filter((t) => t.status === 'approved').length,
    rejected: tracks.filter((t) => t.status === 'rejected').length,
    live: tracks.filter((t) => t.status === 'live').length,
  }), [tracks]);

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Uploads</h1>
        {selected.length > 0 && (
          <div className="dash-page__actions">
            <span className="text-muted text-sm">{selected.length} selected</span>
            <button className="dash-btn dash-btn--gold" onClick={bulkApprove}>Bulk Approve</button>
            <button className="dash-btn dash-btn--ghost" onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
      </div>

      {/* Status tabs */}
      <div className="dash-filters">
        <input
          type="search"
          placeholder="Search by track or artist…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dash-input dash-input--search"
        />
        <div className="dash-filter-tabs">
          {(['all', 'pending', 'approved', 'live', 'rejected'] as const).map((s) => (
            <button
              key={s}
              className={`dash-filter-tab ${statusFilter === s ? 'dash-filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="dash-filter-tab__count">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="dash-panel">
        <table className="dash-table dash-table--hover">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((t) => t.id) : [])} /></th>
              <th>Track</th>
              <th>Artist</th>
              <th>Genre</th>
              <th>Status</th>
              <th>Release Date</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const artist = artists.find((a) => a.id === t.artistId);
              return (
                <tr key={t.id}>
                  <td><input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} /></td>
                  <td>
                    <div className="font-medium">{t.title}</div>
                    {t.featuring && <div className="text-muted text-sm">ft. {t.featuring}</div>}
                    {t.reviewNote && <div className="dash-review-note">⚠ {t.reviewNote}</div>}
                  </td>
                  <td className="text-muted">{artist?.name ?? '—'}</td>
                  <td className="text-muted">{t.genre}</td>
                  <td><span className={`dash-badge dash-badge--${t.status}`}>{t.status}</span></td>
                  <td className="text-muted text-sm">{new Date(t.releaseDate).toLocaleDateString()}</td>
                  <td className="text-muted text-sm">{new Date(t.submittedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="dash-row-actions">
                      {t.status === 'pending' && (
                        <>
                          <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApprove(t)}>Approve</button>
                          <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleReject(t)}>Reject</button>
                        </>
                      )}
                      {t.status === 'approved' && (
                        <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleMarkLive(t.id)}>Mark Live</button>
                      )}
                      {(t.status === 'live' || t.status === 'rejected') && (
                        <span className="text-muted text-sm">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="dash-empty">No uploads found.</p>}
      </div>
    </div>
  );
}
