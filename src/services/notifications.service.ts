import type { Notification, NotificationType } from '../types/dashboard';
import { MOCK_NOTIFICATIONS } from '../data/mock/notifications';

let store: Notification[] = structuredClone(MOCK_NOTIFICATIONS);

export function getNotificationsForArtist(artistId: string): Notification[] {
  return store
    .filter((n) => n.artistId === artistId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllNotifications(): Notification[] {
  return [...store].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadCount(artistId: string): number {
  return store.filter((n) => n.artistId === artistId && !n.isRead).length;
}

export function markAsRead(notificationId: string): void {
  const idx = store.findIndex((n) => n.id === notificationId);
  if (idx !== -1) store[idx] = { ...store[idx], isRead: true };
}

export function markAllAsRead(artistId: string): void {
  store = store.map((n) => (n.artistId === artistId ? { ...n, isRead: true } : n));
}

export function sendNotification(
  artistId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, string>,
): Notification {
  const notification: Notification = {
    id: `notif-${Date.now()}`,
    artistId,
    type,
    title,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
    ...(metadata ? { metadata } : {}),
  };
  store.unshift(notification);
  return notification;
}

export function broadcastNotification(
  artistIds: string[],
  type: NotificationType,
  title: string,
  message: string,
): Notification[] {
  return artistIds.map((id) => sendNotification(id, type, title, message));
}

export function deleteNotification(id: string): boolean {
  const before = store.length;
  store = store.filter((n) => n.id !== id);
  return store.length < before;
}
