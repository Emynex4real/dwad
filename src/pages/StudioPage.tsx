import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import PageHero from '../components/ui/PageHero';
import { studioMain, HOF_ARTISTS } from '../data';

const services = [
  { idx: '01', title: 'Beat', italic: 'production', meta: 'From $50 · 2 day turn' },
  { idx: '02', title: 'Vocal', italic: 'recording', meta: 'From $50/hr · Engineer included' },
  { idx: '03', title: 'Mixing &', italic: 'mastering', meta: 'From $150 · 5 day turn' },
  { idx: '04', title: 'Graphics &', italic: 'cover art', meta: 'From $10 · 3 day turn' },
  { idx: '05', title: 'Full', italic: 'release package', meta: 'Custom · Talk to us' },
];

export default function StudioPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <PageHero
        crumb=""
        title="Music"
        italic="Production."
        lede="Beats, recording, mixing and mastering. Our in-house production team takes a record from idea to finished master — and ships it to streaming the same day if you need."
      />

      {/* Two-col */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            {/* Sticky left */}
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ The studio</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                A studio for<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>finished</span> records.
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                We don't just track vocals. The Dwad studio is set up to deliver mastered, distribution-ready records — including artwork, metadata and a release plan.
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
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '40px' }}>
            ✦ How It Works
          </div>
          <div className="flex flex-col border-t" style={{ borderColor: 'var(--color-line)' }}>
            {[
              { num: '01', text: 'Purchase beats from our beat store.' },
              { num: '02', text: 'Record vocals in our studio or any studio around you.' },
              { num: '03', text: 'Let our trained engineers handle the mixing and mastering.' },
            ].map(step => (
              <div
                key={step.num}
                className="flex items-start gap-8 border-b py-10"
                style={{ borderColor: 'var(--color-line)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-gold)', letterSpacing: '0.2em', minWidth: '32px', paddingTop: '4px' }}>
                  {step.num}
                </span>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 400, lineHeight: 1.3, color: 'var(--color-ink)' }}>
                  {step.text}
                </p>
              </div>
            ))}
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

      {/* Production Bundle */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Bundle
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '14ch' }}>
              Production<br />
              + <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>distribution</span><br />
              + <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>promotion.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
              Get your record made, distributed to 200+ platforms, and promoted via radio and sponsored ads — all under one roof with Dwad.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Get the bundle<Arrow />
              </a>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                Talk to a rep<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              ✦ Hall of Fame
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-4 sm:gap-8 mb-12 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              Artists who've{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>passed through.</span>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
              A record of notable artists whose music has moved through the Dwad network — distributed, promoted or produced with our team.
            </p>
          </div>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {HOF_ARTISTS.map((a, i) => (
              <div
                key={a.name}
                className="flex items-center gap-4 sm:gap-8"
                style={{ background: 'var(--color-bg)', padding: '20px 16px' }}
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
                <Arrow />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
