import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logoDark } from '../data';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin',              label: 'Overview',      icon: '◈' },
  { to: '/admin/artists',     label: 'Artists',        icon: '♪' },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: '◇' },
  { to: '/admin/uploads',     label: 'Uploads',        icon: '↑' },
  { to: '/admin/reports',     label: 'Reports',        icon: '▦' },
  { to: '/admin/notifications', label: 'Notifications', icon: '◎' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="dash-root">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dash-sidebar ${collapsed ? 'dash-sidebar--collapsed' : ''} ${mobileOpen ? 'dash-sidebar--mobile-open' : ''}`}>
        <div className="dash-sidebar__header">
          <img src={logoDark} alt="Dwad Music" className="dash-logo" />
          {!collapsed && <span className="dash-sidebar__role">Admin</span>}
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `dash-nav__item ${isActive ? 'dash-nav__item--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="dash-nav__icon">{item.icon}</span>
              {!collapsed && <span className="dash-nav__label">{item.label}</span>}
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

      {/* Main */}
      <div className={`dash-main ${collapsed ? 'dash-main--collapsed' : ''}`}>
        {/* Topbar */}
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
            <span className="dash-topbar__badge">Admin Portal</span>
          </div>
        </header>

        {/* Page content */}
        <main className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
