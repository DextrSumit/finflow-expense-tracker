import React from 'react';
import { useApp } from '../context/AppContext';
import { getAvatar } from '../utils/avatarUtils';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2, User, Moon, Sun, LogOut, CalendarDays
} from 'lucide-react';

const NAV = [
  { id: 'dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: ArrowLeftRight,  label: 'Transactions' },
  { id: 'events',       icon: CalendarDays,    label: 'Events' },
  { id: 'budget',       icon: Target,          label: 'Budget' },
  { id: 'analytics',   icon: BarChart2,        label: 'Analytics' },
];

export default function Sidebar() {
  const { activePage, setActivePage, theme, toggleTheme, logout, currentUser } = useApp();

  const initials = (currentUser?.name || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const av = getAvatar(currentUser?.avatar);

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      background: 'var(--surface)',
      borderRight: '2px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      height: '100vh', position: 'sticky', top: 0,
    }}>

      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '2px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 6,
            background: 'var(--lime)', border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <Target size={17} strokeWidth={3} color="#171717" />
          </div>
          <span style={{ color: 'var(--text)' }}>Fin</span>
          <span style={{
            color: '#171717', background: 'var(--lime)',
            border: '1.5px solid var(--border)', borderRadius: 4,
            padding: '0 6px', fontSize: 18,
          }}>Flow</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Smart Finance Tracker
        </div>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 12px', marginBottom: 3,
                border: active ? '1.5px solid var(--border)' : '1.5px solid transparent',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: active ? 'var(--lime)' : 'transparent',
                color: active ? '#171717' : 'var(--text2)',
                fontWeight: active ? 700 : 500, fontSize: 14,
                transition: 'all 0.12s ease',
                fontFamily: 'var(--font)', textAlign: 'left',
                boxShadow: active ? 'var(--shadow-sm)' : 'none',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border2)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'transparent'; } }}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
              {active && (
                <div style={{ marginLeft: 'auto', width: 20, height: 6, borderRadius: 2, background: '#171717' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User card ────────────────────────────────────────────── */}
      <div
        onClick={() => setActivePage('profile')}
        style={{
          margin: '0 10px 8px', padding: '10px 12px',
          border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
          background: 'var(--surface2)',
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', transition: 'all 0.12s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--lime-light)'; e.currentTarget.style.borderColor = 'var(--lime-dark)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          border: '1.5px solid var(--border)',
          background: av ? av.bg : 'var(--lime)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: av ? 17 : 12, fontWeight: 800, color: '#171717',
          flexShrink: 0,
        }}>
          {av ? av.emoji : initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.name || 'User'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentUser?.email || ''}
          </div>
        </div>
      </div>

      {/* ── Theme + Logout ───────────────────────────────────────── */}
      <div style={{ padding: '0 10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button
          onClick={toggleTheme}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', border: '1.5px solid transparent',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            background: 'transparent', color: 'var(--text2)',
            fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)', transition: 'all 0.12s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border-soft)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={logout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', border: '1.5px solid transparent',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            background: 'transparent', color: 'var(--red)',
            fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)', transition: 'all 0.12s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.borderColor = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
        >
          <LogOut size={15} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}
