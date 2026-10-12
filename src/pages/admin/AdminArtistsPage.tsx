import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { setUploadAccess, setCopyrightFlag, approveArtist, deleteArtist } from '../../services/artists.service';
import { createInvite } from '../../services/invites.service';
import { useArtists } from '../../hooks/useArtists';
import AddArtistForm from '../../components/admin/AddArtistForm';

export default function AdminArtistsPage() {
  const { artists, isLoading, refreshArtists, updateArtistInCache, addArtistToCache, removeArtistFromCache } = useArtists();
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'expired'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteCopied, setInviteCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refreshArtists();
    } finally {
      setRefreshing(false);
    }
  }

  async function copyInviteLink() {
    let link = inviteLink;
    if (!link) {
      const token = await createInvite();
      link = `${window.location.origin}/join/${token}`;
      setInviteLink(link);
    }
    try {
      await navigator.clipboard.writeText(link);
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked by browser permissions/policy — the
      // link is still fetched and shown below for the admin to copy manually.
    }
  }

  function whatsappShareUrl(): string {
    const message = `Hi! Please create your Dwad Music artist account using this link: ${inviteLink}`;
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }

  async function handleApprove(id: string) {
    const updated = await approveArtist(id);
    if (updated) updateArtistInCache(id, updated);
  }

  async function handleReject(id: string) {
    if (!window.confirm('Reject and delete this pending account?')) return;
    await deleteArtist(id);
    removeArtistFromCache(id);
  }

  const pendingCount = useMemo(() => artists.filter((a) => a.status === 'pending').length, [artists]);

  const filtered = useMemo(() => {
    let list = artists;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q));
    }
    if (filterStatus === 'pending') {
      list = list.filter((a) => a.status === 'pending');
    } else if (filterStatus !== 'all') {
      list = list.filter((a) => a.subscription.status === filterStatus);
    }
    // Pending approvals surface first regardless of filter, so they're never buried below
    // a long list of already-active artists.
    return [...list].sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    });
  }, [artists, search, filterStatus]);

  async function toggleAccess(artistId: string) {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;
    const updated = await setUploadAccess(artistId, artist.uploadAccess === 'granted' ? 'locked' : 'granted');
    if (updated) updateArtistInCache(artistId, updated);
  }

  async function toggleCopyright(artistId: string) {
    const artist = artists.find((a) => a.id === artistId);
    if (!artist) return;
    const updated = await setCopyrightFlag(artistId, artist.copyrightStatus === 'flagged' ? 'clear' : 'flagged');
    if (updated) updateArtistInCache(artistId, updated);
  }

  return (
    <div className="flex flex-col gap-5 max-w-300">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-ink">Artists</h1>
          <p className="text-sm text-muted mt-1">{artists.length} registered artists</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="dash-btn dash-btn--ghost" disabled={refreshing || isLoading} onClick={() => void handleRefresh()}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
          <button className="dash-btn dash-btn--ghost" onClick={() => void copyInviteLink()}>
            {inviteCopied ? 'Copied ✓' : 'Copy Invite Link'}
          </button>
          {!showAddForm && (
            <button className="dash-btn dash-btn--gold" onClick={() => setShowAddForm(true)}>+ Add Artist</button>
          )}
        </div>
      </div>

      {inviteLink && (
        <div className="dash-panel flex items-center gap-3 flex-wrap">
          <span className="text-xs text-muted shrink-0">Invite link:</span>
          <code className="text-xs text-ink flex-1 min-w-0 truncate">{inviteLink}</code>
          <button className="dash-btn dash-btn--ghost text-xs py-1.5 px-3" onClick={copyInviteLink}>
            {inviteCopied ? 'Copied ✓' : 'Copy Link'}
          </button>
          <a href={whatsappShareUrl()} target="_blank" rel="noreferrer" className="dash-btn dash-btn--gold text-xs py-1.5 px-3">
            Share via WhatsApp
          </a>
        </div>
      )}

      {showAddForm && (
        <AddArtistForm
          onCancel={() => setShowAddForm(false)}
          onCreated={(artist) => {
            addArtistToCache(artist);
            setShowAddForm(false);
          }}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dash-input w-full sm:max-w-xs"
        />
        <div className="flex gap-1 overflow-x-auto pb-0.5 shrink-0">
          {(['all', 'pending', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              className={`dash-filter-tab whitespace-nowrap ${filterStatus === f ? 'dash-filter-tab--active' : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && <span className="dash-filter-tab__count">{pendingCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.map((artist) => (
          <div key={artist.id} className="dash-panel flex items-center gap-3 py-3 px-4">
            <div className="dash-avatar shrink-0">{artist.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-ink truncate">{artist.name}</div>
              <div className="text-xs text-muted truncate">{artist.email}</div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {artist.status === 'pending' && <span className="dash-badge dash-badge--pending">Pending Approval</span>}
                {artist.copyrightStatus === 'flagged' && <span className="dash-badge dash-badge--rejected">⚠ Copyright</span>}
                <span className={`dash-badge dash-badge--${artist.subscription.status}`}>{artist.subscription.status}</span>
                <span className="dash-badge dash-badge--plan">{artist.subscription.plan}</span>
                <span className="text-[11px] text-muted">{artist.genre}</span>
              </div>
              {artist.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button className="dash-action-btn dash-action-btn--approve flex-1" onClick={() => handleApprove(artist.id)}>Approve</button>
                  <button className="dash-action-btn dash-action-btn--reject flex-1" onClick={() => handleReject(artist.id)}>Reject</button>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted">Upload</span>
                <button
                  className={`dash-toggle ${artist.uploadAccess === 'granted' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                  onClick={() => toggleAccess(artist.id)}
                  title={artist.uploadAccess === 'granted' ? 'Lock' : 'Grant'}
                >
                  <span className="dash-toggle__knob" />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted">Copyright</span>
                <button
                  className={`dash-toggle ${artist.copyrightStatus === 'flagged' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                  onClick={() => toggleCopyright(artist.id)}
                  title={artist.copyrightStatus === 'flagged' ? 'Clear flag' : 'Flag account'}
                >
                  <span className="dash-toggle__knob" />
                </button>
              </div>
              <Link to={`/admin/artists/${artist.id}`} className="text-xs text-gold">View →</Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted py-4">No artists match your search.</p>}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block dash-panel p-0!">
        <div className="overflow-x-auto">
          <table className="dash-table dash-table--hover">
            <thead>
              <tr>
                <th>Artist</th>
                <th>Genre</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Upload</th>
                <th>Copyright</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((artist) => (
                <tr key={artist.id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="dash-avatar dash-avatar--sm">{artist.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-muted text-sm">{artist.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted">{artist.genre}</td>
                  <td><span className="dash-badge dash-badge--plan">{artist.subscription.plan}</span></td>
                  <td>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {artist.status === 'pending' ? (
                        <span className="dash-badge dash-badge--pending">Pending Approval</span>
                      ) : (
                        <span className={`dash-badge dash-badge--${artist.subscription.status}`}>{artist.subscription.status}</span>
                      )}
                      {artist.copyrightStatus === 'flagged' && <span className="dash-badge dash-badge--rejected">⚠ Copyright</span>}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`dash-toggle ${artist.uploadAccess === 'granted' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                      onClick={() => toggleAccess(artist.id)}
                    >
                      <span className="dash-toggle__knob" />
                    </button>
                  </td>
                  <td>
                    <button
                      className={`dash-toggle ${artist.copyrightStatus === 'flagged' ? 'dash-toggle--on' : 'dash-toggle--off'}`}
                      onClick={() => toggleCopyright(artist.id)}
                      title={artist.copyrightStatus === 'flagged' ? 'Clear flag' : 'Flag account'}
                    >
                      <span className="dash-toggle__knob" />
                    </button>
                  </td>
                  <td className="text-muted text-sm">{new Date(artist.joinedDate).toLocaleDateString()}</td>
                  <td>
                    {artist.status === 'pending' ? (
                      <div className="dash-row-actions">
                        <button className="dash-action-btn dash-action-btn--approve" onClick={() => handleApprove(artist.id)}>Approve</button>
                        <button className="dash-action-btn dash-action-btn--reject" onClick={() => handleReject(artist.id)}>Reject</button>
                      </div>
                    ) : (
                      <Link to={`/admin/artists/${artist.id}`} className="dash-action-link">View →</Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="dash-empty px-5">No artists match your search.</p>}
      </div>

    </div>
  );
}
