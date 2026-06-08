import { useState, useRef } from 'react';
import Arrow from '../components/ui/Arrow';
import studioPhoto from '../assets/studio/console-main.jpg';

interface Beat {
  num: string;
  title: string;
  bpm?: string;
  type: 'lease' | 'purchase';
  src: string;
}

const beats: Beat[] = [
  { num: '01', title: 'Pammy',            bpm: '110bpm',     type: 'lease',    src: '' },
  { num: '02', title: 'Viby piano',       bpm: '107bpm',     type: 'lease',    src: '' },
  { num: '03', title: 'Monica – Afropiano', bpm: '115bpm',   type: 'lease',    src: '' },
  { num: '04', title: 'Mash up',          bpm: '105bpm',     type: 'lease',    src: '' },
  { num: '05', title: 'Iye o',            bpm: '112bpm',     type: 'lease',    src: '' },
  { num: '06', title: 'Pepper',           bpm: '118bpm',     type: 'lease',    src: '' },
  { num: '07', title: 'Slow & Steady',    bpm: '84bpm',      type: 'lease',    src: '' },
  { num: '08', title: 'Surfers',          bpm: '113bpm',     type: 'lease',    src: '' },
  { num: '09', title: 'In my head',       bpm: '96bpm',      type: 'purchase', src: '' },
  { num: '10', title: 'Bum bum bigger',   bpm: '100bpm',     type: 'purchase', src: '' },
  { num: '11', title: 'Holy',             bpm: '102bpm',     type: 'purchase', src: '' },
  { num: '12', title: 'Happy',            bpm: '112bpm',     type: 'purchase', src: '' },
  { num: '13', title: 'Fire Dance',       bpm: '112.060bpm', type: 'purchase', src: '' },
  { num: '14', title: 'Energy',           bpm: '132bpm',     type: 'purchase', src: '' },
  { num: '15', title: 'Fire Fire',        bpm: '98bpm',      type: 'purchase', src: '' },
  { num: '16', title: 'Work of Art',      bpm: '112bpm',     type: 'purchase', src: '' },
  { num: '17', title: 'Pour me Water',    bpm: '93.060bpm',  type: 'purchase', src: '' },
  { num: '18', title: 'Piece of me',      bpm: '99bpm',      type: 'purchase', src: '' },
  { num: '19', title: 'Peace of mind',    bpm: '93bpm',      type: 'purchase', src: '' },
  { num: '20', title: 'Afro',             bpm: '90bpm',      type: 'purchase', src: '' },
  { num: '21', title: 'X-O',                                  type: 'purchase', src: '' },
  { num: '22', title: 'Stay',                                  type: 'purchase', src: '' },
  { num: '23', title: 'Kalakuta',                              type: 'purchase', src: '' },
  { num: '24', title: 'My Babe',                               type: 'purchase', src: '' },
  { num: '25', title: 'Vibez',                                 type: 'purchase', src: '' },
  { num: '26', title: 'Trappy',                                type: 'purchase', src: '' },
  { num: '27', title: 'Things we do for Love',                 type: 'purchase', src: '' },
  { num: '28', title: 'Sarafina',                              type: 'purchase', src: '' },
  { num: '29', title: 'Santana',                               type: 'purchase', src: '' },
  { num: '30', title: 'Rora',                                  type: 'purchase', src: '' },
  { num: '31', title: 'Perfect',                               type: 'purchase', src: '' },
  { num: '32', title: 'Obimo',                                 type: 'purchase', src: '' },
  { num: '33', title: 'Nile',                                  type: 'purchase', src: '' },
  { num: '34', title: 'Mood',                                  type: 'purchase', src: '' },
  { num: '35', title: 'Nana',                                  type: 'purchase', src: '' },
  { num: '36', title: 'Lov',                                   type: 'purchase', src: '' },
  { num: '37', title: 'Lamba',                                 type: 'purchase', src: '' },
  { num: '38', title: 'Lala',                                  type: 'purchase', src: '' },
  { num: '39', title: 'KAfA',                                  type: 'purchase', src: '' },
  { num: '40', title: 'Jule',                                  type: 'purchase', src: '' },
  { num: '41', title: 'Groovy',                                type: 'purchase', src: '' },
  { num: '42', title: 'Give Dem',                              type: 'purchase', src: '' },
  { num: '43', title: 'Forever',                               type: 'purchase', src: '' },
  { num: '44', title: 'Good Bye',                              type: 'purchase', src: '' },
  { num: '45', title: 'Flower',                                type: 'purchase', src: '' },
  { num: '46', title: 'Fever',                                 type: 'purchase', src: '' },
  { num: '47', title: 'Carolina',                              type: 'purchase', src: '' },
  { num: '48', title: 'Blessings',                             type: 'purchase', src: '' },
  { num: '49', title: 'Body & Soul',                           type: 'purchase', src: '' },
  { num: '50', title: 'Mapiano',                               type: 'purchase', src: '' },
  { num: '51', title: 'Pakam',                                 type: 'purchase', src: '' },
  { num: '52', title: 'Balerina',                              type: 'purchase', src: '' },
  { num: '53', title: 'Dizzy',                                 type: 'purchase', src: '' },
  { num: '54', title: 'Abena',                                 type: 'purchase', src: '' },
  { num: '55', title: '1',                                     type: 'purchase', src: '' },
  { num: '56', title: '2',                                     type: 'purchase', src: '' },
  { num: '57', title: '3',                                     type: 'purchase', src: '' },
  { num: '58', title: '6',                                     type: 'purchase', src: '' },
  { num: '59', title: '10',                                    type: 'purchase', src: '' },
];

export default function BeatsPage() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleBeatClick = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeIdx === idx) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { void audio.play(); setIsPlaying(true); }
    } else {
      audio.src = beats[idx].src;
      setActiveIdx(idx);
      if (beats[idx].src) { void audio.play(); setIsPlaying(true); }
      else { setIsPlaying(false); }
    }
  };

  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section className="relative border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
          <img src={studioPhoto} alt="Dwad Music Studio" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,9,7,0.4) 0%, rgba(11,9,7,0.85) 100%)' }} />
          <div className="absolute bottom-10 left-5 sm:left-14">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: '12px',
              }}
            >
              ✦ Beat Store
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: 'clamp(40px, 7vw, 100px)',
                lineHeight: 0.94,
                letterSpacing: '-0.02em',
                color: 'var(--color-ink)',
              }}
            >
              Beats by{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Dwad.</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── INFO ── */}
      <section className="py-14 sm:py-20 px-5 sm:px-14 border-b" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto grid gap-10 items-start grid-cols-1 min-[820px]:grid-cols-2">
          <div>
            <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Browse Dwad's catalogue of original instrumentals — crafted in-house for artists who want something real and ready for release.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              {[
                'All beats are available for lease & purchase',
                'Custom made beats also available',
              ].map(pt => (
                <li key={pt} className="flex items-center gap-3" style={{ fontSize: '15px', color: 'var(--color-ink-2)' }}>
                  <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>✦</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://wa.me/message/VYJP7JFQPZXSN1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
            >
              Get a Beat<Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* ── BEAT LIST ── */}
      <section className="py-14 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          {/* Legend */}
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ All Beats</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-gold)', display: 'inline-block' }} />
                Lease
              </span>
              <span className="flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-muted)', display: 'inline-block' }} />
                Purchase
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {beats.map((b, i) => (
              <div
                key={b.num}
                onClick={() => handleBeatClick(i)}
                className="flex items-center gap-4 sm:gap-6 cursor-pointer transition-all duration-150 active:scale-[1.01]"
                style={{
                  background: activeIdx === i ? 'var(--color-bg-2)' : 'var(--color-bg)',
                  padding: '16px',
                  borderLeft: `2px solid ${activeIdx === i ? 'var(--color-gold)' : 'transparent'}`,
                }}
              >
                {/* Number */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: activeIdx === i ? 'var(--color-gold)' : 'var(--color-muted)', minWidth: '28px' }}>
                  {b.num}
                </span>

                {/* Type dot */}
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: b.type === 'lease' ? 'var(--color-gold)' : 'var(--color-muted)',
                  }}
                />

                {/* Title + BPM */}
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(15px, 2vw, 22px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.2 }}>
                    {b.title}
                  </div>
                  {b.bpm && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--color-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                      {b.bpm}
                    </div>
                  )}
                </div>

                {/* Type label */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: b.type === 'lease' ? 'var(--color-gold)' : 'var(--color-muted)', flexShrink: 0, display: 'none' }} className="sm:inline">
                  {b.type}
                </span>

                {/* Play/Pause */}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activeIdx === i && isPlaying ? 'var(--color-gold)' : 'var(--color-muted)', flexShrink: 0 }}>
                  {activeIdx === i && isPlaying ? '⏸' : '▶'}
                </span>
              </div>
            ))}
          </div>

          <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Get a Beat
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '14ch' }}>
              Ready to get a{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>beat?</span>
            </h2>
            <p className="mt-6" style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              Lease a beat, purchase exclusive rights, or commission a fully custom instrumental from Dwad's production team. Reach out to get started.
            </p>
            <div className="mt-10">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Get a Beat<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
