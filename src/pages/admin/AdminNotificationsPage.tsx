import { useState, useMemo, type FormEvent } from 'react';
import { getAllArtists } from '../../services/artists.service';
import { sendNotification, broadcastNotification, getAllNotifications } from '../../services/notifications.service';
import type { NotificationType, Notification } from '../../types/dashboard';

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
  const artists = useMemo(() => getAllArtists(), []);
  const [notifications, setNotifications] = useState<Notification[]>(() => getAllNotifications());

  const [target, setTarget] = useState<'individual' | 'all'>('individual');
  const [artistId, setArtistId] = useState(artists[0]?.id ?? '');
  const [type, setType] = useState<NotificationType>('general');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (target === 'all') {
      broadcastNotification(artists.map((a) => a.id), type, title, message);
    } else {
      sendNotification(artistId, type, title, message);
    }

    setNotifications(getAllNotifications());
    setTitle('');
    setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <h1 className="dash-page__title">Notifications</h1>
        <p className="dash-page__sub">Send alerts to individual artists or all artists at once.</p>
      </div>

      <div className="dash-two-col">
        {/* Compose form */}
        <div className="dash-panel">
          <h2 className="dash-panel__title">Compose Notification</h2>
          <form className="dash-form" onSubmit={handleSend}>

            {/* Target */}
            <div className="dash-form__field">
              <label>Send to</label>
              <div className="dash-radio-group">
                <label className="dash-radio">
                  <input type="radio" value="individual" checked={target === 'individual'} onChange={() => setTarget('individual')} />
                  Individual artist
                </label>
                <label className="dash-radio">
                  <input type="radio" value="all" checked={target === 'all'} onChange={() => setTarget('all')} />
                  All artists ({artists.length})
                </label>
              </div>
            </div>

            {target === 'individual' && (
              <div className="dash-form__field">
                <label>Artist</label>
                <select className="dash-input select-field" value={artistId} onChange={(e) => setArtistId(e.target.value)}>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="dash-form__field">
              <label>Type</label>
              <select className="dash-input select-field" value={type} onChange={(e) => setType(e.target.value as NotificationType)}>
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="dash-form__field">
              <label>Title</label>
              <input
                className="dash-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Release Scheduled"
                required
                maxLength={80}
              />
            </div>

            <div className="dash-form__field">
              <label>Message</label>
              <textarea
                className="dash-input dash-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification message…"
                required
                rows={4}
                maxLength={500}
              />
              <span className="dash-form__hint">{message.length}/500</span>
            </div>

            <div className="dash-form__footer">
              {sent && <span className="dash-saved">Sent ✓</span>}
              <button type="submit" className="dash-btn dash-btn--gold">
                {target === 'all' ? `Send to All (${artists.length})` : 'Send Notification'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent notifications */}
        <div className="dash-panel">
          <h2 className="dash-panel__title">Recent Notifications</h2>
          <div className="dash-notif-list">
            {notifications.slice(0, 20).map((n) => {
              const artist = artists.find((a) => a.id === n.artistId);
              return (
                <div key={n.id} className={`dash-notif-item ${!n.isRead ? 'dash-notif-item--unread' : ''}`}>
                  <div className="dash-notif-item__meta">
                    <span className="font-medium">{artist?.name ?? n.artistId}</span>
                    <span className="text-muted text-sm">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="dash-notif-item__title">{n.title}</div>
                  <div className="dash-notif-item__msg">{n.message}</div>
                  <span className={`dash-badge dash-badge--${n.isRead ? 'live' : 'pending'}`}>
                    {n.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              );
            })}
            {notifications.length === 0 && <p className="dash-empty">No notifications sent yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
