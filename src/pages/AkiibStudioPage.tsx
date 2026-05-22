import Arrow from '../components/ui/Arrow';
import { studioMain } from '../data';
import akiibPhoto from '../assets/artists/akiib.jpg';
import youngzyPhoto from '../assets/artists/youngzy.jpg';

const packages = [
  {
    tier: 'Promo',
    price: '₦50,000',
    studio: 'Ikorodu Studio',
    items: [
      'Beat lease',
      'Recording, Mixing & Mastering',
    ],
    featured: false,
    note: 'Terms & conditions apply',
  },
  {
    tier: 'Package 1',
    price: '₦200,000',
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
    price: '₦300,000',
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
    price: '₦500,000',
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
    price: '₦1,000,000',
    studio: 'Ajah & Egbeda Studios',
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

const tracklist = [
  { num: '01', title: 'All for the Money', artist: 'Youngzy' },
  { num: '02', title: 'Maro', artist: 'Badess Kid' },
  { num: '03', title: 'Gallivant', artist: 'Youngzy' },
  { num: '04', title: 'Addicted', artist: 'Akiib' },
  { num: '05', title: 'Questions', artist: 'Skiitz x Miraji' },
  { num: '06', title: 'Ayo', artist: 'Yemi Ekun' },
  { num: '07', title: 'Green Light', artist: 'Zephyr' },
  { num: '08', title: 'On Guard', artist: 'Nonny Gee' },
  { num: '09', title: 'Omo Oloja', artist: 'Akiib' },
  { num: '10', title: 'Gbese', artist: 'Blazebankz' },
  { num: '11', title: 'Who is Akiib (Intro)', artist: 'Akiib' },
  { num: '12', title: 'Uselu Roundabout', artist: 'Youngzy' },
  { num: '13', title: 'Fame', artist: 'Badboi Yemi' },
  { num: '14', title: 'Hallelujah', artist: 'Junbho' },
  { num: '15', title: 'My Life (Master)', artist: 'J Smalling' },
  { num: '16', title: 'Why', artist: 'Kenk C' },
  { num: '17', title: 'Disrespect', artist: 'Spice' },
];

const recentProjects = [
  { title: 'Formula', artist: 'Tuneboi Col ft. Favour Tkb', photo: null },
  { title: 'Hallelujah', artist: 'Junbho', photo: null },
  { title: 'Baby', artist: 'Youngzy', photo: youngzyPhoto },
  { title: 'Addicted', artist: 'Akiib', photo: akiibPhoto },
];

const terms = [
  {
    num: '01',
    title: 'Split Sheet',
    desc: 'Split sheets & beat licenses must be filled for all songs I produce for you.',
  },
  {
    num: '02',
    title: 'Clearance',
    desc: 'Songs must be cleared before you release.',
  },
];

export default function AkiibStudioPage() {
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
            ✦ Akiib Studio
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
            Music{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              Production.
            </span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Beats, recording, mixing and mastering. Our in-house production team takes a record from idea to finished master — and ships it to streaming the same day if you need.
            </p>
            <div className="flex flex-wrap gap-3">
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
      </section>

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
            {[
              { title: 'Great Quality', desc: 'Get amazing music production quality here. Industry standard is guaranteed on every project we work on.' },
              { title: 'Professional Post Production', desc: 'We have professional mixing engineers ready to enhance the quality of your music to the highest level.' },
              { title: 'Free Bonuses', desc: 'Get free cover art graphics, free music distribution account setup and many more bonuses included.' },
            ].map(p => (
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

      {/* ── THE STUDIO ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ The studio</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                A studio for<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>finished</span> records.
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                We don't just track vocals. The studio is set up to deliver mastered, distribution-ready records — including artwork, metadata and a release plan.
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
            <div>
              <div className="relative overflow-hidden border" style={{ aspectRatio: '4/5', borderColor: 'var(--color-line)' }}>
                <img src={studioMain} alt="Studio mixing console" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>
            ✦ Packages
          </div>
          <h2 className="mb-14" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
            Pick your<br />
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>package.</span>
          </h2>

          {/* Promo banner */}
          <div
            className="border mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ padding: '28px 32px', borderColor: 'var(--color-gold)', background: 'var(--color-bg-2)' }}
          >
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-bg)', background: 'var(--color-gold)', padding: '4px 10px' }}>PROMO !!!</span>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Ikorodu Studio · Terms &amp; conditions apply</div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 400, color: 'var(--color-ink)' }}>₦50,000</div>
              <div style={{ fontSize: '13px', color: 'var(--color-muted)', lineHeight: 1.5 }}>Beat lease · Recording · Mixing &amp; Mastering</div>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 24px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Get started<Arrow />
              </a>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
            {packages.slice(1).map(pkg => (
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Listen to my works</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Songs I've<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>produced.</span>
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
              {tracklist.map(t => (
                <div
                  key={t.num}
                  className="flex items-center gap-4 sm:gap-6"
                  style={{ background: 'var(--color-bg)', padding: '16px' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>{t.num}</span>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.2 }}>{t.title}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--color-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{t.artist}</div>
                  </div>
                </div>
              ))}
            </div>
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
            {recentProjects.map((p, i) => (
              <div key={i} className="group">
                <div
                  className="relative overflow-hidden border"
                  style={{ aspectRatio: '1/1', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}
                >
                  {p.photo ? (
                    <img src={p.photo} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(40px, 6vw, 72px)', color: 'var(--color-gold)', fontWeight: 300, fontStyle: 'italic' }}>
                        {p.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '20px' }}>{p.title}</h4>
                  <div className="mt-1" style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{p.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDIO LOCATION ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-10 sm:gap-20 items-center grid-cols-1 min-[900px]:grid-cols-2 py-12 sm:py-24 px-6 sm:px-14"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Studio Location</div>
              <h2 className="mt-4" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1 }}>
                Ajah, Egbeda<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>&amp; Ikorodu.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
                Studios located in Ajah, Egbeda and Ikorodu, Lagos, Nigeria. Come in and let's make something great together.
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
          <h2 className="mb-14" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(32px, 4vw, 64px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
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

    </div>
  );
}
