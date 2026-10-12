import { createContext, useContext } from 'react';
import type { ReportUploadSummary, PendingReportRow } from '../types/dashboard';

export interface ReportContextValue {
  history: ReportUploadSummary[];
  pending: PendingReportRow[];
  isLoading: boolean;
  refreshReports: () => Promise<void>;
  addUploadToCache: (upload: ReportUploadSummary, newPending: PendingReportRow[]) => void;
  removePendingFromCache: (id: string) => void;
}

export const ReportContext = createContext<ReportContextValue | null>(null);

export function useReports(): ReportContextValue {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error('useReports must be used inside ReportProvider');
  return ctx;
}
