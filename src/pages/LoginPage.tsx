import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { useAuth } from '../hooks/useAuth';
import { logoWhite } from '../data';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return null;
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/artist/home'} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      // AuthContext sets user; redirect happens via Navigate above on re-render
      navigate(email.toLowerCase().includes('admin') ? '/admin' : '/artist/home', { replace: true });
    } else {
      setError(result.error ?? 'Login failed. Please try again.');
    }
  }

  return (
    <div className="login-root">
      <SEO
        title="Log In to Your Artist Dashboard | Dwad Music"
        description="Sign in to your Dwad Music account. Access your personal artist dashboard to manage releases, track streams and view royalty earnings."
        canonical="/login"
        noIndex
      />
      <div className="login-card">
        <img src={logoWhite} alt="Dwad Music" className="login-logo" />

        <div className="login-heading">
          <h1>Sign In</h1>
          <p>Access your dashboard using your registered email address.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A10.7 10.7 0 0112 5c5 0 9 4 10 7-1 2.14-2.5 4.51-4.62 6.06M6.62 6.62C4.5 8.17 3 10.5 2 12c1 3 5 7 10 7a10.7 10.7 0 002.12-.21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>
            <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="login-bg" aria-hidden>
        <div className="login-bg__glow" />
      </div>
    </div>
  );
}
