import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Notification, NotificationType } from '../types/dashboard';
import {
  getNotificationsForArtist,
  getUnreadCount,
  markAsRead as svcMarkAsRead,
  markAllAsRead as svcMarkAllRead,
  sendNotification as svcSend,
} from '../services/notifications.service';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loadForArtist: (artistId: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (artistId: string) => void;
  send: (artistId: string, type: NotificationType, title: string, message: string, metadata?: Record<string, string>) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadForArtist = useCallback((artistId: string) => {
    setNotifications(getNotificationsForArtist(artistId));
    setUnreadCount(getUnreadCount(artistId));
  }, []);

  const markAsRead = useCallback((id: string) => {
    svcMarkAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback((artistId: string) => {
    svcMarkAllRead(artistId);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, []);

  const send = useCallback(
    (artistId: string, type: NotificationType, title: string, message: string, metadata?: Record<string, string>) => {
      svcSend(artistId, type, title, message, metadata);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loadForArtist, markAsRead, markAllAsRead, send }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
