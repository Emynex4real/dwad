import type { Notification, NotificationType } from '../types/dashboard';
import { apiFetch } from './httpClient';

export async function getNotificationsForArtist(artistId: string): Promise<Notification[]> {
  return apiFetch<Notification[]>(`/notifications/artist/${artistId}`);
}

export async function getAllNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>('/notifications');
}

export async function markAsRead(notificationId: string): Promise<void> {
  await apiFetch(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllAsRead(artistId: string): Promise<void> {
  await apiFetch(`/notifications/artist/${artistId}/read-all`, { method: 'PATCH' });
}

export async function sendNotification(
  artistId: string,
  type: NotificationType,
  title: string,
  message: string,
  metadata?: Record<string, string>,
): Promise<Notification> {
  return apiFetch<Notification>('/notifications', {
    method: 'POST',
    body: { artistId, type, title, message, ...(metadata ? { metadata } : {}) },
  });
}

export async function broadcastNotification(
  artistIds: string[],
  type: NotificationType,
  title: string,
  message: string,
): Promise<Notification[]> {
  return apiFetch<Notification[]>('/notifications/broadcast', {
    method: 'POST',
    body: { artistIds, type, title, message },
  });
}

export async function deleteNotification(id: string): Promise<void> {
  await apiFetch(`/notifications/${id}`, { method: 'DELETE' });
}
