import Arrow from '../components/ui/Arrow';
import ProjectCard from '../components/ui/ProjectCard';
import Ticker from '../components/ui/Ticker';
import { PROJECTS, HOF_ARTISTS } from '../data';

const features = [
  { idx: '01', title: 'Apple, Spotify, Boomplay, TikTok', desc: '200+ stores worldwide, one delivery.' },
  { idx: '02', title: 'Personal artist dashboard', desc: 'Track streams, royalties and territory data in real time.' },
  { idx: '03', title: 'Human support, not bots', desc: 'Talk to a real representative, every time.' },
  { idx: '04', title: 'Free radio submission', desc: 'Every release becomes a candidate for our radio push.' },
];


export default function DistroPage() {
  return (
    <div className="page-enter">

      {/* ── DISTRO HERO ── */}
      <section
        className="border-b"
        style={{ borderColor: 'var(--color-line)', padding: 'clamp(60px, 10vw, 160px) 20px clamp(60px, 10vw, 160px)' }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-14">
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(48px, 7vw, 132px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '12ch',
            }}
          >
            Music{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              distribution.
            </span>
          </h1>
          <p
            className="mt-8"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '520px',
            }}
          >
            Upload to Apple Music, Spotify, Boomplay, TikTok and 200+ streaming platforms worldwide. Real humans, real dashboards, real royalties.
          </p>
        </div>
      </section>

      {/* Two-col */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Why distribute with Dwad</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                One upload.<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Two hundred</span> stores.
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                You hand us the master and the artwork — we handle the rest. Metadata, splits, publishing, takedowns, and a personal dashboard so you can watch the streams roll in.
              </p>
              <div className="mt-8">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Sign up on WhatsApp<Arrow />
                </a>
              </div>
            </div>
            <ul className="list-none m-0">
              {features.map(f => (
                <li
                  key={f.idx}
                  className="grid gap-4 sm:gap-6 py-7 border-b items-center grid-cols-[40px_1fr_auto] sm:grid-cols-[60px_1fr_auto]"
                  style={{ borderColor: 'var(--color-line)' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>{f.idx}</span>
                  <span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--color-ink)' }}>{f.title}</div>
                    <div className="mt-1" style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{f.desc}</div>
                  </span>
                  <Arrow />
                </li>
              ))}
            </ul>
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
              { num: '01', text: 'Contact us and send us your music to be distributed.' },
              { num: '02', text: 'We set up your personal distribution account with your advance dashboard.' },
              { num: '03', text: 'Your music goes live on all platforms worldwide.' },
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

      {/* Bundle */}
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
              Distribute<br />
              + <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>promote</span> together.
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
              Sign for distribution and your first radio pitch is on us. The most popular path for artists releasing their next single with Dwad.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Bundle Distribution<Arrow />
              </a>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                Talk to a Rep<Arrow />
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

      {/* Catalogue */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Catalogue</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Songs we've<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>distributed.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              A selection of recent releases live across all major DSPs.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} idx={i} />)}
          </div>
        </div>
      </section>

      <Ticker items={['Apple Music', 'Spotify', 'Boomplay', 'Audiomack', 'TikTok', 'Tidal', 'Deezer', 'YouTube Music', 'Amazon', 'Pandora']} />
    </div>
  );
}
