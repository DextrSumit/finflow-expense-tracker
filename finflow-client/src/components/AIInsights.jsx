import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/helpers';
import { Lightbulb } from 'lucide-react';

function generateInsights(transactions, budgets) {
  const insights = [];
  const now = new Date();
  const cm = now.getMonth(), cy = now.getFullYear();
  const pm = cm === 0 ? 11 : cm - 1;
  const py = cm === 0 ? cy - 1 : cy;

  const curMonthTxs = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === cm && d.getFullYear() === cy; });
  const prevMonthTxs = transactions.filter(t => { const d = new Date(t.date); return d.getMonth() === pm && d.getFullYear() === py; });

  const curExp = curMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const prevExp = prevMonthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const curInc = curMonthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  if (prevExp > 0 && curExp > 0) {
    const diff = ((curExp - prevExp) / prevExp * 100).toFixed(0);
    if (diff > 10) insights.push({ type: 'warn', text: `You spent ${diff}% more this month vs last month (${fmt(curExp)} vs ${fmt(prevExp)}).` });
    else if (diff < -10) insights.push({ type: 'good', text: `Great job! You spent ${Math.abs(diff)}% less this month vs last month.` });
  }

  // Top spending category
  const catMap = {};
  curMonthTxs.filter(t => t.type === 'expense').forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];
  if (topCat) insights.push({ type: 'info', text: `Your biggest spend this month is ${topCat[0]} at ${fmt(topCat[1])} (${curExp > 0 ? Math.round(topCat[1] / curExp * 100) : 0}% of expenses).` });

  // Savings rate
  if (curInc > 0) {
    const savingsRate = Math.round((curInc - curExp) / curInc * 100);
    if (savingsRate > 30) insights.push({ type: 'good', text: `Excellent! Your savings rate this month is ${savingsRate}%.` });
    else if (savingsRate < 10 && savingsRate >= 0) insights.push({ type: 'warn', text: `Your savings rate is only ${savingsRate}% this month. Try to aim for 20%+.` });
    else if (savingsRate < 0) insights.push({ type: 'danger', text: `You're spending ${fmt(curExp - curInc)} more than you earn this month!` });
  }

  // Budget alerts
  Object.entries(budgets.cats).forEach(([cat, limit]) => {
    const spent = curMonthTxs.filter(t => t.type === 'expense' && t.category === cat).reduce((s, t) => s + t.amount, 0);
    const pct = (spent / limit) * 100;
    if (pct >= 100) insights.push({ type: 'danger', text: `${cat} budget exceeded! Spent ${fmt(spent)} of ${fmt(limit)} limit.` });
    else if (pct >= 80) insights.push({ type: 'warn', text: `${cat} is at ${Math.round(pct)}% of budget with ${new Date(cy, cm + 1, 0).getDate() - now.getDate()} days left.` });
  });

  // Recurring transactions reminder
  const recurring = transactions.filter(t => t.recur === 'monthly');
  if (recurring.length > 0) {
    const totalRecurring = recurring.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    insights.push({ type: 'info', text: `You have ${recurring.length} recurring transactions totaling ${fmt(totalRecurring)}/month in fixed costs.` });
  }

  return insights.slice(0, 4);
}

const COLORS = {
  good: { bg: 'var(--green-light)', border: 'rgba(16, 185, 129, 0.2)', text: 'var(--green)', icon: '✓' },
  info: { bg: 'var(--blue-light)', border: 'rgba(99, 102, 241, 0.2)', text: 'var(--blue)', icon: 'ℹ' },
  warn: { bg: 'var(--amber-light)', border: 'rgba(245, 158, 11, 0.2)', text: 'var(--amber)', icon: '⚡' },
  danger: { bg: 'var(--red-light)', border: 'rgba(244, 63, 94, 0.2)', text: 'var(--red)', icon: '⚠' },
};

export default function AIInsights() {
  const { transactions, budgets } = useApp();
  const insights = useMemo(() => generateInsights(transactions, budgets), [transactions, budgets]);

  if (insights.length === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <Lightbulb size={15} style={{ color: 'var(--amber)' }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>AI Insights</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {insights.map((ins, i) => {
          const c = COLORS[ins.type];
          return (
            <div key={i} style={{
              padding: '11px 14px', borderRadius: 10,
              background: c.bg, border: `1px solid ${c.border}`,
              fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
              animation: `fadeIn 0.3s ease ${i * 0.07}s both`,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14, color: c.text, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
              <span>{ins.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
