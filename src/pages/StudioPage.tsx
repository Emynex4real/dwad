import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import PageHero from '../components/ui/PageHero';
import SEO from '../components/ui/SEO';
import { studioMain, HOF_ARTISTS } from '../data';
import { getAllProductions } from '../services/productions.service';
import { API_BASE_URL } from '../services/httpClient';
import type { Production } from '../types/content';

const studioJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Music Production — Recording, Mixing & Mastering',
  serviceType: 'Music Production',
  provider: { '@type': 'Organization', name: 'Dwad Music', url: 'https://dwadmusic.com' },
  description: 'Professional beats, recording, mixing and mastering. Industry-standard production delivering distribution-ready masters.',
  areaServed: 'Worldwide',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '150',
    highPrice: '1000',
  },
};

const whyPoints = [
  {
    title: 'Great Quality',
    desc: 'Get amazing music production quality here. Industry standard is guaranteed on every project we work on.',
  },
  {
    title: 'Professional Post Production',
    desc: 'We have professional mixing engineers ready to enhance the quality of your music to the highest level.',
  },
  {
    title: 'Free Bonuses',
    desc: 'Get free radio promotions, free music distribution account set up, free cover arts and many more bonus included.',
  },
];

const services = [
  { idx: '01', title: 'Beat', italic: 'production', meta: 'Custom & lease options' },
  { idx: '02', title: 'Vocal', italic: 'recording', meta: 'Engineer included' },
  { idx: '03', title: 'Mixing &', italic: 'mastering', meta: 'Detailed & industry-standard' },
  { idx: '04', title: 'Live Instruments', italic: '(Sax, Guitar, Violin)', meta: 'In-studio session' },
  { idx: '05', title: 'Full', italic: 'release package', meta: 'Custom · Talk to us' },
];

const packages = [
  {
    tier: 'Package 1',
    price: '$150',
    studio: null,
    items: [
      'Beat lease',
      'Recording',
      'Detailed Mixing & Mastering',
      'Live Instruments (Sax, Guitar, Violin…)',
      'Free distribution to streaming platforms',
    ],
    featured: false,
    note: null,
  },
  {
    tier: 'Package 2',
    price: '$300',
    studio: null,
    items: [
      'Beat lease',
      'Recording',
      'Detailed Mixing & Mastering',
      'Live Instruments (Sax, Guitar, Violin…)',
      'Post production enhancements',
      'Free cover art graphics',
      'Free distribution to streaming platforms',
      'Free Radio promotion',
    ],
    featured: true,
    note: null,
  },
  {
    tier: 'Package 3',
    price: '$500',
    studio: null,
    items: [
      'Personal Beat',
      'Recording',
      'Live Instruments (Sax, Guitar, Violin…)',
      'Detailed Mixing & Mastering',
      'Post production enhancements',
      'Free cover art graphics',
      'Free distribution to streaming platforms',
      'Free Radio promotion',
      'Free video performance content',
      'Free social media promotion',
    ],
    featured: false,
    note: null,
  },
  {
    tier: 'Package 4',
    price: '$1,000',
    studio: null,
    items: [
      'Personal Beat',
      'Beat lease',
      'Detailed Mixing & Mastering',
      'Live Instruments (Sax, Guitar, Violin…)',
      'Post production enhancements',
      'Free cover art graphics',
      'Free distribution to streaming platforms',
      'Free Radio promotion',
      'Free viral video',
      'Free social media promotion',
    ],
    featured: false,
    note: null,
  },
];

const terms = [
  {
    num: '01',
    title: 'Split Sheet',
    desc: 'Split sheets & beat licenses must be filled for all songs we produce for you.',
  },
  {
    num: '02',
    title: 'Clearance',
    desc: 'Songs must be cleared before you release.',
  },
];

export default function StudioPage() {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(-1);
  const [productions, setProductions] = useState<Production[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    void getAllProductions().then(setProductions);
  }, []);

  const recentProjects = productions.filter((p) => p.coverArtUrl).slice(-4).reverse();

  const handleTrackClick = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeIdx === idx) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
    } else {
      const audioFileUrl = productions[idx].audioFileUrl;
      if (!audioFileUrl) return;
      audio.src = `${API_BASE_URL}/storage/${audioFileUrl}`;
      setActiveIdx(idx);
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="page-enter">
      <SEO
        title="Music Production — Recording, Mixing & Mastering | Dwad Music"
        description="Professional beats, recording, mixing and mastering. Our in-house studio team delivers distribution-ready masters — then ships them worldwide the same day."
        canonical="/studio"
        jsonLd={studioJsonLd}
      />
      <PageHero
        crumb=""
        title="Music"
        italic="Production."
        lede="Beats, recording, mixing and mastering. Our in-house production team takes a record from idea to finished master — and ships it to streaming the same day if you need."
      />

      {/* ── WHY WORK WITH US ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Why work with us
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-6 grid-cols-1 min-[800px]:grid-cols-3">
            {whyPoints.map(p => (
              <div
                key={p.title}
                className="border flex flex-col"
                style={{ padding: '40px 32px', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
              >
                <span style={{ color: 'var(--color-gold)', fontSize: '20px', marginBottom: '20px' }}>✦</span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 400, lineHeight: 1.1 }}>{p.title}</h4>
                <p className="mt-3" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO-COL STUDIO ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ The studio</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                A studio for<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>finished</span> records.
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                We don't just track vocals. The Dwad studio is set up to deliver mastered, distribution-ready records — including artwork, metadata and a release plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Book a session<Arrow />
                </a>
                <button
                  className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                  onClick={() => navigate('/distro')}
                >
                  See distribution<Arrow />
                </button>
              </div>
            </div>
            <div>
              <div className="relative overflow-hidden border" style={{ aspectRatio: '4/5', borderColor: 'var(--color-line)' }}>
                <img src={studioMain} alt="Dwad studio mixing console" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '40px' }}>
            ✦ How It Works
          </div>
          <div className="flex flex-col border-t" style={{ borderColor: 'var(--color-line)' }}>
            {[
              { num: '01', text: 'Purchase beats from our beat store.' },
              { num: '02', text: 'Record vocals in our studio or any studio around you.' },
              { num: '03', text: 'Let our trained engineers handle the mixing and mastering.' },
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

      {/* ── BEAT STORE ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-10 sm:gap-20 items-center grid-cols-1 min-[900px]:grid-cols-2 py-12 sm:py-24 px-6 sm:px-14"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-gold)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Beat Store</div>
              <h2 className="mt-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1 }}>
                Browse our<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>beat catalogue.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
                Hundreds of original instrumentals available for lease and purchase — Afrobeats, Afro Soul, Pop, Hip Hop and more. Find your sound, get cleared, and release.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {['All beats available for lease & purchase', 'Custom beats on request', 'Instant clearance on purchase'].map(pt => (
                  <li key={pt} className="flex items-center gap-3" style={{ fontSize: '14px', color: 'var(--color-ink-2)' }}>
                    <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>✦</span>{pt}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  to="/beats"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-gold-2"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Browse Beat Store<Arrow />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Capabilities</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                What we<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>make.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Pick a service à la carte, or hand us the whole project. Either way, you walk out with masters that hit on every platform.
            </p>
          </div>
          <ul className="list-none m-0">
            {services.map(s => (
              <li
                key={s.idx}
                className="linklist-item py-6 sm:py-7 border-b cursor-pointer transition-all duration-250"
                style={{ borderColor: 'var(--color-line)' }}
              >
                <div className="flex items-start gap-4 sm:hidden">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.2em', minWidth: '28px', paddingTop: '6px' }}>{s.idx}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 5vw, 40px)', fontWeight: 400 }}>
                      {s.title} <span className="italic" style={{ color: 'var(--color-gold-2)' }}>{s.italic}</span>
                    </div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.meta}</div>
                  </div>
                </div>
                <div className="hidden sm:grid gap-6 items-center" style={{ gridTemplateColumns: '70px 1fr auto' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)', letterSpacing: '0.2em' }}>{s.idx}</span>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400 }}>
                    {s.title} <span className="italic" style={{ color: 'var(--color-gold-2)' }}>{s.italic}</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.meta}</span>
                </div>
              </li>
            ))}
          </ul>
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
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>package.</span>
          </h2>

          {/* Main packages grid */}
          <div className="grid gap-6 grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
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
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{pkg.tier}</div>
                <div className="mt-3 mb-8" style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 400, color: 'var(--color-ink)' }}>{pkg.price}</div>
                {pkg.studio && (
                  <div className="mb-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>{pkg.studio}</div>
                )}
                <ul className="flex flex-col gap-3 flex-1 mb-10">
                  {pkg.items.map(item => (
                    <li key={item} className="flex items-start gap-3" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
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

      {/* ── LISTEN TO MY WORKS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Listen to our works</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Songs we<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>produce.</span>
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300 }}>
                Listen to some songs recently produced here. Send a message and let's work on your next hit.
              </p>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Contact us today<Arrow />
              </a>
            </div>
            <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
              {productions.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => handleTrackClick(i)}
                  className="flex items-center gap-4 sm:gap-6 cursor-pointer transition-all duration-150 active:scale-[1.02]"
                  style={{
                    background: activeIdx === i ? 'var(--color-bg-2)' : 'var(--color-bg)',
                    padding: '16px',
                    borderLeft: `2px solid ${activeIdx === i ? 'var(--color-gold)' : 'transparent'}`,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: activeIdx === i ? 'var(--color-gold)' : 'var(--color-muted)', minWidth: '28px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.2 }}>{p.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--color-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{p.artistName}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activeIdx === i && isPlaying ? 'var(--color-gold)' : 'var(--color-muted)', flexShrink: 0 }}>
                    {activeIdx === i && isPlaying ? '⏸' : '▶'}
                  </span>
                </div>
              ))}
              {productions.length === 0 && (
                <p style={{ padding: '16px', fontSize: '13px', color: 'var(--color-muted)' }}>No songs added yet.</p>
              )}
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
          </div>
        </div>
      </section>

      {/* ── RECENT PROJECTS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Recent Projects</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-6 grid-cols-2 min-[700px]:grid-cols-4">
            {recentProjects.map((p) => {
              const content = (
                <>
                  <div
                    className="relative overflow-hidden border"
                    style={{ aspectRatio: '1/1', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
                  >
                    <img
                      src={`${API_BASE_URL}/storage/${p.coverArtUrl}`}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="pt-4">
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '20px' }}>{p.title}</h4>
                    <div className="mt-1" style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{p.artistName}</div>
                  </div>
                </>
              );
              return p.spotifyUrl ? (
                <a key={p.id} href={p.spotifyUrl} target="_blank" rel="noreferrer" className="group block">{content}</a>
              ) : (
                <div key={p.id} className="group block">{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STUDIO LOCATIONS ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-10 sm:gap-20 items-center grid-cols-1 min-[900px]:grid-cols-2 py-12 sm:py-24 px-6 sm:px-14"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Studio Location</div>
              <h2
                className="mt-4"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1 }}
              >
                Available<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>worldwide.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
                Once you're ready we get you a studio close to you wherever you're located worldwide and our producers and engineers handle the rest.
              </p>
              <div className="mt-8">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Book a session<Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TERMS ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>
            ✦ Very Important
          </div>
          <h2
            className="mb-14"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(32px, 4vw, 64px)', lineHeight: 1, letterSpacing: '-0.015em' }}
          >
            Kindly take note of<br />
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>the below.</span>
          </h2>
          <div className="grid gap-6 grid-cols-1 min-[700px]:grid-cols-2">
            {terms.map(t => (
              <div
                key={t.num}
                className="border flex flex-col gap-4"
                style={{ padding: '40px 32px', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
              >
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', fontStyle: 'italic', color: 'var(--color-gold-2)', fontWeight: 300, lineHeight: 1 }}>{t.num}</span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 400 }}>{t.title}</h4>
                <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)' }}>{t.desc}</p>
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
              Production<br />
              + <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>distribution</span><br />
              + <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>promotion.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
              Get your record made, distributed to 200+ platforms, and promoted via radio and sponsored ads — all under one roof with Dwad.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Get the bundle<Arrow />
              </a>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                Talk to a rep<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RADIO AIRPLAY CARD ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-10 sm:gap-20 items-center grid-cols-1 min-[900px]:grid-cols-2 py-12 sm:py-24 px-6 sm:px-14"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-gold)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Free For Artists</div>
              <h2 className="mt-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1 }}>
                Free Radio<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Airplay.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
                Package 2, 3 and 4 include free radio promotion. Get your music on radio at no extra charge.
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

    </div>
  );
}
