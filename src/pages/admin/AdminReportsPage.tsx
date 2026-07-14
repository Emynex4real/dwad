import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { uploadReport, getReportHistory, getPendingReviews, resolvePendingReview, skipPendingReview } from '../../services/reports.service';
import { getAllArtists } from '../../services/artists.service';
import { getExchangeRate, updateExchangeRate } from '../../services/settings.service';
import type { ReportUploadSummary, PendingReportRow, ArtistProfile } from '../../types/dashboard';

const REASON_LABEL: Record<PendingReportRow['reason'], string> = {
  unmatched: 'Unmatched',
  multi_artist: 'Multi-Artist',
};

export default function AdminReportsPage() {
  const [history, setHistory]     = useState<ReportUploadSummary[]>([]);
  const [pending, setPending]     = useState<PendingReportRow[]>([]);
  const [artists, setArtists]     = useState<ArtistProfile[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [rate, setRate]           = useState<number | null>(null);
  const [rateInput, setRateInput] = useState('');
  const [dragOver, setDragOver]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [log, setLog]             = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    setHistory(await getReportHistory());
    setPending(await getPendingReviews());
  }

  useEffect(() => {
    void getReportHistory().then(setHistory);
    void getPendingReviews().then(setPending);
    void getAllArtists().then(setArtists);
    void getExchangeRate().then((r) => { setRate(r.gbpToUsdRate); setRateInput(String(r.gbpToUsdRate)); });
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
      await refresh();
    } catch (err) {
      addLog(`Error processing ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (f.name.endsWith('.csv')) {
        void processFile(f);
      } else {
        addLog(`Skipped ${f.name} — only .csv is supported.`);
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

  async function handleAssign(row: PendingReportRow) {
    const artistId = assignments[row.id];
    if (!artistId) return;
    await resolvePendingReview(row.id, artistId);
    const artist = artists.find((a) => a.id === artistId);
    addLog(`Assigned "${row.creditText}" to ${artist?.name ?? artistId}.`);
    await refresh();
  }

  async function handleSkip(row: PendingReportRow) {
    await skipPendingReview(row.id);
    addLog(`Skipped "${row.creditText}".`);
    await refresh();
  }

  async function handleSaveRate() {
    const parsed = parseFloat(rateInput);
    if (isNaN(parsed) || parsed <= 0) return;
    const updated = await updateExchangeRate(parsed);
    setRate(updated.gbpToUsdRate);
    setRateInput(String(updated.gbpToUsdRate));
    addLog(`Exchange rate updated to £1 = $${updated.gbpToUsdRate}.`);
    await refresh();
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Reports</h1>
        <p className="text-sm text-muted mt-1">Upload monthly royalty CSV exports to update artist streams and revenue.</p>
      </div>

      {/* Exchange rate */}
      <div className="dash-panel flex items-center gap-3 flex-wrap">
        <h2 className="text-sm font-semibold text-ink">Exchange Rate</h2>
        <span className="text-xs text-muted">£1 =</span>
        <input
          type="number"
          step="0.0001"
          min="0"
          value={rateInput}
          onChange={(e) => setRateInput(e.target.value)}
          className="dash-input w-28"
        />
        <span className="text-xs text-muted">USD</span>
        <button
          className="dash-btn dash-btn--gold"
          disabled={rate === null || parseFloat(rateInput) === rate || !rateInput}
          onClick={handleSaveRate}
        >
          Save
        </button>
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
        <input ref={fileInputRef} type="file" accept=".csv" multiple className="hidden" onChange={handleChange} />
        <div className="text-3xl text-gold">↑</div>
        <div className="text-sm text-ink-2">
          {processing ? 'Processing…' : (
            <>
              <span className="hidden sm:inline">Drop a CSV report here, or </span>
              <span className="text-gold font-medium">tap to browse</span>
            </>
          )}
        </div>
        <div className="text-xs text-muted">.csv only</div>
      </div>

      {/* Pending review */}
      {pending.length > 0 && (
        <div className="dash-panel p-0!">
          <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">Pending Review ({pending.length})</h2>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-line">
            {pending.map((p) => (
              <div key={p.id} className="flex flex-col gap-2 px-5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink truncate">{p.creditText}</span>
                  <span className="dash-badge dash-badge--pending">{REASON_LABEL[p.reason]}</span>
                </div>
                <div className="text-xs text-muted">{p.streams.toLocaleString()} streams · ${p.revenueUsd.toFixed(2)} · {p.filename}</div>
                <div className="flex items-center gap-2">
                  <select
                    className="dash-input flex-1"
                    value={assignments[p.id] ?? ''}
                    onChange={(e) => setAssignments((a) => ({ ...a, [p.id]: e.target.value }))}
                  >
                    <option value="">Assign to artist…</option>
                    {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
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
                {pending.map((p) => (
                  <tr key={p.id}>
                    <td className="font-medium">{p.creditText}</td>
                    <td><span className="dash-badge dash-badge--pending">{REASON_LABEL[p.reason]}</span></td>
                    <td>{p.streams.toLocaleString()}</td>
                    <td>${p.revenueUsd.toFixed(2)}</td>
                    <td className="text-muted text-sm">{p.filename}</td>
                    <td>
                      <div className="dash-row-actions">
                        <select
                          className="dash-input"
                          value={assignments[p.id] ?? ''}
                          onChange={(e) => setAssignments((a) => ({ ...a, [p.id]: e.target.value }))}
                        >
                          <option value="">Assign to artist…</option>
                          {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
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
