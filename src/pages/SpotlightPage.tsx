import Arrow from '../components/ui/Arrow';
import Marquee from '../components/ui/Marquee';
import Ticker from '../components/ui/Ticker';
import { ROSTER_ARTISTS, HOF_ARTISTS, ARTIST_NAMES } from '../data';
import mdayPhoto from '../assets/artists/mday.jpg';

export default function SpotlightPage() {
  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section className="border-b pt-32 pb-14 px-5 sm:pt-[180px] sm:pb-20 sm:px-14" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(48px, 7vw, 132px)', lineHeight: 0.94, letterSpacing: '-0.02em' }}>
            Artist{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>spotlight.</span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              The Dwad Music spotlight showcases talents who deserve to be showcased. Get your music showcased to audiences worldwide.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Talk to our rep<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={ARTIST_NAMES} duration="1200s" fontSize="18px" />

      {/* ══ SECTION 1 — OUR ROSTER ══ */}
      <section className="pt-16 sm:pt-[100px] pb-14 sm:pb-20 px-5 sm:px-14">
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

          {/* Responsive portrait grid — 2 cols on mobile, full roster on desktop */}
          <style>{`
            .roster-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 600px) {
              .roster-grid {
                grid-template-columns: repeat(${ROSTER_ARTISTS.length}, 1fr);
              }
            }
          `}</style>
          <div className="roster-grid grid gap-1">
            {ROSTER_ARTISTS.map((a) => (
              <div key={a.num} className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: '3 / 4' }}>
                <img
                  src={a.photo}
                  alt={a.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(11,9,7,0.92) 100%)' }} />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-[2]">
                  <div className="mt-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3.5vw, 52px)', lineHeight: 1.0, color: 'var(--color-ink)' }}>
                    {a.name}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--color-ink-2)', textTransform: 'uppercase' }}>
                    {a.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ SECTION 2 — HALL OF FAME ══ */}
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          {/* Label row */}
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              ✦ Hall of Fame
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>

          {/* Heading + description */}
          <div className="grid gap-4 sm:gap-8 mb-12 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              Artists who've{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>passed through.</span>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
              A record of notable artists whose music has moved through the Dwad network — distributed, promoted or produced with our team.
            </p>
          </div>

          {/* List rows */}
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

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ TOP TALENTS ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Top Talents</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <p className="mb-10" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300 }}>
            Check out our top talents this month — these guys are definitely here to stay with their blend of good music.
          </p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {[
              { num: '01', name: 'Olarwise',   role: 'Artist', spotify: 'https://open.spotify.com/search/olarwise/artists' },
              { num: '02', name: 'Dmanteaser', role: 'Artist', spotify: 'https://open.spotify.com/search/dmanteaser/artists' },
              { num: '03', name: 'Jazzydking', role: 'Artist', spotify: 'https://open.spotify.com/search/jazzydking/artists' },
            ].map(a => (
              <a
                key={a.num}
                href={a.spotify || undefined}
                target={a.spotify ? '_blank' : undefined}
                rel={a.spotify ? 'noreferrer' : undefined}
                className={`flex items-center gap-4 sm:gap-8${a.spotify ? ' transition-colors duration-250 hover:bg-[var(--color-bg-2)]' : ''}`}
                style={{ background: 'var(--color-bg)', padding: '20px 16px', cursor: a.spotify ? 'pointer' : 'default' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>{a.num}</span>
                <div className="rounded-full flex-shrink-0 flex items-center justify-center border" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)', background: 'var(--color-bg-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-gold)' }}>{a.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>{a.name}</div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{a.role}</div>
                </div>
                {a.spotify && <Arrow />}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ TOP HITS ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Top Hits of the Month</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {[
              { title: 'Rain of Blessings', artist: 'Ransom Ikedinachi',               spotify: 'https://open.spotify.com/search/ransom%20ikedinachi/artists' },
              { title: 'A Cry to God',       artist: 'King Yungzil',                    spotify: 'https://open.spotify.com/search/king%20yungzil/artists' },
              { title: 'Drip',               artist: 'African Boy',                     spotify: 'https://open.spotify.com/search/african%20boy/artists' },
              { title: 'My Life',            artist: 'Normal Donzee ft. Bella Shmurda', spotify: 'https://open.spotify.com/search/normal%20donzee/artists' },
              { title: 'All for You',        artist: 'Karmarr',                         spotify: 'https://open.spotify.com/search/karmarr/artists' },
              { title: 'Where You Dey',      artist: 'Jah Lingo',                       spotify: 'https://open.spotify.com/search/jah%20lingo/artists' },
              { title: 'Oja Men',            artist: 'Ysteve ft. Ojadilichukwu',        spotify: 'https://open.spotify.com/search/ysteve/artists' },
              { title: 'Who is Akiib? EP',   artist: 'Akiib',                           spotify: 'https://open.spotify.com/search/akiib/artists' },
              { title: 'Love Letter',   artist: 'Valid Patema',       spotify: 'https://open.spotify.com/search/VALID%20PATEMA/artists' },
              { title: 'Oya Egbu Onwu', artist: 'Uche Onye Egwu',    spotify: 'https://open.spotify.com/search/UCHE%20ONYE%20EGWU/artists' },
              { title: 'Naija',         artist: 'Solotone',            spotify: 'https://open.spotify.com/search/SOLOTONE/artists' },
              { title: 'Ohema Remix',   artist: 'Nokyes ft Sugarboi', spotify: 'https://open.spotify.com/search/NOKYES/artists' },
            ].map((s, i) => (
              <a
                key={s.title}
                href={s.spotify || undefined}
                target={s.spotify ? '_blank' : undefined}
                rel={s.spotify ? 'noreferrer' : undefined}
                className={`flex items-center gap-4 sm:gap-8${s.spotify ? ' transition-colors duration-250 hover:bg-[var(--color-bg-2)]' : ''}`}
                style={{ background: 'var(--color-bg)', padding: '20px 16px', cursor: s.spotify ? 'pointer' : 'default' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="rounded-full flex-shrink-0 flex items-center justify-center border" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)', background: 'var(--color-bg-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-gold)' }}>{s.artist[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>{s.title}</div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{s.artist}</div>
                </div>
                {s.spotify && <Arrow />}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ HOT NEW VIDEO ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Hot New Videos</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-10 grid-cols-1 min-[700px]:grid-cols-2">
            {[
              { artist: 'Bryno T Ft. Sy Lynghuan', title: 'Unbeliever',    videoId: 'pNrRvpQSff0' },
              { artist: 'Youngzy',                  title: 'Gallivant',     videoId: '3YueUpRD-js' },
              { artist: 'Akiib',                    title: 'Asalamalekun', videoId: 'LKtmhjotYT4' },
              { artist: 'Ryno ft Oberz',            title: 'Lavida Loca',  videoId: 's6dlbg0-UGY' },
            ].map(v => (
              <div key={v.videoId}>
                <h3 className="mb-1" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(20px, 3vw, 36px)', lineHeight: 1.1, color: 'var(--color-ink)' }}>
                  {v.artist}
                </h3>
                <p className="mb-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  {v.title}
                </p>
                <div className="relative w-full border" style={{ aspectRatio: '16/9', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.videoId}`}
                    title={`${v.artist} – ${v.title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ TOP CLASSICS ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Top Classics of the Month</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {[
              { title: 'Kilode',        artist: 'G Win',                    spotify: 'https://open.spotify.com/search/G%20WIN/artists' },
              { title: 'Oja Men',       artist: 'Ysteve ft. Ojadilichukwu', spotify: 'https://open.spotify.com/search/YSTEVE/artists' },
              { title: 'Party Animal',  artist: 'Nature Republiq',           spotify: 'https://open.spotify.com/search/NATURE%20REPUBLIQ/artists' },
              { title: 'Grace Time',    artist: 'Omo Oluwa Badboi Kp',      spotify: 'https://open.spotify.com/search/OMO%20OLUWA%20BADBOI%20KP/artists' },
              { title: 'Watin Dey',     artist: 'Jazzydking',                spotify: 'https://open.spotify.com/search/JAZZYDKING/artists' },
              { title: 'Yehowa Ye',     artist: 'Empaya Vybez',             spotify: 'https://open.spotify.com/search/EMPAYA%20VYBEZ/artists' },
              { title: 'Crazy',         artist: 'BThree',                    spotify: 'https://open.spotify.com/search/BTHREE/artists' },
              { title: 'Holy Father',   artist: 'Olarwise',                  spotify: 'https://open.spotify.com/search/OLARWISE/artists' },
              { title: 'Mommy',         artist: 'Mhuftybwoy',                spotify: 'https://open.spotify.com/search/MHUFTYBWOY/artists' },
              { title: 'Flenjo',        artist: 'Brown Spice',               spotify: 'https://open.spotify.com/search/BROWN%20SPICE/artists' },
              { title: 'Street Hunter', artist: 'Obimax nwa OZ',            spotify: 'https://open.spotify.com/search/OBIMAX%20NWA%20OZ/artists' },
              { title: 'Bianca',        artist: 'Boldmanhs',                 spotify: 'https://open.spotify.com/search/BOLDMANHS/artists' },
            ].map((s, i) => (
              <a
                key={s.title}
                href={s.spotify || undefined}
                target={s.spotify ? '_blank' : undefined}
                rel={s.spotify ? 'noreferrer' : undefined}
                className={`flex items-center gap-4 sm:gap-8${s.spotify ? ' transition-colors duration-250 hover:bg-[var(--color-bg-2)]' : ''}`}
                style={{ background: 'var(--color-bg)', padding: '20px 16px', cursor: s.spotify ? 'pointer' : 'default' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="rounded-full flex-shrink-0 flex items-center justify-center border" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)', background: 'var(--color-bg-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-gold)' }}>{s.artist[0].toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>{s.title}</div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{s.artist}</div>
                </div>
                {s.spotify && <Arrow />}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ ARTIST OF THE MONTH ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Artist of the Month</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <p className="mb-10" style={{ fontSize: '14px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Most Outstanding Music Artist of the Month
          </p>
          <div className="grid gap-10 items-center grid-cols-1 min-[820px]:grid-cols-2">
            <div className="relative overflow-hidden border" style={{ aspectRatio: '3/4', borderColor: 'var(--color-line)' }}>
              <img src={mdayPhoto} alt="M Day Yor" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                M Day <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Yor.</span>
              </h2>
              <div className="mt-10 flex flex-col gap-4">
                {[
                  { label: 'Genre',   value: 'Afro Soul' },
                  { label: 'Country', value: 'Nigeria' },
                ].map(d => (
                  <div key={d.label} className="flex gap-6 border-b pb-4" style={{ borderColor: 'var(--color-line)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase', minWidth: '80px' }}>{d.label}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--color-ink)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker items={['Spotlight Vol. 04', 'New Issues Monthly', 'Pitch Open · 2026', 'Lagos Editorial']} />
    </div>
  );
}
