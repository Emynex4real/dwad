import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/ui/SEO';
import { forgotPassword } from '../services/auth.service';
import { logoWhite } from '../data';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await forgotPassword(email.trim());
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
        description="Reset your Dwad Music account password."
        canonical="/forgot-password"
        noIndex
      />
      <div className="login-card">
        <img src={logoWhite} alt="Dwad Music" className="login-logo" />

        {submitted ? (
          <div className="login-heading">
            <h1>Check your email</h1>
            <p>If an account exists for {email.trim()}, we've sent a link to reset your password. It expires in 1 hour.</p>
          </div>
        ) : (
          <>
            <div className="login-heading">
              <h1>Forgot password?</h1>
              <p>Enter your registered email and we'll send you a link to reset your password.</p>
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

              {error && <div className="login-error">{error}</div>}

              <button type="submit" className="login-btn" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send reset link'}
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
