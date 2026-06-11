import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import Marquee from '../components/ui/Marquee';
import ProjectCard from '../components/ui/ProjectCard';
import SEO from '../components/ui/SEO';
import { SERVICES, PROJECTS, REVIEWS, HOF_ARTISTS, ARTIST_NAMES } from '../data';
import mdayHero from '../assets/artists/mday.jpg';

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Dwad Music',
  url: 'https://dwadmusic.com',
  logo: 'https://dwadmusic.com/og-image.jpg',
  description: 'A full-service music platform for independent artists — distribution, production and promotion worldwide.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+2348030845751',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <SEO
        title="Dwad Music — Distribution, Production & Promotion"
        description="Your all-in-one music platform. Distribute to 200+ platforms worldwide, record in a professional studio, and promote your music on radio. Built for independent artists."
        canonical="/"
        jsonLd={homeJsonLd}
      />

      {/* ── HERO ── */}
      <section className="relative flex flex-col overflow-hidden min-h-screen pt-32 pb-14 px-5 sm:pt-[140px] sm:pb-14 sm:px-14">
        <div className="max-w-[1440px] w-full mx-auto">
          <div className="grid gap-10 min-[980px]:gap-20 flex-1 items-end grid-cols-1 min-[980px]:grid-cols-[1fr_1.2fr]">
            {/* Left */}
            <div>
              <div
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                }}
              >
                Your All-in-One Music Growth Platform
              </div>
              <h1
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  fontSize: 'clamp(60px, 11vw, 200px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.02em',
                }}
              >
                Dwad Music
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                Everything you Need in One Place. From Production to Distribution to Promotion…<br /><br />
                A full-service music platform built for Independent Artists and Labels worldwide.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Get started today<Arrow />
                </a>
                <button
                  className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                  onClick={() => navigate('/spotlight')}
                >
                  Hear the roster<Arrow />
                </button>
              </div>
            </div>

            {/* Right — hero visual */}
            <div
              className="hero-visual relative border overflow-hidden"
              style={{ aspectRatio: '4 / 5', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
            >
              <img src={mdayHero} alt="M Day Yor" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 gap-6 sm:gap-12 mt-16 pt-7 border-t"
            style={{ borderColor: 'var(--color-line)' }}
          >
            {[
              { k: '24/7', l: 'Human Support' },
              { k: '100+', l: 'Countries Active' },
            ].map(stat => (
              <div key={stat.l}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '38px', color: 'var(--color-gold-2)', fontWeight: 300 }}>
                  {stat.k}
                </div>
                <div className="mt-1.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee items={['Music Distribution', 'Music Production', 'Music Promotion', 'Cover Art Graphics', 'Visual Production', 'Project & Talent Management']} />

      {/* ── SERVICES ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <h2
                className="mt-5"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}
              >
                Built for <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>independent</span><br />
                artists and labels.
              </h2>
            </div>
          </div>

          {/* Services grid */}
          <div
            className="grid border-t border-l grid-cols-1 min-[820px]:grid-cols-2"
            style={{ borderColor: 'var(--color-line)' }}
          >
            {SERVICES.map(s => (
              <div
                key={s.slug}
                className="service-card relative border-r border-b flex flex-col justify-between overflow-hidden cursor-pointer min-h-[320px] sm:min-h-[360px] transition-colors duration-[350ms] hover:bg-[var(--color-bg-2)]"
                style={{ padding: '40px 28px', borderColor: 'var(--color-line)' }}
                onClick={() => navigate(`/${s.slug}`)}
              >
                <div>
                  <h3
                    className="mt-6"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1, letterSpacing: '-0.01em' }}
                  >
                    {s.title}
                    <span className="block italic font-light" style={{ color: 'var(--color-gold-2)' }}>{s.titleItalic}</span>
                  </h3>
                </div>
                <div>
                  <p className="mt-4" style={{ maxWidth: '380px', color: 'var(--color-ink-2)', fontWeight: 300, lineHeight: 1.55 }}>{s.desc}</p>
                  <div
                    className="mt-9 self-start inline-flex items-center gap-2.5 transition-transform duration-300"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}
                  >
                    Explore <span className="service-arrow"><Arrow /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO CARDS ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 grid-cols-1 min-[700px]:grid-cols-2">

            {/* Radio Airplay */}
            <div
              className="flex flex-col border"
              style={{ background: 'var(--color-bg-2)', padding: 'clamp(36px, 5vw, 64px) clamp(24px, 4vw, 56px)', borderColor: 'var(--color-gold)' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}>✦ Free For Artists</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Free Radio<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Airplay.</span>
              </h2>
              <p className="mt-6 flex-1" style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300 }}>
                Get your music on radio — free. Available on the premium distribution plan and selected production packages.
              </p>
              <div className="mt-8">
                <button
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                  onClick={() => navigate('/radio')}
                >
                  Get free radio plays<Arrow />
                </button>
              </div>
            </div>

            {/* Artist Spotlight */}
            <div
              className="flex flex-col border"
              style={{ background: 'var(--color-bg-2)', padding: 'clamp(36px, 5vw, 64px) clamp(24px, 4vw, 56px)', borderColor: 'var(--color-line)' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}>✦ For Dwad Artists</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Artist<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Spotlight.</span>
              </h2>
              <p className="mt-6 flex-1" style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300 }}>
                Be featured by the Dwad editorial team — interviews, cover stories and curated drops for artists building real careers.
              </p>
              <div className="mt-8">
                <button
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                  onClick={() => navigate('/spotlight')}
                >
                  Check Spotlight<Arrow />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Released<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>through</span> Dwad.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              A glimpse of some records we've shipped to streaming recently.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {PROJECTS.slice(0, 8).map((p, i) => <ProjectCard key={i} project={p} idx={i} />)}
          </div>
          <div className="mt-12 flex justify-center">
            <button
              className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
              onClick={() => navigate('/spotlight')}
            >
              See the full catalogue<Arrow />
            </button>
          </div>
        </div>
      </section>


      {/* ── FREE BONUSES ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col border"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', borderColor: 'var(--color-gold)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Free Bonuses
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              More than just{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>music.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Get free radio promotions, free cover arts and many more bonus included.
            </p>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                What our<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>artists</span> say.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Three years in. Hundreds of releases. The trust we've built is everything — here's what comes back from the people we work with.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 min-[800px]:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="border flex flex-col justify-between min-h-[220px]"
                style={{ padding: '32px', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
              >
                <div>
                  <div style={{ color: 'var(--color-gold)', letterSpacing: '4px', fontSize: '14px' }}>{'★'.repeat(r.stars)}</div>
                  <blockquote className="mt-4" style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', lineHeight: 1.3, fontWeight: 400, color: 'var(--color-ink)' }}>
                    "{r.quote}"
                  </blockquote>
                </div>
                <div
                  className="mt-6 flex justify-between"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}
                >
                  <span>{r.who}</span><span>{r.role}</span>
                </div>
              </div>
            ))}
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

      <Marquee items={ARTIST_NAMES} duration="1200s" fontSize="18px" />

    </div>
  );
}
