import { useNavigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import Arrow from '../components/ui/Arrow';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      <SEO
        title="Page Not Found | Dwad Music"
        description="The page you're looking for doesn't exist. Explore Dwad Music's services — distribution, production and promotion for independent artists."
        noIndex
      />

      <section
        className="flex flex-col items-start justify-center min-h-screen px-5 sm:px-14 pt-32 pb-20"
      >
        <div className="max-w-[1440px] w-full mx-auto">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '28px',
            }}
          >
            ✦ 404
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              fontSize: 'clamp(64px, 12vw, 200px)',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: 'var(--color-ink)',
            }}
          >
            Page not<br />
            <span className="italic font-light" style={{ color: 'var(--color-gold-2)' }}>found.</span>
          </h1>
          <p
            className="mt-8"
            style={{
              fontSize: '17px',
              lineHeight: 1.55,
              color: 'var(--color-ink-2)',
              fontWeight: 300,
              maxWidth: '480px',
            }}
          >
            The page you're looking for doesn't exist or has been moved. Head back home to explore what Dwad Music has to offer.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-3 transition-colors duration-250 hover:bg-[var(--color-gold-2)]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '16px 28px',
                background: 'var(--color-gold)',
                color: 'var(--color-bg)',
              }}
            >
              Back to home<Arrow />
            </button>
            <button
              onClick={() => navigate('/distro')}
              className="inline-flex items-center gap-3 border transition-all duration-250 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                padding: '16px 28px',
                borderColor: 'var(--color-line-strong)',
                color: 'var(--color-ink)',
              }}
            >
              Distribution<Arrow />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
