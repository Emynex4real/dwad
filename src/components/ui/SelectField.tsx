interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2.5">
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
        }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="select-field"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid var(--color-line)',
          color: 'var(--color-ink)',
          padding: '12px 0',
          fontFamily: 'var(--font-serif)',
          fontSize: '26px',
          outline: 'none',
          width: '100%',
        }}
      >
        {options.map(o => (
          <option key={o} value={o} style={{ background: 'var(--color-bg-2)', color: 'var(--color-ink)' }}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
