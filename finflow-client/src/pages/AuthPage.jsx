import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

// ── 3 screens: 'login' | 'register' | 'verify' ───────────────────────────
export default function AuthPage() {
  const { login } = useApp();

  const [screen, setScreen]           = useState('login');
  const [pendingEmail, setPendingEmail] = useState('');

  // form fields
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]           = useState('');

  // UI state
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');

  // ── SUBMIT HANDLER ──────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {

      // ── REGISTER ────────────────────────────────────────────────────────
      if (screen === 'register') {
        const data = await api.register({ name, email, password });

        if (data.email) {
          // success → backend sent OTP → go to verify screen
          setPendingEmail(data.email);
          setMessage('A 6-digit code has been sent to ' + data.email);
          setScreen('verify');
          setOtp('');
        } else {
          setError(data.message || 'Registration failed.');
        }
      }

      // ── LOGIN ────────────────────────────────────────────────────────────
      else if (screen === 'login') {
        const data = await api.login({ email, password });

        if (data.needsVerification) {
          // account exists but email not verified → show OTP screen
          setPendingEmail(data.email);
          setMessage('Your email is not verified. Enter the OTP sent to ' + data.email);
          setScreen('verify');
          setOtp('');
        } else if (data.token) {
          // fully verified → log in
          await login(email, password);
        } else {
          setError(data.message || 'Login failed.');
        }
      }

      // ── VERIFY OTP ───────────────────────────────────────────────────────
      else if (screen === 'verify') {
        if (otp.length !== 6) {
          setError('Please enter the 6-digit code.');
          setLoading(false);
          return;
        }

        const data = await api.verifyOTP({ email: pendingEmail, otp });

        if (data.token) {
          // verified! save token + user then reload → AppContext picks it up
          localStorage.setItem('ff_token', data.token);
          localStorage.setItem('ff_user', JSON.stringify(data.user));
          window.location.reload();
        } else {
          setError(data.message || 'Invalid OTP.');
        }
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── RESEND OTP ──────────────────────────────────────────────────────────
  async function handleResend() {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await api.resendOTP(pendingEmail);
      setMessage(data.message || 'New OTP sent!');
      setOtp('');
    } catch {
      setError('Failed to resend OTP. Try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── STYLES ──────────────────────────────────────────────────────────────
  const s = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    card: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '36px 32px',
      width: '100%',
      maxWidth: 420,
      boxShadow: 'var(--shadow-lg)',
      animation: 'scaleIn 0.25s ease',
    },
    logo: {
      fontSize: 26,
      fontWeight: 700,
      textAlign: 'center',
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: 'var(--text3)',
      textAlign: 'center',
      marginBottom: 28,
    },
    label: {
      display: 'block',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--text3)',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      marginBottom: 5,
    },
    input: {
      width: '100%',
      padding: '10px 14px',
      border: '1px solid var(--border2)',
      borderRadius: 8,
      background: 'var(--surface2)',
      color: 'var(--text)',
      fontSize: 14,
      fontFamily: 'var(--font)',
      outline: 'none',
      marginBottom: 14,
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
    },
    otpInput: {
      width: '100%',
      padding: '14px',
      border: '1px solid var(--border2)',
      borderRadius: 10,
      background: 'var(--surface2)',
      color: 'var(--text)',
      fontSize: 28,
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      letterSpacing: '12px',
      textAlign: 'center',
      outline: 'none',
      marginBottom: 14,
      boxSizing: 'border-box',
    },
    btn: {
      width: '100%',
      padding: '12px',
      background: loading ? 'var(--green-dark)' : 'var(--green)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'var(--font)',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.8 : 1,
      marginTop: 4,
      transition: 'all 0.2s',
    },
    error: {
      background: 'rgba(255,112,67,0.1)',
      border: '1px solid rgba(255,112,67,0.3)',
      color: 'var(--red)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
      marginBottom: 14,
    },
    success: {
      background: 'rgba(76,175,80,0.1)',
      border: '1px solid rgba(76,175,80,0.25)',
      color: 'var(--green)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
      marginBottom: 14,
    },
    toggle: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 14,
      color: 'var(--text3)',
    },
    toggleBtn: {
      background: 'none',
      border: 'none',
      color: 'var(--green)',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 14,
      fontFamily: 'var(--font)',
      marginLeft: 4,
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: 'var(--text3)',
      fontSize: 13,
      cursor: 'pointer',
      fontFamily: 'var(--font)',
      display: 'block',
      margin: '14px auto 0',
      textDecoration: 'underline',
    },
    emailBadge: {
      background: 'var(--surface2)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '8px 14px',
      fontSize: 13,
      color: 'var(--text2)',
      textAlign: 'center',
      marginBottom: 16,
      fontWeight: 500,
    },
    resendRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      marginTop: 14,
      fontSize: 13,
      color: 'var(--text3)',
    },
    resendBtn: {
      background: 'none',
      border: 'none',
      color: 'var(--green)',
      fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: 13,
      fontFamily: 'var(--font)',
    },
  };

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <span style={{ color: 'var(--green)' }}>Fin</span>
          <span style={{ color: 'var(--text)' }}>Flow</span>
        </div>

        {/* ── VERIFY OTP SCREEN ─────────────────────────────────────────── */}
        {screen === 'verify' && (
          <>
            <div style={s.subtitle}>Check your email for the code</div>

            {/* Show which email we sent to */}
            <div style={s.emailBadge}>📧 {pendingEmail}</div>

            {/* Messages */}
            {error   && <div style={s.error}>⚠ {error}</div>}
            {message && <div style={s.success}>✓ {message}</div>}

            <form onSubmit={handleSubmit}>
              <label style={s.label}>6-Digit Verification Code</label>
              <input
                style={s.otpInput}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="——————"
                value={otp}
                onChange={e => {
                  // only allow numbers
                  const val = e.target.value.replace(/\D/g, '');
                  setOtp(val);
                }}
                autoFocus
                required
              />

              <button type="submit" style={s.btn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            {/* Resend OTP */}
            <div style={s.resendRow}>
              Didn't get the code?
              <button style={s.resendBtn} onClick={handleResend} disabled={loading}>
                Resend OTP
              </button>
            </div>

            {/* Go back */}
            <button style={s.backBtn} onClick={() => {
              setScreen('login');
              setError('');
              setMessage('');
              setOtp('');
            }}>
              ← Back to Login
            </button>
          </>
        )}

        {/* ── LOGIN SCREEN ──────────────────────────────────────────────── */}
        {screen === 'login' && (
          <>
            <div style={s.subtitle}>Welcome back! Log in to continue.</div>

            {error && <div style={s.error}>⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <label style={s.label}>Email Address</label>
              <input
                style={s.input}
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <label style={s.label}>Password</label>
              <input
                style={s.input}
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <button type="submit" style={s.btn} disabled={loading}>
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div style={s.toggle}>
              Don't have an account?
              <button style={s.toggleBtn} onClick={() => {
                setScreen('register');
                setError('');
                setMessage('');
              }}>
                Sign Up
              </button>
            </div>
          </>
        )}

        {/* ── REGISTER SCREEN ───────────────────────────────────────────── */}
        {screen === 'register' && (
          <>
            <div style={s.subtitle}>Create your free account.</div>

            {error && <div style={s.error}>⚠ {error}</div>}

            <form onSubmit={handleSubmit}>
              <label style={s.label}>Full Name</label>
              <input
                style={s.input}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <label style={s.label}>Email Address</label>
              <input
                style={s.input}
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <label style={s.label}>Password</label>
              <input
                style={s.input}
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />

              <button type="submit" style={s.btn} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div style={s.toggle}>
              Already have an account?
              <button style={s.toggleBtn} onClick={() => {
                setScreen('login');
                setError('');
                setMessage('');
              }}>
                Log In
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}