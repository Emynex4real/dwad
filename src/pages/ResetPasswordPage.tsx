import { useState, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { resetPassword } from '../services/auth.service';
import { logoWhite } from '../data';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is invalid.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const result = await resetPassword(token, password);
    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  }

  return (
    <div className="login-root">
      <SEO
        title="Reset Your Password | Dwad Music"
        description="Set a new password for your Dwad Music account."
        canonical="/reset-password"
        noIndex
      />
      <div className="login-card">
        <img src={logoWhite} alt="Dwad Music" className="login-logo" />

        {submitted ? (
          <div className="login-heading">
            <h1>Password updated</h1>
            <p>Your password has been reset. You can now sign in with your new password.</p>
          </div>
        ) : (
          <>
            <div className="login-heading">
              <h1>Set a new password</h1>
              <p>Choose a new password for your account.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="password">New password</label>
                <div className="login-password-wrap">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoFocus
                    autoComplete="new-password"
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
              </div>

              <div className="login-field">
                <label htmlFor="confirmPassword">Confirm new password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? 'Resetting…' : 'Reset password'}
              </button>
            </form>
          </>
        )}

        <Link to="/login" className="login-forgot login-forgot--center">
          Back to sign in
        </Link>
      </div>

      <div className="login-bg" aria-hidden>
        <div className="login-bg__glow" />
      </div>
    </div>
  );
}
