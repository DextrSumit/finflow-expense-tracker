import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Input, Select, Btn, ProgressBar, Modal, EmptyState } from '../components/UI';
import { fmt } from '../utils/helpers';
import { Plus, Trash2 } from 'lucide-react';

export default function Budget() {
  const { transactions, budgets, setBudgetTotal, setCatBudget, deleteCatBudget, CATEGORIES, getCatMeta } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [newCat, setNewCat] = useState('Food');
  const [newAmt, setNewAmt] = useState('');

  const now = new Date();
  const cm = now.getMonth();
  const cy = now.getFullYear();

  // ── Helper: safely check if a transaction belongs to current month ────────
  function isCurrentMonth(t) {
    try {
      const d = new Date(t.date);
      return d.getMonth() === cm && d.getFullYear() === cy;
    } catch {
      return false;
    }
  }

  // ── Helper: safely get amount as number ───────────────────────────────────
  function getAmount(t) {
    return parseFloat(t.amount) || 0;
  }

  // ── Total month expense ───────────────────────────────────────────────────
  const monthExpense = transactions
    .filter(t => t.type === 'expense' && isCurrentMonth(t))
    .reduce((s, t) => s + getAmount(t), 0);

  const budgetPct = budgets.total > 0 ? (monthExpense / budgets.total) * 100 : 0;
  const remaining = budgets.total - monthExpense;

  function handleSaveCat() {
    if (!newCat || !parseFloat(newAmt)) return;
    setCatBudget(newCat, parseFloat(newAmt));
    setModalOpen(false);
    setNewAmt('');
  }

  // ── Debug: log transactions so you can verify in console ─────────────────
  // Remove this after confirming it works
  console.log('All transactions:', transactions.length);
  console.log('This month expenses:', transactions.filter(t => t.type === 'expense' && isCurrentMonth(t)));

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* ── Monthly Budget Card ─────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Budget</div>
        <div className="charts-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <Input
            label="Total Monthly Budget (₹)"
            type="number"
            placeholder="50000"
            defaultValue={budgets.total || ''}
            onBlur={e => setBudgetTotal(parseFloat(e.target.value) || 0)}
          />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 5 }}>
              Remaining
            </div>
            <div style={{
              fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: remaining >= 0 ? 'var(--green)' : 'var(--red)'
            }}>
              {fmt(Math.abs(remaining))}
              {remaining < 0 && (
                <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 6 }}>overspent</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
          <span>Spent: {fmt(monthExpense)}</span>
          <span>Budget: {fmt(budgets.total)} ({Math.round(budgetPct)}%)</span>
        </div>
        <ProgressBar pct={budgetPct} />

        {/* Show transaction count for this month — helps debug */}
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8 }}>
          {transactions.filter(t => t.type === 'expense' && isCurrentMonth(t)).length} expense transactions this month
        </div>
      </Card>

      {/* ── Category Budgets Card ───────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Category Budgets</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Track spending per category this month</div>
          </div>
          <Btn variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Add Budget
          </Btn>
        </div>

        {Object.keys(budgets.cats).length === 0
          ? <EmptyState icon="🎯" title="No category budgets" sub="Set limits to stay on track" />
          : Object.keys(budgets.cats).map(cat => {
              const meta = getCatMeta(cat);

              // ── Calculate spent for this category this month ─────────────
              const catTransactions = transactions.filter(t =>
                t.type === 'expense' &&
                t.category === cat &&        // exact match
                isCurrentMonth(t)            // current month only
              );
              const spent = catTransactions.reduce((s, t) => s + getAmount(t), 0);
              const limit = budgets.cats[cat];
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const statusColor = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--green)';

              return (
                <div key={cat} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>

                    {/* Left — icon + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--surface2)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 18
                      }}>
                        {meta.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{cat}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                          {catTransactions.length} transaction{catTransactions.length !== 1 ? 's' : ''} · {Math.round(pct)}% used
                        </div>
                      </div>
                    </div>

                    {/* Right — amount + delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-mono)', color: statusColor }}>
                          {fmt(spent)}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>of {fmt(limit)}</div>
                      </div>
                      <button
                        onClick={() => deleteCatBudget(cat)}
                        style={{
                          width: 32, height: 32, border: 'none', borderRadius: 8,
                          background: 'transparent', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text3)', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.transform = 'none'; }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <ProgressBar pct={pct} />

                  {pct >= 80 && (
                    <div style={{ fontSize: 12, color: statusColor, marginTop: 5, fontWeight: 500 }}>
                      {pct >= 100
                        ? `⚠ Over budget by ${fmt(spent - limit)}`
                        : `⚡ ${fmt(limit - spent)} remaining`
                      }
                    </div>
                  )}
                </div>
              );
            })
        }
      </Card>

      {/* ── Add Category Budget Modal ───────────────────────────────────── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Set Category Budget">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <Select label="Category" value={newCat} onChange={e => setNewCat(e.target.value)}>
            {CATEGORIES.expense.map(c => (
              <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </Select>
          <Input
            label="Monthly Limit (₹)"
            type="number"
            placeholder="5000"
            value={newAmt}
            onChange={e => setNewAmt(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={() => setModalOpen(false)} style={{ flex: 1 }}>Cancel</Btn>
          <Btn onClick={handleSaveCat} variant="primary" style={{ flex: 1 }}>Save Budget</Btn>
        </div>
      </Modal>

    </div>
  );
}