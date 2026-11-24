import React from 'react';

/* ══════════════════════════════════════════════════════════════════
   FinFlow — Neo-Brutalist UI Component Library
   ══════════════════════════════════════════════════════════════════ */

export function Card({ children, style, className = '', hover = true }) {
  const base = {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 24,
    boxShadow: 'var(--shadow)',
    animation: 'fadeIn 0.3s ease',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  };
  return (
    <div
      className={`card ${className}`}
      style={{ ...base, ...style }}
      onMouseEnter={hover ? e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; } : undefined}
      onMouseLeave={hover ? e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; } : undefined}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, sub, color = 'var(--text)', accent, highlight }) {
  return (
    <div style={{
      background: highlight ? 'var(--lime)' : 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px 22px',
      boxShadow: 'var(--shadow)',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    >
      <div style={{ fontSize: 11, color: highlight ? '#171717' : 'var(--text3)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: highlight ? '#171717' : color, fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: highlight ? '#3D3D3D' : 'var(--text3)', marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

export function Btn({ children, onClick, variant = 'default', size = 'md', style, disabled, type = 'button' }) {
  const sizes = {
    sm: { padding: '7px 14px', fontSize: 12 },
    md: { padding: '10px 18px', fontSize: 14 },
    lg: { padding: '13px 26px', fontSize: 15 },
  };
  const variants = {
    default: {
      background: 'var(--surface)', color: 'var(--text)',
      border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    },
    primary: {
      background: 'var(--lime)', color: '#171717',
      border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    },
    danger: {
      background: 'var(--red)', color: '#fff',
      border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text2)',
      border: '1.5px solid var(--border2)',
    },
  };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)',
    fontWeight: 700, letterSpacing: '0.01em',
    borderRadius: 'var(--radius-sm)',
    transition: 'all 0.12s ease',
    opacity: disabled ? 0.5 : 1,
  };
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = variants[variant]?.boxShadow || 'none'; } }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'translate(1px,1px)'; }}
      onMouseUp={e => { if (!disabled) e.currentTarget.style.transform = 'translate(-1px,-1px)'; }}
    >
      {children}
    </button>
  );
}

export function Badge({ children, color = 'var(--text)', bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
      color, background: bg || 'var(--surface2)',
      border: `1.5px solid ${color === 'var(--text)' ? 'var(--border2)' : color}`,
    }}>
      {children}
    </span>
  );
}

export function ProgressBar({ pct, color, trackBg, height = 9 }) {
  const c = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : color || 'var(--bar-green)';
  return (
    <div style={{
      height,
      background: trackBg || 'rgba(23,23,23,0.08)',
      border: '1.5px solid var(--border)',
      borderRadius: 4,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${Math.min(pct, 100)}%`,
        background: c, borderRadius: 2,
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {label}
        </label>
      )}
      <input
        style={{
          padding: '10px 13px',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontSize: 14,
          fontWeight: 500,
          outline: 'none',
          transition: 'all 0.12s ease',
          fontFamily: 'var(--font)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && (
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
          {label}
        </label>
      )}
      <select
        style={{
          padding: '10px 13px',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface)',
          color: 'var(--text)',
          fontSize: 14,
          fontWeight: 500,
          outline: 'none',
          transition: 'all 0.12s ease',
          fontFamily: 'var(--font)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--lime)'; e.target.style.boxShadow = '2px 2px 0px var(--lime)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
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
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(23,23,23,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, animation: 'fadeIn 0.18s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal-body"
        style={{
          background: 'var(--surface)',
          border: '2px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: 32,
          width: 480, maxWidth: '92vw',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)' }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface2)', border: '1.5px solid var(--border)',
              cursor: 'pointer', width: 30, height: 30, borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text2)', fontSize: 16, fontWeight: 700,
              transition: 'all 0.12s ease', boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--red)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', animation: 'fadeIn 0.3s ease' }}>
      <div style={{
        width: 64, height: 64, border: '2px solid var(--border)',
        borderRadius: 'var(--radius)', background: 'var(--surface2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32, margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)',
      }}>
        {icon}
      </div>
      <div style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 6, fontSize: 16, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text3)', maxWidth: 260, margin: '0 auto', lineHeight: 1.6 }}>{sub}</div>
    </div>
  );
}
