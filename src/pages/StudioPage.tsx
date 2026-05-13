import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import PageHero from '../components/ui/PageHero';
import Ticker from '../components/ui/Ticker';
import { studioMain, studioDetail, studioDaw } from '../data';

const services = [
  { idx: '01', title: 'Beat', italic: 'production', meta: 'From $80 · 2 day turn' },
  { idx: '02', title: 'Vocal', italic: 'recording', meta: 'From $50/hr · Engineer included' },
  { idx: '03', title: 'Mixing &', italic: 'mastering', meta: 'From $150 · 5 day turn' },
  { idx: '04', title: 'Graphics &', italic: 'cover art', meta: 'From $40 · 3 day turn' },
  { idx: '05', title: 'Full', italic: 'release package', meta: 'Custom · Talk to us' },
];

export default function StudioPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <PageHero
        crumb="✦ Service 02"
        title="Production"
        italic="& studio."
        lede="Beats, recording, mixing and mastering. Our in-house production team takes a record from idea to finished master — and ships it to streaming the same day if you need."
      />

      {/* Two-col */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            {/* Sticky left */}
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ The room</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                A studio for<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>finished</span> records.
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                We don't just track vocals. The Dwad room is set up to deliver mastered, distribution-ready records — including artwork, metadata and a release plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Book a session<Arrow />
                </a>
                <button
                  className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                  onClick={() => navigate('/distro')}
                >
                  See distribution<Arrow />
                </button>
              </div>
            </div>

            {/* Right — photo grid */}
            <div>
              <div className="relative overflow-hidden border" style={{ aspectRatio: '4/5', borderColor: 'var(--color-line)' }}>
                <img src={studioMain} alt="Dwad studio mixing console" className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {([studioDetail, studioDaw] as const).map((photo, i) => (
                  <div key={i} className="relative overflow-hidden border" style={{ aspectRatio: '1', borderColor: 'var(--color-line)' }}>
                    <img src={photo} alt="Studio detail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Capabilities</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                What we<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>make.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Pick a service à la carte, or hand us the whole project. Either way, you walk out with masters that hit on every platform.
            </p>
          </div>
          <ul className="list-none m-0">
            {services.map(s => (
              <li
                key={s.idx}
                className="linklist-item py-6 sm:py-7 border-b cursor-pointer transition-all duration-250"
                style={{ borderColor: 'var(--color-line)' }}
              >
                {/* Mobile layout */}
                <div className="flex items-start gap-4 sm:hidden">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.2em', minWidth: '28px', paddingTop: '6px' }}>{s.idx}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 400 }}>
                      {s.title} <span className="italic" style={{ color: 'var(--color-gold-2)' }}>{s.italic}</span>
                    </div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.meta}</div>
                  </div>
                </div>
                {/* Desktop layout */}
                <div className="hidden sm:grid gap-6 items-center" style={{ gridTemplateColumns: '70px 1fr auto' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.2em' }}>{s.idx}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400 }}>
                    {s.title} <span className="italic" style={{ color: 'var(--color-gold-2)' }}>{s.italic}</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.meta}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Ticker items={['Beats', 'Mixing', 'Mastering', 'Recording', 'Cover Art', 'Lagos Studio · Bookings 2026']} />
    </div>
  );
}
