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
      <section className="border-b" style={{ padding: '180px 56px 80px', borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
            ✦ Service 04 · Editorial
          </div>
          <h1 className="mt-6" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(56px, 7vw, 132px)', lineHeight: 0.94, letterSpacing: '-0.02em' }}>
            Artist{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>spotlight.</span>
          </h1>
          <div className="mt-10 grid items-end gap-16 max-[820px]:grid-cols-1 max-[820px]:gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
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

      {/* ══════════════════════════════════════
          SECTION 1 — OUR ROSTER
          Current Dwad-signed / distributed artists
      ══════════════════════════════════════ */}
      <section style={{ padding: '100px 56px 80px' }}>
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

          {/* Tall portrait grid */}
          <div className="grid gap-1 max-[600px]:grid-cols-1" style={{ gridTemplateColumns: `repeat(${ROSTER_ARTISTS.length}, 1fr)` }}>
            {ROSTER_ARTISTS.map((a) => (
              <div key={a.num} className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: '3 / 4' }}>
                <img
                  src={a.photo}
                  alt={a.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(11,9,7,0.92) 100%)' }} />
                <div className="absolute bottom-8 left-8 right-8 z-[2]">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--color-gold)' }}>
                    {a.num} / {String(ROSTER_ARTISTS.length).padStart(2, '0')}
                  </div>
                  <div className="mt-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 3.5vw, 52px)', lineHeight: 1.0, color: 'var(--color-ink)' }}>
                    {a.name}
                  </div>
                  <div className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--color-ink-2)', textTransform: 'uppercase' }}>
                    {a.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider between the two sections ── */}
      <div className="flex items-center gap-8" style={{ padding: '0 56px' }}>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — HALL OF FAME
          Notable artists who've worked with Dwad
      ══════════════════════════════════════ */}
      <section style={{ padding: '80px 56px 120px' }}>
        <div className="max-w-[1440px] mx-auto">

          {/* Label row */}
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              ✦ Hall of Fame
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>

          {/* Heading + description */}
          <div className="grid gap-8 mb-12 items-end max-[820px]:grid-cols-1 max-[820px]:gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              Artists who've{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>passed through.</span>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
              A record of notable artists whose music has moved through the Dwad network — distributed, promoted or produced with our team.
            </p>
          </div>

          {/* List-style rows — intentionally different from the portrait grid above */}
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {HOF_ARTISTS.map((a, i) => (
              <div
                key={a.name}
                className="flex items-center gap-8 group cursor-pointer transition-colors duration-250"
                style={{ background: 'var(--color-bg)', padding: '24px 32px' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg-2)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--color-bg)'; }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '36px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="rounded-full overflow-hidden flex-shrink-0 border" style={{ width: '52px', height: '52px', borderColor: 'var(--color-line-strong)' }}>
                  <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>
                    {a.name}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {a.role}
                  </div>
                </div>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5" style={{ color: 'var(--color-gold)' }}>
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
