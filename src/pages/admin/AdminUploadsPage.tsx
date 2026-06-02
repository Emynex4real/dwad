import { useState, useMemo } from 'react';
import { getAllTracks, updateTrackStatus } from '../../services/tracks.service';
import { getAllArtists } from '../../services/artists.service';
import { sendNotification } from '../../services/notifications.service';
import type { TrackUpload, TrackStatus } from '../../types/dashboard';

const STATUS_ACCENT: Record<string, string> = {
  pending:  'border-t-amber-400/60',
  approved: 'border-t-sky-400/60',
  live:     'border-t-green-400/60',
  rejected: 'border-t-red-400/60',
};

const STATUS_TABS = ['all', 'pending', 'approved', 'live', 'rejected'] as const;

export default function AdminUploadsPage() {
  const artists = useMemo(() => getAllArtists(), []);
  const [tracks, setTracks]             = useState<TrackUpload[]>(() => getAllTracks());
  const [statusFilter, setStatusFilter] = useState<TrackStatus | 'all'>('all');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = tracks;
    if (statusFilter !== 'all') list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => {
        const a = artists.find((a) => a.id === t.artistId);
        return t.title.toLowerCase().includes(q) || a?.name.toLowerCase().includes(q);
      });
    }
    return [...list].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [tracks, statusFilter, search, artists]);

  function refresh() { setTracks(getAllTracks()); setSelected([]); }

  function handleApprove(t: TrackUpload) {
    updateTrackStatus(t.id, 'approved');
    sendNotification(t.artistId, 'upload_approved', 'Upload Approved',
      `Your track "${t.title}" has been approved.`, { trackId: t.id, trackTitle: t.title });
    refresh();
  }

  function handleReject(t: TrackUpload) {
    const note = window.prompt('Rejection reason (shown to artist):') ?? '';
    updateTrackStatus(t.id, 'rejected', note || undefined);
    sendNotification(t.artistId, 'upload_rejected', 'Upload Rejected',
      `Your track "${t.title}" was not approved.${note ? ` Reason: ${note}` : ''}`,
      { trackId: t.id, trackTitle: t.title });
    refresh();
  }

  function handleMarkLive(id: string) { updateTrackStatus(id, 'live'); refresh(); }

  function toggleSelect(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function bulkApprove() {
    selected.forEach((id) => {
      const t = tracks.find((t) => t.id === id);
      if (t?.status === 'pending') handleApprove(t);
    });
  }

  const counts = useMemo(() => ({
    all:      tracks.length,
    pending:  tracks.filter((t) => t.status === 'pending').length,
    approved: tracks.filter((t) => t.status === 'approved').length,
    rejected: tracks.filter((t) => t.status === 'rejected').length,
    live:     tracks.filter((t) => t.status === 'live').length,
  }), [tracks]);

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Uploads</h1>
          <p className="text-sm text-muted mt-0.5">{tracks.length} total submissions</p>
        </div>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted">{selected.length} selected</span>
            <button className="dash-btn dash-btn--gold" onClick={bulkApprove}>Bulk Approve</button>
            <button className="dash-btn dash-btn--ghost" onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search by track or artist…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="dash-input w-full"
      />

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto flex-nowrap pb-0.5 w-full">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border shrink-0',
              statusFilter === s
                ? 'bg-gold/10 text-gold border-gold/30'
                : 'text-muted border-transparent hover:bg-white/5 hover:text-ink',
            ].join(' ')}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={[
              'inline-flex items-center justify-center rounded-full min-w-4.5 px-1 text-[10px] font-semibold',
              statusFilter === s ? 'bg-gold/20 text-gold' : 'bg-white/8 text-muted',
            ].join(' ')}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Mobile cards ─────────────────────────────────────────────────────── */}
      <div className="sm:hidden w-full space-y-2.5">
        {filtered.map((t) => {
          const artist     = artists.find((a) => a.id === t.artistId);
          const isSelected = selected.includes(t.id);

          return (
            <div
              key={t.id}
              className={[
                'w-full rounded-xl border-t-2 border border-line bg-bg-2',
                STATUS_ACCENT[t.status] ?? '',
                isSelected ? 'ring-1 ring-gold/40' : '',
              ].join(' ')}
            >
              <div className="p-3 space-y-2.5">

                {/* Checkbox + title + badge */}
                <div className="flex items-start gap-2.5 w-full">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(t.id)}
                    className="mt-0.5 accent-gold shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink leading-snug truncate">{t.title}</p>
                      {t.featuring && <p className="text-[11px] text-muted">ft. {t.featuring}</p>}
                    </div>
                    <span className={`dash-badge dash-badge--${t.status} shrink-0 capitalize`}>{t.status}</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted pl-6">
                  <span className="font-medium">{artist?.name ?? '—'}</span>
                  <span className="px-1.5 py-0.5 rounded bg-bg-3 border border-line leading-none">{t.genre}</span>
                  <span>{new Date(t.releaseDate).toLocaleDateString()}</span>
                </div>

                {/* Review note */}
                {t.reviewNote && (
                  <p className="text-[11px] text-amber-400 pl-6">⚠ {t.reviewNote}</p>
                )}

                {/* Actions — grid ensures equal 50/50 split */}
                {t.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-line w-full">
                    <button
                      className="py-2 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/25 active:bg-green-500/20"
                      onClick={() => handleApprove(t)}
                    >
                      ✓ Approve
                    </button>
                    <button
                      className="py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/25 active:bg-red-500/20"
                      onClick={() => handleReject(t)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}

                {t.status === 'approved' && (
                  <div className="pt-2.5 border-t border-line w-full">
                    <button
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-gold/10 text-gold border border-gold/25 active:bg-gold/20"
                      onClick={() => handleMarkLive(t.id)}
                    >
                      ↑ Mark Live
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted py-12">No uploads found.</p>
        )}
      </div>

      {/* ── Desktop table ──────────────────────────────────────────────────── */}
      <div className="hidden sm:block dash-panel p-0!">
        <div className="overflow-x-auto pb-2">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => setSelected(e.target.checked ? filtered.map((t) => t.id) : [])}
                  />
                </th>
                <th>Track</th><th>Artist</th><th>Genre</th><th>Status</th>
                <th>Release Date</th><th>Submitted</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const artist = artists.find((a) => a.id === t.artistId);
                return (
                  <tr key={t.id}>
                    <td>
                      <input type="checkbox" checked={selected.includes(t.id)} onChange={() => toggleSelect(t.id)} />
                    </td>
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
        </div>
        {filtered.length === 0 && <p className="dash-empty px-5">No uploads found.</p>}
      </div>

    </div>
  );
}
