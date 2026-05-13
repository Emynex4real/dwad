import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Arrow from '../ui/Arrow';
import { NAV, logoDark } from '../../data';

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`topbar fixed top-0 left-0 right-0 z-[100] flex items-center justify-between${scrolled ? ' solid border-b' : ''}`}
      style={{
        padding: '22px 40px',
        borderColor: scrolled ? 'var(--color-line)' : 'transparent',
      }}
    >
      {/* Logo */}
      <button onClick={() => navigate('/')} className="cursor-pointer flex-shrink-0">
        <img
          src={logoDark}
          alt="Dwad Music"
          className="h-10 w-auto object-contain"
        />
      </button>

      {/* Nav */}
      <nav className="flex items-center gap-9 max-[820px]:gap-[18px]">
        {NAV.filter(n => n.slug !== 'contact' && n.slug !== 'home').map(n => (
          <NavLink
            key={n.slug}
            to={`/${n.slug}`}
            className={({ isActive }) =>
              `nav-link relative pb-1.5 transition-colors duration-250 max-[820px]:hidden ${isActive ? 'active' : ''}`
            }
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-2)',
            }}
          >
            {n.label}
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          className="flex items-center gap-3 border rounded-full transition-all duration-250 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            borderColor: 'var(--color-gold)',
            color: 'var(--color-gold)',
            padding: '10px 16px',
          }}
        >
          Start a project<Arrow />
        </NavLink>
      </nav>
    </header>
  );
}
