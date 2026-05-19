import { useNavigate } from 'react-router-dom';
import { NAV } from '../../data';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer
      className="border-t pt-16 sm:pt-24 px-5 sm:px-14 pb-10"
      style={{
        background: 'var(--color-bg)',
        borderColor: 'var(--color-line)',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 min-[800px]:grid-cols-3 gap-10 sm:gap-16">
          {/* Navigate */}
          <div>
            <h5
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Navigate
            </h5>
            <ul className="list-none">
              {NAV.map(n => (
                <li key={n.slug} className="mb-3">
                  <button
                    onClick={() => navigate(n.slug === 'home' ? '/' : `/${n.slug}`)}
                    className="transition-colors duration-250 hover:text-[var(--color-gold)] cursor-pointer"
                    style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--color-ink)' }}
                  >
                    {n.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Contact
            </h5>
            <ul className="list-none">
              {[
                { href: 'tel:+2348030845751', label: '+234 803 084 5751' },
                { href: 'https://wa.me/message/VYJP7JFQPZXSN1', label: 'WhatsApp', external: true },
                { href: 'mailto:contact@dwadmusic.com', label: 'contact@dwadmusic.com' },
              ].map(item => (
                <li key={item.href} className="mb-3">
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="transition-colors duration-250 hover:text-[var(--color-gold)]"
                    style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--color-ink)' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h5
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'var(--color-muted)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Social
            </h5>
            <ul className="list-none">
              {[
                { href: 'https://www.instagram.com/dwad.music.entertainment/', label: 'Instagram', external: true },
                { href: 'https://web.facebook.com/DwadMusic/', label: 'Facebook', external: true },
                { href: '#', label: 'YouTube' },
                { href: '#', label: 'Boomplay' },
              ].map(item => (
                <li key={item.label} className="mb-3">
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    className="transition-colors duration-250 hover:text-[var(--color-gold)]"
                    style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--color-ink)' }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Big word */}
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(60px, 10vw, 200px)',
            letterSpacing: '-0.03em',
            lineHeight: 0.85,
            marginTop: '80px',
            color: 'var(--color-ink)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          Dwad{' '}
          <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
            music.
          </span>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center"
          style={{
            borderColor: 'var(--color-line)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.18em',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
          }}
        >
          <span>© 2026 Dwad Music Entertainment · Lagos, Nigeria</span>
          <span>50+ Countries · 200+ Platforms</span>
        </div>
      </div>
    </footer>
  );
}
