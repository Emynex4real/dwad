import { useNavigate } from 'react-router-dom';
import Arrow from '../components/ui/Arrow';
import PageHero from '../components/ui/PageHero';
import Ticker from '../components/ui/Ticker';

const steps = [
  {
    num: '01',
    title: 'Submit your record',
    desc: 'Drop us the master, artwork and a one-line pitch. We\'ll respond inside 24 hours with a fit assessment.',
  },
  {
    num: '02',
    title: 'We pitch & place',
    desc: 'Radio stations, online editors, TikTok influencers, playlist curators — we route to the channels that match your sound.',
  },
  {
    num: '03',
    title: 'You see the data',
    desc: 'Weekly reports with airplay logs, social pickups and stream lifts so you know exactly what worked.',
  },
];

const channels = [
  { num: '01', title: 'Terrestrial radio', desc: 'Affiliate stations across Nigeria, Ghana, Kenya, South Africa and the UK diaspora circuit.' },
  { num: '02', title: 'Editorial playlists', desc: 'Genre-led playlist pitching on Spotify, Apple Music, Boomplay and Audiomack.' },
  { num: '03', title: 'Social & creator', desc: 'TikTok challenges, Reels seeding and creator partnerships matched to your record.' },
  { num: '04', title: 'Press & blogs', desc: 'Coverage on African and global music press — full PR brief included.' },
];

export default function PromotionPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <PageHero
        crumb="✦ Service 03"
        title="Radio &"
        italic="promotion."
        lede="Land your record on the right stations, the right playlists and the right feeds. Campaigns built around the territories that move your music, run by people who know the gatekeepers."
      />

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '120px 56px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-15 mb-16 items-end max-[820px]:grid-cols-1 max-[820px]:gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ How it works</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Three steps.<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>One</span> campaign.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              From submission to radio rotation — typically inside three weeks. Here's the path your record takes through the Dwad promotions desk.
            </p>
          </div>

          <div className="grid gap-8 max-[800px]:grid-cols-1" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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

      {/* ── BUNDLE CTA ── */}
      <section style={{ padding: '80px 56px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div
            className="cta-card relative border overflow-hidden grid gap-20 items-center max-[900px]:grid-cols-1 max-[900px]:p-8"
            style={{ padding: '96px 56px', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)', gridTemplateColumns: '1fr 1fr' }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Bundle</div>
              <h2 className="mt-4 relative z-[1]" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1 }}>
                Distribute<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>+ promote</span> together.
              </h2>
            </div>
            <div className="relative z-[1]">
              <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
                Sign for distribution and your first radio pitch is on us. The most popular path for artists releasing their next single with Dwad.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                  onClick={() => navigate('/distro')}
                >
                  Bundle distribution<Arrow />
                </button>
                <a
                  href="https://wa.me/message/VYJP7JFQPZXSN1"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                >
                  Talk to a rep<Arrow />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHANNELS ── */}
      <section style={{ padding: '80px 56px 120px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-15 mb-16 items-end max-[820px]:grid-cols-1 max-[820px]:gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>✦ Channels</div>
              <h2 className="mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(40px, 5vw, 84px)', lineHeight: 1, letterSpacing: '-0.015em' }}>
                Where<br />
                <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>we</span> place you.
              </h2>
            </div>
            <p style={{ fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '560px' }}>
              A balanced mix of broadcast, editorial and social. We tune the channel split to your genre and the territories you care about.
            </p>
          </div>
          <div
            className="grid border-t max-[900px]:grid-cols-2 max-[500px]:grid-cols-1"
            style={{ gridTemplateColumns: 'repeat(4, 1fr)', borderColor: 'var(--color-line)' }}
          >
            {channels.map((c, i) => (
              <div
                key={c.num}
                className={`flex flex-col justify-between border-b border-r min-h-[220px] ${i === channels.length - 1 ? 'border-r-0' : ''}`}
                style={{ padding: '40px 32px', borderColor: 'var(--color-line)' }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-gold)', letterSpacing: '0.2em' }}>{c.num}</div>
                <div>
                  <h4 className="mt-3.5" style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', lineHeight: 1.1, fontWeight: 400 }}>{c.title}</h4>
                  <p className="mt-3" style={{ color: 'var(--color-muted)', fontSize: '13px', lineHeight: 1.5 }}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker items={['Now Booking', 'Free Radio Pitch', 'Pitch-To-Editorial', 'TikTok Push', 'Lagos · UK · US · ZA']} />
    </div>
  );
}
