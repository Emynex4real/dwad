import Arrow from '../components/ui/Arrow';
import akiibPhoto from '../assets/artists/akiib.jpg';

const streamingLinks = [
  {
    platform: 'Apple Music',
    desc: 'Check out my music on Apple Music',
    href: 'https://music.apple.com/search?term=akiib',
    icon: '🎵',
  },
  {
    platform: 'Audiomack',
    desc: 'Check out my music on Audiomack',
    href: 'https://audiomack.com/search?q=akiib',
    icon: '🎧',
  },
  {
    platform: 'Boomplay',
    desc: 'Check out my music on Boomplay',
    href: 'https://www.boomplay.com/search/default/akiib',
    icon: '▶️',
  },
  {
    platform: 'Spotify',
    desc: 'Check out my music on Spotify',
    href: 'https://open.spotify.com/search/akiib/artists',
    icon: '🎶',
  },
  {
    platform: 'YouTube',
    desc: 'Check out my music on YouTube',
    href: 'https://www.youtube.com/results?search_query=akiib+music',
    icon: '📺',
  },
];

const releases = [
  { title: 'Who is Akiib?', subtitle: 'EP', year: '2024' },
  { title: 'Addicted', subtitle: 'Single', year: '2024' },
  { title: 'Omo Oloja', subtitle: 'Single', year: '2024' },
  { title: 'Asalamalekun', subtitle: 'Single · Video out', year: '2024' },
];

export default function AkiibMusicPage() {
  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section
        className="border-b pt-32 sm:pt-[180px] px-5 sm:px-14"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 min-[980px]:gap-20 items-end grid-cols-1 min-[980px]:grid-cols-[1fr_1.1fr]">

            {/* Left */}
            <div className="pb-14 sm:pb-20">
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
                ✦ Dwad Music · Artist
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  fontSize: 'clamp(60px, 9vw, 160px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.025em',
                }}
              >
                Who is{' '}
                <span className="block italic font-light" style={{ color: 'var(--color-gold-2)' }}>
                  Akiib?
                </span>
              </h1>
              <p
                className="mt-8"
                style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '540px' }}
              >
                Akiib — whose real name is <strong style={{ color: 'var(--color-ink)', fontWeight: 400 }}>Teslim Omotunde</strong> — is a Nigerian-born Artist, Record Producer and Songwriter. His genre is a fusion of Afrobeat and Pop, spiced up with Hip-Hop, Fuji and EDM elements. Discover the unique sounds of Akiib today.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://open.spotify.com/search/akiib/artists"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Listen to my music<Arrow />
                </a>
              </div>
            </div>

            {/* Right — portrait */}
            <div
              className="relative overflow-hidden border self-end"
              style={{ aspectRatio: '4 / 5', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
            >
              <img src={akiibPhoto} alt="Akiib" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,9,7,0.5) 0%, transparent 60%)' }} />
              <div
                className="absolute bottom-6 left-6"
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 5vw, 72px)', color: 'var(--color-ink)', lineHeight: 1, letterSpacing: '-0.02em' }}
              >
                Akiib
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── LISTEN TO MY MUSIC ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Listen to my music</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Choose your<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>preferred app.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Kindly listen to my music below — download, follow &amp; share. Also available on every other music app you use.
            </p>
          </div>

          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {streamingLinks.map(s => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 sm:gap-8 transition-colors duration-250 hover:bg-[var(--color-bg-2)]"
                style={{ background: 'var(--color-bg)', padding: '24px 20px', textDecoration: 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                  {String(streamingLinks.indexOf(s) + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 3vw, 40px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>
                    {s.platform}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {s.desc}
                  </div>
                </div>
                <Arrow />
              </a>
            ))}
            {/* Trailing note */}
            <div
              className="flex items-center gap-4 sm:gap-8"
              style={{ background: 'var(--color-bg)', padding: '20px' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-gold)', minWidth: '28px' }}>✦</span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                Also available on every other music app you use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR RELEASES ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Popular Releases
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-6 grid-cols-2 min-[700px]:grid-cols-4">
            {releases.map((r, i) => (
              <a
                key={r.title}
                href="https://open.spotify.com/search/akiib/artists"
                target="_blank"
                rel="noreferrer"
                className="group"
                style={{ textDecoration: 'none' }}
              >
                {/* Cover art placeholder with Akiib photo tinted */}
                <div
                  className="relative overflow-hidden border"
                  style={{ aspectRatio: '1/1', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
                >
                  <img
                    src={akiibPhoto}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: `hue-rotate(${i * 25}deg) saturate(0.7)` }}
                  />
                  <div className="absolute inset-0" style={{ background: 'rgba(11,9,7,0.45)' }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'var(--color-ink)', lineHeight: 1.1 }}>
                      {r.title}
                    </div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                      {r.subtitle} · {r.year}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCOVER ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-10 sm:gap-20 items-center grid-cols-1 min-[900px]:grid-cols-2 py-12 sm:py-24 px-6 sm:px-14"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Discover</div>
              <h2
                className="mt-4"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1 }}
              >
                Who is Akiib?<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Discover the sound.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
                Discover Akiib and his amazing sound — a unique blend of Afrobeat, Pop, Hip-Hop, Fuji and EDM. Stream, follow and share everywhere music lives.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://open.spotify.com/search/akiib/artists"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Listen on Spotify<Arrow />
                </a>
                <a
                  href="https://www.youtube.com/results?search_query=akiib+music"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
                >
                  Watch on YouTube<Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
