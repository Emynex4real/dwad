import type { ReportUploadSummary, PendingReportRow } from '../types/dashboard';
import { apiFetch } from './httpClient';

export async function uploadReport(file: File): Promise<{ upload: ReportUploadSummary; pending: PendingReportRow[] }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<{ upload: ReportUploadSummary; pending: PendingReportRow[] }>('/reports/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getReportHistory(): Promise<ReportUploadSummary[]> {
  return apiFetch<ReportUploadSummary[]>('/reports');
}

export async function getPendingReviews(): Promise<PendingReportRow[]> {
  return apiFetch<PendingReportRow[]>('/reports/pending');
}

export async function resolvePendingReview(id: string, artistId: string): Promise<void> {
  await apiFetch(`/reports/pending/${id}/resolve`, { method: 'PATCH', body: { artistId } });
}

export async function skipPendingReview(id: string): Promise<void> {
  await apiFetch(`/reports/pending/${id}/skip`, { method: 'PATCH' });
}
