import Arrow from '../components/ui/Arrow';
import SEO from '../components/ui/SEO';
import akiibPhoto from '../assets/who is akiib.jpeg';
import c1 from '../assets/covers/1.jpeg';
import c2 from '../assets/covers/2.jpeg';
import c3 from '../assets/covers/3.jpeg';
import c4 from '../assets/covers/4.jpeg';
import c5 from '../assets/covers/5.jpeg';
import c6 from '../assets/covers/6.jpeg';
import c7 from '../assets/covers/7.jpeg';
import c8 from '../assets/covers/8.jpeg';

const streamingLinks = [
  {
    platform: 'Apple Music',
    desc: 'Listen to Akiib on Apple Music',
    href: 'https://music.apple.com/us/artist/akiib/960562413',
  },
  {
    platform: 'Audiomack',
    desc: 'Stream and download on Audiomack',
    href: 'https://audiomack.com/who_is_akiib',
  },
  {
    platform: 'Boomplay',
    desc: 'Follow Akiib on Boomplay',
    href: 'https://www.boomplay.com/artists/14530673',
  },
  {
    platform: 'Spotify',
    desc: 'Follow Akiib on Spotify',
    href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG',
  },
  {
    platform: 'YouTube',
    desc: 'Watch music videos on YouTube',
    href: 'https://www.youtube.com/@WhoisAkiib',
  },
];

const releases = [
  { title: 'Who is Akiib?', subtitle: 'EP · 7 Tracks', year: '2024', cover: c1, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Hallelujah',    subtitle: 'Single',         year: '2024', cover: c2, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Gbese',         subtitle: 'Single',         year: '2024', cover: c3, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Badess Kid',    subtitle: 'Single',         year: '2024', cover: c4, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Gallivant',     subtitle: 'Single',         year: '2024', cover: c5, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Surulere',      subtitle: 'Single',         year: '2024', cover: c6, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Baaad',         subtitle: 'Single',         year: '2024', cover: c7, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
  { title: 'Go',            subtitle: 'Single',         year: '2024', cover: c8, href: 'https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG' },
];

const videos = [
  { id: 'vgK984Ifzkg', title: 'Addicted Episode 1',         subtitle: 'Music & Comedy',      href: 'https://youtu.be/vgK984Ifzkg' },
  { id: 'WWgTI50MWgA', title: 'Addicted Episode 3',         subtitle: 'Music & Comedy',      href: 'https://youtu.be/WWgTI50MWgA' },
  { id: 'nJL-H_R1zl4', title: 'Go',                         subtitle: 'Official Video',      href: 'https://youtu.be/nJL-H_R1zl4' },
  { id: 'x4FBYX9UQ3c', title: 'Omo Oloja',                  subtitle: 'Official Video',      href: 'https://youtu.be/x4FBYX9UQ3c' },
  { id: 'LKtmhjotYT4', title: 'Asalamalekun ft. KapoLion',  subtitle: 'Official Audio',      href: 'https://youtu.be/LKtmhjotYT4' },
];

export default function AkiibMusicPage() {
  return (
    <div className="page-enter">
      <SEO
        title="Akiib — Artist Profile | Dwad Music"
        description="Stream Akiib's music on Spotify, Apple Music, Audiomack and Boomplay. Lagos-based independent artist distributed and produced through Dwad Music."
        canonical="/akiibmusic"
      />

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
                  href="https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-gold-2"
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
            {streamingLinks.map((s, i) => (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 sm:gap-8 transition-colors duration-250 hover:bg-bg-2"
                style={{ background: 'var(--color-bg)', padding: '24px 20px', textDecoration: 'none' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                  {String(i + 1).padStart(2, '0')}
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
          <div className="grid gap-4 sm:gap-6 grid-cols-2 min-[700px]:grid-cols-4">
            {releases.map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="relative overflow-hidden border"
                  style={{ aspectRatio: '1/1', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
                >
                  <img
                    src={r.cover}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,9,7,0.7) 0%, transparent 55%)' }} />
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(13px, 1.8vw, 18px)', color: 'var(--color-ink)', lineHeight: 1.1 }}>
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

      {/* ── VIDEOS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Videos</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Watch the<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>visuals.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Music videos, official audio and comedy series. Subscribe on YouTube and never miss a drop.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 min-[600px]:grid-cols-2 min-[1000px]:grid-cols-3">
            {videos.map((v) => (
              <a
                key={v.id}
                href={v.href}
                target="_blank"
                rel="noreferrer"
                className="group block"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="relative overflow-hidden border"
                  style={{ aspectRatio: '16/9', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,9,7,0.65) 0%, transparent 50%)' }} />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ width: '52px', height: '52px', background: 'var(--color-gold)', borderRadius: '50%' }}
                    >
                      <span style={{ color: 'var(--color-bg)', fontSize: '18px', marginLeft: '3px' }}>▶</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(14px, 1.8vw, 19px)', color: 'var(--color-ink)', lineHeight: 1.2 }}>
                      {v.title}
                    </div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                      {v.subtitle}
                    </div>
                  </div>
                </div>
              </a>
            ))}
            {/* Subscribe CTA */}
            <a
              href="https://www.youtube.com/@WhoisAkiib"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center border transition-colors duration-250 hover:border-gold min-h-45"
              style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg-2)', aspectRatio: '16/9', textDecoration: 'none' }}

            >
              <span style={{ fontSize: '28px', marginBottom: '12px' }}>▶</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                Subscribe on YouTube
              </div>
              <div className="mt-2" style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                @WhoisAkiib
              </div>
            </a>
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
                  href="https://open.spotify.com/artist/1SfCh1tKzltIu87n2xqPNG"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-gold-2"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Listen on Spotify<Arrow />
                </a>
                <a
                  href="https://www.youtube.com/@WhoisAkiib"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-gold"
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
