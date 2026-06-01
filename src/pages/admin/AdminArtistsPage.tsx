import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllArtists, setUploadAccess } from '../../services/artists.service';
import type { ArtistProfile } from '../../types/dashboard';

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<ArtistProfile[]>(() => getAllArtists());
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');

  const filtered = useMemo(() => {
    let list = artists;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q),
      );
    }
    if (filterStatus !== 'all') {
      list = list.filter((a) => a.subscription.status === filterStatus);
    }
    return list;
  }, [artists, search, filterStatus]);

  function toggleAccess(artistId: string) {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;
    const newAccess = artist.uploadAccess === 'granted' ? 'locked' : 'granted';
    setUploadAccess(artistId, newAccess);
    setArtists(getAllArtists());
  }

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Artists</h1>
          <p className="dash-page__sub">{artists.length} registered artists</p>
        </div>
      </div>

      {/* Filters */}
      <div className="dash-filters">
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dash-input dash-input--search"
        />
        <div className="dash-filter-tabs">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              className={`dash-filter-tab ${filterStatus === f ? 'dash-filter-tab--active' : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="dash-panel">
        <table className="dash-table dash-table--hover">
          <thead>
            <tr>
              <th>Artist</th>
              <th>Genre</th>
              <th>Plan</th>
              <th>Sub Status</th>
              <th>Upload Access</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((artist) => (
              <tr key={artist.id}>
                <td>
                  <div className="dash-artist-cell">
                    <div className="dash-avatar dash-avatar--sm">{artist.name.charAt(0)}</div>
                    <div>
                      <div className="font-medium">{artist.name}</div>
                      <div className="text-muted text-sm">{artist.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{artist.genre}</td>
                <td>
                  <span className="dash-badge dash-badge--plan">{artist.subscription.plan}</span>
                </td>
                <td>
                  <span className={`dash-badge dash-badge--${artist.subscription.status}`}>
                    {artist.subscription.status}
                  </span>
                </td>
                <td>
                  <button
                    className={`dash-toggle ${artist.uploadAccess === 'granted' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                    onClick={() => toggleAccess(artist.id)}
                    title={artist.uploadAccess === 'granted' ? 'Lock upload access' : 'Grant upload access'}
                  >
                    <span className="dash-toggle__knob" />
                  </button>
                </td>
                <td className="text-muted text-sm">{new Date(artist.joinedDate).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/artists/${artist.id}`} className="dash-action-link">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="dash-empty">No artists match your search.</p>
        )}
      </div>
    </div>
  );
}
