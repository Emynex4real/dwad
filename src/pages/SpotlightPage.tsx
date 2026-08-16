import { useState, useEffect } from 'react';
import Arrow from '../components/ui/Arrow';
import Marquee from '../components/ui/Marquee';
import SEO from '../components/ui/SEO';
import Ticker from '../components/ui/Ticker';
import { HOF_ARTISTS, ARTIST_NAMES } from '../data';
import { API_BASE_URL } from '../services/httpClient';
import { getSpotlightContent } from '../services/spotlight.service';
import type { SpotlightContent } from '../types/content';

function storageUrl(path: string | null): string | null {
  return path ? `${API_BASE_URL}/storage/${path}` : null;
}

export default function SpotlightPage() {
  const [content, setContent] = useState<SpotlightContent | null>(null);

  useEffect(() => {
    void getSpotlightContent().then(setContent);
  }, []);

  if (!content) {
    return (
      <div className="page-enter min-h-screen flex items-center justify-center">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Loading…</p>
      </div>
    );
  }

  const { settings, items } = content;

  return (
    <div className="page-enter">
      <SEO
        title="Artist Spotlight — Dwad Music Roster & Catalogue"
        description="Browse the Dwad Music artist roster, recent releases and editorial features. Independent artists distributed, produced and promoted through Dwad Music."
        canonical="/spotlight"
      />

      {/* ── HERO ── */}
      <section className="border-b pt-32 pb-14 px-5 sm:pt-[180px] sm:pb-20 sm:px-14" style={{ borderColor: 'var(--color-line)' }}>
        <div className="max-w-[1440px] mx-auto">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(48px, 7vw, 132px)', lineHeight: 0.94, letterSpacing: '-0.02em' }}>
            Artist{' '}
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>spotlight.</span>
          </h1>
          <div className="mt-10 grid items-end gap-8 sm:gap-16 grid-cols-1 min-[820px]:grid-cols-2">
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '17px', lineHeight: 1.55, color: 'var(--color-ink-2)', fontWeight: 300, maxWidth: '520px' }}>
              The Dwad Music spotlight showcases talents who deserve to be showcased. Get your music showcased to audiences worldwide.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Talk to our rep<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={ARTIST_NAMES} duration="1200s" fontSize="18px" />

      {/* ══ SECTION 1 — OUR ROSTER ══ */}
      <section className="pt-16 sm:pt-[100px] pb-14 sm:pb-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          <div className="flex items-center gap-6 mb-12">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Our Roster
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--color-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Active · 2026
            </span>
          </div>

          <style>{`
            .roster-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            @media (min-width: 600px) {
              .roster-grid {
                grid-template-columns: repeat(${items.roster.length}, 1fr);
              }
            }
          `}</style>
          <div className="roster-grid grid gap-1">
            {items.roster.map((a) => (
              <div key={a.id} className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: '3 / 4' }}>
                <img
                  src={storageUrl(a.imagePath) ?? undefined}
                  alt={a.primaryText ?? ''}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 35%, rgba(11,9,7,0.92) 100%)' }} />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-[2]">
                  <div className="mt-2" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 3.5vw, 52px)', lineHeight: 1.0, color: 'var(--color-ink)' }}>
                    {a.primaryText}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--color-ink-2)', textTransform: 'uppercase' }}>
                    {a.secondaryText}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ SECTION 2 — HALL OF FAME ══ */}
      <section className="pt-14 sm:pt-20 pb-16 sm:pb-[120px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
              ✦ Hall of Fame
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>

          <div className="grid gap-4 sm:gap-8 mb-12 items-end grid-cols-1 min-[820px]:grid-cols-2">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              Artists who've{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>passed through.</span>
            </h2>
            <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300, maxWidth: '480px' }}>
              A record of notable artists whose music has moved through the Dwad network — distributed, promoted or produced with our team.
            </p>
          </div>

          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {HOF_ARTISTS.map((a, i) => (
              <a
                key={a.name}
                href={a.spotify}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 sm:gap-8 transition-all duration-150 hover:bg-[var(--color-bg-2)] active:scale-[1.02]"
                style={{ background: 'var(--color-bg)', padding: '20px 16px' }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="rounded-full overflow-hidden flex-shrink-0 border" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)' }}>
                  <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>
                    {a.name}
                  </div>
                  <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                    {a.role}
                  </div>
                </div>
                <Arrow />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ TOP TALENTS ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Top Talents</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <p className="mb-10" style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-muted)', fontWeight: 300 }}>
            Check out our top talents this month — these guys are definitely here to stay with their blend of good music.
          </p>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {items.topTalents.map((a, i) => {
              const photo = storageUrl(a.imagePath);
              return (
                <a
                  key={a.id}
                  href={a.externalUrl || undefined}
                  target={a.externalUrl ? '_blank' : undefined}
                  rel={a.externalUrl ? 'noreferrer' : undefined}
                  className={`flex items-center gap-4 sm:gap-8${a.externalUrl ? ' transition-all duration-150 hover:bg-[var(--color-bg-2)] active:scale-[1.02]' : ''}`}
                  style={{ background: 'var(--color-bg)', padding: '20px 16px', cursor: a.externalUrl ? 'pointer' : 'default' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="rounded-full overflow-hidden shrink-0 flex items-center justify-center border" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)', background: 'var(--color-bg-2)' }}>
                    {photo
                      ? <img src={photo} alt={a.primaryText ?? ''} className="w-full h-full object-cover" />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-gold)' }}>{a.primaryText?.[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>{a.primaryText}</div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{a.secondaryText}</div>
                  </div>
                  {a.externalUrl && <Arrow />}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ TOP HITS ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Top Hits of the Month</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {items.topHits.map((s, i) => {
              const cover = storageUrl(s.imagePath);
              return (
                <a
                  key={s.id}
                  href={s.externalUrl || undefined}
                  target={s.externalUrl ? '_blank' : undefined}
                  rel={s.externalUrl ? 'noreferrer' : undefined}
                  className={`flex items-center gap-4 sm:gap-8${s.externalUrl ? ' transition-all duration-150 hover:bg-[var(--color-bg-2)] active:scale-[1.02]' : ''}`}
                  style={{ background: 'var(--color-bg)', padding: '20px 16px', cursor: s.externalUrl ? 'pointer' : 'default' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="overflow-hidden shrink-0 border flex items-center justify-center" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)', background: 'var(--color-bg-2)', borderRadius: '3px' }}>
                    {cover
                      ? <img src={cover} alt={s.primaryText ?? ''} className="w-full h-full object-cover" />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-gold)' }}>{s.primaryText?.[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>{s.primaryText}</div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{s.secondaryText}</div>
                  </div>
                  {s.externalUrl && <Arrow />}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ HOT NEW VIDEO ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Hot New Videos</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="grid gap-10 grid-cols-1 min-[700px]:grid-cols-2">
            {items.videos.map((v) => (
              <div key={v.id}>
                <h3 className="mb-1" style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(20px, 3vw, 36px)', lineHeight: 1.1, color: 'var(--color-ink)' }}>
                  {v.primaryText}
                </h3>
                <p className="mb-4" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  {v.secondaryText}
                </p>
                <div className="relative w-full border" style={{ aspectRatio: '16/9', borderColor: 'var(--color-line)', background: 'var(--color-bg-2)' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.videoId}`}
                    title={`${v.primaryText} – ${v.secondaryText}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ TOP CLASSICS ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Top Classics of the Month</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <div className="flex flex-col gap-px" style={{ background: 'var(--color-line)' }}>
            {items.topClassics.map((s, i) => {
              const cover = storageUrl(s.imagePath);
              return (
                <a
                  key={s.id}
                  href={s.externalUrl || undefined}
                  target={s.externalUrl ? '_blank' : undefined}
                  rel={s.externalUrl ? 'noreferrer' : undefined}
                  className={`flex items-center gap-4 sm:gap-8${s.externalUrl ? ' transition-all duration-150 hover:bg-[var(--color-bg-2)] active:scale-[1.02]' : ''}`}
                  style={{ background: 'var(--color-bg)', padding: '20px 16px', cursor: s.externalUrl ? 'pointer' : 'default' }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--color-muted)', minWidth: '28px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="overflow-hidden shrink-0 border flex items-center justify-center" style={{ width: '44px', height: '44px', borderColor: 'var(--color-line-strong)', background: 'var(--color-bg-2)', borderRadius: '3px' }}>
                    {cover
                      ? <img src={cover} alt={s.primaryText ?? ''} className="w-full h-full object-cover" />
                      : <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-gold)' }}>{s.primaryText?.[0]}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(18px, 2.5vw, 32px)', fontWeight: 400, color: 'var(--color-ink)', lineHeight: 1.1 }}>{s.primaryText}</div>
                    <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>{s.secondaryText}</div>
                  </div>
                  {s.externalUrl && <Arrow />}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ COVER ART WALL ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">

          <div className="flex items-center gap-6 mb-4">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>
              ✦ Dwad Music
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>

          <div className="mb-10">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 4vw, 72px)', lineHeight: 0.96, letterSpacing: '-0.02em' }}>
              Sound of{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>this season.</span>
            </h2>
          </div>

          <style>{`
            .cover-wall {
              grid-template-columns: repeat(3, 1fr);
            }
            @media (min-width: 480px) {
              .cover-wall { grid-template-columns: repeat(4, 1fr); }
            }
            @media (min-width: 768px) {
              .cover-wall { grid-template-columns: repeat(6, 1fr); }
            }
            @media (min-width: 1200px) {
              .cover-wall { grid-template-columns: repeat(8, 1fr); }
            }
          `}</style>
          <div className="cover-wall grid gap-1">
            {items.coverWall.map((item, i) => (
              <div
                key={item.id}
                className="relative overflow-hidden group cursor-pointer"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={storageUrl(item.imagePath) ?? undefined}
                  alt={`Release ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 60%)' }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: 'inset 0 0 0 2px var(--color-gold)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="flex items-center gap-8 px-5 sm:px-14">
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontStyle: 'italic', color: 'var(--color-gold)' }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-line-strong)' }} />
      </div>

      {/* ══ ARTIST OF THE MONTH ══ */}
      <section className="py-16 sm:py-[100px] px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 mb-10">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', whiteSpace: 'nowrap' }}>✦ Artist of the Month</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-line)' }} />
          </div>
          <p className="mb-10" style={{ fontSize: '14px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Most Outstanding Music Artist of the Month
          </p>
          <div className="grid gap-10 items-center grid-cols-1 min-[820px]:grid-cols-2">
            <div className="relative overflow-hidden border" style={{ aspectRatio: '3/4', borderColor: 'var(--color-line)' }}>
              <img src={storageUrl(settings.artistOfMonth.photoUrl) ?? undefined} alt={settings.artistOfMonth.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {settings.artistOfMonth.name}
              </h2>
              <div className="mt-10 flex flex-col gap-4">
                {[
                  { label: 'Genre',   value: settings.artistOfMonth.genre },
                  { label: 'Country', value: settings.artistOfMonth.country },
                ].filter((d) => d.value).map(d => (
                  <div key={d.label} className="flex gap-6 border-b pb-4" style={{ borderColor: 'var(--color-line)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase', minWidth: '80px' }}>{d.label}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--color-ink)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET FEATURED CTA ── */}
      <section className="py-12 sm:py-20 px-5 sm:px-14">
        <div className="max-w-[1440px] mx-auto">
          <div
            className="flex flex-col"
            style={{ background: 'var(--color-bg-2)', padding: 'clamp(40px, 6vw, 80px) clamp(28px, 5vw, 72px)', border: '1px solid var(--color-line)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: '28px' }}>
              ✦ Get Featured
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(36px, 5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.015em', maxWidth: '16ch' }}>
              Do you want to get featured on the{' '}
              <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>Dwad Music Spotlight?</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://wa.me/message/VYJP7JFQPZXSN1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', padding: '16px 28px', background: 'var(--color-gold)', color: 'var(--color-bg)' }}
              >
                Talk to us<Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Ticker items={['Spotlight Vol. 04', 'New Issues Monthly', 'Pitch Open', 'Lagos Editorial']} />
    </div>
  );
}
