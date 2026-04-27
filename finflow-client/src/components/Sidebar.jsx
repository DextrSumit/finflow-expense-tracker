import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, ArrowLeftRight, Target, BarChart2, Moon, Sun
} from 'lucide-react';

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { id: 'budget', icon: Target, label: 'Budget Planner' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
];

export default function Sidebar() {
  const { activePage, setActivePage, theme, toggleTheme, logout } = useApp();

  return (
    <aside style={{
      width: 'var(--sidebar-w)', background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>
          <span style={{ color: 'var(--green)' }}>Fin</span>
          <span style={{ color: 'var(--text)' }}>Flow</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Smart Finance Tracker</div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {NAV.map(({ id, icon: Icon, label }) => {
          const active = activePage === id;
          return (
            <button key={id} onClick={() => setActivePage(id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
              marginBottom: 3, border: 'none', borderRadius: 10, cursor: 'pointer',
              background: active ? 'var(--green-light)' : 'transparent',
              color: active ? 'var(--green)' : 'var(--text2)',
              fontWeight: active ? 600 : 400, fontSize: 14, transition: 'all 0.18s',
              fontFamily: 'var(--font)', textAlign: 'left',
            }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text2)'; } }}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
              {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />}
            </button>
          );
        })}
      </nav>

      {/* Theme toggle */}
      <div style={{ padding: '14px 10px', borderTop: '1px solid var(--border)' }}>
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

      {/* Logout */}
      <div style={{ padding: '10px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '10px 12px',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--red)',
            fontSize: 14,
            fontFamily: 'var(--font)',
            transition: 'all 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
