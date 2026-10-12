import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import FaqAccordion from '../components/ui/FaqAccordion';
import PricingCard from '../components/ui/PricingCard';
import ProjectCard from '../components/ui/ProjectCard';
import Reveal from '../components/ui/Reveal';
import Ticker from '../components/ui/Ticker';
import SEO from '../components/ui/SEO';
import { HOF_ARTISTS, PROJECTS, distroHero } from '../data';
import { getLocalizedPricing, getPricingPlans } from '../services/pricing.service';
import { PricingGroup } from '../types/content';
import { getLiveTracks } from '../services/tracks.service';
import { getAllDistroReleases } from '../services/distroReleases.service';
import { API_BASE_URL } from '../services/httpClient';
import type { LocalizedPricing, LiveTrack, PricingPlan, DistroRelease } from '../types/content';

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

const faqs = [
  {
    question: 'What Do I Need To Get Started?',
    answer: 'Click get started or Sign up to contact our representatives to create your personal account. You will need your audio in WAV or MP3 format, as well as an artwork image.',
  },
  {
    question: 'How Do I Create A New Release?',
    answer: 'Once you’ve signed up and logged into your Dwad Music dashboard, you can click on “Releases”, locate the “Upload” button and click to start uploading your music.',
  },
  {
    question: 'How Much Will I Get Paid?',
    answer: 'The royalty return on streams is approximately 0.003p per stream, but may vary in different territories. The amount paid for downloads will also vary, as stores take a commission between 10-30%, and there is around 3-5% variance in bank charges when royalties are sent over.',
  },
  {
    question: 'How Do I View My Sales Data & Earnings?',
    answer: 'To view your sales data and royalty earnings, log in to your Dwad Music dashboard and select the Analytics tab.',
  },
  {
    question: 'How Long Does It Take To Release My Music?',
    answer: 'Your release can be live on Apple Music/Spotify within 2-3 working days of uploading, however we generally advise allowing up to 2 weeks for all stores to go live. Please remember these are approximate timeframes and should be used as guidelines only.',
  },
  {
    question: 'Do You Work With Music Videos?',
    answer: 'Yes we do. You can set up a Vevo channel and upload a music video to be distributed there.',
  },
  {
    question: 'How Do I Gain Access To My Dashboard?',
    answer: 'Once you sign up as a new user on Dwad Music, you get a personalized login to access your dashboard.',
  },
  {
    question: 'Do I Need A Dollar Card To Pay For My Distribution?',
    answer: 'No, we have made available easy payment options for you — bank transfers, mobile money, PayPal, debit and credit cards.',
  },
];

const features = [
  { idx: '01', title: 'Apple, Spotify, Boomplay, TikTok', desc: '200+ stores worldwide, one delivery.' },
  { idx: '02', title: 'Personal artist dashboard', desc: 'Track streams, royalties and territory data in real time.' },
  { idx: '03', title: 'Human support, not bots', desc: 'Talk to a real representative, every time.' },
];


export default function DistroPage() {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState<LocalizedPricing>({ currencyCode: 'USD', rate: 1 });
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [liveTracks, setLiveTracks] = useState<LiveTrack[]>([]);
  const [distroReleases, setDistroReleases] = useState<DistroRelease[]>([]);

  useEffect(() => {
    void getLocalizedPricing().then(setPricing);
    void getPricingPlans().then(setPlans);
    void getLiveTracks().then(setLiveTracks);
    void getAllDistroReleases().then(setDistroReleases);
  }, []);

  const projects = liveTracks.length > 0
    ? liveTracks.map((t) => ({
        title: t.title,
        artist: t.artistName,
        year: new Date(t.releaseDate).getFullYear().toString(),
        cover: `${API_BASE_URL}/storage/${t.coverArtUrl}`,
      }))
    : PROJECTS;

  const basicPlans = plans.filter((p) => p.groupKey === PricingGroup.DistroBasic).sort((a, b) => a.sortOrder - b.sortOrder);
  const bundlePlans = plans.filter((p) => p.groupKey === PricingGroup.DistroBundle).sort((a, b) => a.sortOrder - b.sortOrder);

  function formatPrice(usdAmount: number): string {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: pricing.currencyCode,
        currencyDisplay: 'narrowSymbol',
        maximumFractionDigits: 0,
      }).format(usdAmount * pricing.rate);
    } catch {
      return `$${usdAmount.toLocaleString()}`;
    }
  }

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
            <Reveal>
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
            </Reveal>
            <Reveal variant="scale" delay={150}>
              <div
                className="relative overflow-hidden border"
                style={{ borderColor: 'var(--color-line)' }}
              >
                <img src={distroHero} alt="Music Distribution" className="w-full h-auto object-contain" />
              </div>
            </Reveal>
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
          <Reveal>
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
          </Reveal>
        </div>
      </section>

      {/* Two-col */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-10 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-2">
            <Reveal>
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
            </Reveal>
            <ul className="list-none m-0">
              {features.map((f, i) => (
                <Reveal key={f.idx} delay={i * 80}>
                  <li
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
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── DISTRIBUTION PRICING ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Distribution Pricing
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <Reveal>
            <div className="grid gap-6 sm:gap-15 mb-14 items-end grid-cols-1 min-[820px]:grid-cols-2">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Just <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>distribution.</span>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
                Pay once, get your music live across every major store — no promotion included.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 grid-cols-1 min-[640px]:grid-cols-3">
            {basicPlans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80} className="h-full">
                <PricingCard plan={plan} formattedPrice={formatPrice(plan.price)} ctaHref="https://wa.me/message/VYJP7JFQPZXSN1" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISTRIBUTION + PROMOTION PRICING ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14 border-t" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Distribution + Promotion Pricing
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <Reveal>
            <div className="grid gap-6 sm:gap-15 mb-14 items-end grid-cols-1 min-[820px]:grid-cols-2">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Distribution,<br />
                plus the <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>push.</span>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
                Bundled packages that add radio promotion, playlist pitching, cover art and blog placements on top of full distribution.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 grid-cols-1 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-3">
            {bundlePlans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80} className="h-full">
                <PricingCard plan={plan} formattedPrice={formatPrice(plan.price)} ctaHref="https://wa.me/message/VYJP7JFQPZXSN1" emphasize />
              </Reveal>
            ))}
          </div>

          {/* Custom budget CTA */}
          <Reveal delay={200}>
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
          </Reveal>
        </div>
      </section>

      {/* Bundle */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="scale">
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
                Distribute and promote your music at the same time creating a better opportunity for you to be heard by billions of people worldwide.
              </p>
              <p className="mt-3" style={{ fontSize: '13px', letterSpacing: '0.04em', color: 'var(--color-muted)', fontWeight: 300 }}>
                Check our special packages above.
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
          </Reveal>
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
          <Reveal>
            <div className="grid gap-4 sm:gap-8 mb-12 items-end grid-cols-1 min-[820px]:grid-cols-2">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
                Artists who've{' '}
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>passed through.</span>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
                A record of notable artists whose music has moved through the Dwad network — distributed, promoted or produced with our team.
              </p>
            </div>
          </Reveal>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {HOF_ARTISTS.map((a, i) => (
              <Reveal key={a.name} delay={Math.min(i * 60, 400)}>
                <a
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
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
          </Reveal>
          <div className="grid gap-6 grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {projects.map((p, i) => (
              <Reveal key={`${p.title}-${p.artist}`} delay={Math.min(i * 60, 400)} className="h-full">
                <ProjectCard project={p} idx={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELEASED THROUGH DWAD ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
            <div className="grid gap-6 sm:gap-15 mb-10 sm:mb-16 items-end grid-cols-1 min-[820px]:grid-cols-2">
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                  Released<br />
                  <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>through</span> Dwad.
                </h2>
              </div>
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                A glimpse of some records we've shipped to streaming recently.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 grid-cols-2 min-[800px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {distroReleases.map((r, i) => (
              <Reveal key={r.id} delay={Math.min(i * 60, 400)} className="h-full">
                <ProjectCard
                  idx={i}
                  href={r.releaseUrl ?? undefined}
                  project={{
                    title: r.title,
                    artist: r.artistName,
                    year: new Date(r.createdAt).getFullYear().toString(),
                    cover: r.coverArtUrl ? `${API_BASE_URL}/storage/${r.coverArtUrl}` : '',
                  }}
                />
              </Reveal>
            ))}
          </div>
          {distroReleases.length === 0 && (
            <p style={{ fontSize: '14px', color: 'var(--color-muted)' }}>No releases added yet.</p>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ You Ask, We Answer
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <Reveal>
            <div className="grid gap-6 sm:gap-15 mb-12 items-end grid-cols-1 min-[820px]:grid-cols-2">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Frequently asked<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>questions.</span>
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
                Kindly check the most frequent questions we receive from artists worldwide.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ── ROYALTIES TEASER ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <Reveal variant="scale">
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
          </Reveal>
        </div>
      </section>

      <Ticker items={['Apple Music', 'Spotify', 'Boomplay', 'Audiomack', 'TikTok', 'Tidal', 'Deezer', 'YouTube Music', 'Amazon', 'Pandora']} />
    </div>
  );
}
