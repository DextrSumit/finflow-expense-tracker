import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AppContext = createContext(null);

const CATEGORIES = {
  income: [
    { name: 'Salary', icon: '💼', color: '#4CAF50' },
    { name: 'Freelance', icon: '💻', color: '#00BCD4' },
    { name: 'Investment', icon: '📈', color: '#2196F3' },
    { name: 'Gift', icon: '🎁', color: '#9C27B0' },
    { name: 'Other Income', icon: '💰', color: '#FF9800' },
  ],
  expense: [
    { name: 'Food', icon: '🍔', color: '#FF7043' },
    { name: 'Transport', icon: '🚗', color: '#FF9800' },
    { name: 'Bills', icon: '⚡', color: '#FFC107' },
    { name: 'Shopping', icon: '🛍', color: '#E91E63' },
    { name: 'Health', icon: '💊', color: '#F44336' },
    { name: 'Entertainment', icon: '🎬', color: '#9C27B0' },
    { name: 'Education', icon: '📚', color: '#3F51B5' },
    { name: 'Rent', icon: '🏠', color: '#607D8B' },
    { name: 'Subscription', icon: '📱', color: '#00BCD4' },
    { name: 'Other', icon: '📋', color: '#795548' },
  ]
};

const ALL_CATEGORIES = [...CATEGORIES.income, ...CATEGORIES.expense];

function getCatMeta(name) {
  return ALL_CATEGORIES.find(c => c.name === name) || { name, icon: '•', color: '#888' };
}

export function AppProvider({ children }) {

  // ── AUTH STATE ────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_user')); } catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // ── TRANSACTIONS (empty on start, loaded from API) ────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  // ── BUDGETS (still localStorage) ─────────────────────────────────────────
  const [budgets, setBudgets] = useState(() => {
    try {
      const s = localStorage.getItem('ff_budgets');
      return s ? JSON.parse(s) : {
        total: 50000,
        cats: { Food: 5000, Rent: 15000, Shopping: 6000, Entertainment: 3000, Bills: 4000, Health: 3500 }
      };
    } catch { return { total: 50000, cats: {} }; }
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('ff_theme') || 'light');
  const [activePage, setActivePage] = useState('dashboard');

  // ── FETCH TRANSACTIONS WHEN USER LOGS IN ──────────────────────────────────
  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      return;
    }
    const fetchTransactions = async () => {
      setTxLoading(true);
      try {
        const data = await api.getTransactions();
        if (data.message) { logout(); return; }
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setTxLoading(false);
      }
    };
    fetchTransactions();
  }, [currentUser]);

  // ── PERSIST BUDGETS & THEME ───────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('ff_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('ff_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // ── AUTH FUNCTIONS ────────────────────────────────────────────────────────
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
    } catch (err) {
      setAuthError('Registration failed. Please try again.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

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
      return true;
    } catch (err) {
      setAuthError('Login failed. Please try again.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ff_token');
    localStorage.removeItem('ff_user');
    setCurrentUser(null);
    setTransactions([]);
  }, []);

  // ── TRANSACTION FUNCTIONS (now use API) ───────────────────────────────────
  const addTransaction = useCallback(async (tx) => {
    try {
      const saved = await api.createTransaction(tx);
      setTransactions(prev => [saved, ...prev]);
    } catch (err) {
      console.error('Failed to add transaction:', err);
    }
  }, []);

  const updateTransaction = useCallback(async (id, tx) => {
    try {
      const updated = await api.updateTransaction(id, tx);
      setTransactions(prev => prev.map(t => (t._id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to update transaction:', err);
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    }
  }, []);

  // ── BUDGET FUNCTIONS (unchanged) ──────────────────────────────────────────
  const setBudgetTotal = useCallback((v) => setBudgets(b => ({ ...b, total: v })), []);
  const setCatBudget = useCallback((cat, amt) => setBudgets(b => ({ ...b, cats: { ...b.cats, [cat]: amt } })), []);
  const deleteCatBudget = useCallback((cat) => setBudgets(b => {
    const c = { ...b.cats }; delete c[cat]; return { ...b, cats: c };
  }), []);

  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);

  // ── DERIVED STATS ─────────────────────────────────────────────────────────
  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();
  const monthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === curMonth && d.getFullYear() === curYear;
  });
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const monthIncome = monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const monthExpense = monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const budgetPct = budgets.total > 0 ? (monthExpense / budgets.total) * 100 : 0;

  return (
    <AppContext.Provider value={{
      // Auth
      currentUser, authLoading, authError, register, login, logout,
      // Transactions
      transactions, txLoading,
      addTransaction, updateTransaction, deleteTransaction,
      // Budgets
      budgets, setBudgetTotal, setCatBudget, deleteCatBudget,
      // UI
      theme, toggleTheme,
      activePage, setActivePage,
      // Helpers
      CATEGORIES, ALL_CATEGORIES, getCatMeta,
      // Stats
      stats: { totalIncome, totalExpense, balance: totalIncome - totalExpense, monthIncome, monthExpense, budgetPct, monthTxs }
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);