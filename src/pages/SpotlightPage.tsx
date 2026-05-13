import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import Marquee from '../components/ui/Marquee';
import Ticker from '../components/ui/Ticker';
import { ROSTER_ARTISTS, HOF_ARTISTS } from '../data';

export default function SpotlightPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section className="border-b pt-32 pb-14 px-5 sm:pt-[180px] sm:pb-20 sm:px-14" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            ✦ Service 04 · Editorial
          </div>
          <h1 className="mt-6" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(48px, 7vw, 132px)', lineHeight: 0.94, letterSpacing: '-0.02em' }}>
            Artist{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>spotlight.</span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              The Dwad editorial desk picks one artist a month for a full cover treatment — interview, photo story, lyric drops and a dedicated playlist push across our channels.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                onClick={() => navigate('/contact')}
              >
                Pitch your story<Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={['M Day Yor', 'Akiib', 'Chygoda', 'Highness', 'Aden Ultimate', 'Inature', 'Davee Jay']} />

      {/* ══ SECTION 1 — OUR ROSTER ══ */}
      <section className="pt-16 sm:pt-[100px] pb-14 sm:pb-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          {/* Label row */}
          <div className="flex items-center gap-6 mb-12">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Our Roster
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--color-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Active · 2026
            </span>
          </div>

          {/* Responsive portrait grid — 2 cols on mobile, full roster on desktop */}
          <style>{`
            .roster-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 600px) {
              .roster-grid {
                grid-template-columns: repeat(${ROSTER_ARTISTS.length}, 1fr);
              }
            }
          `}</style>
          <div className="roster-grid grid gap-1">
            {ROSTER_ARTISTS.map((a) => (
              <div key={a.num} className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: '3 / 4' }}>
                <img
                  src={a.photo}
                  alt={a.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(11,9,7,0.92) 100%)' }} />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-[2]">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--color-gold)' }}>
                    {a.num} / {String(ROSTER_ARTISTS.length).padStart(2, '0')}
                  </div>
                  <div className="mt-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3.5vw, 52px)', lineHeight: 1.0, color: 'var(--color-ink)' }}>
                    {a.name}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--color-ink-2)', textTransform: 'uppercase' }}>
                    {a.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ SECTION 2 — HALL OF FAME ══ */}
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          {/* Label row */}
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              ✦ Hall of Fame
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>

          {/* Heading + description */}
          <div className="grid gap-4 sm:gap-8 mb-12 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              Artists who've{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>passed through.</span>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
              A record of notable artists whose music has moved through the Dwad network — distributed, promoted or produced with our team.
            </p>
          </div>

          {/* List rows */}
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {HOF_ARTISTS.map((a, i) => (
              <div
                key={a.name}
                className="flex items-center gap-4 sm:gap-8 group cursor-pointer transition-colors duration-250"
                style={{ background: 'var(--color-bg)', padding: '20px 16px' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg)'; }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="rounded-full overflow-hidden flex-shrink-0 border" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)' }}>
                  <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>
                    {a.name}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {a.role}
                  </div>
                </div>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5 flex-shrink-0" style={{ color: 'var(--color-gold)' }}>
                  <Arrow />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker items={['Spotlight Vol. 04', 'New Issues Monthly', 'Pitch Open · 2026', 'Lagos Editorial']} />
    </div>
  );
}
