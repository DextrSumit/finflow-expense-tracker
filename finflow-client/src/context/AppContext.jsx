import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AppContext = createContext(null);

// ── CATEGORIES ────────────────────────────────────────────────────────────
const CATEGORIES = {
  income: [
    { name: 'Salary',       icon: '💼', color: '#4CAF50' },
    { name: 'Freelance',    icon: '💻', color: '#00BCD4' },
    { name: 'Investment',   icon: '📈', color: '#2196F3' },
    { name: 'Gift',         icon: '🎁', color: '#9C27B0' },
    { name: 'Other Income', icon: '💰', color: '#FF9800' },
  ],
  expense: [
    { name: 'Food',         icon: '🍔', color: '#FF7043' },
    { name: 'Transport',    icon: '🚗', color: '#FF9800' },
    { name: 'Bills',        icon: '⚡', color: '#FFC107' },
    { name: 'Shopping',     icon: '🛍', color: '#E91E63' },
    { name: 'Health',       icon: '💊', color: '#F44336' },
    { name: 'Entertainment',icon: '🎬', color: '#9C27B0' },
    { name: 'Education',    icon: '📚', color: '#3F51B5' },
    { name: 'Rent',         icon: '🏠', color: '#607D8B' },
    { name: 'Subscription', icon: '📱', color: '#00BCD4' },
    { name: 'Other',        icon: '📋', color: '#795548' },
  ]
};

const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense];

function getCatMeta(name) {
  return ALL_CATEGORIES.find(c => c.name === name) || { name, icon: '•', color: '#888' };
}

// ── PROVIDER ──────────────────────────────────────────────────────────────
export function AppProvider({ children }) {

  // ── Auth state ───────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_user')); } catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError]     = useState('');

  // ── Transaction state ────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading]       = useState(false);

  // ── Event state ───────────────────────────────────────────────────────────
  const [events, setEvents]             = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // ── Budget state (localStorage) ──────────────────────────────────────────
  const [budgets, setBudgets] = useState(() => {
    try {
      const s = localStorage.getItem('ff_budgets');
      return s ? JSON.parse(s) : {
        total: 50000,
        cats: { Food: 5000, Rent: 15000, Shopping: 6000, Entertainment: 3000, Bills: 4000, Health: 3500 }
      };
    } catch { return { total: 50000, cats: {} }; }
  });

  const [theme, setTheme]           = useState(() => localStorage.getItem('ff_theme') || 'light');
  const [activePage, setActivePage] = useState('dashboard');

  // ── logout defined early so fetchTransactions can use it ─────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    setCurrentUser(null);
    setTransactions([]);
    setEvents([]);
  }, []);

  // ── Fetch transactions + events from API when user logs in ────────────────
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setEvents([]);
      return;
    }
    const fetchData = async () => {
      setTxLoading(true);
      setEventsLoading(true);
      try {
        const [txData, evData] = await Promise.all([
          api.getTransactions(),
          api.getEvents(),
        ]);
        if (!Array.isArray(txData)) {
          console.error('Unexpected tx response:', txData);
          logout();
          return;
        }
        setTransactions(txData);
        if (Array.isArray(evData)) setEvents(evData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setTxLoading(false);
        setEventsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, logout]);

  // ── Persist budgets ───────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('ff_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // ── Persist theme ─────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('ff_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── AUTH: register ────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await api.register({ name, email, password });
      if (data.message && !data.token) {
        setAuthError(data.message);
        return false;
      }
      localStorage.setItem('ff_token', data.token);
      localStorage.setItem('ff_user', JSON.stringify(data.user));
      setCurrentUser(data.user);
      return true;
    } catch {
      setAuthError('Registration failed. Please try again.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ── AUTH: login ───────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await api.login({ email, password });
      if (data.message && !data.token) {
        setAuthError(data.message);
        return false;
      }
      localStorage.setItem('ff_token', data.token);
      localStorage.setItem('ff_user', JSON.stringify(data.user));
      setCurrentUser(data.user);

      try {
      const profile = await api.getProfile();
      if (profile.user) {
        const fresh = { ...data.user, avatar: profile.user.avatar, name: profile.user.name };
        localStorage.setItem('ff_user', JSON.stringify(fresh));
        setCurrentUser(fresh);
      }
    } catch {}
    
      return true;
    } catch {
      setAuthError('Login failed. Please try again.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ── TRANSACTIONS: add ─────────────────────────────────────────────────────
  const addTransaction = useCallback(async (tx) => {
    try {
      const saved = await api.createTransaction(tx);
      if (saved && saved._id) {
        setTransactions(prev => [saved, ...prev]);
      } else {
        console.error('Add transaction failed:', saved);
      }
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  }, []);

  // ── TRANSACTIONS: update ──────────────────────────────────────────────────
  const updateTransaction = useCallback(async (id, tx) => {
    try {
      const updated = await api.updateTransaction(id, tx);
      if (updated && updated._id) {
        // Match by _id — id here is always a MongoDB ObjectId string
        setTransactions(prev => prev.map(t => t._id === id ? updated : t));
      } else {
        console.error('Update transaction failed:', updated);
      }
    } catch (err) {
      console.error('Failed to update transaction:', err);
    }
  }, []);

  // ── TRANSACTIONS: delete ──────────────────────────────────────────────────
  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.deleteTransaction(id);
      // Remove from local state by matching _id
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  }, []);

  // ── EVENTS: add ───────────────────────────────────────────────────────────
  const addEvent = useCallback(async (data) => {
    try {
      const ev = await api.createEvent(data);
      if (ev && ev._id) setEvents(prev => [ev, ...prev]);
      return ev;
    } catch (err) { console.error('Failed to create event:', err); }
  }, []);

  // ── EVENTS: update ────────────────────────────────────────────────────────
  const updateEvent = useCallback(async (id, data) => {
    try {
      const ev = await api.updateEvent(id, data);
      if (ev && ev._id) setEvents(prev => prev.map(e => e._id === id ? ev : e));
      return ev;
    } catch (err) { console.error('Failed to update event:', err); }
  }, []);

  // ── EVENTS: delete ────────────────────────────────────────────────────────
  const deleteEvent = useCallback(async (id) => {
    try {
      await api.deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) { console.error('Failed to delete event:', err); }
  }, []);

  // ── EVENTS: add expense ───────────────────────────────────────────────────
  const addEventExpense = useCallback(async (eventId, data) => {
    try {
      const tx = await api.addEventExpense(eventId, data);
      if (tx && tx._id) {
        // Add to global transaction list so Transactions page reflects it
        setTransactions(prev => [tx, ...prev]);
        // Update event's spent amount in local events state
        setEvents(prev => prev.map(e =>
          e._id === eventId
            ? { ...e, spent: (e.spent || 0) + (parseFloat(tx.amount) || 0) }
            : e
        ));
      }
      return tx;
    } catch (err) { console.error('Failed to add event expense:', err); }
  }, []);

  // ── EVENTS: delete expense ────────────────────────────────────────────────
  const deleteEventExpense = useCallback(async (eventId, txId) => {
    try {
      await api.deleteEventExpense(eventId, txId);
      const tx = transactions.find(t => t._id === txId);
      const amount = tx ? parseFloat(tx.amount) || 0 : 0;
      setTransactions(prev => prev.filter(t => t._id !== txId));
      setEvents(prev => prev.map(e =>
        e._id === eventId
          ? { ...e, spent: Math.max(0, (e.spent || 0) - amount) }
          : e
      ));
    } catch (err) { console.error('Failed to delete event expense:', err); }
  }, [transactions]);

  // ── BUDGETS ───────────────────────────────────────────────────────────────
  const setBudgetTotal  = useCallback((v) => setBudgets(b => ({ ...b, total: v })), []);
  const setCatBudget    = useCallback((cat, amt) => setBudgets(b => ({ ...b, cats: { ...b.cats, [cat]: amt } })), []);
  const deleteCatBudget = useCallback((cat) => setBudgets(b => {
    const c = { ...b.cats };
    delete c[cat];
    return { ...b, cats: c };
  }), []);

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);

  // ── DERIVED STATS ─────────────────────────────────────────────────────────
  const now      = new Date();
  const curMonth = now.getMonth();
  const curYear  = now.getFullYear();

  const monthTxs = transactions.filter(t => {
    try {
      const d = new Date(t.date);
      return d.getMonth() === curMonth && d.getFullYear() === curYear;
    } catch { return false; }
  });

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const monthIncome  = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  // ↓ Approach C: event expenses are excluded from monthly budget calculations
  const monthExpense = monthTxs.filter(t => t.type === 'expense' && !t.eventId).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const budgetPct    = budgets.total > 0 ? (monthExpense / budgets.total) * 100 : 0;

  // ── CONTEXT VALUE ─────────────────────────────────────────────────────────
  return (
    <AppContext.Provider value={{
      // Auth
      currentUser, setCurrentUser, authLoading, authError,
      register, login, logout,

      // Transactions
      transactions, txLoading,
      addTransaction, updateTransaction, deleteTransaction,

      // Events
      events, eventsLoading,
      addEvent, updateEvent, deleteEvent,
      addEventExpense, deleteEventExpense,

      // Budgets
      budgets, setBudgetTotal, setCatBudget, deleteCatBudget,

      // UI
      theme, toggleTheme,
      activePage, setActivePage,

      // Helpers
      CATEGORIES, ALL_CATEGORIES, getCatMeta,

      // Stats
      stats: {
        totalIncome, totalExpense,
        balance: totalIncome - totalExpense,
        monthIncome, monthExpense,
        budgetPct, monthTxs
      }
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);