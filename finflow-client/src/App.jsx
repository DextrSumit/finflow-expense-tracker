import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import TransactionModal from './components/TransactionModal';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Analytics from './pages/Analytics';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Events from './pages/Events';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  transactions: 'Transactions',
  events:       'Events',
  budget:       'Budget Planner',
  analytics:    'Analytics',
  profile:      'My Profile',
};

function AppInner() {
  const { activePage, deleteTransaction, currentUser, selectedMonth, goToPrevMonth, goToNextMonth, curMonth, curYear } = useApp();
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTx, setEditTx]         = useState(null);
  const [authView, setAuthView]     = useState('landing');

  if (!currentUser) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setAuthView('register')}
          onLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <AuthPage
        defaultScreen={authView === 'register' ? 'register' : 'login'}
        onBackToHome={() => setAuthView('landing')}
      />
    );
  }

  const isCurrentMonth = selectedMonth.month === curMonth && selectedMonth.year === curYear;
  const monthLabel = new Date(selectedMonth.year, selectedMonth.month, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });

  function handleEdit(tx)   { setEditTx(tx); setModalOpen(true); }
  function handleAdd()      { setEditTx(null); setModalOpen(true); }
  function handleDelete(id) { if (window.confirm('Delete this transaction?')) deleteTransaction(id); }

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div className="app-sidebar"><Sidebar /></div>

        <main className="app-main" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

          {/* ── Header ──────────────────────────────────────────── */}
          <div className="main-header" style={{
            padding: '18px 28px 14px',
            position: 'sticky', top: 0, zIndex: 10,
            background: 'var(--bg)',
            borderBottom: '2px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Left — title + month nav */}
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                  {PAGE_TITLES[activePage]}
                </h1>
                {/* Month navigator — shown on all pages except profile */}
                {activePage !== 'profile' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    <button
                      onClick={goToPrevMonth}
                      style={{
                        width: 24, height: 24, border: '1.5px solid var(--border)',
                        borderRadius: 4, background: 'var(--surface)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text2)', transition: 'all 0.12s ease', boxShadow: 'var(--shadow-sm)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--lime)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <ChevronLeft size={13} strokeWidth={2.5} />
                    </button>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: isCurrentMonth ? '#171717' : 'var(--text2)',
                      background: isCurrentMonth ? 'var(--lime)' : 'var(--surface2)',
                      border: '1.5px solid var(--border)',
                      borderRadius: 4, padding: '2px 10px',
                      minWidth: 118, textAlign: 'center',
                      letterSpacing: '0.01em',
                      boxShadow: isCurrentMonth ? 'var(--shadow-sm)' : 'none',
                    }}>
                      {monthLabel}
                    </span>
                    <button
                      onClick={goToNextMonth}
                      disabled={isCurrentMonth}
                      style={{
                        width: 24, height: 24, border: '1.5px solid var(--border)',
                        borderRadius: 4, background: 'var(--surface)',
                        cursor: isCurrentMonth ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isCurrentMonth ? 'var(--border2)' : 'var(--text2)',
                        opacity: isCurrentMonth ? 0.4 : 1,
                        transition: 'all 0.12s ease', boxShadow: 'var(--shadow-sm)',
                      }}
                      onMouseEnter={e => { if (!isCurrentMonth) { e.currentTarget.style.background = 'var(--lime)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <ChevronRight size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>

              {/* Right — Add Transaction button */}
              {activePage !== 'profile' && activePage !== 'events' && (
                <button
                  onClick={handleAdd}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 16px',
                    background: 'var(--lime)', color: '#171717',
                    border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'var(--font)',
                    boxShadow: 'var(--shadow)',
                    transition: 'all 0.12s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  onMouseDown={e => { e.currentTarget.style.transform = 'translate(1px,1px)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span className="add-btn-text">Add Transaction</span>
                </button>
              )}
            </div>
          </div>

          {/* ── Page content ─────────────────────────────────────── */}
          <div className="main-content" style={{ flex: 1, padding: '24px 28px', overflow: 'auto' }}>
            {activePage === 'dashboard'    && <Dashboard    onEdit={handleEdit} onDelete={handleDelete} />}
            {activePage === 'transactions' && <Transactions onEdit={handleEdit} onDelete={handleDelete} />}
            {activePage === 'events'       && <Events />}
            {activePage === 'budget'       && <Budget />}
            {activePage === 'analytics'    && <Analytics />}
            {activePage === 'profile'      && <Profile />}
          </div>
        </main>

        <MobileNav />
        <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editTx={editTx} />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
