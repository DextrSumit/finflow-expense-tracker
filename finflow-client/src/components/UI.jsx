import React from 'react';

export function Card({ children, style, className = '' }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
      <style>{`
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          box-shadow: var(--shadow);
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export function StatCard({ label, value, sub, color = 'var(--blue)', accent }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      padding: '18px 20px', boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: '14px 14px 0 0' }} />
      <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 600, color, fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function Btn({ children, onClick, variant = 'default', size = 'md', style, disabled, type = 'button' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)',
    fontWeight: 500, transition: 'all 0.18s', opacity: disabled ? 0.5 : 1,
    borderRadius: 'var(--radius-sm)',
  };
  const sizes = { sm: { padding: '6px 12px', fontSize: 13 }, md: { padding: '9px 18px', fontSize: 14 }, lg: { padding: '12px 24px', fontSize: 15 } };
  const variants = {
    default: { background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border2)' },
    primary: { background: 'var(--green)', color: '#fff' },
    danger: { background: 'var(--red-light)', color: 'var(--red)', border: '1px solid rgba(255,112,67,0.2)' },
    ghost: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function Badge({ children, color = 'var(--green)', bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.02em',
      color, background: bg || `${color}18`,
    }}>
      {children}
    </span>
  );
}

export function ProgressBar({ pct, color }) {
  const c = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : color || 'var(--green)';
  return (
    <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: c, borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>}
      <input style={{
        padding: '9px 12px', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
        background: 'var(--surface2)', color: 'var(--text)', fontSize: 14, outline: 'none',
        transition: 'border-color 0.2s', fontFamily: 'var(--font)',
      }}
        onFocus={e => e.target.style.borderColor = 'var(--green)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>}
      <select style={{
        padding: '9px 12px', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
        background: 'var(--surface2)', color: 'var(--text)', fontSize: 14, outline: 'none',
        transition: 'border-color 0.2s', fontFamily: 'var(--font)', cursor: 'pointer',
      }}
        onFocus={e => e.target.style.borderColor = 'var(--green)'}
        onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease'
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 28,
        width: 440, maxWidth: '92vw', boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.22s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--text3)', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)', animation: 'fadeIn 0.3s ease' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 500, color: 'var(--text2)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13 }}>{sub}</div>
    </div>
  );
}
