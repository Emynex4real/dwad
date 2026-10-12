import { useState, useMemo } from 'react';
import { updateTrackStatus } from '../../services/tracks.service';
import { sendNotification } from '../../services/notifications.service';
import { API_BASE_URL } from '../../services/httpClient';
import { useArtists } from '../../hooks/useArtists';
import { useTracks } from '../../hooks/useTracks';
import type { TrackUpload, TrackStatus } from '../../types/dashboard';

const STATUS_ACCENT: Record<string, string> = {
  pending:  'border-t-amber-400/60',
  approved: 'border-t-sky-400/60',
  live:     'border-t-green-400/60',
  rejected: 'border-t-red-400/60',
};

const STATUS_TABS = ['all', 'pending', 'approved', 'live', 'rejected'] as const;

interface AlbumGroupRow {
  kind: 'album';
  albumId: string;
  albumTitle: string;
  albumType: string;
  tracks: TrackUpload[];
}
interface SingleGroupRow {
  kind: 'single';
  track: TrackUpload;
}
type GroupRow = AlbumGroupRow | SingleGroupRow;

export default function AdminUploadsPage() {
  const { artists } = useArtists();
  const { tracks, updateTrackInCache } = useTracks();
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
    // Newest submission first, but keep one album's songs together in upload order (track 1..N).
    const time = (t: TrackUpload) => new Date(t.submittedAt).getTime();
    const albumNewest = new Map<string, number>();
    for (const t of list) {
      if (t.albumId) albumNewest.set(t.albumId, Math.max(albumNewest.get(t.albumId) ?? 0, time(t)));
    }
    const newestInGroup = (t: TrackUpload) => (t.albumId ? (albumNewest.get(t.albumId) ?? time(t)) : time(t));
    return [...list].sort((a, b) => {
      const byGroup = newestInGroup(b) - newestInGroup(a);
      if (byGroup !== 0) return byGroup;
      if (a.albumId && a.albumId === b.albumId) return time(a) - time(b);
      return time(b) - time(a);
    });
  }, [tracks, statusFilter, search, artists]);

  const groups = useMemo<GroupRow[]>(() => {
    const result: GroupRow[] = [];
    const albumIndex = new Map<string, number>();
    for (const t of filtered) {
      if (t.albumId) {
        const idx = albumIndex.get(t.albumId);
        if (idx === undefined) {
          albumIndex.set(t.albumId, result.length);
          result.push({ kind: 'album', albumId: t.albumId, albumTitle: t.albumTitle ?? '', albumType: t.albumType ?? 'Album', tracks: [t] });
        } else {
          (result[idx] as AlbumGroupRow).tracks.push(t);
        }
      } else {
        result.push({ kind: 'single', track: t });
      }
    }
    for (const g of result) {
      if (g.kind === 'album') g.tracks.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    }
    return result;
  }, [filtered]);

  const [albumSelection, setAlbumSelection] = useState<Record<string, string>>({});

  function selectedTrackFor(group: AlbumGroupRow): TrackUpload | null {
    const sel = albumSelection[group.albumId] ?? 'all';
    if (sel === 'all') return null;
    return group.tracks.find((t) => t.id === sel) ?? null;
  }

  function statusSummary(list: TrackUpload[]): string {
    const counts: Partial<Record<TrackStatus, number>> = {};
    for (const t of list) counts[t.status] = (counts[t.status] ?? 0) + 1;
    const keys = Object.keys(counts) as TrackStatus[];
    if (keys.length === 1) return keys[0];
    return keys.map((k) => `${counts[k]} ${k}`).join(' · ');
  }

  function groupTrackIds(group: AlbumGroupRow): string[] {
    const sel = albumSelection[group.albumId] ?? 'all';
    return sel === 'all' ? group.tracks.map((t) => t.id) : [sel];
  }

  function isGroupSelected(group: AlbumGroupRow): boolean {
    const ids = groupTrackIds(group);
    return ids.length > 0 && ids.every((id) => selected.includes(id));
  }

  function toggleGroupSelect(group: AlbumGroupRow) {
    const ids = groupTrackIds(group);
    const allSelected = isGroupSelected(group);
    setSelected((s) => (allSelected ? s.filter((id) => !ids.includes(id)) : [...new Set([...s, ...ids])]));
  }

  async function handleApproveAll(list: TrackUpload[]) {
    for (const t of list) {
      if (t.status !== 'approved') await handleApprove(t);
    }
  }

  async function handleRejectAll(list: TrackUpload[]) {
    const note = window.prompt('Rejection reason (shown to artist, applies to all tracks):') ?? '';
    for (const t of list) {
      const updated = await updateTrackStatus(t.id, 'rejected', note || undefined);
      updateTrackInCache(t.id, updated);
      void sendNotification(t.artistId, 'upload_rejected', 'Upload Rejected',
        `Your track "${t.title}" was not approved.${note ? ` Reason: ${note}` : ''}`,
        { trackId: t.id, trackTitle: t.title });
    }
  }

  async function handleMarkLiveAll(list: TrackUpload[]) {
    for (const t of list) {
      if (t.status === 'approved') await handleMarkLive(t.id);
    }
  }

  async function handleApprove(t: TrackUpload) {
    const updated = await updateTrackStatus(t.id, 'approved');
    updateTrackInCache(t.id, updated);
    void sendNotification(t.artistId, 'upload_approved', 'Upload Approved',
      `Your track "${t.title}" has been approved.`, { trackId: t.id, trackTitle: t.title });
  }

  async function handleReject(t: TrackUpload) {
    const note = window.prompt('Rejection reason (shown to artist):') ?? '';
    const updated = await updateTrackStatus(t.id, 'rejected', note || undefined);
    updateTrackInCache(t.id, updated);
    void sendNotification(t.artistId, 'upload_rejected', 'Upload Rejected',
      `Your track "${t.title}" was not approved.${note ? ` Reason: ${note}` : ''}`,
      { trackId: t.id, trackTitle: t.title });
  }

  async function handleMarkLive(id: string) {
    const updated = await updateTrackStatus(id, 'live');
    updateTrackInCache(id, updated);
  }

  function submissionLines(t: TrackUpload): string[] {
    const artist = artists.find((a) => a.id === t.artistId);
    const d = t.details ?? {};
    const na = 'N/A';
    const row = (label: string, value: string) => `${label.padEnd(27)}: ${value}`;
    const yesNo = (v: 'yes' | 'no' | undefined) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : na);
    return [
      row('Track Title', t.title),
      row('Featuring', t.featuring ?? na),
      t.albumId ? row('Album', `${t.albumTitle} (${t.albumType})`) : '',
      row('Artist (Stage Name)', d.stageName ?? artist?.name ?? na),
      row('Artist Real Name', d.realName ?? na),
      row('Artist Email', artist?.email ?? na),
      row('Artist Phone (profile)', artist?.phone ?? na),
      row('WhatsApp (as entered)', d.whatsapp ?? na),
      row('Country', d.country ?? na),
      row('Producer', d.producer ?? na),
      row('Genre', t.genre),
      row('Release Date', t.releaseDate),
      row('Status', t.status),
      row('Submitted At', new Date(t.submittedAt).toLocaleString()),
      row('UPC Code', t.upcCode ?? na),
      row('ISRC Code', t.isrcCode ?? na),
      row('Release Link', t.releaseLink ?? na),
      row('Released Before', yesNo(d.previouslyReleased)),
      row('Artist Profile/Song Link', d.profileLink ?? na),
      t.featuring ? row('Featuring Released Before', yesNo(d.featuringPreviouslyReleased)) : '',
      t.featuring ? row('Featuring Profile/Song Link', d.featuringProfileLink ?? na) : '',
      row('Notes', d.notes ?? na),
      row('Platforms', t.platforms.join(', ')),
      t.reviewNote ? row('Review Note', t.reviewNote) : '',
    ].filter((l) => l !== '');
  }

  function downloadLines(lines: string[], filename: string) {
    const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadSubmission(t: TrackUpload) {
    downloadLines(
      ['DWAD MUSIC - UPLOAD SUBMISSION', '--------------------------------', '', ...submissionLines(t)],
      `submission-${t.id}.txt`,
    );
  }

  function downloadAlbumSubmissions(group: AlbumGroupRow) {
    const lines = ['DWAD MUSIC - UPLOAD SUBMISSION', `Album: ${group.albumTitle} (${group.albumType})`, '--------------------------------', ''];
    group.tracks.forEach((t, i) => {
      lines.push(`==== Track ${i + 1}: ${t.title} ====`, '', ...submissionLines(t), '');
    });
    downloadLines(lines, `submission-album-${group.albumId}.txt`);
  }

  function downloadForGroup(group: AlbumGroupRow) {
    const pickedTrack = selectedTrackFor(group);
    if (pickedTrack) downloadSubmission(pickedTrack);
    else downloadAlbumSubmissions(group);
  }

  function toggleSelect(id: string) {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  }

  function audioDownloadUrl(trackId: string): string {
    return `${API_BASE_URL}/tracks/${trackId}/audio`;
  }

  function coverDownloadUrl(trackId: string): string {
    return `${API_BASE_URL}/tracks/${trackId}/cover`;
  }

  function albumAudioDownloadUrl(albumId: string): string {
    return `${API_BASE_URL}/tracks/album/${albumId}/audio`;
  }

  async function bulkApprove() {
    for (const id of selected) {
      const t = tracks.find((t) => t.id === id);
      if (t?.status === 'pending') await handleApprove(t);
    }
    setSelected([]);
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
        {groups.map((g) => {
          if (g.kind === 'single') {
            const t          = g.track;
            const artist     = artists.find((a) => a.id === t.artistId);
            const isSelected = selected.includes(t.id);
            const coverArtUrl = t.coverArtUrl;

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
                  <div className="pt-2 w-full grid grid-cols-1 gap-2">
                    <button
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 text-muted border border-line active:bg-white/10"
                      onClick={() => downloadSubmission(t)}
                    >
                      ↓ Download Details
                    </button>
                    {coverArtUrl && (
                      <a
                        href={coverDownloadUrl(t.id)}
                        className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 text-muted border border-line active:bg-white/10 text-center"
                      >
                        🖼 Download Cover Art
                      </a>
                    )}
                    {t.audioFileUrl && (
                      <a
                        href={audioDownloadUrl(t.id)}
                        className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 text-muted border border-line active:bg-white/10 text-center"
                      >
                        ♪ Download Audio
                      </a>
                    )}
                  </div>

                </div>
              </div>
            );
          }

          const group        = g;
          const firstTrack    = group.tracks[0];
          const artist        = artists.find((a) => a.id === firstTrack?.artistId);
          const sel           = albumSelection[group.albumId] ?? 'all';
          const selectedTrack = selectedTrackFor(group);
          const isSelected    = isGroupSelected(group);

          return (
            <div
              key={group.albumId}
              className={[
                'w-full rounded-xl border-t-2 border border-line bg-bg-2',
                selectedTrack ? (STATUS_ACCENT[selectedTrack.status] ?? '') : 'border-t-gold/60',
                isSelected ? 'ring-1 ring-gold/40' : '',
              ].join(' ')}
            >
              <div className="p-3 space-y-2.5">

                {/* Checkbox + album title + badge */}
                <div className="flex items-start gap-2.5 w-full">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleGroupSelect(group)}
                    className="mt-0.5 accent-gold shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink leading-snug truncate">💿 {group.albumTitle}</p>
                      <p className="text-[11px] text-gold">{group.albumType} · {group.tracks.length} tracks</p>
                    </div>
                    {selectedTrack ? (
                      <span className={`dash-badge dash-badge--${selectedTrack.status} shrink-0 capitalize`}>{selectedTrack.status}</span>
                    ) : (
                      <span className="text-[11px] text-muted shrink-0 capitalize">{statusSummary(group.tracks)}</span>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-muted pl-6">
                  <span className="font-medium">{artist?.name ?? '—'}</span>
                  {firstTrack && <span className="px-1.5 py-0.5 rounded bg-bg-3 border border-line leading-none">{firstTrack.genre}</span>}
                  {firstTrack && <span>{new Date(firstTrack.releaseDate).toLocaleDateString()}</span>}
                </div>

                {/* Track picker */}
                <div className="pl-6">
                  <select
                    className="dash-input w-full text-xs"
                    value={sel}
                    onChange={(e) => setAlbumSelection((s) => ({ ...s, [group.albumId]: e.target.value }))}
                  >
                    <option value="all">All ({group.tracks.length} tracks)</option>
                    {group.tracks.map((t, i) => (
                      <option key={t.id} value={t.id}>{i + 1}. {t.title}</option>
                    ))}
                  </select>
                </div>

                {selectedTrack?.reviewNote && (
                  <p className="text-[11px] text-amber-400 pl-6">⚠ {selectedTrack.reviewNote}</p>
                )}

                {/* Actions — driven by track-picker selection */}
                {selectedTrack ? (
                  <>
                    {selectedTrack.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-line w-full">
                        <button
                          className="py-2 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/25 active:bg-green-500/20"
                          onClick={() => handleApprove(selectedTrack)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/25 active:bg-red-500/20"
                          onClick={() => handleReject(selectedTrack)}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                    {selectedTrack.status === 'approved' && (
                      <div className="pt-2.5 border-t border-line w-full">
                        <button
                          className="w-full py-2 text-xs font-semibold rounded-lg bg-gold/10 text-gold border border-gold/25 active:bg-gold/20"
                          onClick={() => handleMarkLive(selectedTrack.id)}
                        >
                          ↑ Mark Live
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-line w-full">
                    <button
                      className="py-2 text-xs font-semibold rounded-lg bg-green-500/10 text-green-400 border border-green-500/25 active:bg-green-500/20"
                      onClick={() => handleApproveAll(group.tracks)}
                    >
                      ✓ Approve All
                    </button>
                    <button
                      className="py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/25 active:bg-red-500/20"
                      onClick={() => handleRejectAll(group.tracks)}
                    >
                      ✕ Reject All
                    </button>
                    <button
                      className="py-2 text-xs font-semibold rounded-lg bg-gold/10 text-gold border border-gold/25 active:bg-gold/20"
                      onClick={() => handleMarkLiveAll(group.tracks)}
                    >
                      ↑ Live All
                    </button>
                  </div>
                )}

                <div className="pt-2 w-full grid grid-cols-1 gap-2">
                  <button
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 text-muted border border-line active:bg-white/10"
                    onClick={() => downloadForGroup(group)}
                  >
                    ↓ Download {sel === 'all' ? 'All Details' : 'Details'}
                  </button>
                  {firstTrack?.coverArtUrl && (
                    <a
                      href={coverDownloadUrl(firstTrack.id)}
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 text-muted border border-line active:bg-white/10 text-center"
                    >
                      🖼 Download Cover Art
                    </a>
                  )}
                  {selectedTrack?.audioFileUrl && (
                    <a
                      href={audioDownloadUrl(selectedTrack.id)}
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-white/5 text-muted border border-line active:bg-white/10 text-center"
                    >
                      ♪ Download Audio
                    </a>
                  )}
                  <a
                    href={albumAudioDownloadUrl(group.albumId)}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-gold/10 text-gold border border-gold/25 active:bg-gold/20 text-center"
                  >
                    💿 Download Whole {group.albumType} (ZIP)
                  </a>
                </div>

              </div>
            </div>
          );
        })}

        {groups.length === 0 && (
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
              {groups.map((g) => {
                if (g.kind === 'single') {
                  const t      = g.track;
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
                          <button className="dash-action-btn" onClick={() => downloadSubmission(t)} title="Download submission details">↓</button>
                          {t.coverArtUrl && (
                            <a href={coverDownloadUrl(t.id)} className="dash-action-btn" title="Download cover art">🖼</a>
                          )}
                          {t.audioFileUrl && (
                            <a href={audioDownloadUrl(t.id)} className="dash-action-btn" title="Download audio">♪</a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }

                const group        = g;
                const firstTrack    = group.tracks[0];
                const artist        = artists.find((a) => a.id === firstTrack?.artistId);
                const sel           = albumSelection[group.albumId] ?? 'all';
                const selectedTrack = selectedTrackFor(group);
                const isSelected    = isGroupSelected(group);

                return (
                  <tr key={group.albumId}>
                    <td>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleGroupSelect(group)} />
                    </td>
                    <td>
                      <div className="font-medium">💿 {group.albumTitle}</div>
                      <div className="text-gold text-sm">{group.albumType} · {group.tracks.length} tracks</div>
                      <select
                        className="dash-input mt-1 text-xs"
                        value={sel}
                        onChange={(e) => setAlbumSelection((s) => ({ ...s, [group.albumId]: e.target.value }))}
                      >
                        <option value="all">All ({group.tracks.length} tracks)</option>
                        {group.tracks.map((t, i) => (
                          <option key={t.id} value={t.id}>{i + 1}. {t.title}</option>
                        ))}
                      </select>
                      {selectedTrack?.reviewNote && <div className="dash-review-note">⚠ {selectedTrack.reviewNote}</div>}
                    </td>
                    <td className="text-muted">{artist?.name ?? '—'}</td>
                    <td className="text-muted">{firstTrack?.genre}</td>
                    <td>
                      {selectedTrack ? (
                        <span className={`dash-badge dash-badge--${selectedTrack.status}`}>{selectedTrack.status}</span>
                      ) : (
                        <span className="text-muted text-sm capitalize">{statusSummary(group.tracks)}</span>
                      )}
                    </td>
                    <td className="text-muted text-sm">{firstTrack && new Date(firstTrack.releaseDate).toLocaleDateString()}</td>
                    <td className="text-muted text-sm">{firstTrack && new Date(firstTrack.submittedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="dash-row-actions">
                        {selectedTrack ? (
                          <>
                            {selectedTrack.status === 'pending' && (
                              <>
                                <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApprove(selectedTrack)}>Approve</button>
                                <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleReject(selectedTrack)}>Reject</button>
                              </>
                            )}
                            {selectedTrack.status === 'approved' && (
                              <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleMarkLive(selectedTrack.id)}>Mark Live</button>
                            )}
                            {(selectedTrack.status === 'live' || selectedTrack.status === 'rejected') && (
                              <span className="text-muted text-sm">—</span>
                            )}
                            {selectedTrack.audioFileUrl && (
                              <a href={audioDownloadUrl(selectedTrack.id)} className="dash-action-btn" title="Download audio">♪</a>
                            )}
                          </>
                        ) : (
                          <>
                            <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApproveAll(group.tracks)}>Approve All</button>
                            <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleRejectAll(group.tracks)}>Reject All</button>
                            <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleMarkLiveAll(group.tracks)}>Live All</button>
                          </>
                        )}
                        <button className="dash-action-btn" onClick={() => downloadForGroup(group)} title={sel === 'all' ? 'Download all tracks’ details' : 'Download submission details'}>↓</button>
                        {firstTrack?.coverArtUrl && (
                          <a href={coverDownloadUrl(firstTrack.id)} className="dash-action-btn" title="Download cover art">🖼</a>
                        )}
                        <a href={albumAudioDownloadUrl(group.albumId)} className="dash-action-btn" title={`Download whole ${group.albumType} (ZIP)`}>💿 ZIP</a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {groups.length === 0 && <p className="dash-empty px-5">No uploads found.</p>}
      </div>

    </div>
  );
}
