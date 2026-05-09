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
          padding: 24px;
          box-shadow: var(--shadow);
          animation: fadeIn 0.4s ease;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}

export function StatCard({ label, value, sub, color = 'var(--blue)', accent }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      padding: '24px', boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden', animation: 'fadeIn 0.4s ease',
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: color, opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, background: `linear-gradient(180deg, ${color}15 0%, transparent 100%)`, pointerEvents: 'none' }} />
      <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8, position: 'relative' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em', position: 'relative' }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6, position: 'relative', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

export function Btn({ children, onClick, variant = 'default', size = 'md', style, disabled, type = 'button' }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)',
    fontWeight: 600, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', opacity: disabled ? 0.6 : 1,
    borderRadius: 'var(--radius-sm)', letterSpacing: '0.01em'
  };
  const sizes = { sm: { padding: '8px 16px', fontSize: 13 }, md: { padding: '10px 20px', fontSize: 14 }, lg: { padding: '14px 28px', fontSize: 15 } };
  const variants = {
    default: { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    primary: { background: 'var(--blue)', color: '#fff', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)' },
    danger: { background: 'var(--red)', color: '#fff', boxShadow: '0 4px 12px rgba(244, 63, 94, 0.25)' },
    ghost: { background: 'transparent', color: 'var(--text2)', border: '1px solid transparent' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if(!disabled) { e.currentTarget.style.filter = 'brightness(1.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { if(!disabled) { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; } }}
      onMouseDown={e => { if(!disabled) e.currentTarget.style.transform = 'scale(0.97)'; }}
      onMouseUp={e => { if(!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
    >
      {children}
    </button>
  );
}

export function Badge({ children, color = 'var(--green)', bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
      borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em',
      color, background: bg || `${color}15`, border: `1px solid ${color}30`
    }}>
      {children}
    </span>
  );
}

export function ProgressBar({ pct, color }) {
  const c = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : color || 'var(--green)';
  return (
    <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: c, borderRadius: 4, transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'pulse 2s infinite' }} />
      </div>
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.02em' }}>{label}</label>}
      <input style={{
        padding: '12px 16px', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
        background: 'var(--surface)', color: 'var(--text)', fontSize: 15, outline: 'none',
        transition: 'all 0.2s ease', fontFamily: 'var(--font)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
        onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-light)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'; }}
        {...props}
      />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.02em' }}>{label}</label>}
      <select style={{
        padding: '12px 16px', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)',
        background: 'var(--surface)', color: 'var(--text)', fontSize: 15, outline: 'none',
        transition: 'all 0.2s ease', fontFamily: 'var(--font)', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
        onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.boxShadow = '0 0 0 3px var(--blue-light)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)'; }}
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
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease'
    }}>
      <div onClick={e => e.stopPropagation()} className="modal-body" style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 32,
        width: 480, maxWidth: '92vw', boxShadow: 'var(--shadow-lg)', animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)', border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'var(--surface2)', border: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--border2)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.8 }}>{icon}</div>
      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 8, fontSize: 18 }}>{title}</div>
      <div style={{ fontSize: 14, maxWidth: 300, margin: '0 auto', lineHeight: 1.6 }}>{sub}</div>
    </div>
  );
}
