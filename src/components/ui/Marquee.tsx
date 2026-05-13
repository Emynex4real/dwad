interface MarqueeProps {
  items: string[];
  italic?: boolean;
}

export default function Marquee({ items, italic = true }: MarqueeProps) {
  const content = (
    <span className="inline-flex items-center gap-14">
      {items.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-14">
          <span className={italic ? 'italic' : ''}>{t}</span>
          <span className="text-[0.6em] not-italic translate-y-[-0.2em]" style={{ color: 'var(--color-gold)' }}>✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="overflow-hidden border-t border-b py-7 whitespace-nowrap"
      style={{ borderColor: 'var(--color-line)' }}
    >
      <div
        className="marquee-track inline-flex gap-14"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(36px, 5vw, 72px)',
          fontWeight: 300,
          color: 'var(--color-ink)',
        }}
      >
        {content}{content}
      </div>
    </div>
  );
}
