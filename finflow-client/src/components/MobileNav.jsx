import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ArrowLeftRight, Target, BarChart2, User, CalendarDays } from 'lucide-react';

const NAV = [
  { id: 'dashboard',    icon: LayoutDashboard, label: 'Home' },
  { id: 'transactions', icon: ArrowLeftRight,  label: 'Txns' },
  { id: 'events',       icon: CalendarDays,    label: 'Events' },
  { id: 'budget',       icon: Target,          label: 'Budget' },
  { id: 'analytics',   icon: BarChart2,        label: 'Charts' },
  { id: 'profile',     icon: User,             label: 'Profile' },
];

export default function MobileNav() {
  const { activePage, setActivePage } = useApp();
  return (
    <nav
      className="mobile-nav"
      style={{
        display: 'none',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--surface)',
        borderTop: '2px solid var(--border)',
        padding: '6px 0 env(safe-area-inset-bottom, 6px)',
        gridTemplateColumns: 'repeat(6, 1fr)',
      }}
    >
      {NAV.map(({ id, icon: Icon, label }) => {
        const active = activePage === id;
        return (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '5px 0', border: 'none', background: 'transparent', cursor: 'pointer',
              color: active ? '#171717' : 'var(--text3)',
              fontFamily: 'var(--font)', fontSize: 10, fontWeight: active ? 700 : 500,
              transition: 'all 0.12s ease',
            }}
          >
            <div style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              background: active ? 'var(--lime)' : 'transparent',
              border: active ? '1.5px solid var(--border)' : '1.5px solid transparent',
              transition: 'all 0.12s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
            }}>
              <Icon size={19} strokeWidth={active ? 2.5 : 2} />
            </div>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
