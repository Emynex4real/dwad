const GOLD = '#c9a667';

interface AreaSparklineProps {
  data: { month: string; streams: number }[];
}

export default function AreaSparkline({ data }: AreaSparklineProps) {
  if (data.length === 0) {
    return <p className="dash-empty">No monthly data yet.</p>;
  }

  const max = Math.max(...data.map((d) => d.streams), 1);
  const W = 600;
  const H = 160;
  const pts = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * W : W / 2;
    const y = H - (d.streams / max) * (H - 20);
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `${pts[0].split(',')[0]},${H} ` + polyline + ` ${pts[pts.length - 1].split(',')[0]},${H}`;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '160px', display: 'block' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#areaGrad)" />
        <polyline points={polyline} fill="none" stroke={GOLD} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => {
          const x = data.length > 1 ? (i / (data.length - 1)) * W : W / 2;
          const y = H - (d.streams / max) * (H - 20);
          return <circle key={i} cx={x} cy={y} r="4" fill={GOLD} stroke="var(--color-bg)" strokeWidth="2" />;
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 0', borderTop: '1px solid var(--color-line)' }}>
        {data.map((d) => (
          <span key={d.month} style={{ fontSize: '10px', color: 'var(--color-muted)', flex: 1, textAlign: 'center' }}>{d.month}</span>
        ))}
      </div>
    </div>
  );
}
