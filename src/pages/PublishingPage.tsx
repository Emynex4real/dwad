import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';

const steps = [
  {
    num: '01',
    title: 'Simple setup',
    desc: 'Register in minutes and reduce the time you spend on administration. Get started with a quick onboarding process designed for independent artists.',
  },
  {
    num: '02',
    title: 'Efficient royalties',
    desc: 'Let us handle licensing with major digital service providers and collection societies covering more than 95% of income-generating territories worldwide.',
  },
  {
    num: '03',
    title: 'Transparent accounting',
    desc: 'View detailed, easy-to-understand royalty statements. Know exactly what you\'re earning, where it\'s coming from, and when it lands.',
  },
];

const comparison = [
  {
    label: 'Traditional Publisher',
    points: [
      'Takes a cut of your copyright',
      'Looks for guaranteed major hits only',
      'You give up ownership of your songs',
      'Slow and opaque accounting',
    ],
    highlight: false,
  },
  {
    label: 'Dwad Publishing',
    points: [
      'You keep 100% of your copyright ownership',
      'Open to artists at every stage',
      'Full control over your catalogue',
      'Real-time, transparent statements',
    ],
    highlight: true,
  },
];

export default function PublishingPage() {
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
            ✦ Music Publishing
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
            Get your{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              publishing royalties.
            </span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Dwad Music Publishing empowers songwriters, artists and labels of all levels to earn from their publishings.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Set up your publishing<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ How It Works</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Three steps.<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Full ownership.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Getting your publishing registered and collecting royalties shouldn't be complicated. Here's how we make it simple.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 min-[800px]:grid-cols-3">
            {steps.map(s => (
              <div
                key={s.num}
                className="border flex flex-col justify-between relative"
                style={{ padding: '40px', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)', minHeight: '280px' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-gold-2)',
                    fontSize: '56px',
                    lineHeight: 1,
                    fontWeight: 300,
                  }}
                >
                  {s.num}
                </div>
                <div>
                  <h4 className="mt-6" style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 400 }}>{s.title}</h4>
                  <p className="mt-3" style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GET BACK TO MAKING MUSIC ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ For Creators
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              Get back to{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>making music.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '620px' }}>
              New writers, Grammy-winning artists, bands, producers. Dwad Publishing empowers creators of all kinds to take complete ownership of their publishing royalties. Our streamlined, self-service platform helps you save time, lower administration costs, and maximise your return — so you can focus on what you do best.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Register as a songwriter<Arrow />
              </a>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                Talk to us<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DWAD VS TRADITIONAL ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Why Dwad Publishing</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Collecting without giving up{' '}
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>copyright.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Traditional publishers want ownership of your songs. Dwad gives you the flexibility to access everything you're earning and make decisions about your career from an informed, empowered place.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 min-[700px]:grid-cols-2">
            {comparison.map(col => (
              <div
                key={col.label}
                className="border flex flex-col"
                style={{
                  padding: '40px 32px',
                  borderColor: col.highlight ? 'var(--color-gold)' : 'var(--color-line)',
                  background: col.highlight ? 'var(--color-bg-2)' : 'transparent',
                }}
              >
                {col.highlight && (
                  <div
                    className="self-start mb-4"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-bg)', background: 'var(--color-gold)', padding: '4px 10px' }}
                  >
                    Recommended
                  </div>
                )}
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: col.highlight ? 'var(--color-gold)' : 'var(--color-muted)', marginBottom: '24px' }}>
                  {col.label}
                </div>
                <ul className="flex flex-col gap-4 flex-1">
                  {col.points.map(pt => (
                    <li key={pt} className="flex items-start gap-3" style={{ fontSize: '15px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                      <span style={{ color: col.highlight ? 'var(--color-gold)' : 'var(--color-muted)', marginTop: '2px', flexShrink: 0 }}>
                        {col.highlight ? '✦' : '–'}
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROYALTIES TEASER ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-10 sm:gap-20 items-center grid-cols-1 min-[900px]:grid-cols-2 py-12 sm:py-24 px-6 sm:px-14"
            style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Education</div>
              <h2
                className="mt-4"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1 }}
              >
                How music<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>royalties work.</span>
              </h2>
            </div>
            <div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
                Mechanical, performance, print, sync — understand every royalty type your music can earn and how Dwad Publishing collects them all on your behalf worldwide.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/royalties')}
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Learn how royalties work<Arrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
