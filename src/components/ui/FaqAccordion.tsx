import { useState } from 'react';

interface FaqEntry {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqEntry[];
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col border-t" style={{ borderColor: 'var(--color-line)' }}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question} className="border-b" style={{ borderColor: 'var(--color-line)' }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-6 text-left py-7 cursor-pointer"
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.2vw, 26px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.3 }}>
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-45' : ''}`}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--color-gold)' }}
              >
                +
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
              <p className="pb-7" style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '640px' }}>
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
