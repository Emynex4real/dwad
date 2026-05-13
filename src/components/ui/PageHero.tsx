interface PageHeroProps {
  crumb: string;
  title: string;
  italic: string;
  lede?: string;
}

export default function PageHero({ crumb, title, italic, lede }: PageHeroProps) {
  return (
    <section
      className="border-b relative overflow-hidden"
      style={{
        padding: '180px 56px 80px',
        borderColor: 'var(--color-line)',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--color-gold)',
          }}
        >
          {crumb}
        </div>
        <h1
          className="mt-6"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: 'clamp(56px, 7vw, 132px)',
            lineHeight: 0.94,
            letterSpacing: '-0.02em',
            maxWidth: '14ch',
          }}
        >
          {title}{' '}
          <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>
            {italic}
          </span>
        </h1>
        {lede && (
          <p
            className="mt-8"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '560px',
            }}
          >
            {lede}
          </p>
        )}
      </div>
    </section>
  );
}
