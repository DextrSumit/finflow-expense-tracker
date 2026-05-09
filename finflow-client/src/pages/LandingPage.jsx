import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun } from 'lucide-react';

export default function LandingPage({ onGetStarted, onLogin }) {
  const { theme, toggleTheme } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const s = {
    // Nav
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 40px', height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'var(--surface-alpha, rgba(255,255,255,0.9))' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    },
    logo: { fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', textDecoration: 'none' },
    navLinks: { display: 'flex', alignItems: 'center', gap: 32 },
    navLink: {
      background: 'none', border: 'none', cursor: 'pointer',
      fontSize: 14, fontWeight: 500, color: 'var(--text2)',
      fontFamily: 'var(--font)', transition: 'color 0.2s',
      padding: 0,
    },
    btnOutline: {
      padding: '8px 20px', border: '1px solid var(--border2)',
      borderRadius: 8, background: 'transparent', cursor: 'pointer',
      fontSize: 14, fontWeight: 500, color: 'var(--text)',
      fontFamily: 'var(--font)', transition: 'all 0.2s',
    },
    btnPrimary: {
      padding: '8px 20px', border: 'none',
      borderRadius: 8, background: 'var(--blue)', cursor: 'pointer',
      fontSize: 14, fontWeight: 600, color: '#fff',
      fontFamily: 'var(--font)', transition: 'all 0.2s',
      boxShadow: '0 2px 12px var(--blue-light)',
    },
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)', overflowX: 'hidden' }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.logo}>
          <span style={{ color: 'var(--blue)' }}>Fin</span>
          <span style={{ color: 'var(--text)' }}>Flow</span>
        </div>
        <div style={s.navLinks}>
          <button className="hide-on-mobile" style={s.navLink} onClick={() => scrollTo('features')}>Features</button>
          <button className="hide-on-mobile" style={s.navLink} onClick={() => scrollTo('about')}>About</button>
          <button className="hide-on-mobile" style={s.navLink} onClick={() => scrollTo('how-it-works')}>How it works</button>
          
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text2)', display: 'flex', alignItems: 'center',
            padding: 8, borderRadius: '50%', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button style={s.btnOutline} onClick={onLogin}>Log In</button>
          <button style={s.btnPrimary} onClick={onGetStarted}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 40px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--blue-light) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 760, position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 20,
            background: 'var(--blue-light)', border: '1px solid var(--blue)',
            fontSize: 13, fontWeight: 600, color: 'var(--blue)',
            marginBottom: 28,
          }}>
            ✦ Smart Finance Tracker
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 700,
            lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 24, color: 'var(--text)',
          }}>
            Take Control of Your{' '}
            <span style={{ color: 'var(--blue)' }}>Finances</span>{' '}
            Today
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18, color: 'var(--text2)', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 40px',
          }}>
            FinFlow helps you track expenses, set budgets, and understand your spending habits — all in one beautiful, easy-to-use app.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{
              padding: '14px 32px', background: 'var(--blue)', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font)',
              boxShadow: '0 4px 20px var(--blue-light)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px var(--blue-light)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--blue-light)'; }}
            >
              Start for Free →
            </button>
            <button onClick={() => scrollTo('how-it-works')} style={{
              padding: '14px 32px', background: 'var(--surface)', color: 'var(--text)',
              border: '1px solid var(--border2)', borderRadius: 12, fontSize: 16, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; }}
            >
              See How It Works
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '100%', label: 'Free to use' },
              { value: 'OTP', label: 'Email verified' },
              { value: '∞', label: 'Transactions' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            background: 'rgba(33,150,243,0.1)', border: '1px solid rgba(33,150,243,0.2)',
            fontSize: 12, fontWeight: 600, color: 'var(--blue)',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
          }}>
            Features
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Everything you need to manage money
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
            Built with powerful features that make financial tracking simple and insightful.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {[
            {
              icon: '◈', color: 'var(--green)', bg: 'rgba(76,175,80,0.1)',
              title: 'Smart Dashboard',
              desc: 'Get a complete picture of your finances at a glance — balance, income, expenses, and monthly summaries with AI-powered insights.',
            },
            {
              icon: '▦', color: 'var(--blue)', bg: 'rgba(33,150,243,0.1)',
              title: 'Analytics & Charts',
              desc: 'Beautiful pie, bar, and line charts that reveal your spending patterns. Export reports as PDF or CSV anytime.',
            },
            {
              icon: '◎', color: '#FF9800', bg: 'rgba(255,152,0,0.1)',
              title: 'Budget Planner',
              desc: 'Set monthly budgets per category. Get real-time alerts when you\'re nearing or exceeding your limits.',
            },
            {
              icon: '⇄', color: '#9C27B0', bg: 'rgba(156,39,176,0.1)',
              title: 'Transaction Tracking',
              desc: 'Add, edit, and delete transactions with ease. Filter by date, category, or type and search anything instantly.',
            },
            {
              icon: '🔒', color: 'var(--red)', bg: 'rgba(255,112,67,0.1)',
              title: 'Secure Authentication',
              desc: 'OTP-based email verification, JWT tokens, and bcrypt-hashed passwords keep your financial data safe.',
            },
            {
              icon: '◑', color: 'var(--text2)', bg: 'rgba(128,128,128,0.1)',
              title: 'Dark Mode',
              desc: 'Fully responsive design with a beautiful dark mode. Works perfectly on desktop, tablet, and mobile.',
            },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '24px 24px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: f.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 20, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{
        padding: '100px 40px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 20,
              background: 'var(--blue-light)', border: '1px solid var(--blue)',
              fontSize: 12, fontWeight: 600, color: 'var(--blue)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
            }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Up and running in 3 steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              {
                step: '01', color: 'var(--green)',
                title: 'Create your account',
                desc: 'Sign up with your email. We\'ll send a 6-digit OTP to verify your identity — no passwords saved in plain text.',
              },
              {
                step: '02', color: 'var(--blue)',
                title: 'Add your transactions',
                desc: 'Log your income and expenses by category. Set monthly budgets to know exactly where your money is going.',
              },
              {
                step: '03', color: '#FF9800',
                title: 'Get smart insights',
                desc: 'FinFlow analyzes your data and shows you spending trends, savings rate, and budget alerts automatically.',
              },
            ].map((s, i) => (
              <div key={s.step} style={{ position: 'relative' }}>
                {/* Step number */}
                <div style={{
                  fontSize: 48, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  color: s.color, opacity: 0.15, lineHeight: 1, marginBottom: 12,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>

                {/* Connector line */}
                {i < 2 && (
                  <div style={{
                    display: 'none', // shown via CSS on desktop
                    position: 'absolute', top: 28, right: -16,
                    width: 32, height: 1,
                    background: 'var(--border2)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="grid-2-to-1" style={{
          display: 'grid', gap: 60,
          alignItems: 'center',
        }}>
          {/* Left — text */}
          <div>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 20,
              background: 'rgba(156,39,176,0.1)', border: '1px solid rgba(156,39,176,0.2)',
              fontSize: 12, fontWeight: 600, color: '#9C27B0',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
            }}>
              About FinFlow
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20, lineHeight: 1.2 }}>
              Built to make personal finance simple
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20 }}>
              FinFlow was built as a full-stack learning project to solve a real problem — most people don't track their spending, not because they don't want to, but because existing tools are too complex.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 32 }}>
              We built FinFlow to be different: clean, fast, and focused. No subscription fees, no bloat — just the tools you need to understand and improve your financial habits.
            </p>

            {/* Tech stack badges */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Built with
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['React 18', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Chart.js'].map(tech => (
                  <span key={tech} style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    fontSize: 12, fontWeight: 500, color: 'var(--text2)',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — visual card */}
          <div style={{ position: 'relative' }}>
            {/* Main card */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 28,
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
                This Month
              </div>

              {/* Mini stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Income', value: '₹55,000', color: 'var(--green)' },
                  { label: 'Expenses', value: '₹28,400', color: 'var(--red)' },
                  { label: 'Savings', value: '₹26,600', color: 'var(--blue)' },
                  { label: 'Budget Used', value: '56%', color: '#FF9800' },
                ].map(m => (
                  <div key={m.label} style={{
                    background: 'var(--surface2)', borderRadius: 10, padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Mini bar chart */}
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>Spending by category</div>
                {[
                  { cat: 'Rent', pct: 42, color: '#607D8B' },
                  { cat: 'Food', pct: 18, color: '#FF7043' },
                  { cat: 'Transport', pct: 10, color: '#FF9800' },
                  { cat: 'Shopping', pct: 15, color: '#E91E63' },
                ].map(b => (
                  <div key={b.cat} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
                      <span style={{ color: 'var(--text2)' }}>{b.cat}</span>
                      <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{b.pct}%</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 3, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating insight card */}
            <div style={{
              position: 'absolute', bottom: -20, right: -20,
              background: 'var(--surface)', border: '1px solid var(--amber)',
              borderRadius: 12, padding: '12px 16px',
              boxShadow: '0 8px 24px var(--amber-light)',
              maxWidth: 200,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--amber)', marginBottom: 3 }}>
                ✦ AI Insight
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                Your savings rate is 48% — excellent!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 40px', textAlign: 'center',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to take control of your finances?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 36 }}>
            Join FinFlow today — it's completely free. Start tracking your spending and building better financial habits.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{
              padding: '14px 36px', background: 'var(--blue)', color: '#fff',
              border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font)',
              boxShadow: '0 4px 20px var(--blue-light)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Create Free Account
            </button>
            <button onClick={onLogin} style={{
              padding: '14px 36px', background: 'transparent', color: 'var(--text)',
              border: '1px solid var(--border2)', borderRadius: 12, fontSize: 16, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '32px 40px',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: 'var(--blue)' }}>Fin</span>
          <span style={{ color: 'var(--text)' }}>Flow</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Built with React · Node.js · MongoDB
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Features', 'About', 'How it works'].map(link => (
            <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font)',
              }}>
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
