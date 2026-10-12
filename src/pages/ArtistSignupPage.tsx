import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { checkInvite, registerViaInvite } from '../services/invites.service';
import { ApiError } from '../services/httpClient';
import { logoWhite } from '../data';

export default function ArtistSignupPage() {
  const { token } = useParams<{ token: string }>();
  const [valid, setValid] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    void checkInvite(token).then(setValid);
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!token || !name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      await registerViaInvite(token, {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        genre: genre.trim(),
        country: country.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-root">
      <SEO
        title="Create Your Artist Account | Dwad Music"
        description="Create your Dwad Music artist account."
        canonical="/join"
        noIndex
      />
      <div className="login-card signup-card">
        <img src={logoWhite} alt="Dwad Music" className="login-logo" />

        {valid === null ? null : !valid ? (
          <div className="login-heading">
            <h1>Invite Link Invalid</h1>
            <p>This invite link is no longer valid — it may have already been used. Please ask your admin for a new one.</p>
          </div>
        ) : submitted ? (
          <div className="signup-success">
            <div className="signup-success__icon">✓</div>
            <div className="login-heading">
              <h1>You're all set</h1>
              <p>Your account has been created and is now awaiting admin approval. You'll be able to log in as soon as it's approved — we'll be in touch.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="login-heading">
              <h1>Create Your Artist Account</h1>
              <p>You've been invited to join Dwad Music. Fill in your details below to get started.</p>
              <div className="signup-steps">
                <span className="signup-step signup-step--done"><span className="signup-step__dot" />Invited</span>
                <span className="signup-step__line" />
                <span className="signup-step signup-step--done"><span className="signup-step__dot" />Your details</span>
                <span className="signup-step__line" />
                <span className="signup-step">Admin approval</span>
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="signup-section">
                <div className="signup-section__title">Account</div>
                <div className="signup-row">
                  <div className="login-field">
                    <label htmlFor="name">Name</label>
                    <input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
                  </div>
                  <div className="login-field">
                    <label htmlFor="email">Email address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                  </div>
                </div>
                <div className="login-field">
                  <label htmlFor="password">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      style={{ paddingRight: '64px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="signup-section">
                <div className="signup-section__title">Artist Profile</div>
                <div className="signup-row">
                  <div className="login-field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="login-field">
                    <label htmlFor="genre">Genre</label>
                    <input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="e.g. Afrobeats" />
                  </div>
                </div>
                <div className="signup-row">
                  <div className="login-field">
                    <label htmlFor="country">Country</label>
                    <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                </div>
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? 'Creating Account…' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="login-bg" aria-hidden>
        <div className="login-bg__glow" />
      </div>
    </div>
  );
}
