import { useState, useRef, useEffect } from 'react';
import Arrow from '../components/ui/Arrow';
import SEO from '../components/ui/SEO';
import studioPhoto from '../assets/studio/console-main.jpg';
import { getAllBeats } from '../services/beats.service';
import { API_BASE_URL } from '../services/httpClient';
import type { Beat } from '../types/content';

export default function BeatsPage() {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    void getAllBeats().then(setBeats);
  }, []);

  const handleBeatClick = (idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeIdx === idx) {
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
    } else {
      const audioFileUrl = beats[idx].audioFileUrl;
      if (!audioFileUrl) return;
      audio.src = `${API_BASE_URL}/storage/${audioFileUrl}`;
      setActiveIdx(idx);
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="page-enter">
      <SEO
        title="Beat Store — Afrobeats & Hip Hop Instrumentals | Dwad Music"
        description="Browse and license original beats — Afrobeats, Afro Soul, Pop and Hip Hop. Lease or buy outright. Custom beats on request. Instant clearance on purchase."
        canonical="/beats"
      />

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
                key={b.id}
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
                  {String(i + 1).padStart(2, '0')}
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
            {beats.length === 0 && (
              <p style={{ padding: '16px', fontSize: '13px', color: 'var(--color-muted)' }}>No beats added yet.</p>
            )}
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
