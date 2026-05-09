import React from 'react';
import { useApp } from '../context/AppContext';
import { getAvatar } from '../utils/avatarUtils';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2, User, Moon, Sun, LogOut
} from 'lucide-react';

const NAV = [
  { id: 'dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { id: 'budget',       icon: Target,          label: 'Budget Planner' },
  { id: 'analytics',    icon: BarChart2,        label: 'Analytics' },
];

export default function Sidebar() {
  const { activePage, setActivePage, theme, toggleTheme, logout, currentUser } = useApp();

  const initials = (currentUser?.name || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  // Get current avatar data (emoji + bg color)
  const av = getAvatar(currentUser?.avatar);

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
    }}>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Target size={18} strokeWidth={3} />
          </div>
          <div>
            <span style={{ color: 'var(--blue)' }}>Fin</span>
            <span style={{ color: 'var(--text)' }}>Flow</span>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Smart Finance Tracker
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button key={id} onClick={() => setActivePage(id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              marginBottom: 4, border: 'none', borderRadius: 12, cursor: 'pointer',
              background: active ? 'var(--blue-light)' : 'transparent',
              color: active ? 'var(--blue)' : 'var(--text2)',
              fontWeight: active ? 600 : 500, fontSize: 14, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'var(--font)', textAlign: 'left',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.transform = 'translateX(4px)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.transform = 'none'; } }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              {label}
              {active && (
                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 8px var(--blue)' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User card ─────────────────────────────────────────────────── */}
      <div
        onClick={() => setActivePage('profile')}
        style={{
          margin: '0 12px', padding: '12px', borderRadius: 12,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {/* ── Avatar — shows emoji if selected, initials if not ───────── */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: av ? av.bg : 'linear-gradient(135deg, var(--green), var(--blue))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: av ? 18 : 13, fontWeight: 700, color: '#fff',
          userSelect: 'none',
        }}>
          {av ? av.emoji : initials}
        </div>

        {/* Name + email */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, color: 'var(--text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {currentUser?.name || 'User'}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--text3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {currentUser?.email || ''}
          </div>
        </div>
      </div>

      {/* ── Theme toggle ──────────────────────────────────────────────── */}
      <div style={{ padding: '8px 10px 0' }}>
        <button onClick={toggleTheme} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
          border: 'none', borderRadius: 10, cursor: 'pointer', background: 'transparent',
          color: 'var(--text2)', fontSize: 14, fontFamily: 'var(--font)', transition: 'all 0.18s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* ── Logout ────────────────────────────────────────────────────── */}
      <div style={{ padding: '0 10px 16px' }}>
        <button onClick={logout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
          border: 'none', borderRadius: 10, cursor: 'pointer', background: 'transparent',
          color: 'var(--red)', fontSize: 14, fontFamily: 'var(--font)', transition: 'all 0.18s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={17} strokeWidth={2} />
          Logout
        </button>
      </div>

    </aside>
  );
}