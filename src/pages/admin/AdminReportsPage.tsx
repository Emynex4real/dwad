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
  const [reports, setReports] = useState<ReportUpload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addLog(msg: string) {
    setLog((l) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...l]);
  }

  function processFile(file: File) {
    setProcessing(true);
    const type = file.name.endsWith('.csv') ? 'csv' : 'html';

    const reportEntry: ReportUpload = {
      id: `report-${Date.now()}`,
      filename: file.name,
      type,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
      affectedArtists: 0,
      uploadedBy: 'admin-001',
    };
    setReports((r) => [reportEntry, ...r]);
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
          setReports((r) =>
            r.map((rep) => rep.id === reportEntry.id ? { ...rep, status: 'applied', affectedArtists: count } : rep),
          );
          addLog(`Applied ${file.name} — ${count} artists updated, ${results.data.length} rows parsed.`);
          setProcessing(false);
        },
        error(err) {
          setReports((r) => r.map((rep) => rep.id === reportEntry.id ? { ...rep, status: 'failed' } : rep));
          addLog(`Error parsing ${file.name}: ${err.message}`);
          setProcessing(false);
        },
      });
    } else {
      // HTML files are stored as-is (rendered in artist dashboard via raw HTML injection)
      setTimeout(() => {
        setReports((r) => r.map((rep) => rep.id === reportEntry.id ? { ...rep, status: 'applied', affectedArtists: 0 } : rep));
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
        addLog(`Skipped ${f.name} — only .csv and .html files are supported.`);
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
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Reports</h1>
        <p className="dash-page__sub">Upload CSV or HTML files to update artist analytics dashboards.</p>
      </div>

      {/* CSV format reference */}
      <div className="dash-panel">
        <h2 className="dash-panel__title">CSV Format</h2>
        <p className="text-muted text-sm" style={{ marginBottom: 12 }}>
          Your CSV must have these exact column headers. Each row updates one artist's analytics.
        </p>
        <pre className="dash-code">artistId,streams,revenue
artist-001,12400,43.40
artist-002,8200,28.70</pre>
      </div>

      {/* Drop zone */}
      <div
        className={`dash-dropzone ${dragOver ? 'dash-dropzone--active' : ''} ${processing ? 'dash-dropzone--processing' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.html,.htm"
          multiple
          className="hidden"
          onChange={handleChange}
        />
        <div className="dash-dropzone__icon">↑</div>
        <div className="dash-dropzone__label">
          {processing ? 'Processing…' : 'Drop CSV or HTML files here, or click to browse'}
        </div>
        <div className="dash-dropzone__hint">.csv · .html · .htm supported</div>
      </div>

      {/* History */}
      {reports.length > 0 && (
        <div className="dash-panel">
          <h2 className="dash-panel__title">Upload History</h2>
          <table className="dash-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Status</th>
                <th>Artists Updated</th>
                <th>Uploaded At</th>
              </tr>
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
      )}

      {/* Activity log */}
      {log.length > 0 && (
        <div className="dash-panel">
          <h2 className="dash-panel__title">Activity Log</h2>
          <div className="dash-log">
            {log.map((entry, i) => <div key={i} className="dash-log__entry">{entry}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
