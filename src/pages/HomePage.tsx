import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import Marquee from '../components/ui/Marquee';
import Ticker from '../components/ui/Ticker';
import ProjectCard from '../components/ui/ProjectCard';
import { SERVICES, PROJECTS, PLATFORMS, REVIEWS } from '../data';
import mdayHero from '../assets/artists/mday.jpg';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section
        className="relative flex flex-col overflow-hidden min-h-screen"
        style={{ padding: '140px 56px 56px' }}
      >
        <div className="max-w-[1440px] w-full mx-auto">
          <div
            className="grid gap-20 flex-1 items-end max-[980px]:grid-cols-1 max-[980px]:gap-10"
            style={{ gridTemplateColumns: '1fr 1.2fr' }}
          >
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
                ✦ Music House · Est. 2023 · Lagos
              </div>
              <h1
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  fontSize: 'clamp(72px, 11vw, 200px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.02em',
                }}
              >
                Sound,<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>staged</span><br />
                worldwide.
              </h1>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                A Lagos-based music house for distribution, production and promotion — placing independent artists on 200+ platforms across 50+ countries.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)] group"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                  onClick={() => navigate('/distro')}
                >
                  Distribute a record<Arrow />
                </button>
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
              <div
                className="absolute bottom-5 left-5 right-5 z-[2] flex justify-between items-end"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink)' }}
              >
                <span>Vol. 04 · Cover</span>
                <span>2026</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex gap-12 items-end flex-wrap mt-16 pt-7 border-t"
            style={{ borderColor: 'var(--color-line)' }}
          >
            {[
              { k: '200+', l: 'Streaming Platforms' },
              { k: '50+', l: 'Countries Active' },
              { k: '1.2K+', l: 'Releases Shipped' },
              { k: '24/7', l: 'Human Support' },
            ].map(stat => (
              <div key={stat.l} className="flex-1">
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
      <Marquee items={['Distribution', 'Production', 'Promotion', 'Spotlight', 'Graphics', 'Radio']} />

      {/* ── SERVICES ── */}
      <section style={{ padding: '120px 56px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div
            className="grid gap-15 mb-16 items-end max-[820px]:grid-cols-1 max-[820px]:gap-6 max-[820px]:mb-10"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ 01 — Our craft</div>
              <h2
                className="mt-5"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}
              >
                Built for the<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>independent</span> artist.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Four pillars — one studio. From writing a beat to landing it in editorial rotation, the team handles every step in-house. No middlemen. No bots. Just people who love this work.
            </p>
          </div>

          {/* Services grid */}
          <div
            className="grid border-t border-l max-[820px]:grid-cols-1"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)', borderColor: 'var(--color-line)' }}
          >
            {SERVICES.map(s => (
              <div
                key={s.slug}
                className="service-card relative border-r border-b flex flex-col justify-between overflow-hidden cursor-pointer min-h-[360px] transition-colors duration-[350ms] hover:bg-[var(--color-bg-2)]"
                style={{ padding: '56px 44px', borderColor: 'var(--color-line)' }}
                onClick={() => navigate(`/${s.slug}`)}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)' }}>{s.num} / 04</div>
                  <h3
                    className="mt-6"
                    style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1, letterSpacing: '-0.01em' }}
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

      {/* ── FREE RADIO CTA ── */}
      <section style={{ padding: '80px 56px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-20 items-center max-[900px]:grid-cols-1 max-[900px]:p-8"
            style={{ padding: '96px 56px', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)', gridTemplateColumns: '1fr 1fr' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ For Dwad Artists</div>
              <h2
                className="mt-4 relative z-[1]"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1 }}
              >
                Free<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>radio</span> submission.
              </h2>
            </div>
            <div className="relative z-[1]">
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                Every song you distribute or produce with us gets a chance at terrestrial and online radio — submitted, pitched and tracked by our promotions team. No hidden fees.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                  onClick={() => navigate('/promotion')}
                >
                  How it works<Arrow />
                </button>
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                >
                  Talk to a rep<Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section style={{ padding: '120px 56px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div
            className="grid gap-15 mb-16 items-end max-[820px]:grid-cols-1 max-[820px]:gap-6"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ 02 — Recent work</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Released<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>through</span> Dwad.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              A glimpse of the records we've shipped to streaming this season.
            </p>
          </div>
          <div className="grid gap-6 max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2 max-[480px]:grid-cols-1" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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

      {/* ── PLATFORMS ── */}
      <div
        className="flex flex-wrap justify-center items-center gap-14 border-t border-b"
        style={{ padding: '56px', borderColor: 'var(--color-line)' }}
      >
        {PLATFORMS.map((p, i) => (
          <div key={i} className="flex items-center gap-3.5" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '26px', color: 'var(--color-ink-2)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--color-gold)' }} />
            {p}
          </div>
        ))}
      </div>

      {/* ── REVIEWS ── */}
      <section style={{ padding: '120px 56px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div
            className="grid gap-15 mb-16 items-end max-[820px]:grid-cols-1 max-[820px]:gap-6"
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ 03 — Word of mouth</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                What our<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>artists</span> say.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Three years in. Hundreds of releases. The trust we've built is everything — here's what comes back from the people we work with.
            </p>
          </div>
          <div className="grid gap-6 max-[800px]:grid-cols-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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

      <Ticker items={['Now Booking 2026', 'Free Radio Pitch', 'Apple Music', 'Spotify', 'Boomplay', 'TikTok', 'Lagos · Worldwide']} />
    </div>
  );
}
