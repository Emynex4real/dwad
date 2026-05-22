import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import Ticker from '../components/ui/Ticker';

const royaltyTypes = [
  {
    id: 'mechanical',
    num: '01',
    title: 'Mechanical Royalties',
    intro: 'A mechanical royalty is paid every time your song is reproduced. Every time your song is streamed on an interactive platform like Spotify or Apple Music, downloaded from a store like iTunes, or sold on a physical product like vinyl or CD — your song has been reproduced and is due a mechanical royalty.',
    note: 'In the US, the main mechanical collection society is the Harry Fox Agency (HFA). Individual writers cannot join HFA directly and need to work with a publishing administrator — like Dwad — to register their songs and collect mechanical revenue.',
    sources: [
      'Interactive streaming (Spotify, Apple Music, YouTube, Tidal, Deezer)',
      'Digital downloads (iTunes, Amazon)',
      'Physical products — vinyl, CDs, cassettes',
      'Ringtones and ringbacks',
      'Cover versions of your songs',
      'Samples (you take a share of ownership in the new song)',
      'Karaoke recordings',
      'Greeting cards',
      'On-demand jukebox (e.g. TouchTunes)',
    ],
  },
  {
    id: 'performance',
    num: '02',
    title: 'Performance Royalties',
    intro: 'Performance royalties are generated every time your song is performed in public — on radio, television, or live. If your song plays at a gym, a restaurant, or on national radio, the songwriter earns money. These royalties are collected by a Performing Rights Organisation (PRO) such as COSON, PAMCORP, BMI or ASCAP.',
    note: 'There are 150+ different PROs around the world. Dwad works in tandem with your local PRO to maximise collection of performance royalties globally — by registering your songs directly with these organisations for faster, more accurate payments.',
    sources: [
      'Interactive streaming (Spotify, Apple Music, YouTube)',
      'Radio — AM/FM broadcasts',
      'Internet radio (BBC, global stations)',
      'Satellite radio and non-interactive streaming (Pandora, Sirius XM)',
      'TV broadcasts — shows, films, adverts',
      'Restaurants, bars, gyms',
      'Live concert venues',
      'Supermarkets and retail outlets',
      'Samples (you take a share of ownership in the new song)',
    ],
  },
  {
    id: 'print',
    num: '03',
    title: 'Print Royalties',
    intro: 'Print royalties come from the sale of printed music materials — lyrics, musical notation, guitar tablature and more. When a company prints a t-shirt with your lyrics, creates sheet music or publishes your lyrics on a streaming platform, they are required to pay a print royalty.',
    note: 'There is no government-set worldwide rate. The rate is typically a fee for a specific period and/or a percentage of the service\'s gross revenue. Dwad has experienced licensing professionals working to maximise the value of your catalogue.',
    sources: [
      'Physical and digital sheet music',
      'Lyric reprints in physical liner notes',
      'Lyric reprints digital — Spotify, MusixMatch, Instagram',
      'Guitar tablature websites',
    ],
  },
  {
    id: 'sync',
    num: '04',
    title: 'Sync Licensing',
    intro: 'Sync refers to the synchronisation of music with a moving image. Payment typically takes the form of a one-time fee granting the licensee the right to "sync" your composition with a moving image. There is no set rate — the fee is negotiated based on the type of media, how the music is used, the length of usage, and how integral the music is to the scene.',
    note: 'Micro-sync is an important revenue source from platforms like YouTube and TikTok — the mass use of music in user-generated content. Micro-sync generates both mechanical and performance royalties simultaneously.',
    sources: [
      'TV shows and TV commercials',
      'Films and film trailers',
      'TV promos',
      'Video games',
      'Mobile applications',
      'DVD / Blu-Ray',
      'YouTube and TikTok user-generated content (Micro-Sync)',
    ],
  },
];

export default function RoyaltiesPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section
        className="border-b pt-32 pb-14 px-5 sm:pt-[180px] sm:pb-20 sm:px-14"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto">
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
            ✦ Education
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(48px, 7vw, 132px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '16ch',
            }}
          >
            How music{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              royalties work.
            </span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              When you write a song, it has the potential to be streamed, downloaded, broadcast, sampled, performed live and more — globally. That's a lot of revenue to track. Here's a breakdown of every royalty type your music can earn.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/publishing')}
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Register with Dwad Publishing<Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ The big picture</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Every cent<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>you're owed.</span>
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300 }}>
                The more people that hear your music, the more money it makes — and the harder it becomes to track. Dwad ensures your songs are registered globally so every single cent owed to you is collected.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Talk to our team<Arrow />
                </a>
              </div>
            </div>

            {/* Quick-nav index */}
            <div className="flex flex-col border-t" style={{ borderColor: 'var(--color-line)' }}>
              {royaltyTypes.map(r => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  className="flex items-center gap-6 border-b py-6 transition-colors duration-250 hover:text-[var(--color-gold)]"
                  style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink)', textDecoration: 'none' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em', minWidth: '28px' }}>{r.num}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 400 }}>{r.title}</span>
                  <span className="ml-auto"><Arrow /></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROYALTY SECTIONS ── */}
      {royaltyTypes.map((r, i) => (
        <section
          key={r.id}
          id={r.id}
          className="py-16 sm:py-[120px] px-5 sm:px-14 border-t"
          style={{ borderColor: 'var(--color-line)' }}
        >
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center gap-6 mb-10">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
                {r.num}
              </span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
            </div>

            <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                  {r.title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
                    {r.title.split(' ').slice(-1)[0]}
                  </span>
                </h2>
                <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300 }}>
                  {r.intro}
                </p>
                {r.note && (
                  <div
                    className="mt-8 border-l-2 pl-5"
                    style={{ borderColor: 'var(--color-gold)' }}
                  >
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      {r.note}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}>
                  Revenue sources
                </div>
                <ul className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
                  {r.sources.map((src, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-4"
                      style={{ background: 'var(--color-bg)', padding: '16px', fontSize: '14px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}
                    >
                      <span style={{ color: 'var(--color-gold)', flexShrink: 0, fontSize: '10px' }}>✦</span>
                      {src}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ── BOTTOM CTA ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Start collecting
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              Let Dwad collect{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>every royalty you're owed.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              From mechanical to sync, performance to print — Dwad Publishing handles the global registration and collection so you never leave money on the table.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/publishing')}
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Go to Publishing<Arrow />
              </button>
              <button
                onClick={() => navigate('/distro')}
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                See Distribution<Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Ticker items={['Mechanical Royalties', 'Performance Royalties', 'Print Royalties', 'Sync Licensing', 'Micro-Sync', 'Publishing Admin']} />
    </div>
  );
}
