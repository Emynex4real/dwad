import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { getArtistById } from '../../services/artists.service';
import { getTracksByArtist } from '../../services/tracks.service';
import { getArtistAnalytics } from '../../services/analytics.service';
import { getPlanDefinition } from '../../services/subscriptions.service';
import type { ArtistProfile, TrackUpload, ArtistAnalytics } from '../../types/dashboard';

export default function ArtistHomePage() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [artist, setArtist] = useState<ArtistProfile | undefined>(undefined);
  const [tracks, setTracks] = useState<TrackUpload[]>([]);
  const [analytics, setAnalytics] = useState<ArtistAnalytics | undefined>(undefined);
  const planDef = useMemo(() => artist ? getPlanDefinition(artist.subscription.plan) : undefined, [artist]);

  useEffect(() => {
    if (!user?.artistId) return;
    void getArtistById(user.artistId).then(setArtist);
    void getTracksByArtist(user.artistId).then(setTracks);
    void getArtistAnalytics(user.artistId).then(setAnalytics);
  }, [user]);

  if (!artist) return null;

  const sub = artist.subscription;
  const expiryDate = new Date(sub.expiryDate);
  const today = new Date();
  const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
  const isExpired = sub.status === 'expired';

  const nextRelease = tracks
    .filter((t) => (t.status === 'approved' || t.status === 'live') && new Date(t.releaseDate) >= today)
    .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())[0];

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Welcome back, {artist.name.split(' ')[0]}</h1>
          <p className="dash-page__sub">Here's your artist overview.</p>
        </div>
        {artist.uploadAccess === 'locked' && (
          <div className="dash-alert dash-alert--warn">Upload access is currently suspended. Contact support.</div>
        )}
      </div>

      <div className="dash-two-col">
        {/* Subscription card */}
        <div className={`dash-panel dash-panel--subscription ${isExpired ? 'dash-panel--expired' : ''}`}>
          <div className="sub-card">
            <div className="sub-card__header">
              <div>
                <div className="sub-card__plan">{planDef?.name ?? sub.plan} Plan</div>
                <div className={`dash-badge dash-badge--${sub.status}`}>{sub.status}</div>
              </div>
              <div className="sub-card__price">${sub.price}<span>/yr</span></div>
            </div>
            <div className="sub-card__expiry">
              {isExpired ? (
                <span className="sub-card__expired">Expired — renew to restore access</span>
              ) : (
                <>
                  Expires <strong>{expiryDate.toLocaleDateString()}</strong>
                  {isExpiringSoon && <span className="sub-card__warn"> — {daysLeft} days left</span>}
                </>
              )}
            </div>
            {planDef && (
              <ul className="sub-card__features">
                {planDef.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
          </div>
        </div>

        {/* Next release event */}
        <div className="dash-panel">
          <h2 className="dash-panel__title">Next Release</h2>
          {nextRelease ? (
            <div className="event-card">
              <div className="event-card__date">
                <span className="event-card__day">{new Date(nextRelease.releaseDate).getDate()}</span>
                <span className="event-card__month">{new Date(nextRelease.releaseDate).toLocaleString('default', { month: 'short' })}</span>
              </div>
              <div className="event-card__info">
                <div className="event-card__title">{nextRelease.title}</div>
                <div className="event-card__meta">{nextRelease.genre} · <span className={`dash-badge dash-badge--${nextRelease.status}`}>{nextRelease.status}</span></div>
                <div className="event-card__platforms">{nextRelease.platforms.join(', ')}</div>
              </div>
            </div>
          ) : (
            <div className="dash-empty">
              No upcoming releases.{' '}
              {artist.uploadAccess === 'granted' ? (
                <Link to="/artist/upload" className="dash-link">Submit a track →</Link>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="stat-grid stat-grid--4">
        <div className="stat-card">
          <div className="stat-card__label">Total Tracks</div>
          <div className="stat-card__value">{tracks.length}</div>
        </div>
        <div className="stat-card stat-card--gold">
          <div className="stat-card__label">Live</div>
          <div className="stat-card__value">{tracks.filter((t) => t.status === 'live').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Available Balance</div>
          <div className="stat-card__value">${analytics?.pendingPayout.toFixed(2) ?? '0.00'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">Notifications</div>
          <div className="stat-card__value">{unreadCount}</div>
          <div className="stat-card__note">Unread</div>
        </div>
      </div>

      {/* Notifications */}
      <div className="dash-panel">
        <div className="dash-panel__header">
          <h2 className="dash-panel__title">Notifications</h2>
          {unreadCount > 0 && (
            <button className="dash-panel__link" onClick={() => markAllAsRead(artist.id)}>
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="dash-empty">No notifications yet.</p>
        ) : (
          <div className="dash-notif-list">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`dash-notif-item ${!n.isRead ? 'dash-notif-item--unread' : ''}`}
                onClick={() => !n.isRead && markAsRead(n.id)}
              >
                <div className="dash-notif-item__meta">
                  <span className="dash-notif-item__title">{n.title}</span>
                  <span className="text-muted text-sm">{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="dash-notif-item__msg">{n.message}</div>
                {!n.isRead && <div className="dash-notif-item__dot" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
