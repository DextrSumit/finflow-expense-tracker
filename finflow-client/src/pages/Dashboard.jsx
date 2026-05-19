import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard, Card, ProgressBar, EmptyState } from '../components/UI';
import TxItem from '../components/TxItem';
import { fmt } from '../utils/helpers';
import { AlertTriangle } from 'lucide-react';
import AIInsights from '../components/AIInsights';

export default function Dashboard({ onEdit, onDelete }) {
  const { transactions, stats, budgets, getCatMeta } = useApp();
  const { totalIncome, totalExpense, balance, monthIncome, monthExpense, budgetPct } = stats;

  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  const catBudgets = Object.keys(budgets.cats);
  const now = new Date();
  const cm = now.getMonth(), cy = now.getFullYear();

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Alert */}
      {budgetPct >= 100 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
          background: 'var(--red-light)', border: '1px solid rgba(255,112,67,0.25)',
          borderRadius: 12, marginBottom: 20, fontSize: 14, color: 'var(--red)', fontWeight: 500
        }}>
          <AlertTriangle size={16} />
          You've exceeded your monthly budget of {fmt(budgets.total)}!
        </div>
      )}

      {/* AI Insights */}
      <AIInsights />

      {/* Stat Cards */}
      <div className="cards-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Total Balance" value={fmt(balance)} sub="All time" color={balance >= 0 ? 'var(--blue)' : 'var(--red)'} />
        <StatCard label="Total Income" value={fmt(totalIncome)} sub="All time" color="var(--green)" />
        <StatCard label="Total Expenses" value={fmt(totalExpense)} sub="All time" color="var(--red)" />
      </div>

      {/* Month Summary */}
      <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--surface), var(--surface2))' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>This Month</div>
        <div className="month-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          {[
            { label: 'Income', value: fmt(monthIncome), color: 'var(--green)' },
            { label: 'Expenses', value: fmt(monthExpense), color: 'var(--red)' },
            { label: 'Net', value: fmt(monthIncome - monthExpense), color: monthIncome >= monthExpense ? 'var(--green)' : 'var(--red)' },
            { label: 'Budget Used', value: `${Math.round(budgetPct)}%`, color: budgetPct >= 100 ? 'var(--red)' : budgetPct >= 80 ? 'var(--amber)' : 'var(--green)' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            </div>
          ))}
        </div>
        {budgets.total > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
              <span>Monthly Budget</span>
              <span>{fmt(monthExpense)} / {fmt(budgets.total)}</span>
            </div>
            <ProgressBar pct={budgetPct} />
          </>
        )}
      </Card>

      <div className="charts-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Recent Transactions */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Recent Transactions</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Latest activity</div>
          {recent.length === 0
            ? <EmptyState icon="💸" title="No transactions yet" sub="Add your first transaction" />
            : recent.map(tx => <TxItem key={tx._id || tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)
          }
        </Card>

        {/* Budget Overview */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Category Budgets</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>This month's spend vs limit</div>
          {catBudgets.length === 0
            ? <EmptyState icon="🎯" title="No budgets set" sub="Go to Budget Planner" />
            : catBudgets.map(cat => {
              const meta = getCatMeta(cat);
              const spent = transactions.filter(t => t.type === 'expense' && t.category === cat && new Date(t.date).getMonth() === cm && new Date(t.date).getFullYear() === cy && !t.eventId).reduce((s, t) => s + t.amount, 0);
              const limit = budgets.cats[cat];
              const pct = (spent / limit) * 100;
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span style={{ fontWeight: 500 }}>{meta.icon} {cat}</span>
                    <span style={{ color: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--text2)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {fmt(spent)} / {fmt(limit)}
                    </span>
                  </div>
                  <ProgressBar pct={pct} />
                </div>
              );
            })
          }
        </Card>
      </div>
    </div>
  );
}
