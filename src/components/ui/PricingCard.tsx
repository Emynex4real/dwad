import Arrow from './Arrow';
import type { PricingPlan } from '../../types/content';

interface PricingCardProps {
  plan: PricingPlan;
  formattedPrice: string;
  ctaHref: string;
  /** 'distro' = flat card, always-gold CTA button, used on the Distro page.
   *  'package' = outlined CTA unless featured, used on Studio/Akiib Studio. */
  variant?: 'distro' | 'package';
  /** Force gold border/label regardless of plan.featured — used for a whole
   *  group (e.g. Distro's "+ Promotion" bundle tier), not just one plan. */
  emphasize?: boolean;
}

export default function PricingCard({ plan, formattedPrice, ctaHref, variant = 'distro', emphasize = false }: PricingCardProps) {
  const gold = emphasize || plan.featured;

  if (variant === 'package') {
    return (
      <div
        className="flex flex-col border h-full"
        style={{ padding: '40px 32px', borderColor: gold ? 'var(--color-gold)' : 'var(--color-line)', background: gold ? 'var(--color-bg-2)' : 'transparent' }}
      >
        {plan.featured && (
          <div
            className="self-start mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-bg)', background: 'var(--color-gold)', padding: '4px 10px' }}
          >
            Most Popular
          </div>
        )}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{plan.label}</div>
        <div className="mt-3 mb-8" style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', fontWeight: 400, color: 'var(--color-ink)' }}>{formattedPrice}</div>
        <ul className="flex flex-col gap-3 flex-1 mb-10">
          {plan.features.map((item) => (
            <li key={item} className="flex items-start gap-3" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--color-gold)', marginTop: '2px', flexShrink: 0 }}>✦</span>
              {item}
            </li>
          ))}
        </ul>
        <a
          href={ctaHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            padding: '14px 24px',
            background: gold ? 'var(--color-gold)' : 'transparent',
            color: gold ? 'var(--color-bg)' : 'var(--color-gold)',
            border: gold ? 'none' : '1px solid var(--color-gold)',
            alignSelf: 'flex-start',
          }}
        >
          Get started<Arrow />
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col border h-full" style={{ borderColor: gold ? 'var(--color-gold)' : 'var(--color-line)', background: 'var(--color-bg-2)', padding: '32px 28px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: gold ? 'var(--color-gold)' : 'var(--color-muted)', marginBottom: '16px' }}>
        {plan.label}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '52px', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1 }}>{formattedPrice}</div>
      <div className="mt-6 flex flex-col gap-3 flex-1">
        {plan.features.map((f) => (
          <div key={f} className="flex items-start gap-2" style={{ fontSize: '13px', color: 'var(--color-ink-2)', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--color-gold)', fontSize: '9px', marginTop: '4px', flexShrink: 0 }}>✦</span>
            {f}
          </div>
        ))}
      </div>
      <a
        href={ctaHref}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 transition-colors duration-250 hover:bg-gold-2"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '14px 20px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
      >
        Get started<Arrow />
      </a>
    </div>
  );
}
