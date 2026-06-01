import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { logoDark } from '../data';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/artist/home',      label: 'Home',      icon: '⌂' },
  { to: '/artist/releases',  label: 'Releases',  icon: '♫' },
  { to: '/artist/analytics', label: 'Analytics', icon: '◈' },
  { to: '/artist/income',    label: 'Income',    icon: '◇' },
  { to: '/artist/upload',    label: 'Upload',    icon: '↑' },
];

export default function ArtistLayout() {
  const { user, logout } = useAuth();
  const { unreadCount, loadForArtist } = useNotifications();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user?.artistId) loadForArtist(user.artistId);
  }, [user, loadForArtist]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="dash-root">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`dash-sidebar ${collapsed ? 'dash-sidebar--collapsed' : ''} ${mobileOpen ? 'dash-sidebar--mobile-open' : ''}`}>
        <div className="dash-sidebar__header">
          <img src={logoDark} alt="Dwad Music" className="dash-logo" />
          {!collapsed && <span className="dash-sidebar__role">Artist</span>}
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="dash-nav__icon">{item.icon}</span>
              {!collapsed && <span className="dash-nav__label">{item.label}</span>}
              {item.to === '/artist/home' && unreadCount > 0 && (
                <span className="dash-nav__badge">{unreadCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar__footer">
          {!collapsed && (
            <div className="dash-sidebar__user">
              <div className="dash-avatar">{user?.name.charAt(0)}</div>
              <div>
                <div className="dash-sidebar__name">{user?.name}</div>
                <div className="dash-sidebar__email">{user?.email}</div>
              </div>
            </div>
          )}
          <button className="dash-sidebar__logout" onClick={handleLogout} title="Sign out">
            ⏻
          </button>
        </div>
      </aside>

      <div className={`dash-main ${collapsed ? 'dash-main--collapsed' : ''}`}>
        <header className="dash-topbar">
          <div className="dash-topbar__left">
            <button
              className="dash-collapse-btn"
              onClick={() => { setCollapsed((c) => !c); setMobileOpen(false); }}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <button
              className="dash-mobile-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
          <div className="dash-topbar__right">
            <span className="dash-topbar__badge">Artist Portal</span>
          </div>
        </header>

        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
