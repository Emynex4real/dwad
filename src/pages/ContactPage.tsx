import Arrow from '../components/ui/Arrow';
import PageHero from '../components/ui/PageHero';
import SEO from '../components/ui/SEO';
import Ticker from '../components/ui/Ticker';

const contactItems = [
  { label: 'Phone & WhatsApp', value: '+234 803 084 5751', href: 'tel:+2348030845751' },
  { label: 'Email', value: 'hello@dwadmusic.com', href: 'mailto:hello@dwadmusic.com' },
  { label: 'Studio', value: 'Lagos, Nigeria.', href: null },
  { label: 'Hours', value: 'Mon–Sat · 9:00–20:00 WAT\nWhatsApp replies 7 days.', href: null },
];

export default function ContactPage() {
  return (
    <div className="page-enter">
      <SEO
        title="Contact Dwad Music — Get in Touch"
        description="Reach the Dwad Music team by phone, WhatsApp or email. Based in Lagos, Nigeria. Available Mon–Sat. WhatsApp replies 7 days. We reply within 24 hours."
        canonical="/contact"
      />
      <PageHero
        crumb="✦ Contact"
        title="Let's work on"
        italic="your next hit."
        lede="Tell us about your project and a representative will reply within 24 hours. For the fastest response, message us on WhatsApp."
      />

      <section className="py-16 sm:py-[120px] pb-16 sm:pb-[160px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid gap-12 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-[1.2fr_1fr]">

            {/* ── CTA ── */}
            <div>
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                WhatsApp us<Arrow />
              </a>
            </div>

            {/* ── Contact cards ── */}
            <div className="flex flex-col gap-5">
              {contactItems.map(item => (
                <div
                  key={item.label}
                  className="border"
                  style={{ padding: '24px 28px', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block mt-3 transition-colors duration-250 hover:text-[var(--color-gold)] break-all"
                      style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 400, lineHeight: 1.2, color: 'var(--color-ink)' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div
                      className="mt-3 whitespace-pre-line"
                      style={{ fontFamily: 'var(--font-serif)', fontSize: item.label === 'Hours' ? '18px' : 'clamp(20px, 3.5vw, 28px)', fontWeight: 400, lineHeight: 1.3, color: 'var(--color-ink)' }}
                    >
                      {item.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Ticker items={['Now Booking 2026', 'Free Radio Pitch', '24h Reply Time', '50+ Countries', 'Lagos · NG']} />
    </div>
  );
}
