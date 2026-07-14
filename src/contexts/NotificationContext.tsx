import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Notification, NotificationType } from '../types/dashboard';
import {
  getNotificationsForArtist,
  markAsRead as svcMarkAsRead,
  markAllAsRead as svcMarkAllRead,
  sendNotification as svcSend,
} from '../services/notifications.service';
import { NotificationContext } from '../hooks/useNotifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadForArtist = useCallback((artistId: string) => {
    void getNotificationsForArtist(artistId).then((list) => {
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    void svcMarkAsRead(id);
  }, []);

  const markAllAsRead = useCallback((artistId: string) => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    void svcMarkAllRead(artistId);
  }, []);

  const send = useCallback(
    (artistId: string, type: NotificationType, title: string, message: string, metadata?: Record<string, string>) => {
      void svcSend(artistId, type, title, message, metadata);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loadForArtist, markAsRead, markAllAsRead, send }}>
      {children}
    </NotificationContext.Provider>
  );
}
