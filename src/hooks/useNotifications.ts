import { createContext, useContext } from 'react';
import type { Notification, NotificationType } from '../types/dashboard';

export interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  loadForArtist: (artistId: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (artistId: string) => void;
  send: (artistId: string, type: NotificationType, title: string, message: string, metadata?: Record<string, string>) => void;
}

export const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
