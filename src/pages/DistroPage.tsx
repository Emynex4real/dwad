import Arrow from '../components/ui/Arrow';
import ProjectCard from '../components/ui/ProjectCard';
import Ticker from '../components/ui/Ticker';
import { PROJECTS, distroHero } from '../data';

const features = [
  { idx: '01', title: 'Apple, Spotify, Boomplay, TikTok', desc: '200+ stores worldwide, one delivery.' },
  { idx: '02', title: 'Publishing & lyrics included', desc: 'Sync, mechanicals, lyric upload — all set up for you.' },
  { idx: '03', title: 'Personal artist dashboard', desc: 'Track streams, royalties and territory data in real time.' },
  { idx: '04', title: 'Human support, not bots', desc: 'Talk to a real representative, every time.' },
  { idx: '05', title: 'Free radio submission', desc: 'Every release becomes a candidate for our radio push.' },
];

const pillars = [
  { num: '01', title: 'Free radio support', desc: 'Songs distributed here automatically enter our promotions pipeline for radio pitching.' },
  { num: '02', title: 'Personal dashboard', desc: 'An artist-only login with real-time streams, payouts and territory breakdowns.' },
  { num: '03', title: 'Active support', desc: 'WhatsApp + email. Our team is online seven days a week — never an FAQ bot.' },
  { num: '04', title: 'Easy payments', desc: 'Bank transfer, credit and debit card. Withdraw in your local currency.' },
];

export default function DistroPage() {
  return (
    <div className="page-enter">

      {/* ── DISTRO HERO ── */}
      <section
        className="relative overflow-hidden border-b flex items-end"
        style={{ minHeight: '80vh', borderColor: 'var(--color-line)' }}
      >
        <img
          src={distroHero}
          alt="Your global distribution network"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(11,9,7,0.35) 0%, rgba(11,9,7,0.82) 100%)' }}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-5 sm:px-14 pb-20">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '20px',
            }}
          >
            ✦ Service 01
          </div>
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
            Upload to Apple Music, Spotify, Boomplay, TikTok and 200+ streaming platforms worldwide. Publishing setup and lyrics included with every release. Real humans, real dashboards, real royalties.
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
                You hand us the master and the artwork — we handle the rest. Metadata, splits, lyrics, publishing, takedowns, and a personal dashboard so you can watch the streams roll in.
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

      {/* Pillars */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Pillars</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Why<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>choose</span> us.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              A distributor is only as good as the people behind it. Here's what you get when you sign with Dwad.
            </p>
          </div>
          <div
            className="grid border-t grid-cols-1 min-[500px]:grid-cols-2 min-[900px]:grid-cols-4"
            style={{ borderColor: 'var(--color-line)' }}
          >
            {pillars.map((p, i) => (
              <div
                key={p.num}
                className={`flex flex-col justify-between border-b border-r min-h-[220px] ${i === pillars.length - 1 ? 'min-[900px]:border-r-0' : ''}`}
                style={{ padding: '32px 24px', borderColor: 'var(--color-line)' }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>{p.num}</div>
                <div>
                  <h4 className="mt-3.5" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', lineHeight: 1.1, fontWeight: 400 }}>{p.title}</h4>
                  <p className="mt-3" style={{ color: 'var(--color-muted)', fontSize: '13px', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
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
