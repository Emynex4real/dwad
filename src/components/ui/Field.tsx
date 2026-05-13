interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}

export default function Field({ label, value, onChange, placeholder, type = 'text', textarea }: FieldProps) {
  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-line)',
    color: 'var(--color-ink)',
    padding: '12px 0',
    fontFamily: 'var(--font-serif)',
    outline: 'none',
    width: '100%',
  };

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
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{ ...inputStyle, fontSize: '22px', resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle, fontSize: '26px' }}
        />
      )}
    </label>
  );
}
