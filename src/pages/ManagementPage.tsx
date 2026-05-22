import Arrow from '../components/ui/Arrow';
import Ticker from '../components/ui/Ticker';

const services = [
  {
    num: '01',
    title: 'Artist Development',
    desc: 'We work with you from the ground up — branding, identity, sound direction, and a long-term career strategy built around your strengths.',
  },
  {
    num: '02',
    title: 'Project Management',
    desc: 'From pre-production planning to release day and beyond — we coordinate every moving part so you can focus entirely on the music.',
  },
  {
    num: '03',
    title: 'Deal Negotiations',
    desc: 'Contracts, licensing, brand partnerships, endorsements. We ensure your interests are protected in every deal you sign.',
  },
  {
    num: '04',
    title: 'Release Strategy',
    desc: 'Timing, rollout, playlist pitching, press and social — we build a custom release plan that maximises the impact of every drop.',
  },
  {
    num: '05',
    title: 'Tour & Booking Support',
    desc: 'Venue bookings, performance scheduling and logistics support for live shows across Nigeria and internationally.',
  },
  {
    num: '06',
    title: 'Brand & PR',
    desc: 'Media placements, editorial coverage, interviews, and brand positioning that builds your public profile the right way.',
  },
];

const process = [
  { num: '01', text: 'We start with an in-depth conversation about your goals, sound and where you want to be in 12 months.' },
  { num: '02', text: 'We build a personalised management plan — covering releases, promotion, distribution and brand.' },
  { num: '03', text: 'We execute. Every deadline, every placement, every conversation with labels and partners — handled.' },
  { num: '04', text: 'Regular check-ins and transparent reporting so you always know what\'s happening with your career.' },
];

export default function ManagementPage() {
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
            ✦ Talent &amp; Project Management
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
            Your career,{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
              managed.
            </span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Dwad's management team works alongside independent artists and labels to build sustainable music careers — handling the business side so you can stay in the creative zone.
            </p>
            <div className="flex flex-wrap gap-3">
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
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ What we do</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Everything<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>but the music.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              We handle the business, logistics and strategy around your career — leaving you free to focus on creating. From your first single to your first major deal, we're in your corner.
            </p>
          </div>

          <div
            className="grid border-t border-l grid-cols-1 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-3"
            style={{ borderColor: 'var(--color-line)' }}
          >
            {services.map(s => (
              <div
                key={s.num}
                className="border-r border-b flex flex-col gap-4 min-h-[220px]"
                style={{ padding: '36px 28px', borderColor: 'var(--color-line)' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>{s.num}</span>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 400, lineHeight: 1.1 }}>{s.title}</h4>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)' }}>{s.desc}</p>
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
            {process.map(step => (
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

      {/* ── CTA ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Get Managed
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              Ready to take your<br />
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>career seriously?</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Whether you're an independent artist releasing your first project or a label looking for a management partner, we want to hear from you. Let's talk about what a real career looks like.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Start the conversation<Arrow />
              </a>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-[var(--color-gold)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                WhatsApp the team<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Ticker items={['Artist Development', 'Project Management', 'Deal Negotiations', 'Release Strategy', 'Tour & Booking', 'Brand & PR']} />
    </div>
  );
}
