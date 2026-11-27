import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function AuthPage({ defaultScreen = 'login', onBackToHome }) {
  const { login, setAuthSession } = useApp();

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
          setScreen('verify'); setOtp('');
        } else {
          setError(data.message || 'Registration failed.');
        }
      } else if (screen === 'login') {
        const res = await login(email, password);
        if (res && res.needsVerification) {
          setPendingEmail(res.email || email);
          setMessage('Your email is not verified. Enter the OTP sent to ' + (res.email || email));
          setScreen('verify'); setOtp('');
        } else if (res === false || (res && !res.success)) {
          setError(res?.message || 'Login failed. Please check your credentials.');
        }
      } else if (screen === 'verify') {
        if (otp.length !== 6) { setError('Please enter the 6-digit code.'); setLoading(false); return; }
        const data = await api.verifyOTP({ email: pendingEmail, otp });
        if (data.token) { await setAuthSession(data); }
        else { setError(data.message || 'Invalid OTP.'); }
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

  // ── Shared style helpers ─────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid var(--border)', borderRadius: 6,
    background: 'var(--surface2)', color: 'var(--text)',
    fontSize: 14, fontFamily: 'var(--font)', outline: 'none',
    marginBottom: 14, boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: 'var(--text3)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: 5,
  };

  const btnStyle = {
    width: '100%', padding: '13px',
    background: loading ? 'var(--border-soft)' : 'var(--lime)',
    color: '#171717',
    border: '1.5px solid var(--border)', borderRadius: 6,
    fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.75 : 1, marginTop: 8,
    transition: 'all 0.15s',
    boxShadow: loading ? 'none' : '3px 3px 0px var(--border)',
  };

  const errorStyle = {
    background: 'var(--red-light)', border: '1.5px solid var(--red)',
    color: 'var(--red)', borderRadius: 6, padding: '10px 14px',
    fontSize: 13, marginBottom: 14,
  };

  const successStyle = {
    background: 'var(--lime-light)', border: '1.5px solid var(--lime)',
    color: '#3a5c00', borderRadius: 6, padding: '10px 14px',
    fontSize: 13, marginBottom: 14,
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'var(--surface)', border: '2px solid var(--border)',
        borderRadius: 8, padding: '36px 32px', width: '100%', maxWidth: 420,
        boxShadow: '6px 6px 0px var(--border)', animation: 'scaleIn 0.25s ease',
      }}>

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
        <div style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--text)' }}>Fin</span>
          <span style={{
            color: '#171717', background: 'var(--lime)',
            padding: '0 6px', borderRadius: 4,
            border: '1.5px solid var(--border)',
          }}>Flow</span>
        </div>

        {/* ── VERIFY SCREEN ─────────────────────────────────────────────────── */}
        {screen === 'verify' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text3)', textAlign: 'center', marginBottom: 20 }}>
              Check your email for the code
            </div>
            <div style={{
              background: 'var(--surface2)', border: '1.5px solid var(--border)',
              borderRadius: 6, padding: '8px 14px', fontSize: 13,
              color: 'var(--text2)', textAlign: 'center', marginBottom: 16,
            }}>
              📧 {pendingEmail}
            </div>
            {error   && <div style={errorStyle}>⚠ {error}</div>}
            {message && <div style={successStyle}>✓ {message}</div>}
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>6-Digit Verification Code</label>
              <input
                style={{
                  ...inputStyle,
                  fontSize: 28, fontFamily: 'var(--font-mono)', fontWeight: 700,
                  letterSpacing: '10px', textAlign: 'center',
                }}
                type="text" inputMode="numeric" maxLength={6}
                placeholder="——————" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                autoFocus required
                onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="submit" style={btnStyle} disabled={loading}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border)'; }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--text3)' }}>
              Didn't get the code?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: 'var(--font)', textDecoration: 'underline' }}
                onClick={handleResend} disabled={loading}
              >Resend OTP</button>
            </div>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font)', display: 'block', margin: '14px auto 0', textDecoration: 'underline' }}
              onClick={() => { setScreen('login'); setError(''); setMessage(''); setOtp(''); }}
            >
              ← Back to Login
            </button>
          </>
        )}

        {/* ── LOGIN SCREEN ──────────────────────────────────────────────────── */}
        {screen === 'login' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text3)', textAlign: 'center', marginBottom: 24 }}>
              Welcome back! Log in to continue.
            </div>
            {error && <div style={errorStyle}>⚠ {error}</div>}
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Email Address</label>
              <input
                style={inputStyle} type="email" placeholder="john@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <label style={labelStyle}>Password</label>
              <input
                style={inputStyle} type="password" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} required
                onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="submit" style={btnStyle} disabled={loading}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border)'; }}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text3)' }}>
              Don't have an account?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font)', textDecoration: 'underline' }}
                onClick={() => { setScreen('register'); setError(''); }}
              >Sign Up</button>
            </div>
          </>
        )}

        {/* ── REGISTER SCREEN ───────────────────────────────────────────────── */}
        {screen === 'register' && (
          <>
            <div style={{ fontSize: 14, color: 'var(--text3)', textAlign: 'center', marginBottom: 24 }}>
              Create your free account.
            </div>
            {error && <div style={errorStyle}>⚠ {error}</div>}
            <form onSubmit={handleSubmit}>
              <label style={labelStyle}>Full Name</label>
              <input
                style={inputStyle} type="text" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)} required
                onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <label style={labelStyle}>Email Address</label>
              <input
                style={inputStyle} type="email" placeholder="john@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <label style={labelStyle}>Password</label>
              <input
                style={inputStyle} type="password" placeholder="Min. 6 characters"
                value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="submit" style={btnStyle} disabled={loading}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border)'; }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text3)' }}>
              Already have an account?{' '}
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font)', textDecoration: 'underline' }}
                onClick={() => { setScreen('login'); setError(''); }}
              >Log In</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
