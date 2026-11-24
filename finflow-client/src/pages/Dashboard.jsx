import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, ProgressBar, EmptyState } from '../components/UI';
import TxItem from '../components/TxItem';
import { fmt, parseLocalDate } from '../utils/helpers';
import AIInsights from '../components/AIInsights';

export default function Dashboard({ onEdit, onDelete }) {
  const { transactions, stats, budgets, getCatMeta, txLoading, selectedMonth, curMonth, curYear } = useApp();
  const { totalIncome, totalExpense, balance, monthIncome, monthExpense } = stats;

  // ── Days remaining in selected month ────────────────────────────────────
  const now = new Date();
  const isCurrentMonth = selectedMonth.month === curMonth && selectedMonth.year === curYear;
  const lastDay = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
  const daysLeft = isCurrentMonth ? lastDay - now.getDate() : 0;
  const monthName = new Date(selectedMonth.year, selectedMonth.month, 1)
    .toLocaleString('default', { month: 'long' });

  // ── Safe-to-Spend calculation ────────────────────────────────────────────
  const safeToSpend = monthIncome - monthExpense;
  const dailyPace = daysLeft > 0 ? safeToSpend / daysLeft : 0;
  const dailyIncome = daysLeft > 0 && lastDay > 0 ? monthIncome / lastDay : 0;

  // Status badge
  let statusLabel = 'On Track';
  let statusColor = '#1a3a00';
  let statusBg = 'var(--lime)';
  if (safeToSpend < 0) {
    statusLabel = 'Over Budget'; statusColor = '#fff'; statusBg = 'var(--red)';
  } else if (dailyIncome > 0 && dailyPace < dailyIncome * 0.2) {
    statusLabel = 'Tight'; statusColor = '#171717'; statusBg = 'var(--amber)';
  }

  // ── Recent transactions ──────────────────────────────────────────────────
  const recent = [...transactions]
    .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date))
    .slice(0, 6);

  // ── Top 5 category budgets ───────────────────────────────────────────────
  const sm = selectedMonth?.month ?? new Date().getMonth();
  const sy = selectedMonth?.year ?? new Date().getFullYear();
  const cats = budgets?.cats || {};
  const catBudgetKeys = Object.keys(cats);
  const catStats = catBudgetKeys.map(cat => {
    const spent = (transactions || []).filter(t => {
      if (t.type !== 'expense' || t.category !== cat || t.eventId) return false;
      const d = parseLocalDate(t.date);
      return d.getMonth() === sm && d.getFullYear() === sy;
    }).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    return { cat, spent, limit: parseFloat(cats[cat]) || 0 };
  })
    .filter(x => x.spent > 0 || x.limit > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  const catTotal = Object.values(cats).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const totalBudget = parseFloat(budgets?.total) > 0 ? parseFloat(budgets.total) : catTotal;
  const budgetPct   = totalBudget > 0 ? (monthExpense / totalBudget) * 100 : 0;

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* AI Insights */}
      <AIInsights />

      {/* ── Safe-to-Spend Hero Card ─────────────────────────────────────── */}
      <div style={{
        background: safeToSpend >= 0 ? 'var(--lime)' : 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 8,
        boxShadow: '6px 6px 0px var(--border)',
        padding: '28px 24px',
        textAlign: 'center',
        marginBottom: 16,
      }}>
        {/* Status badge */}
        <div style={{ marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 12px', borderRadius: 4,
            background: statusBg, color: statusColor,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            border: '1.5px solid var(--border)',
          }}>
            {statusLabel}
          </span>
        </div>

        {/* Label */}
        <div style={{
          fontSize: 11, fontWeight: 700, color: safeToSpend >= 0 ? '#3a5c00' : 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
        }}>
          Safe to Spend — {monthName}
        </div>

        {/* Big number */}
        <div style={{
          fontSize: 52, fontWeight: 900, fontFamily: 'var(--font-mono)',
          color: safeToSpend >= 0 ? '#171717' : 'var(--red)',
          letterSpacing: '-0.03em', lineHeight: 1,
        }}>
          {safeToSpend < 0 ? '−' : ''}{fmt(Math.abs(safeToSpend))}
        </div>

        {/* Daily pace */}
        <div style={{ marginTop: 10, fontSize: 13, color: safeToSpend >= 0 ? '#171717' : 'var(--text3)' }}>
          {isCurrentMonth && daysLeft > 0 ? (
            <>
              <span style={{ fontWeight: 700 }}>{fmt(dailyPace)}/day</span>
              <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
              {daysLeft} day{daysLeft !== 1 ? 's' : ''} left in {monthName}
            </>
          ) : isCurrentMonth ? (
            <span style={{ fontWeight: 600 }}>Last day of {monthName}</span>
          ) : (
            <span>Past month — no days remaining</span>
          )}
        </div>

        {/* Budget bar — high contrast against card background */}
        {totalBudget > 0 && (
          <div style={{ marginTop: 18, maxWidth: 340, margin: '18px auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, color: safeToSpend >= 0 ? '#171717' : 'var(--text3)', marginBottom: 5 }}>
              <span>Spent {fmt(monthExpense)}</span>
              <span>Budget {fmt(totalBudget)} · {Math.round(budgetPct)}%</span>
            </div>
            <ProgressBar
              pct={budgetPct}
              color={safeToSpend >= 0 ? '#171717' : undefined}
              trackBg={safeToSpend >= 0 ? 'rgba(23,23,23,0.18)' : undefined}
              height={10}
            />
          </div>
        )}
      </div>

      {/* ── 3 Quick Stats ──────────────────────────────────────────────────── */}
      <div className="cards-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Income', value: fmt(monthIncome), sub: monthName, color: 'var(--green)', highlight: true },
          { label: 'Expenses', value: fmt(monthExpense), sub: monthName, color: 'var(--red)', highlight: false },
          { label: 'Net Balance', value: fmt(balance), sub: 'All time', color: balance >= 0 ? 'var(--text)' : 'var(--red)', highlight: false },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 8,
            boxShadow: '3px 3px 0px var(--border)',
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, fontFamily: 'var(--font-mono)', color: s.color, letterSpacing: '-0.02em' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── 2-col: Recent Txns + Category Budgets ──────────────────────────── */}
      <div className="charts-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Recent Transactions */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
            Recent Transactions
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Latest activity</div>
          {txLoading ? (
            <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
              Loading transactions...
            </div>
          ) : recent.length === 0 ? (
            <EmptyState icon="💸" title="No transactions yet" sub="Add your first transaction" />
          ) : (
            recent.map(tx => <TxItem key={tx._id || tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </Card>

        {/* Top 5 Category Budgets */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
            Top Categories
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
            {monthName} spend vs limit
          </div>
          {catStats.length === 0
            ? <EmptyState icon="🎯" title="No budgets set" sub="Go to Budget Planner" />
            : catStats.map(({ cat, spent, limit }) => {
              const meta = getCatMeta(cat);
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{meta.icon} {cat}</span>
                    <span style={{
                      color: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--text)',
                      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800,
                    }}>
                      {fmt(spent)}{limit > 0 ? ` / ${fmt(limit)}` : ''}
                    </span>
                  </div>
                  {limit > 0 && <ProgressBar pct={pct} />}
                </div>
              );
            })
          }
        </Card>
      </div>
    </div>
  );
}
