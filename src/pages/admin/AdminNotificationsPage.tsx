import { useState, useEffect, type FormEvent } from 'react';
import { getAllArtists } from '../../services/artists.service';
import { sendNotification, broadcastNotification, getAllNotifications } from '../../services/notifications.service';
import type { ArtistProfile, NotificationType, Notification } from '../../types/dashboard';

const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: 'general',              label: 'General' },
  { value: 'upload_submitted',     label: 'Upload Submitted' },
  { value: 'upload_approved',      label: 'Upload Approved' },
  { value: 'upload_rejected',      label: 'Upload Rejected' },
  { value: 'release_alert',        label: 'Release Alert' },
  { value: 'subscription_expired', label: 'Subscription Expired' },
  { value: 'subscription_renewed', label: 'Subscription Renewed' },
];

export default function AdminNotificationsPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [target,   setTarget]   = useState<'individual' | 'all'>('individual');
  const [artistId, setArtistId] = useState('');
  const [type,     setType]     = useState<NotificationType>('general');
  const [title,    setTitle]    = useState('');
  const [message,  setMessage]  = useState('');
  const [sent,     setSent]     = useState(false);

  useEffect(() => {
    void getAllArtists().then((list) => {
      setArtists(list);
      setArtistId((current) => current || (list[0]?.id ?? ''));
    });
    void getAllNotifications().then(setNotifications);
  }, []);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    if (target === 'all') {
      await broadcastNotification(artists.map((a) => a.id), type, title, message);
    } else {
      await sendNotification(artistId, type, title, message);
    }
    setNotifications(await getAllNotifications());
    setTitle('');
    setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Notifications</h1>
        <p className="text-sm text-muted mt-1">Send alerts to individual artists or broadcast to all.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Compose */}
        <div className="dash-panel">
          <h2 className="text-sm font-semibold text-ink mb-4">Compose Notification</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSend}>

            {/* Target */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-ink-2">Send to</label>
              <div className="flex gap-4">
                {(['individual', 'all'] as const).map((v) => (
                  <label key={v} className="flex items-center gap-2 text-sm text-ink-2 cursor-pointer">
                    <input
                      type="radio"
                      value={v}
                      checked={target === v}
                      onChange={() => setTarget(v)}
                      className="accent-gold"
                    />
                    {v === 'individual' ? 'Individual artist' : `All artists (${artists.length})`}
                  </label>
                ))}
              </div>
            </div>

            {target === 'individual' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-ink-2">Artist</label>
                <select className="dash-input select-field" value={artistId} onChange={(e) => setArtistId(e.target.value)}>
                  {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-2">Type</label>
              <select className="dash-input select-field" value={type} onChange={(e) => setType(e.target.value as NotificationType)}>
                {NOTIFICATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-2">Title</label>
              <input
                className="dash-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Release Scheduled"
                required
                maxLength={80}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-ink-2">Message</label>
              <textarea
                className="dash-input dash-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification message…"
                required
                rows={4}
                maxLength={500}
              />
              <span className="text-xs text-muted">{message.length}/500</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line">
              {sent && <span className="text-xs text-green-400">Sent ✓</span>}
              <button type="submit" className="dash-btn dash-btn--gold ml-auto">
                {target === 'all' ? `Send to All (${artists.length})` : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent notifications */}
        <div className="dash-panel p-0!">
          <h2 className="text-sm font-semibold text-ink px-5 pt-5 pb-3">Recent Notifications</h2>
          <div className="divide-y divide-line max-h-130 overflow-y-auto">
            {notifications.slice(0, 20).map((n) => {
              const artist = artists.find((a) => a.id === n.artistId);
              return (
                <div key={n.id} className={`px-5 py-3 ${!n.isRead ? 'bg-gold/3' : ''}`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-ink truncate">{artist?.name ?? n.artistId}</span>
                    <span className="text-[11px] text-muted shrink-0">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-medium text-ink-2 mb-0.5">{n.title}</div>
                  <div className="text-xs text-muted leading-relaxed line-clamp-2">{n.message}</div>
                  <span className={`dash-badge dash-badge--${n.isRead ? 'live' : 'pending'} mt-2`}>
                    {n.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <p className="px-5 py-5 text-sm text-muted">No notifications sent yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
