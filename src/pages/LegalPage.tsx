import Arrow from '../components/ui/Arrow';

const documents = [
  {
    id: 'master',
    num: '01',
    title: 'Master Split Sheet',
    desc: 'Sign a split sheet for Masters royalty sharing for Artists and Music Producers.',
    detail: 'Defines ownership percentages of the master recording — the actual sound file — between all contributing parties. Required before distribution.',
    href: '#',
  },
  {
    id: 'publishing',
    num: '02',
    title: 'Publishing Split Sheet',
    desc: 'Sign a split sheet for Publishing royalty sharing for Artists and Music Producers.',
    detail: 'Defines ownership percentages of the underlying composition — melody and lyrics — between all songwriters and producers. Required for publishing registration.',
    href: '#',
  },
];

export default function LegalPage() {
  return (
    <div className="page-enter">

      {/* ── HEADER ── */}
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
            ✦ Dwad Music Legal Department
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(48px, 7vw, 120px)',
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
              maxWidth: '14ch',
            }}
          >
            Split Sheet{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              Agreements.
            </span>
          </h1>
          <p
            className="mt-8"
            style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '560px',
            }}
          >
            Before your music is distributed or registered, all contributing parties must agree on ownership splits. Select the agreement type below to proceed.
          </p>
        </div>
      </section>

      {/* ── DOCUMENTS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 grid-cols-1 min-[820px]:grid-cols-2">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="border flex flex-col"
                style={{
                  padding: 'clamp(32px, 4vw, 60px)',
                  borderColor: 'var(--color-line)',
                  background: 'var(--color-bg-2)',
                  minHeight: '360px',
                }}
              >
                <div className="flex items-center justify-between mb-10">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gold)',
                    }}
                  >
                    {doc.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                    }}
                  >
                    Legal Document
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 400,
                    fontSize: 'clamp(32px, 3.5vw, 56px)',
                    lineHeight: 1,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {doc.title.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
                    {doc.title.split(' ').slice(-1)[0]}
                  </span>
                </h2>

                <p
                  className="mt-5 flex-1"
                  style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300 }}
                >
                  {doc.desc}
                </p>

                <p
                  className="mt-4"
                  style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-muted)', fontStyle: 'italic' }}
                >
                  {doc.detail}
                </p>

                <div className="mt-10">
                  <a
                    href={doc.href}
                    className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      padding: '16px 28px',
                      background: 'var(--color-gold)',
                      color: 'var(--color-bg)',
                    }}
                  >
                    Sign Agreement<Arrow />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTICE ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="border-l-2 pl-6"
            style={{ borderColor: 'var(--color-gold)' }}
          >
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--color-muted)', fontStyle: 'italic', maxWidth: '680px' }}>
              All split sheet agreements are legally binding documents. Ensure all contributing parties review and agree to the stated ownership percentages before signing. Dwad Music acts as administrator only and does not determine ownership splits.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        className="py-12 sm:py-20 px-5 sm:px-14 border-t"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto flex flex-col min-[600px]:flex-row items-start min-[600px]:items-center justify-between gap-6">
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '10px',
              }}
            >
              ✦ Questions
            </div>
            <p style={{ fontSize: '17px', color: 'var(--color-ink-2)', fontWeight: 300 }}>
              Need help with a split sheet or have a legal query?
            </p>
          </div>
          <a
            href="mailto:Contact@Dwadmusic.com"
            className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)] flex-shrink-0"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.15em',
              color: 'var(--color-ink)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Contact@Dwadmusic.com<Arrow />
          </a>
        </div>
      </section>

    </div>
  );
}
