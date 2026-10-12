import { useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ReportUploadSummary, PendingReportRow } from '../types/dashboard';
import { getReportHistory, getPendingReviews } from '../services/reports.service';
import { useAuth } from '../hooks/useAuth';
import { ReportContext } from '../hooks/useReports';

export function ReportProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<ReportUploadSummary[]>([]);
  const [pending, setPending] = useState<PendingReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadedForUserId = useRef<string | null>(null);
  const prevUserId = useRef<string | undefined>(undefined);
  const isAdmin = !!user && user.role === 'admin';

  if (user?.id !== prevUserId.current) {
    prevUserId.current = user?.id;
    if (!isAdmin) {
      setHistory([]);
      setPending([]);
    }
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      loadedForUserId.current = null;
      return;
    }
    if (loadedForUserId.current === user.id) return;
    const currentUserId = user.id;

    async function load() {
      setIsLoading(true);
      setHistory(await getReportHistory());
      setPending(await getPendingReviews());
      loadedForUserId.current = currentUserId;
      setIsLoading(false);
    }
    void load();
  }, [user]);

  const refreshReports = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    setHistory(await getReportHistory());
    setPending(await getPendingReviews());
  }, [user]);

  const addUploadToCache = useCallback((upload: ReportUploadSummary, newPending: PendingReportRow[]) => {
    setHistory((prev) => [upload, ...prev]);
    setPending((prev) => [...prev, ...newPending]);
  }, []);

  const removePendingFromCache = useCallback((id: string) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <ReportContext.Provider value={{ history, pending, isLoading, refreshReports, addUploadToCache, removePendingFromCache }}>
      {children}
    </ReportContext.Provider>
  );
}
