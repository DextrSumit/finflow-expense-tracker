import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, ArrowLeftRight, Target, BarChart2 } from 'lucide-react';

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'transactions', icon: ArrowLeftRight, label: 'Txns' },
  { id: 'budget', icon: Target, label: 'Budget' },
  { id: 'analytics', icon: BarChart2, label: 'Charts' },
];

export default function MobileNav() {
  const { activePage, setActivePage } = useApp();
  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'var(--surface)', borderTop: '1px solid var(--border)',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      gridTemplateColumns: 'repeat(4, 1fr)',
      className: 'mobile-nav',
    }}
      className="mobile-nav"
    >
      {NAV.map(({ id, icon: Icon, label }) => {
        const active = activePage === id;
        return (
          <button key={id} onClick={() => setActivePage(id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 0', border: 'none', background: 'transparent', cursor: 'pointer',
            color: active ? 'var(--green)' : 'var(--text3)', fontFamily: 'var(--font)',
            fontSize: 11, fontWeight: active ? 600 : 400, transition: 'color 0.18s',
          }}>
            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
