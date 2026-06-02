import { useState, useRef, type ChangeEvent } from 'react';
import Papa from 'papaparse';
import { applyReportData } from '../../services/tracks.service';
import type { ReportUpload } from '../../types/dashboard';

interface CsvRow {
  artistId: string;
  streams: string;
  revenue: string;
}

export default function AdminReportsPage() {
  const [reports, setReports]     = useState<ReportUpload[]>([]);
  const [dragOver, setDragOver]   = useState(false);
  const [processing, setProcessing] = useState(false);
  const [log, setLog]             = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addLog(msg: string) {
    setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l]);
  }

  function processFile(file: File) {
    setProcessing(true);
    const type = file.name.endsWith('.csv') ? 'csv' : 'html';
    const entry: ReportUpload = {
      id: `report-${Date.now()}`,
      filename: file.name,
      type,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      affectedArtists: 0,
      uploadedBy: 'admin-001',
    };
    setReports((r) => [entry, ...r]);
    addLog(`Processing ${file.name}…`);

    if (type === 'csv') {
      Papa.parse<CsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          const data: Record<string, { streams: number; revenue: number }> = {};
          for (const row of results.data) {
            const streams = parseInt(row.streams, 10);
            const revenue = parseFloat(row.revenue);
            if (row.artistId && !isNaN(streams) && !isNaN(revenue)) {
              data[row.artistId] = { streams, revenue };
            }
          }
          const count = applyReportData(data);
          setReports((r) => r.map((rep) => rep.id === entry.id ? { ...rep, status: 'applied', affectedArtists: count } : rep));
          addLog(`Applied ${file.name} — ${count} artists updated, ${results.data.length} rows parsed.`);
          setProcessing(false);
        },
        error(err) {
          setReports((r) => r.map((rep) => rep.id === entry.id ? { ...rep, status: 'failed' } : rep));
          addLog(`Error parsing ${file.name}: ${err.message}`);
          setProcessing(false);
        },
      });
    } else {
      setTimeout(() => {
        setReports((r) => r.map((rep) => rep.id === entry.id ? { ...rep, status: 'applied' } : rep));
        addLog(`HTML report ${file.name} stored successfully.`);
        setProcessing(false);
      }, 800);
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((f) => {
      if (f.name.endsWith('.csv') || f.name.endsWith('.html') || f.name.endsWith('.htm')) {
        processFile(f);
      } else {
        addLog(`Skipped ${f.name} — only .csv and .html supported.`);
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

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Reports</h1>
        <p className="text-sm text-muted mt-1">Upload CSV or HTML files to update artist analytics dashboards.</p>
      </div>

      {/* CSV format */}
      <div className="dash-panel">
        <h2 className="text-sm font-semibold text-ink mb-2">CSV Format</h2>
        <p className="text-xs text-muted mb-3">Your CSV must use these exact column headers. Each row updates one artist.</p>
        <pre className="dash-code text-xs sm:text-sm overflow-x-auto">{'artistId,streams,revenue\nartist-001,12400,43.40\nartist-002,8200,28.70'}</pre>
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
              <span className="hidden sm:inline">Drop CSV or HTML files here, or </span>
              <span className="text-gold font-medium">tap to browse</span>
            </>
          )}
        </div>
        <div className="text-xs text-muted">.csv · .html · .htm supported</div>
      </div>

      {/* Upload history */}
      {reports.length > 0 && (
        <div className="dash-panel p-0!">
          <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">Upload History</h2>

          {/* Mobile */}
          <div className="sm:hidden divide-y divide-line">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink truncate">{r.filename}</div>
                  <div className="text-xs text-muted">{new Date(r.uploadedAt).toLocaleTimeString()} · {r.affectedArtists} artists</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="dash-badge dash-badge--plan">{r.type.toUpperCase()}</span>
                  <span className={`dash-badge dash-badge--${r.status === 'applied' ? 'live' : r.status === 'failed' ? 'rejected' : 'pending'}`}>{r.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto pb-2">
            <table className="dash-table">
              <thead>
                <tr><th>File</th><th>Type</th><th>Status</th><th>Artists Updated</th><th>Uploaded At</th></tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.filename}</td>
                    <td><span className="dash-badge dash-badge--plan">{r.type.toUpperCase()}</span></td>
                    <td><span className={`dash-badge dash-badge--${r.status === 'applied' ? 'live' : r.status === 'failed' ? 'rejected' : 'pending'}`}>{r.status}</span></td>
                    <td>{r.affectedArtists}</td>
                    <td className="text-muted text-sm">{new Date(r.uploadedAt).toLocaleTimeString()}</td>
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
