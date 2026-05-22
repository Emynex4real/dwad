import Arrow from '../components/ui/Arrow';
import Ticker from '../components/ui/Ticker';
import ProjectCard from '../components/ui/ProjectCard';
import { HOF_ARTISTS, PROJECTS } from '../data';

const deliverables = [
  { idx: '01', title: 'Single & EP Cover Art', desc: 'DSP-ready artwork sized and optimised for every platform.' },
  { idx: '02', title: 'Album Packaging', desc: 'Front, back, disc, and booklet — full physical and digital suites.' },
  { idx: '03', title: 'Social Media Kits', desc: 'Consistent visual identity across Instagram, TikTok, and YouTube.' },
  { idx: '04', title: 'Press & EPK Assets', desc: 'Artist photos, banners, and branded PDFs for editorial pitching.' },
];

const process = [
  { num: '01', text: 'Brief us — share your vision, references, and release date.' },
  { num: '02', text: 'We deliver a first concept within 48 hours for your review.' },
  { num: '03', text: 'Two rounds of revisions until the design is exactly right.' },
  { num: '04', text: 'Final files delivered in all formats — print, web, and DSP specs.' },
];

const packages = [
  {
    tier: 'Single',
    price: 'Get a Quote',
    items: ['1 cover art (3000 × 3000 px)', 'DSP-ready JPEG + PNG', '1 revision round', '48 hr turnaround'],
  },
  {
    tier: 'Bundle',
    price: 'Get a Quote',
    items: ['Cover art + 3-piece social kit', 'Story, post & banner formats', '2 revision rounds', 'Branded colour palette'],
    featured: true,
  },
  {
    tier: 'Full Project',
    price: 'Get a Quote',
    items: ['Album / EP full suite', 'Social kit + press assets', 'Unlimited revisions', 'Source files included'],
  },
];

export default function GraphicsPage() {
  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section
        className="border-b pt-32 pb-14 sm:pt-[180px] sm:pb-20"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto w-full px-5 sm:px-14">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '24px',
            }}
          >
            ✦ Cover Art &amp; Graphics
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(48px, 7vw, 132px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '14ch',
            }}
          >
            Design that{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              converts.
            </span>
          </h1>
          <p
            className="mt-8"
            style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '520px',
            }}
          >
            Professional cover art and graphic design for singles, EPs, albums, and social media — built to stop the scroll and move on every platform.
          </p>
          <div className="mt-10">
            <a
              href="https://wa.me/message/VYJP7JFQPZXSN1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
            >
              Start a project<Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT WE DELIVER ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                ✦ What we deliver
              </div>
              <h2
                className="mt-5"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}
              >
                Every format.<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Every platform.</span>
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
                From a single cover to a full album rollout — we give you artwork that looks right on Spotify, Apple Music, Instagram, and everywhere in between.
              </p>
            </div>
            <ul className="list-none m-0">
              {deliverables.map(d => (
                <li
                  key={d.idx}
                  className="grid gap-4 sm:gap-6 py-7 border-b items-center grid-cols-[40px_1fr_auto] sm:grid-cols-[60px_1fr_auto]"
                  style={{ borderColor: 'var(--color-line)' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>{d.idx}</span>
                  <span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--color-ink)' }}>{d.title}</div>
                    <div className="mt-1" style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{d.desc}</div>
                  </span>
                  <Arrow />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── RECENT WORK ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Recent Work
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-6 grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '40px' }}>
            ✦ How It Works
          </div>
          <div className="flex flex-col border-t" style={{ borderColor: 'var(--color-line)' }}>
            {process.map(step => (
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

      {/* ── PACKAGES ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>
            ✦ Packages
          </div>
          <h2
            className="mb-14"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}
          >
            Pick your<br />
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>scope.</span>
          </h2>
          <div className="grid gap-6 grid-cols-1 min-[820px]:grid-cols-3">
            {packages.map(pkg => (
              <div
                key={pkg.tier}
                className="flex flex-col border"
                style={{
                  padding: '40px 32px',
                  borderColor: pkg.featured ? 'var(--color-gold)' : 'var(--color-line)',
                  background: pkg.featured ? 'var(--color-bg-2)' : 'transparent',
                }}
              >
                {pkg.featured && (
                  <div
                    className="self-start mb-4"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-bg)', background: 'var(--color-gold)', padding: '4px 10px' }}
                  >
                    Most Popular
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  {pkg.tier}
                </div>
                <div
                  className="mt-3 mb-8"
                  style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 400, color: 'var(--color-ink)' }}
                >
                  {pkg.price}
                </div>
                <ul className="flex flex-col gap-3 flex-1 mb-10">
                  {pkg.items.map(item => (
                    <li key={item} className="flex items-start gap-3" style={{ fontSize: '14px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--color-gold)', marginTop: '2px', flexShrink: 0 }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    padding: '14px 24px',
                    background: pkg.featured ? 'var(--color-gold)' : 'transparent',
                    color: pkg.featured ? 'var(--color-bg)' : 'var(--color-gold)',
                    border: pkg.featured ? 'none' : '1px solid var(--color-gold)',
                    alignSelf: 'flex-start',
                  }}
                >
                  Get started<Arrow />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUNDLE CTA ── */}
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
              Art + Distribution<br />
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>together.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
              Combine your cover art order with a Dwad distribution deal and get your release looking and sounding professional on every platform — at the same time.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Bundle Art + Distro<Arrow />
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

      {/* ── HALL OF FAME ── */}
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
              <a
                key={a.name}
                href={a.spotify}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 sm:gap-8 transition-colors duration-250 hover:bg-[var(--color-bg-2)]"
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
              </a>
            ))}
          </div>
        </div>
      </section>

      <Ticker items={['Cover Art', 'Album Packaging', 'Social Media Kits', 'Press Assets', 'Branding', 'Visual Identity', 'EPK Design', 'Merch Graphics']} />
    </div>
  );
}
