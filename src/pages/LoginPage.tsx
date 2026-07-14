import { useState, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { useAuth } from '../hooks/useAuth';
import { logoWhite } from '../data';

export default function LoginPage() {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-hints">
          <p className="login-hints__title">Demo credentials</p>
          <p><strong>Admin:</strong> admin@dwadmusic.com</p>
          <p><strong>Artist:</strong> akiib@dwadmusic.com</p>
          <p><strong>Password:</strong> password123</p>
        </div>
      </div>

      <div className="login-bg" aria-hidden>
        <div className="login-bg__glow" />
      </div>
    </div>
  );
}
