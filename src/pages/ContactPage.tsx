import { useState } from 'react';
import Arrow from '../components/ui/Arrow';
import PageHero from '../components/ui/PageHero';
import Field from '../components/ui/Field';
import SelectField from '../components/ui/SelectField';
import Ticker from '../components/ui/Ticker';

interface FormState {
  name: string;
  email: string;
  service: string;
  message: string;
}

const contactItems = [
  { label: 'Phone & WhatsApp', value: '+234 803 084 5751', href: 'tel:+2348030845751' },
  { label: 'Email', value: 'hello@dwadmusic.com', href: 'mailto:hello@dwadmusic.com' },
  { label: 'Studio', value: 'Lagos, Nigeria.', href: null },
  { label: 'Hours', value: 'Mon–Sat · 9:00–20:00 WAT\nWhatsApp replies 7 days.', href: null },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    service: 'Distribution',
    message: '',
  });

  const update = (key: keyof FormState) => (value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const reset = () => {
    setSent(false);
    setForm({ name: '', email: '', service: 'Distribution', message: '' });
  };

  return (
    <div className="page-enter">
      <PageHero
        crumb="✦ Contact"
        title="Let's make"
        italic="a record."
        lede="Tell us about your project and a representative will reply within 24 hours. For the fastest response, message us on WhatsApp."
      />

      <section className="py-16 sm:py-[120px] pb-16 sm:pb-[160px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="grid gap-12 sm:gap-20 items-start grid-cols-1 min-[900px]:grid-cols-[1.2fr_1fr]"
          >
            {/* ── Form ── */}
            {sent ? (
              <div
                className="border text-center"
                style={{ padding: '80px 40px', background: 'var(--color-bg-2)', borderColor: 'var(--color-line)' }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                  ✦ Received
                </div>
                <h3
                  className="mt-5"
                  style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(28px, 3vw, 48px)', lineHeight: 1.05, letterSpacing: '-0.01em' }}
                >
                  Thanks,{' '}
                  <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
                    {form.name || 'friend'}.
                  </span>
                </h3>
                <p
                  className="mt-4 mx-auto"
                  style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '380px' }}
                >
                  We've got your message. A Dwad representative will reach out within 24 hours.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] mt-8"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                  onClick={reset}
                >
                  Send another<Arrow />
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); setSent(true); }}
                className="flex flex-col gap-6"
              >
                <Field label="Your name" value={form.name} onChange={update('name')} placeholder="Artist or band name" />
                <Field label="Email" type="email" value={form.email} onChange={update('email')} placeholder="you@domain.com" />
                <SelectField
                  label="What do you need?"
                  value={form.service}
                  onChange={update('service')}
                  options={['Distribution', 'Production', 'Promotion', 'Spotlight feature', 'Graphics', 'Just saying hi']}
                />
                <Field label="Tell us about it" textarea value={form.message} onChange={update('message')} placeholder="A few lines about the project, timeline and budget." />
                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
                  >
                    Send the brief<Arrow />
                  </button>
                  <a
                    href="https://wa.me/message/VYJP7JFQPZXSN1"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', borderColor: 'var(--color-line-strong)', color: 'var(--color-ink)' }}
                  >
                    Or WhatsApp us<Arrow />
                  </a>
                </div>
              </form>
            )}

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
