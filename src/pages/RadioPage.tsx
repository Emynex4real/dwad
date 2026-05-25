import Arrow from '../components/ui/Arrow';

const eligibility = [
  {
    icon: '01',
    title: 'Premium Distribution Plan',
    desc: 'Artists on the Dwad premium distribution plan automatically qualify for free radio airplay as part of their package.',
  },
  {
    icon: '02',
    title: 'Selected Production Packages',
    desc: 'Artists on Package 2, Package 3 and Package 4 of the Dwad production plan receive free radio promotion included.',
  },
  {
    icon: '03',
    title: 'Custom Promotions',
    desc: 'Even if you\'re not on a qualifying plan, you can always reach out to add radio promotion to your release campaign.',
  },
];

const steps = [
  { num: '01', title: 'Release your music', desc: 'Distribute your music through Dwad or book a production session on a qualifying package.' },
  { num: '02', title: 'We submit to radio', desc: 'Our team submits your track to our network of radio stations and online stations for airplay.' },
  { num: '03', title: 'Your music reaches listeners', desc: 'Your music is heard on radio — building awareness, growing your fanbase and boosting streams.' },
];

export default function RadioPage() {
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
            ✦ Free For Artists
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
            Free Radio{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              Airplay.
            </span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Get your music on radio — free. Available to artists on the premium distribution plan and selected production packages.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Get free radio plays<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO QUALIFIES ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Who Qualifies</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Is your music<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>eligible?</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Radio airplay is included free with qualifying Dwad plans. Here's how to know if you're covered.
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 min-[800px]:grid-cols-3">
            {eligibility.map(e => (
              <div
                key={e.icon}
                className="border flex flex-col"
                style={{ padding: '40px 32px', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)', minHeight: '260px' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-gold-2)',
                    fontSize: '56px',
                    lineHeight: 1,
                    fontWeight: 300,
                    marginBottom: '24px',
                  }}
                >
                  {e.icon}
                </div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 400, marginBottom: '12px' }}>{e.title}</h4>
                <p style={{ color: 'var(--color-muted)', fontSize: '14px', lineHeight: 1.6 }}>{e.desc}</p>
              </div>
            ))}
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
            {steps.map(s => (
              <div
                key={s.num}
                className="flex items-start gap-8 border-b py-10"
                style={{ borderColor: 'var(--color-line)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-gold)', letterSpacing: '0.2em', minWidth: '32px', paddingTop: '4px' }}>
                  {s.num}
                </span>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 400, lineHeight: 1.2, color: 'var(--color-ink)', marginBottom: '8px' }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: '15px', color: 'var(--color-muted)', lineHeight: 1.6, maxWidth: '560px' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Claim Your Airplay
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              Get your music{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>on radio.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Sign up for the premium distribution plan or a qualifying production package and your music goes on radio — no extra charge. Talk to us to get started.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Get free radio plays<Arrow />
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

    </div>
  );
}
