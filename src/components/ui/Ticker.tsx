interface TickerProps {
  items: string[];
}

export default function Ticker({ items }: TickerProps) {
  const content = (
    <span className="inline-flex items-center gap-12">
      {items.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-12">
          <span style={{ color: 'var(--color-ink-2)' }}>{t}</span>
          <span style={{ color: 'var(--color-gold)' }}>✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="overflow-hidden border-t border-b py-4"
      style={{ borderColor: 'var(--color-line)' }}
    >
      <div
        className="ticker-track inline-flex gap-12 whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
        }}
      >
        {content}{content}
      </div>
    </div>
  );
}
