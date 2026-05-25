import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import Ticker from '../components/ui/Ticker';

interface RoyaltyType {
  id: string;
  num: string;
  title: string;
  intro: string;
  rates?: string[];
  extraParagraphs?: string[];
  note: string;
  sources?: string[];
  generates?: string[];
}

const royaltyTypes: RoyaltyType[] = [
  {
    id: 'mechanical',
    num: '01',
    title: 'Mechanical Royalties',
    intro: 'Mechanical royalties are generated every time your song is reproduced. Whenever your song is streamed on an interactive streaming platform like Spotify, Apple Music, or YouTube, downloaded from stores like iTunes or Amazon, or sold physically on vinyl records or CDs, your composition has been reproduced and is eligible for a mechanical royalty payment.',
    rates: [
      'For physical products and permanent digital downloads, the current rate is $0.091 (9.1 cents) per song, per unit for songs under 5 minutes, with an additional 0.0175 cents for each extra minute.',
      'For ringtones, the rate is 0.24 cents.',
      'For interactive streaming, the rate varies depending on the platform and subscription type.',
    ],
    extraParagraphs: [
      'For example, royalties generated from streams on Spotify may differ depending on whether the listener uses a Premium or ad-supported account. On Apple Music, rates may vary between student, family, and individual plans.',
      'This payment formula is generally based on a percentage of the streaming platform\'s revenue minus the performance royalty, which is paid separately through a songwriter\'s performing rights organization (PRO).',
    ],
    note: 'In the United States, the main mechanical collection society is the Harry Fox Agency (HFA). Individual songwriters cannot register directly with HFA and usually need a publishing administrator to handle registrations and royalty collections. That\'s where Dwad Music comes in — we help manage and administer these registrations globally so creators can focus on making music while we focus on collecting every possible royalty.',
    sources: [
      'Interactive streaming (Spotify, Apple Music, YouTube, Tidal, Deezer, etc.)',
      'Digital downloads (iTunes, Amazon)',
      'Physical products such as vinyl, CDs, and cassettes',
      'Ringtones and ringbacks from telecom providers',
      'Cover versions of your songs',
      'Samples (when another artist samples your music)',
      'Karaoke recordings',
      'Greeting cards',
      'On-demand jukebox services such as TouchTunes',
    ],
  },
  {
    id: 'performance',
    num: '02',
    title: 'Performance Royalties',
    intro: 'Performance royalties are earned whenever your song is performed publicly. The scope of public performance royalties is broad and includes radio, television, live performances, and public spaces. Whether your music is played at a concert, broadcast on radio, heard in a restaurant, used in a gym, or featured in the background of a television show, performance royalties are generated for the songwriter and publisher.',
    extraParagraphs: [
      'These royalties are collected by Performing Rights Organizations (PROs) such as BMI and ASCAP. PROs issue blanket licenses to businesses and broadcasters, allowing them access to the PRO\'s music catalog. They then monitor song usage and distribute royalties to the rightful songwriters and rights holders.',
    ],
    note: 'There are more than 150 PROs worldwide. Dwad Music works closely with local and international PROs to maximize global royalty collection. By directly registering your songs with multiple rights organizations, we help ensure faster, more accurate international royalty payments.',
    sources: [
      'Interactive streaming platforms (Spotify, Apple Music, YouTube, Tidal, Deezer, etc.)',
      'AM/FM radio broadcasts',
      'Internet radio stations such as BBC, KEXP, and KCRW',
      'Satellite radio and non-interactive streaming services like Pandora and SiriusXM',
      'Television broadcasts',
      'Restaurants',
      'Bars and lounges',
      'Gyms and fitness centers',
      'Live concert venues',
      'Supermarkets',
      'Retail stores',
      'Small businesses',
      'Samples and derivative works',
    ],
  },
  {
    id: 'print',
    num: '03',
    title: 'Print Royalties',
    intro: 'Print royalties are earned from the sale and licensing of printed music materials. This includes lyrics, musical notation, sheet music, and tablature. Companies that publish sheet music or reproduce lyrics commercially are required to pay print royalties to the rights holders.',
    extraParagraphs: [
      'Unlike mechanical royalties, there is no fixed global government rate for print royalties. Payments are usually negotiated based on licensing agreements, subscription models, advertising revenue, or sales percentages.',
    ],
    note: 'At Dwad Music, our experienced licensing team works to maximize the value of your catalog through strategic print licensing opportunities worldwide.',
    sources: [
      'Physical and digital sheet music',
      'Lyric reprints in album liner notes',
      'Digital lyric displays on Spotify, MusixMatch, Instagram, and other platforms',
      'Guitar tablature',
      'Music educational materials',
    ],
  },
  {
    id: 'sync',
    num: '04',
    title: 'Sync Licensing',
    intro: 'Synchronization licensing, commonly called "sync," refers to the use of music alongside moving visual content. A sync license grants permission for a composition to be synchronized with films, television shows, advertisements, games, and other visual media. Unlike ongoing royalties, sync deals are usually negotiated as one-time payments.',
    extraParagraphs: [
      'There is no fixed rate for sync licensing. Fees are negotiated based on several factors: the type of media, how the song is used, the length of the music used, how important the song is to the scene, and whether the song is also used in trailers, advertisements, or promotional campaigns.',
    ],
    note: 'The experienced sync team at Dwad Music negotiates these deals on behalf of creators to ensure the maximum value is secured for every opportunity.',
    sources: [
      'TV shows',
      'TV commercials',
      'Films',
      'Film trailers',
      'TV promos',
      'Video games',
      'Mobile applications',
      'DVD and Blu-ray releases',
    ],
  },
  {
    id: 'microsync',
    num: '05',
    title: 'Micro-Sync Royalties',
    intro: 'Micro-sync has become one of the fastest-growing music revenue streams in the digital era. Platforms like TikTok and YouTube allow millions of users to synchronize music with user-generated content daily, creating a large-scale version of traditional sync licensing.',
    extraParagraphs: [
      'Micro-sync royalties are generated whenever your music is used in videos uploaded by users on these platforms. Crucially, these uses can also simultaneously generate both mechanical royalties and performance royalties — making micro-sync an essential income source for modern artists and songwriters.',
    ],
    note: 'At Dwad Music, we ensure your catalog is positioned globally to capture these opportunities and maximize every revenue stream connected to your music.',
    generates: ['Mechanical Royalties', 'Performance Royalties'],
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
              When you write a song, it has the potential to be streamed, downloaded, printed, sampled, broadcast, and performed live across the world — generating income from countless sources globally. The more people who hear your music, the more revenue it can generate, but also the harder it becomes to properly monitor and collect every payment owed to you.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/publishing')}
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Set up today<Arrow />
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
                At Dwad Music, we make sure your songs are properly registered worldwide so that every royalty generated from your music is identified, tracked, and collected efficiently. Our global infrastructure helps maximize your earnings while giving you complete peace of mind.
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
      {royaltyTypes.map((r) => (
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

                {r.rates && (
                  <ul className="mt-6 flex flex-col gap-3">
                    {r.rates.map((rate, i) => (
                      <li key={i} className="flex items-start gap-3" style={{ fontSize: '15px', color: 'var(--color-ink-2)', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '5px', fontSize: '9px' }}>✦</span>
                        {rate}
                      </li>
                    ))}
                  </ul>
                )}

                {r.extraParagraphs?.map((para, i) => (
                  <p key={i} className="mt-5" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300 }}>
                    {para}
                  </p>
                ))}

                <div
                  className="mt-8 border-l-2 pl-5"
                  style={{ borderColor: 'var(--color-gold)' }}
                >
                  <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                    {r.note}
                  </p>
                </div>
              </div>

              <div>
                {r.sources && (
                  <>
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
                  </>
                )}

                {r.generates && (
                  <>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '20px' }}>
                      Also generates
                    </div>
                    <ul className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
                      {r.generates.map((g, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-4"
                          style={{ background: 'var(--color-bg)', padding: '20px 16px', fontSize: '15px', color: 'var(--color-ink)', lineHeight: 1.5, fontFamily: 'var(--font-serif)' }}
                        >
                          <span style={{ color: 'var(--color-gold)', flexShrink: 0, fontSize: '10px' }}>✦</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6" style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                      Micro-sync is unique — a single use on a platform like TikTok or YouTube simultaneously triggers both royalty types, making it one of the most valuable passive income streams for modern artists.
                    </p>
                  </>
                )}
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
              ✦ Earn Royalties
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              Earn{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>royalties.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Maximize your music earning. Dwad Music handles the global collection so you can focus on what matters.
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
