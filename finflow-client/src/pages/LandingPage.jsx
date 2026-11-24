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

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font)', overflowX: 'hidden' }}>

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'var(--surface)' : 'transparent',
        borderBottom: scrolled ? '2px solid var(--border)' : 'none',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em' }}>
          <span style={{ color: 'var(--text)' }}>Fin</span>
          <span style={{
            color: '#171717', background: 'var(--lime)',
            padding: '0 5px', borderRadius: 4,
            border: '1.5px solid var(--border)',
          }}>Flow</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <button className="hide-on-mobile" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: 'var(--text2)',
            fontFamily: 'var(--font)', padding: 0,
          }} onClick={() => scrollTo('features')}>Features</button>
          <button className="hide-on-mobile" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: 'var(--text2)',
            fontFamily: 'var(--font)', padding: 0,
          }} onClick={() => scrollTo('about')}>About</button>
          <button className="hide-on-mobile" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: 'var(--text2)',
            fontFamily: 'var(--font)', padding: 0,
          }} onClick={() => scrollTo('how-it-works')}>How it works</button>

          <button onClick={toggleTheme} style={{
            background: 'none', border: '1.5px solid var(--border)', borderRadius: 6,
            cursor: 'pointer', color: 'var(--text2)',
            display: 'flex', alignItems: 'center', padding: 7, transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button style={{
            padding: '8px 18px', border: '1.5px solid var(--border)',
            borderRadius: 6, background: 'transparent', cursor: 'pointer',
            fontSize: 14, fontWeight: 600, color: 'var(--text)',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            onClick={onLogin}
          >Log In</button>

          <button style={{
            padding: '8px 18px', border: '1.5px solid var(--border)',
            borderRadius: 6, background: 'var(--lime)', cursor: 'pointer',
            fontSize: 14, fontWeight: 700, color: '#171717',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
            boxShadow: '3px 3px 0px var(--border)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border)'; }}
            onClick={onGetStarted}
          >Get Started</button>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 40px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background geometric decoration */}
        <div style={{
          position: 'absolute', top: '15%', right: '8%',
          width: 180, height: 180, borderRadius: 8,
          border: '2px solid var(--lime)', opacity: 0.25,
          transform: 'rotate(15deg)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '6%',
          width: 100, height: 100, borderRadius: 4,
          background: 'var(--lime)', opacity: 0.08,
          transform: 'rotate(-10deg)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 760, position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 4,
            background: 'var(--lime)', border: '1.5px solid var(--border)',
            fontSize: 12, fontWeight: 700, color: '#171717',
            marginBottom: 28, boxShadow: '2px 2px 0px var(--border)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            ✦ Smart Finance Tracker
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800,
            lineHeight: 1.05, letterSpacing: '-0.04em',
            marginBottom: 24, color: 'var(--text)',
          }}>
            Take Control of Your{' '}
            <span style={{
              color: '#171717',
              background: 'var(--lime)',
              padding: '0 8px',
              borderRadius: 4,
              border: '1.5px solid var(--border)',
              display: 'inline-block',
              transform: 'rotate(-0.5deg)',
            }}>Finances</span>{' '}
            Today
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 18, color: 'var(--text2)', lineHeight: 1.7,
            maxWidth: 540, margin: '0 auto 40px',
          }}>
            FinFlow helps you track expenses, set budgets, and understand your spending habits — all in one bold, easy-to-use app.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{
              padding: '14px 32px', background: 'var(--lime)', color: '#171717',
              border: '2px solid var(--border)', borderRadius: 6, fontSize: 16, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font)',
              boxShadow: '4px 4px 0px var(--border)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px var(--border)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; }}
            >
              Start for Free →
            </button>
            <button onClick={() => scrollTo('how-it-works')} style={{
              padding: '14px 32px', background: 'var(--surface)', color: 'var(--text)',
              border: '2px solid var(--border)', borderRadius: 6, fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
              boxShadow: '4px 4px 0px var(--border)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px var(--border)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; }}
            >
              See How It Works
            </button>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 32, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap',
          }}>
            {[
              { value: '100%', label: 'Free to use' },
              { value: 'OTP', label: 'Email verified' },
              { value: '∞', label: 'Transactions' },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: 'center',
                padding: '12px 24px',
                border: '1.5px solid var(--border)', borderRadius: 6,
                background: 'var(--surface)',
                boxShadow: '3px 3px 0px var(--border)',
              }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 4,
            background: 'var(--lime)', border: '1.5px solid var(--border)',
            fontSize: 11, fontWeight: 700, color: '#171717',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
            boxShadow: '2px 2px 0px var(--border)',
          }}>
            Features
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
            Everything you need to manage money
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
            Built with powerful features that make financial tracking simple and insightful.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[
            { icon: '◈', color: '#171717', bg: 'var(--lime)', title: 'Smart Dashboard', desc: 'Get a complete picture of your finances at a glance — balance, income, expenses, and monthly summaries with AI-powered insights.' },
            { icon: '▦', color: '#fff', bg: '#171717', title: 'Analytics & Charts', desc: 'Beautiful pie, bar, and line charts that reveal your spending patterns. Export reports as PDF or CSV anytime.' },
            { icon: '◎', color: '#171717', bg: 'var(--lavender)', title: 'Budget Planner', desc: 'Set monthly budgets per category. Get real-time alerts when you\'re nearing or exceeding your limits.' },
            { icon: '⇄', color: '#fff', bg: 'var(--red)', title: 'Transaction Tracking', desc: 'Add, edit, and delete transactions with ease. Filter by date, category, or type and search anything instantly.' },
            { icon: '🔒', color: '#171717', bg: 'var(--lime-light)', title: 'Secure Authentication', desc: 'OTP-based email verification, JWT tokens, and bcrypt-hashed passwords keep your financial data safe.' },
            { icon: '◑', color: '#fff', bg: 'var(--text)', title: 'Dark Mode', desc: 'Fully responsive design with a beautiful dark mode. Works perfectly on desktop, tablet, and mobile.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--surface)', border: '2px solid var(--border)',
              borderRadius: 8, padding: '24px',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '4px 4px 0px var(--border)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px var(--border)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 6,
                background: f.bg, border: '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" style={{
        padding: '100px 40px',
        background: 'var(--surface)',
        borderTop: '2px solid var(--border)',
        borderBottom: '2px solid var(--border)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 4,
              background: 'var(--lime)', border: '1.5px solid var(--border)',
              fontSize: 11, fontWeight: 700, color: '#171717',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16,
              boxShadow: '2px 2px 0px var(--border)',
            }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Up and running in 3 steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            {[
              { step: '01', bg: 'var(--lime)', title: 'Create your account', desc: 'Sign up with your email. We\'ll send a 6-digit OTP to verify your identity — no passwords saved in plain text.' },
              { step: '02', bg: 'var(--lavender)', title: 'Add your transactions', desc: 'Log your income and expenses by category. Set monthly budgets to know exactly where your money is going.' },
              { step: '03', bg: 'var(--red-light)', title: 'Get smart insights', desc: 'FinFlow analyzes your data and shows you spending trends, savings rate, and budget alerts automatically.' },
            ].map(s => (
              <div key={s.step} style={{ position: 'relative' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 56, height: 56, borderRadius: 8,
                  background: s.bg, border: '2px solid var(--border)',
                  boxShadow: '3px 3px 0px var(--border)',
                  fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)',
                  color: '#171717', marginBottom: 16,
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Section ──────────────────────────────────────────────────── */}
      <section id="about" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="grid-2-to-1" style={{ display: 'grid', gap: 60, alignItems: 'center' }}>
          {/* Left — text */}
          <div>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 4,
              background: 'var(--lavender)', border: '1.5px solid var(--border)',
              fontSize: 11, fontWeight: 700, color: '#171717',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
              boxShadow: '2px 2px 0px var(--border)',
            }}>
              About FinFlow
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20, lineHeight: 1.2 }}>
              Built to make personal finance simple
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 20 }}>
              FinFlow was built as a full-stack learning project to solve a real problem — most people don't track their spending, not because they don't want to, but because existing tools are too complex.
            </p>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 32 }}>
              We built FinFlow to be different: clean, fast, and focused. No subscription fees, no bloat — just the tools you need to understand and improve your financial habits.
            </p>

            {/* Tech stack badges */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Built with
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['React 18', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'Chart.js'].map(tech => (
                  <span key={tech} style={{
                    padding: '4px 12px', borderRadius: 4,
                    background: 'var(--surface2)', border: '1.5px solid var(--border)',
                    fontSize: 12, fontWeight: 600, color: 'var(--text2)',
                    boxShadow: '2px 2px 0px var(--border)',
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — demo card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'var(--surface)', border: '2px solid var(--border)',
              borderRadius: 8, padding: 28,
              boxShadow: '6px 6px 0px var(--border)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
                This Month
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Income', value: '₹55,000', color: 'var(--green)', bg: 'var(--lime)' },
                  { label: 'Expenses', value: '₹28,400', color: 'var(--red)', bg: 'var(--red-light)' },
                  { label: 'Savings', value: '₹26,600', color: 'var(--blue)', bg: 'var(--blue-light)' },
                  { label: 'Budget Used', value: '56%', color: 'var(--amber)', bg: 'var(--amber-light)' },
                ].map(m => (
                  <div key={m.label} style={{
                    background: m.bg, borderRadius: 6, padding: '12px 14px',
                    border: '1.5px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#171717', fontFamily: 'var(--font-mono)' }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                  Spending by category
                </div>
                {[
                  { cat: 'Rent', pct: 42 },
                  { cat: 'Food', pct: 18 },
                  { cat: 'Transport', pct: 10 },
                  { cat: 'Shopping', pct: 15 },
                ].map(b => (
                  <div key={b.cat} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{b.cat}</span>
                      <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{b.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border-soft)', borderRadius: 2, overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
                      <div style={{ height: '100%', width: `${b.pct}%`, background: 'var(--lime)', transition: 'width 1s ease', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating insight card */}
            <div style={{
              position: 'absolute', bottom: -18, right: -18,
              background: 'var(--surface)', border: '2px solid var(--amber)',
              borderRadius: 6, padding: '10px 14px',
              boxShadow: '4px 4px 0px var(--border)',
              maxWidth: 190,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--amber)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ⚡ AI Insight
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                Your savings rate is 48% — excellent!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────────── */}
      <section style={{
        padding: '100px 40px', textAlign: 'center',
        background: 'var(--lime)',
        borderTop: '2px solid var(--border)',
        borderBottom: '2px solid var(--border)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, color: '#171717' }}>
            Ready to take control of your finances?
          </h2>
          <p style={{ fontSize: 16, color: '#3a5c00', lineHeight: 1.7, marginBottom: 36 }}>
            Join FinFlow today — it's completely free. Start tracking your spending and building better financial habits.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={{
              padding: '14px 36px', background: '#171717', color: '#fff',
              border: '2px solid #171717', borderRadius: 6, fontSize: 16, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font)',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.3)'; }}
            >
              Create Free Account
            </button>
            <button onClick={onLogin} style={{
              padding: '14px 36px', background: 'transparent', color: '#171717',
              border: '2px solid #171717', borderRadius: 6, fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.2)'; }}
            >
              Log In
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer style={{
        padding: '28px 40px',
        borderTop: '2px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--text)' }}>Fin</span>
          <span style={{
            color: '#171717', background: 'var(--lime)',
            padding: '0 5px', borderRadius: 4,
            border: '1.5px solid var(--border)',
          }}>Flow</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Built with React · Node.js · MongoDB
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Features', 'About', 'How it works'].map(link => (
            <button key={link}
              onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font)',
                fontWeight: 600,
              }}
            >
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
