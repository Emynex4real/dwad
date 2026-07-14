import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { checkInvite, registerViaInvite } from '../services/invites.service';
import { ApiError } from '../services/httpClient';
import { PLAN_DEFINITIONS } from '../services/subscriptions.service';
import { logoWhite } from '../data';
import type { SubscriptionPlan } from '../types/dashboard';

export default function ArtistSignupPage() {
  const { token } = useParams<{ token: string }>();
  const [valid, setValid] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [spotify, setSpotify] = useState('');
  const [instagram, setInstagram] = useState('');
  const [plan, setPlan] = useState<SubscriptionPlan>('plan-a');

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

    const planDef = PLAN_DEFINITIONS.find((p) => p.id === plan);
    setSubmitting(true);
    try {
      await registerViaInvite(token, {
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        genre: genre.trim(),
        country: country.trim(),
        bio: bio.trim(),
        socialLinks: {
          ...(spotify.trim() ? { spotify: spotify.trim() } : {}),
          ...(instagram.trim() ? { instagram: instagram.trim() } : {}),
        },
        subscription: { plan, price: planDef?.price ?? 0 },
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
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="At least 8 characters" />
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
                  <div className="login-field">
                    <label htmlFor="spotify">Spotify URL</label>
                    <input id="spotify" value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="signup-row">
                  <div className="login-field">
                    <label htmlFor="instagram">Instagram URL</label>
                    <input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div className="login-field">
                  <label htmlFor="bio">Bio</label>
                  <textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Optional — a short intro artists will see on your profile" />
                </div>
              </div>

              <div className="signup-section">
                <div className="signup-section__title">Choose Your Plan</div>
                <div className="plan-grid">
                  {PLAN_DEFINITIONS.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      className={`plan-card ${plan === p.id ? 'plan-card--selected' : ''}`}
                      onClick={() => setPlan(p.id)}
                    >
                      <div className="plan-card__top">
                        <span className="plan-card__name">{p.name}</span>
                        <span className="plan-card__check">✓</span>
                      </div>
                      <div className="plan-card__price">${p.price}/yr</div>
                      <ul className="plan-card__features">
                        {p.features.slice(0, 2).map((f) => <li key={f}>{f}</li>)}
                      </ul>
                    </button>
                  ))}
                </div>
                <p className="signup-hint">You can change your plan later once your account is approved.</p>
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
