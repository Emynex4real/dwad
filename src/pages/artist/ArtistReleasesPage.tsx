import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getTracksByArtist } from '../../services/tracks.service';
import { getArtistById } from '../../services/artists.service';
import type { TrackStatus } from '../../types/dashboard';

export default function ArtistReleasesPage() {
  const { user } = useAuth();
  const artist = useMemo(() => (user?.artistId ? getArtistById(user.artistId) : undefined), [user]);
  const tracks = useMemo(() => (user?.artistId ? getTracksByArtist(user.artistId) : []), [user]);
  const [statusFilter, setStatusFilter] = useState<TrackStatus | 'all'>('all');

  const filtered = useMemo(() => {
    const list = statusFilter === 'all' ? tracks : tracks.filter((t) => t.status === statusFilter);
    return [...list].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [tracks, statusFilter]);

  const counts = useMemo(() => ({
    all: tracks.length,
    live: tracks.filter((t) => t.status === 'live').length,
    approved: tracks.filter((t) => t.status === 'approved').length,
    pending: tracks.filter((t) => t.status === 'pending').length,
    rejected: tracks.filter((t) => t.status === 'rejected').length,
  }), [tracks]);

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Releases</h1>
          <p className="dash-page__sub">{tracks.length} total submissions</p>
        </div>
        {artist?.uploadAccess === 'granted' && (
          <Link to="/artist/upload" className="dash-btn dash-btn--gold">+ New Upload</Link>
        )}
      </div>

      <div className="dash-filters">
        <div className="dash-filter-tabs">
          {(['all', 'live', 'approved', 'pending', 'rejected'] as const).map((s) => (
            <button
              key={s}
              className={`dash-filter-tab ${statusFilter === s ? 'dash-filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              <span className="dash-filter-tab__count">{counts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dash-panel">
          <p className="dash-empty">
            No {statusFilter !== 'all' ? statusFilter : ''} releases yet.{' '}
            {artist?.uploadAccess === 'granted' && (
              <Link to="/artist/upload" className="dash-link">Submit your first track →</Link>
            )}
          </p>
        </div>
      ) : (
        <div className="releases-grid">
          {filtered.map((track) => (
            <div key={track.id} className="release-card">
              <div className="release-card__header">
                <div>
                  <div className="release-card__title">{track.title}</div>
                  {track.featuring && <div className="release-card__feat">ft. {track.featuring}</div>}
                </div>
                <span className={`dash-badge dash-badge--${track.status}`}>{track.status}</span>
              </div>

              <div className="release-card__details">
                <div className="release-card__row">
                  <span>Release Date</span>
                  <span>{new Date(track.releaseDate).toLocaleDateString()}</span>
                </div>
                <div className="release-card__row">
                  <span>Genre</span>
                  <span>{track.genre}</span>
                </div>
                {track.upcCode && (
                  <div className="release-card__row">
                    <span>UPC</span>
                    <span className="text-mono">{track.upcCode}</span>
                  </div>
                )}
                {track.isrcCode && (
                  <div className="release-card__row">
                    <span>ISRC</span>
                    <span className="text-mono">{track.isrcCode}</span>
                  </div>
                )}
                {track.releaseLink && (
                  <div className="release-card__row">
                    <span>Link</span>
                    <a href={track.releaseLink} target="_blank" rel="noopener noreferrer" className="dash-link">
                      Open →
                    </a>
                  </div>
                )}
              </div>

              <div className="release-card__platforms">
                {track.platforms.map((p) => (
                  <span key={p} className="release-card__platform">{p}</span>
                ))}
              </div>

              {track.reviewNote && (
                <div className="dash-review-note release-card__note">
                  <strong>Review note:</strong> {track.reviewNote}
                </div>
              )}

              <div className="release-card__footer">
                <span className="text-muted text-sm">Submitted {new Date(track.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
