import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  // Toggle between login and register form
  const [isLogin, setIsLogin] = useState(true);

  // Form fields
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  // Get auth functions and state from context
  const { login, register, authLoading, authError } = useApp();

  // ── Handle form submit ──────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault(); // stop page from refreshing

    if (isLogin) {
      // Call login from AppContext → hits POST /api/auth/login
      await login(email, password);
    } else {
      // Call register from AppContext → hits POST /api/auth/register
      const success = await register(name, email, password);
      if (success) setIsLogin(true); // after registering, go to login
    }
  }

  // ── Styles (inline so no extra CSS file needed) ─────────────────────────
  const styles = {
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
      padding: 36,
      width: '100%',
      maxWidth: 420,
      boxShadow: 'var(--shadow-lg)',
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
    },
    button: {
      width: '100%',
      padding: '12px',
      background: 'var(--green)',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'var(--font)',
      cursor: authLoading ? 'not-allowed' : 'pointer',
      opacity: authLoading ? 0.7 : 1,
      marginTop: 4,
      transition: 'opacity 0.2s',
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
    divider: {
      borderBottom: '1px solid var(--border)',
      margin: '20px 0',
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <span style={{ color: 'var(--green)' }}>Fin</span>
          <span style={{ color: 'var(--text)' }}>Flow</span>
        </div>
        <div style={styles.subtitle}>
          {isLogin ? 'Welcome back! Log in to continue.' : 'Create your free account.'}
        </div>

        {/* Error message (shown only if authError exists) */}
        {authError && (
          <div style={styles.error}>⚠ {authError}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name field — only shown on Register */}
          {!isLogin && (
            <div>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Submit button */}
          <button type="submit" style={styles.button} disabled={authLoading}>
            {authLoading
              ? (isLogin ? 'Logging in...' : 'Creating account...')
              : (isLogin ? 'Log In' : 'Create Account')
            }
          </button>
        </form>

        {/* Switch between Login / Register */}
        <div style={styles.toggle}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            style={styles.toggleBtn}
            onClick={() => {
              setIsLogin(!isLogin);
              setName('');
              setEmail('');
              setPassword('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>

      </div>
    </div>
  );
}