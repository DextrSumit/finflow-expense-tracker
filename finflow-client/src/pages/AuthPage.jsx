import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function AuthPage({ defaultScreen = 'login', onBackToHome }) {
  const { login } = useApp();

  const [screen, setScreen]             = useState(defaultScreen);
  const [pendingEmail, setPendingEmail] = useState('');

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]           = useState('');

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setMessage('');
    setLoading(true);
    try {
      if (screen === 'register') {
        const data = await api.register({ name, email, password });
        if (data.email) {
          setPendingEmail(data.email);
          setMessage('A 6-digit code has been sent to ' + data.email);
          setScreen('verify');
          setOtp('');
        } else {
          setError(data.message || 'Registration failed.');
        }
      } else if (screen === 'login') {
        const data = await api.login({ email, password });
        if (data.needsVerification) {
          setPendingEmail(data.email);
          setMessage('Your email is not verified. Enter the OTP sent to ' + data.email);
          setScreen('verify');
          setOtp('');
        } else if (data.token) {
          await login(email, password);
        } else {
          setError(data.message || 'Login failed.');
        }
      } else if (screen === 'verify') {
        if (otp.length !== 6) { setError('Please enter the 6-digit code.'); setLoading(false); return; }
        const data = await api.verifyOTP({ email: pendingEmail, otp });
        if (data.token) {
          localStorage.setItem('ff_token', data.token);
          localStorage.setItem('ff_user', JSON.stringify(data.user));
          window.location.reload();
        } else {
          setError(data.message || 'Invalid OTP.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(''); setMessage(''); setLoading(true);
    try {
      const data = await api.resendOTP(pendingEmail);
      setMessage(data.message || 'New OTP sent!');
      setOtp('');
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  }

  const s = {
    page: {
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    },
    card: {
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 420,
      boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.25s ease',
    },
    logo: { fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 6 },
    subtitle: { fontSize: 14, color: 'var(--text3)', textAlign: 'center', marginBottom: 28 },
    label: { display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 },
    input: { width: '100%', padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface2)', color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font)', outline: 'none', marginBottom: 16, boxSizing: 'border-box', transition: 'all 0.2s ease' },
    otpInput: { width: '100%', padding: '14px', border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface2)', color: 'var(--text)', fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '12px', textAlign: 'center', outline: 'none', marginBottom: 16, boxSizing: 'border-box', transition: 'all 0.2s ease' },
    btn: { width: '100%', padding: '14px', background: loading ? 'var(--blue-light)' : 'var(--blue)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, fontFamily: 'var(--font)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, marginTop: 8, transition: 'all 0.2s ease', boxShadow: '0 4px 14px var(--blue-light)' },
    error: { background: 'rgba(255,112,67,0.1)', border: '1px solid rgba(255,112,67,0.3)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 },
    success: { background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.25)', color: 'var(--green)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 },
    toggle: { textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text3)' },
    toggleBtn: { background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font)', marginLeft: 4 },
    backBtn: { background: 'none', border: 'none', color: 'var(--text3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', display: 'block', margin: '14px auto 0', textDecoration: 'underline' },
    emailBadge: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--text2)', textAlign: 'center', marginBottom: 16, fontWeight: 500 },
    resendRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 13, color: 'var(--text3)' },
    resendBtn: { background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'var(--font)' },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Back to home */}
        {onBackToHome && screen !== 'verify' && (
          <button onClick={onBackToHome} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text3)', fontSize: 13, fontFamily: 'var(--font)',
            display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20, padding: 0,
          }}>
            ← Back to home
          </button>
        )}

        {/* Logo */}
        <div style={s.logo}>
          <span style={{ color: 'var(--blue)' }}>Fin</span>
          <span style={{ color: 'var(--text)' }}>Flow</span>
        </div>

        {/* ── VERIFY SCREEN ─────────────────────────────────────────────── */}
        {screen === 'verify' && (
          <>
            <div style={s.subtitle}>Check your email for the code</div>
            <div style={s.emailBadge}>📧 {pendingEmail}</div>
            {error   && <div style={s.error}>⚠ {error}</div>}
            {message && <div style={s.success}>✓ {message}</div>}
            <form onSubmit={handleSubmit}>
              <label style={s.label}>6-Digit Verification Code</label>
              <input style={s.otpInput} type="text" inputMode="numeric" maxLength={6}
                placeholder="——————" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus required />
              <button type="submit" style={s.btn} disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'none' }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <div style={s.resendRow}>
              Didn't get the code?
              <button style={s.resendBtn} onClick={handleResend} disabled={loading}>Resend OTP</button>
            </div>
            <button style={s.backBtn} onClick={() => { setScreen('login'); setError(''); setMessage(''); setOtp(''); }}>
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
              <input style={s.input} type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" style={s.btn} disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'none' }}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            <div style={s.toggle}>
              Don't have an account?
              <button style={s.toggleBtn} onClick={() => { setScreen('register'); setError(''); }}>Sign Up</button>
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
              <input style={s.input} type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
              <label style={s.label}>Email Address</label>
              <input style={s.input} type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button type="submit" style={s.btn} disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'none' }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div style={s.toggle}>
              Already have an account?
              <button style={s.toggleBtn} onClick={() => { setScreen('login'); setError(''); }}>Log In</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}