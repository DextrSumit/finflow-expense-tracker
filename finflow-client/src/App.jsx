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
import { Plus } from 'lucide-react';

const PAGE_TITLES = {
  dashboard:    'Dashboard',
  transactions: 'Transactions',
  budget:       'Budget Planner',
  analytics:    'Analytics',
  profile:      'My Profile',
};

function AppInner() {
  const { activePage, deleteTransaction, currentUser } = useApp();
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTx, setEditTx]         = useState(null);

  // ── authView: 'landing' | 'login' | 'register' ───────────────────────────
  const [authView, setAuthView] = useState('landing');

  // ── Not logged in → show landing or auth page ─────────────────────────────
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

  // ── Logged in → show the main app ─────────────────────────────────────────
  function handleEdit(tx) { setEditTx(tx); setModalOpen(true); }
  function handleAdd()    { setEditTx(null); setModalOpen(true); }
  function handleDelete(id) {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id);
  }

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div className="app-sidebar"><Sidebar /></div>

        <main className="app-main" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

          {/* Header */}
          <div className="main-header" style={{
            padding: '20px 28px 16px', position: 'sticky', top: 0, zIndex: 10,
            background: 'var(--bg)', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {PAGE_TITLES[activePage]}
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {activePage !== 'profile' && (
                <button onClick={handleAdd} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                  background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
                  boxShadow: '0 4px 14px rgba(76,175,80,0.35)', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(76,175,80,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(76,175,80,0.35)'; }}
                >
                  <Plus size={16} />
                  <span className="add-btn-text">Add Transaction</span>
                </button>
              )}
            </div>
          </div>

          {/* Page content */}
          <div className="main-content" style={{ flex: 1, padding: '24px 28px', overflow: 'auto' }}>
            {activePage === 'dashboard'    && <Dashboard    onEdit={handleEdit} onDelete={handleDelete} />}
            {activePage === 'transactions' && <Transactions onEdit={handleEdit} onDelete={handleDelete} />}
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