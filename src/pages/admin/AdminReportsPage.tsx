import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { uploadReport, resolvePendingReview, skipPendingReview, backfillTracksFromReports } from '../../services/reports.service';
import { getExchangeRate } from '../../services/settings.service';
import { useArtists } from '../../hooks/useArtists';
import { useTracks } from '../../hooks/useTracks';
import { useReports } from '../../hooks/useReports';
import type { PendingReportRow } from '../../types/dashboard';

const REASON_LABEL: Record<PendingReportRow['reason'], string> = {
  unmatched: 'Unmatched',
  multi_artist: 'Multi-Artist',
};

export default function AdminReportsPage() {
  const { history, pending, addUploadToCache, removePendingFromCache } = useReports();
  const { artists } = useArtists();
  const { refreshTracks } = useTracks();
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [assignmentSearch, setAssignmentSearch] = useState<Record<string, string>>({});
  const [deselected, setDeselected] = useState<Set<string>>(new Set());
  const [groupSearch, setGroupSearch] = useState<Record<string, string>>({});
  const [groupTarget, setGroupTarget] = useState<Record<string, string>>({});
  const [rate, setRate]           = useState<number | null>(null);
  const [dragOver, setDragOver]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [backfilling, setBackfilling] = useState(false);
  const [log, setLog]             = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void getExchangeRate().then((r) => setRate(r.gbpToUsdRate));
  }, []);

  function addLog(msg: string) {
    setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l]);
  }

  async function processFile(file: File) {
    setProcessing(true);
    addLog(`Processing ${file.name}…`);
    try {
      const { upload, pending: newPending } = await uploadReport(file);
      addLog(`Applied ${file.name} — ${upload.matchedGroups} artists matched, ${newPending.length} pending review.`);
      addUploadToCache(upload, newPending);
    } catch (err) {
      addLog(`Error processing ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (f.name.endsWith('.csv') || f.name.endsWith('.html') || f.name.endsWith('.htm')) {
        void processFile(f);
      } else {
        addLog(`Skipped ${f.name} — only .csv or .html is supported.`);
      }
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = '';
  }

  function handleArtistSearchChange(rowId: string, value: string) {
    setAssignmentSearch((s) => ({ ...s, [rowId]: value }));
    const match = artists.find((a) => a.name.trim().toLowerCase() === value.trim().toLowerCase());
    setAssignments((a) => ({ ...a, [rowId]: match?.id ?? '' }));
  }

  async function handleAssign(row: PendingReportRow) {
    const artistId = assignments[row.id];
    if (!artistId) return;
    await resolvePendingReview(row.id, artistId);
    const artist = artists.find((a) => a.id === artistId);
    addLog(`Assigned "${row.creditText}" to ${artist?.name ?? artistId}.`);
    removePendingFromCache(row.id);
  }

  async function handleSkip(row: PendingReportRow) {
    await skipPendingReview(row.id);
    addLog(`Skipped "${row.creditText}".`);
    removePendingFromCache(row.id);
  }

  function toggleDeselected(rowId: string) {
    setDeselected((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId); else next.add(rowId);
      return next;
    });
  }

  function handleGroupSearchChange(groupKey: string, value: string) {
    setGroupSearch((s) => ({ ...s, [groupKey]: value }));
    const match = artists.find((a) => a.name.trim().toLowerCase() === value.trim().toLowerCase());
    setGroupTarget((t) => ({ ...t, [groupKey]: match?.id ?? '' }));
  }

  async function handleAssignGroup(rows: PendingReportRow[], artistId: string, artistName: string) {
    const toAssign = rows.filter((r) => !deselected.has(r.id));
    if (toAssign.length === 0 || !artistId) return;
    for (const row of toAssign) {
      await resolvePendingReview(row.id, artistId);
      removePendingFromCache(row.id);
    }
    addLog(`Assigned ${toAssign.length} report${toAssign.length === 1 ? '' : 's'} to ${artistName}.`);
  }

  async function handleBackfillTracks() {
    setBackfilling(true);
    addLog('Checking existing reports for songs missing from Uploads…');
    try {
      const { combinationsChecked, tracksCreated } = await backfillTracksFromReports();
      addLog(`Checked ${combinationsChecked} artist/song combinations — added ${tracksCreated} missing upload${tracksCreated === 1 ? '' : 's'}.`);
      if (tracksCreated > 0) await refreshTracks();
    } catch (err) {
      addLog(`Error checking for missing uploads: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setBackfilling(false);
    }
  }

  const suggestedGroups = new Map<string, { name: string; rows: PendingReportRow[] }>();
  const ungroupedPending: PendingReportRow[] = [];
  for (const p of pending) {
    if (p.suggestedArtistId && p.suggestedArtistName) {
      const group = suggestedGroups.get(p.suggestedArtistId) ?? { name: p.suggestedArtistName, rows: [] };
      group.rows.push(p);
      suggestedGroups.set(p.suggestedArtistId, group);
    } else {
      ungroupedPending.push(p);
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Reports</h1>
          <p className="text-sm text-muted mt-1">Upload monthly royalty CSV exports to update artist streams and revenue.</p>
        </div>
        <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" disabled={backfilling} onClick={() => void handleBackfillTracks()}>
          {backfilling ? 'Checking…' : 'Add missing songs to Uploads'}
        </button>
      </div>

      {/* Exchange rate */}
      <div className="dash-panel flex items-center gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-ink">Exchange Rate</h2>
        <span className="text-xs text-muted">
          {rate === null ? 'Loading…' : `£1 = $${rate.toFixed(4)} (live rate, updates automatically)`}
        </span>
        <span className="text-xs text-muted">Reports are shown in USD, converted from the GBP figures distributors report.</span>
      </div>

      {/* Drop zone */}
      <div
        className={[
          'rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 px-6 text-center cursor-pointer transition-colors',
          dragOver || processing
            ? 'border-gold bg-gold/5'
            : 'border-line-strong hover:border-gold hover:bg-gold/5',
          processing ? 'pointer-events-none opacity-60' : '',
        ].join(' ')}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" accept=".csv,.html,.htm" multiple className="hidden" onChange={handleChange} />
        <div className="text-3xl text-gold">↑</div>
        <div className="text-sm text-ink-2">
          {processing ? 'Processing…' : (
            <>
              <span className="hidden sm:inline">Drop a CSV or HTML report here, or </span>
              <span className="text-gold font-medium">tap to browse</span>
            </>
          )}
        </div>
        <div className="text-xs text-muted">.csv or .html</div>
      </div>

      {pending.length > 0 && (
        <datalist id="pending-review-artist-options">
          {artists.map((a) => <option key={a.id} value={a.name} />)}
        </datalist>
      )}

      {/* Suggested matches — same song already owned by one of our artists */}
      {suggestedGroups.size > 0 && (
        <div className="dash-panel p-0!">
          <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">Suggested Matches</h2>
          <p className="text-xs text-muted px-5 pb-3 -mt-2">
            These credits didn't match by name, but the song title already belongs to one of your artists. The artist below is just a suggestion — search to change it before assigning.
          </p>
          <div className="divide-y divide-line">
            {Array.from(suggestedGroups.entries()).map(([groupKey, group]) => {
              const selectedRows = group.rows.filter((r) => !deselected.has(r.id));
              const totalStreams = selectedRows.reduce((s, r) => s + r.streams, 0);
              const totalRevenue = selectedRows.reduce((s, r) => s + r.revenueUsd, 0);
              const targetId = groupKey in groupTarget ? groupTarget[groupKey] : groupKey;
              const targetName = groupSearch[groupKey] ?? group.name;
              return (
                <div key={groupKey} className="px-5 py-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        list="pending-review-artist-options"
                        className="dash-input"
                        placeholder="Search artist…"
                        value={targetName}
                        onChange={(e) => handleGroupSearchChange(groupKey, e.target.value)}
                      />
                      <span className="text-xs text-muted">
                        {selectedRows.length} of {group.rows.length} selected · {totalStreams.toLocaleString()} streams · ${totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    <button
                      className="dash-btn dash-btn--gold text-xs py-1.5 px-3"
                      disabled={selectedRows.length === 0 || !targetId}
                      onClick={() => handleAssignGroup(group.rows, targetId, targetName)}
                    >
                      Assign All ({selectedRows.length})
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {group.rows.map((r) => (
                      <label key={r.id} className="flex items-center gap-2.5 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-gold"
                          checked={!deselected.has(r.id)}
                          onChange={() => toggleDeselected(r.id)}
                        />
                        <span className="text-ink flex-1 min-w-0 truncate">{r.creditText}</span>
                        <span className="text-xs text-muted shrink-0">{r.streams.toLocaleString()} streams · ${r.revenueUsd.toFixed(2)} · {r.filename}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending review */}
      {ungroupedPending.length > 0 && (
        <div className="dash-panel p-0!">
          <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">Pending Review ({ungroupedPending.length})</h2>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-line">
            {ungroupedPending.map((p) => (
              <div key={p.id} className="flex flex-col gap-2 px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink truncate">{p.creditText}</span>
                  <span className="dash-badge dash-badge--pending">{REASON_LABEL[p.reason]}</span>
                </div>
                <div className="text-xs text-muted">{p.streams.toLocaleString()} streams · ${p.revenueUsd.toFixed(2)} · {p.filename}</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    list="pending-review-artist-options"
                    className="dash-input flex-1"
                    placeholder="Search artist…"
                    value={assignmentSearch[p.id] ?? ''}
                    onChange={(e) => handleArtistSearchChange(p.id, e.target.value)}
                  />
                  <button className="dash-btn dash-btn--gold" disabled={!assignments[p.id]} onClick={() => handleAssign(p)}>Assign</button>
                  <button className="dash-btn dash-btn--ghost" onClick={() => handleSkip(p)}>Skip</button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto pb-2">
            <table className="dash-table">
              <thead>
                <tr><th>Credit</th><th>Reason</th><th>Streams</th><th>Revenue ($)</th><th>File</th><th>Resolve</th></tr>
              </thead>
              <tbody>
                {ungroupedPending.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.creditText}</td>
                    <td><span className="dash-badge dash-badge--pending">{REASON_LABEL[p.reason]}</span></td>
                    <td>{p.streams.toLocaleString()}</td>
                    <td>${p.revenueUsd.toFixed(2)}</td>
                    <td className="text-muted text-sm">{p.filename}</td>
                    <td>
                      <div className="dash-row-actions">
                        <input
                          type="text"
                          list="pending-review-artist-options"
                          className="dash-input"
                          placeholder="Search artist…"
                          value={assignmentSearch[p.id] ?? ''}
                          onChange={(e) => handleArtistSearchChange(p.id, e.target.value)}
                        />
                        <button className="dash-action-btn dash-action-btn--approve" disabled={!assignments[p.id]} onClick={() => handleAssign(p)}>Assign</button>
                        <button className="dash-action-btn" onClick={() => handleSkip(p)}>Skip</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload history */}
      {history.length > 0 && (
        <div className="dash-panel p-0!">
          <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">Upload History</h2>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-line">
            {history.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{r.filename}</div>
                  <div className="text-xs text-muted">{r.period} · {r.matchedGroups} matched · {r.pendingGroups} pending</div>
                </div>
                <span className="dash-badge dash-badge--plan shrink-0">{r.totalRows} rows</span>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto pb-2">
            <table className="dash-table">
              <thead>
                <tr><th>File</th><th>Period</th><th>Rows</th><th>Matched</th><th>Pending</th><th>Uploaded At</th></tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.filename}</td>
                    <td className="text-muted">{r.period}</td>
                    <td>{r.totalRows}</td>
                    <td>{r.matchedGroups}</td>
                    <td>{r.pendingGroups}</td>
                    <td className="text-muted text-sm">{new Date(r.uploadedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity log */}
      {log.length > 0 && (
        <div className="dash-panel">
          <h2 className="text-sm font-semibold text-ink mb-3">Activity Log</h2>
          <div className="bg-bg rounded-md border border-line p-3 max-h-40 overflow-y-auto flex flex-col gap-1">
            {log.map((entry, i) => (
              <div key={i} className="font-mono text-xs text-muted">{entry}</div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
