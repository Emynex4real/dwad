import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Arrow from '../ui/Arrow';
import { NAV, logoDark } from '../../data';

export default function Topbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleMobileNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header
        className={`topbar fixed top-0 left-0 right-0 z-[100] flex items-center justify-between${scrolled || menuOpen ? ' solid border-b' : ''}`}
        style={{
          padding: '18px 20px',
          borderColor: scrolled || menuOpen ? 'var(--color-line)' : 'transparent',
        }}
      >
        {/* Logo */}
        <button onClick={() => { setMenuOpen(false); navigate('/'); }} className="cursor-pointer flex-shrink-0">
          <img src={logoDark} alt="Dwad Music" className="h-9 w-auto object-contain" />
        </button>

        {/* Desktop nav */}
        <nav className="hidden min-[820px]:flex items-center gap-9">
          {NAV.filter(n => n.slug !== 'contact' && n.slug !== 'home').map(n => (
            <NavLink
              key={n.slug}
              to={`/${n.slug}`}
              className={({ isActive }) =>
                `nav-link relative pb-1.5 transition-colors duration-250 ${isActive ? 'active' : ''}`
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

        {/* Mobile: CTA pill + hamburger */}
        <div className="flex items-center gap-3 min-[820px]:hidden">
          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 border rounded-full transition-all duration-250 hover:bg-[var(--color-gold)] hover:text-[var(--color-bg)]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              borderColor: 'var(--color-gold)',
              color: 'var(--color-gold)',
              padding: '8px 14px',
            }}
          >
            Start<Arrow />
          </NavLink>

          <button
            className="flex flex-col justify-center gap-[6px] w-8 h-8 cursor-pointer"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className="block transition-all duration-300 origin-center"
              style={{
                background: 'var(--color-ink)',
                height: '1px',
                width: '22px',
                transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              className="block transition-all duration-300"
              style={{
                background: 'var(--color-ink)',
                height: '1px',
                width: '22px',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block transition-all duration-300 origin-center"
              style={{
                background: 'var(--color-ink)',
                height: '1px',
                width: '22px',
                transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 z-[99] flex flex-col min-[820px]:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'var(--color-bg)', paddingTop: '72px' }}
      >
        <nav className="flex flex-col px-5 pt-6 flex-1 overflow-y-auto">
          {NAV.filter(n => n.slug !== 'home').map(n => (
            <button
              key={n.slug}
              onClick={() => handleMobileNav(n.slug === 'home' ? '/' : `/${n.slug}`)}
              className="text-left py-5 border-b transition-colors duration-250 hover:text-[var(--color-gold)]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '36px',
                fontWeight: 400,
                color: 'var(--color-ink)',
                borderColor: 'var(--color-line)',
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="px-5 pb-10 pt-8">
          <a
            href="https://wa.me/message/VYJP7JFQPZXSN1"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              padding: '16px 28px',
              background: 'var(--color-gold)',
              color: 'var(--color-bg)',
            }}
          >
            WhatsApp the team<Arrow />
          </a>
        </div>
      </div>
    </>
  );
}
