import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import ProjectCard from '../components/ui/ProjectCard';
import Ticker from '../components/ui/Ticker';
import SEO from '../components/ui/SEO';
import { PROJECTS, HOF_ARTISTS, distroHero } from '../data';

const distroJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Music Distribution',
  serviceType: 'Music Distribution',
  provider: { '@type': 'Organization', name: 'Dwad Music', url: 'https://dwadmusic.com' },
  description: 'Distribute music to 200+ platforms including Spotify, Apple Music, Boomplay and TikTok worldwide.',
  areaServed: 'Worldwide',
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '10',
    highPrice: '1000',
  },
};

const features = [
  { idx: '01', title: 'Apple, Spotify, Boomplay, TikTok', desc: '200+ stores worldwide, one delivery.' },
  { idx: '02', title: 'Personal artist dashboard', desc: 'Track streams, royalties and territory data in real time.' },
  { idx: '03', title: 'Human support, not bots', desc: 'Talk to a real representative, every time.' },
  { idx: '04', title: 'Free radio submission', desc: 'Every release becomes a candidate for our radio push.' },
];


export default function DistroPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <SEO
        title="Music Distribution to 200+ Platforms | Dwad Music"
        description="Distribute your music to Spotify, Apple Music, Boomplay, TikTok and 200+ platforms. Real dashboards, real royalties. Plans from $10. Worldwide delivery."
        canonical="/distro"
        jsonLd={distroJsonLd}
      />

      {/* ── DISTRO HERO ── */}
      <section
        className="border-b pt-32 pb-14 px-5 sm:pt-[180px] sm:pb-20 sm:px-14"
        style={{ borderColor: 'var(--color-line)' }}
      >
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="grid gap-10 min-[900px]:gap-20 items-end grid-cols-1 min-[900px]:grid-cols-2">
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontWeight: 400,
                  fontSize: 'clamp(48px, 7vw, 132px)',
                  lineHeight: 0.94,
                  letterSpacing: '-0.02em',
                }}
              >
                Music{' '}
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
                  distribution.
                </span>
              </h1>
              <p
                className="mt-8"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '17px',
                  lineHeight: 1.55,
                  color: 'var(--color-ink-2)',
                  fontWeight: 300,
                  maxWidth: '520px',
                }}
              >
                Upload to Apple Music, Spotify, Boomplay, TikTok and 200+ streaming platforms worldwide. Real humans, real dashboards, real royalties.
              </p>
              <div className="mt-10">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Get started<Arrow />
                </a>
              </div>
            </div>
            <div
              className="relative overflow-hidden border"
              style={{ borderColor: 'var(--color-line)' }}
            >
              <img src={distroHero} alt="Music Distribution" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ── UPLOAD YOUR MUSIC ── */}
      <section className="py-16 sm:py-25 px-5 sm:px-14 border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Upload your music
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="max-w-160">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Your music.<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Everywhere.</span>
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
                Send us your track and artwork — we upload it to Apple Music, Spotify, Boomplay, TikTok and 200+ platforms worldwide. No technical setup required.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Upload your music<Arrow />
                </a>
              </div>
          </div>
        </div>
      </section>

      {/* Two-col */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Why distribute with Dwad</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                One upload.<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Two hundred</span> stores.
              </h2>
              <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                You hand us the master and the artwork — we handle the rest. Metadata, splits, publishing, takedowns, and a personal dashboard so you can watch the streams roll in.
              </p>
              <div className="mt-8">
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                >
                  Sign up on WhatsApp<Arrow />
                </a>
              </div>
            </div>
            <ul className="list-none m-0">
              {features.map(f => (
                <li
                  key={f.idx}
                  className="grid gap-4 sm:gap-6 py-7 border-b items-center grid-cols-[40px_1fr_auto] sm:grid-cols-[60px_1fr_auto]"
                  style={{ borderColor: 'var(--color-line)' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>{f.idx}</span>
                  <span>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--color-ink)' }}>{f.title}</div>
                    <div className="mt-1" style={{ fontSize: '13px', color: 'var(--color-muted)' }}>{f.desc}</div>
                  </span>
                  <Arrow />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '40px' }}>
            ✦ How It Works
          </div>
          <div className="flex flex-col border-t" style={{ borderColor: 'var(--color-line)' }}>
            {[
              { num: '01', text: 'Contact us and send us your music to be distributed.' },
              { num: '02', text: 'We set up your personal distribution account with your advance dashboard.' },
              { num: '03', text: 'Your music goes live on all platforms worldwide.' },
              { num: '04', text: 'Earn as the fans listen.' },
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

      {/* ── DISTRIBUTION PLANS ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Distribution Plans
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <h2 className="mt-5 mb-14" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
            Choose your <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>plan.</span>
          </h2>

          {/* ── Basic Plans ── */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
            Basic
          </div>
          <div className="grid gap-4 grid-cols-1 min-[640px]:grid-cols-3 mb-14">

            {/* A — $10 */}
            <div className="flex flex-col border" style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
                A · 1 Song Upload
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>$10</div>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                {['1 song upload', 'Spotify, Apple Music + all music apps', 'No TikTok or Instagram upload'].map((f, i) => (
                  <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: i === 2 ? 'var(--color-muted)' : 'var(--color-ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: i === 2 ? 'var(--color-muted)' : 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>{i === 2 ? '—' : '✦'}</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                Get started<Arrow />
              </a>
            </div>

            {/* B — $15 */}
            <div className="flex flex-col border" style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
                B · 1 Song Upload Pro
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>$15</div>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                {['1 song upload', 'Spotify, Apple Music + 200 more apps', 'TikTok, Instagram + all social media apps'].map(f => (
                  <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>✦</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                Get started<Arrow />
              </a>
            </div>

            {/* C — $30 */}
            <div className="flex flex-col border" style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
                C · Unlimited
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>$30</div>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                {['Unlimited song uploads per year', 'Spotify, Apple Music + 200 more apps', 'TikTok, Instagram + all social media apps'].map(f => (
                  <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>✦</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                Get started<Arrow />
              </a>
            </div>

          </div>

          {/* ── Special Packages ── */}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>
            ✦ Special Packages
          </div>
          <div className="grid gap-4 grid-cols-1 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-3">

            {/* Gold $150 */}
            <div className="flex flex-col border" style={{ borderColor: 'var(--color-gold)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>Gold</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>$150</div>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                {[
                  'Unlimited upload a year',
                  'All music apps',
                  'All social media apps',
                  '1 free radio promotion',
                  'Free editorial playlist pitching',
                  '1 free cover art graphics',
                ].map(f => (
                  <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>✦</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                Get started<Arrow />
              </a>
            </div>

            {/* Diamond $500 */}
            <div className="flex flex-col border" style={{ borderColor: 'var(--color-gold)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>Diamond</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>$500</div>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                {[
                  'Unlimited upload a year',
                  'All music apps',
                  'All social media apps',
                  '3 free radio promotions',
                  'Free editorial playlist pitching',
                  '2 free cover art graphics',
                  '10 free web blog placements',
                ].map(f => (
                  <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>✦</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                Get started<Arrow />
              </a>
            </div>

            {/* Platinum $1,000 */}
            <div className="flex flex-col border" style={{ borderColor: 'var(--color-gold)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '16px' }}>Platinum</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>$1,000</div>
              <div className="mt-6 flex flex-col gap-3 flex-1">
                {[
                  'Unlimited upload a year',
                  'All music apps',
                  'All social media apps',
                  '5 free radio promotions',
                  'Free editorial playlist pitching',
                  '5 free cover art graphics',
                  '50 free web blog placements',
                  'Free promo on TikTok, Instagram & Facebook',
                ].map(f => (
                  <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>✦</span>
                    {f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/message/VYJP7JFQPZXSN1" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
                Get started<Arrow />
              </a>
            </div>


          </div>

          {/* Custom budget CTA */}
          <div className="mt-10 border-t pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" style={{ borderColor: 'var(--color-line)' }}>
            <p style={{ fontSize: '16px', color: 'var(--color-ink-2)', fontWeight: 300, lineHeight: 1.5, maxWidth: '560px' }}>
              Have a bigger budget and want bigger results?{' '}
              <span style={{ color: 'var(--color-ink)' }}>Contact us and we'll build you a personal promo plan.</span>
            </p>
            <a
              href="https://wa.me/message/VYJP7JFQPZXSN1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 shrink-0 transition-colors duration-250 hover:text-gold"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
            >
              Contact us<Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* Bundle */}
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
              Distribution<br />
              + <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>promotion</span> together.
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '480px' }}>
              Sign for distribution and your first radio pitch is on us. The most popular path for artists releasing their next single with Dwad.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Bundle Distribution<Arrow />
              </a>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:text-gold"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', border: '1px solid var(--color-line)', color: 'var(--color-ink)' }}
              >
                Talk to a Rep<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Free Bonuses */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col border"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', borderColor: 'var(--color-gold)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Free Bonuses
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              More than just{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>distribution.</span>
            </h2>
            <p className="mt-8" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              Get free radio promotions, free cover arts and many more bonus included.
            </p>
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
                On the premium distribution plan, your music goes on radio — free. No extra charge, no extra steps.
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

      {/* Hall of Fame */}
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

      {/* Catalogue */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Catalogue</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Songs we've<br /><span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>distributed.</span>
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              A selection of recent releases live across all major DSPs.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {PROJECTS.map((p, i) => <ProjectCard key={i} project={p} idx={i} />)}
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
                Mechanical, performance, print, sync — understand every royalty type your music can earn and how Dwad collects them all on your behalf.
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

      <Ticker items={['Apple Music', 'Spotify', 'Boomplay', 'Audiomack', 'TikTok', 'Tidal', 'Deezer', 'YouTube Music', 'Amazon', 'Pandora']} />
    </div>
  );
}
