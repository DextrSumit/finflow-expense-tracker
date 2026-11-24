import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Input, Select, Btn, ProgressBar, Modal, EmptyState } from '../components/UI';
import { fmt, parseLocalDate } from '../utils/helpers';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function Budget() {
  const { transactions = [], budgets = {}, setBudgetTotal, setCatBudget, deleteCatBudget, CATEGORIES, getCatMeta, selectedMonth } = useApp();
  const [modalOpen, setModalOpen]           = useState(false);
  const [totalModalOpen, setTotalModalOpen] = useState(false);
  const [newTotalAmt, setNewTotalAmt]       = useState('');
  const [editingCat, setEditingCat]         = useState(null); // null = add new, string = editing category name
  const [newCat, setNewCat]                 = useState('Food');
  const [newAmt, setNewAmt]                 = useState('');

  const sm = selectedMonth?.month ?? new Date().getMonth();
  const sy = selectedMonth?.year ?? new Date().getFullYear();
  const monthName = new Date(sy, sm, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  function isSelectedMonth(t) {
    try {
      const d = parseLocalDate(t.date);
      return d.getMonth() === sm && d.getFullYear() === sy;
    } catch { return false; }
  }

  function getAmount(t) { return parseFloat(t?.amount) || 0; }

  const cats = budgets?.cats || {};
  const catKeys = Object.keys(cats);
  const catTotal = Object.values(cats).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const manualTotal = parseFloat(budgets?.total) || 0;
  const totalBudget = manualTotal > 0 ? manualTotal : catTotal;
  const catCount = catKeys.length;

  const monthExpense = (transactions || [])
    .filter(t => t?.type === 'expense' && isSelectedMonth(t) && !t?.eventId)
    .reduce((s, t) => s + getAmount(t), 0);

  const budgetPct = totalBudget > 0 ? (monthExpense / totalBudget) * 100 : 0;
  const remaining = totalBudget - monthExpense;

  function handleOpenAdd() {
    setEditingCat(null);
    setNewCat(CATEGORIES?.expense?.[0]?.name || 'Food');
    setNewAmt('');
    setModalOpen(true);
  }

  function handleOpenEdit(cat, limit) {
    setEditingCat(cat);
    setNewCat(cat);
    setNewAmt(String(limit));
    setModalOpen(true);
  }

  function handleSaveCat() {
    const amt = parseFloat(newAmt);
    if (!newCat || isNaN(amt) || amt <= 0) {
      return alert('Please enter a valid monthly limit amount.');
    }
    // If category was renamed during edit, remove the old key
    if (editingCat && editingCat !== newCat) {
      deleteCatBudget(editingCat);
    }
    setCatBudget(newCat, amt);
    setModalOpen(false);
    setEditingCat(null);
    setNewAmt('');
  }

  function handleSaveTotal() {
    const amt = parseFloat(newTotalAmt);
    if (isNaN(amt) || amt <= 0) {
      return alert('Please enter a valid monthly budget amount.');
    }
    setBudgetTotal(amt);
    setTotalModalOpen(false);
  }

  function handleUseCategorySum() {
    if (catTotal <= 0) return alert('No category budgets set yet.');
    setBudgetTotal(catTotal);
    setNewTotalAmt(String(catTotal));
    setTotalModalOpen(false);
  }

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* ── Monthly Budget Summary ─────────────────────────────────────────── */}
      <div style={{
        background: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 8,
        boxShadow: '4px 4px 0px var(--border)',
        padding: '22px 24px',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Monthly Budget
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{monthName}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
              Total Budgeted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
              <div
                style={{ fontSize: 26, fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--text)', cursor: 'pointer' }}
                onClick={() => { setNewTotalAmt(String(totalBudget || '')); setTotalModalOpen(true); }}
                title="Click to edit total monthly budget"
              >
                {fmt(totalBudget)}
              </div>
              <button
                onClick={() => { setNewTotalAmt(String(totalBudget || '')); setTotalModalOpen(true); }}
                title="Change Total Monthly Budget"
                style={{
                  width: 32, height: 32, border: '1.5px solid var(--border)', borderRadius: 6,
                  background: 'var(--lime)', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#171717', boxShadow: '2px 2px 0px var(--border)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px var(--border)'; }}
              >
                <Edit2 size={13} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
              {catCount > 0 ? `${catCount} categor${catCount !== 1 ? 'ies' : 'y'} · ` : ''}
              <button
                onClick={() => { setNewTotalAmt(String(totalBudget || '')); setTotalModalOpen(true); }}
                style={{
                  background: 'none', border: 'none', color: 'var(--text)',
                  fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 11,
                }}
              >
                Change total budget
              </button>
            </div>
          </div>
        </div>

        {totalBudget > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 6 }}>
              <span>Spent: <strong style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{fmt(monthExpense)}</strong></span>
              <span style={{ color: remaining >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {remaining >= 0 ? `${fmt(remaining)} remaining` : `${fmt(Math.abs(remaining))} overspent`}
              </span>
            </div>
            <ProgressBar pct={budgetPct} height={10} />
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>
              No total budget set yet for {monthName} — set your limits to track your progress.
            </div>
            <Btn variant="primary" size="sm" onClick={() => { setNewTotalAmt('50000'); setTotalModalOpen(true); }}>
              <Edit2 size={14} /> Set Total Monthly Budget
            </Btn>
          </div>
        )}
      </div>

      {/* ── Category Budgets ──────────────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Category Budgets
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              Click any category or edit button to change its limit — {monthName}
            </div>
          </div>
          <Btn variant="primary" size="sm" onClick={handleOpenAdd}>
            <Plus size={14} /> Add Budget
          </Btn>
        </div>

        {catKeys.length === 0
          ? <EmptyState icon="🎯" title="No category budgets" sub="Set limits to stay on track" />
          : catKeys.map(cat => {
              const meta = getCatMeta(cat);
              const catTransactions = (transactions || []).filter(t =>
                t?.type === 'expense' && t?.category === cat && isSelectedMonth(t) && !t?.eventId
              );
              const spent = catTransactions.reduce((s, t) => s + getAmount(t), 0);
              const limit = parseFloat(cats[cat]) || 0;
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const statusColor = pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--green)';

              return (
                <div key={cat} style={{
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border-soft)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>

                    {/* Left — icon + name */}
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                      onClick={() => handleOpenEdit(cat, limit)}
                      title="Click to edit budget"
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 6,
                        background: 'var(--surface2)', border: '1.5px solid var(--border-soft)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                      }}>
                        {meta.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {cat}
                          <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400 }}>✎</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                          {catTransactions.length} tx · {Math.round(pct)}% used
                        </div>
                      </div>
                    </div>

                    {/* Right — amount + edit + delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{ textAlign: 'right', cursor: 'pointer' }}
                        onClick={() => handleOpenEdit(cat, limit)}
                        title="Click to change limit"
                      >
                        <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', color: statusColor }}>
                          {fmt(spent)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>of {fmt(limit)}</div>
                      </div>

                      {/* Edit button */}
                      <button
                        onClick={() => handleOpenEdit(cat, limit)}
                        title="Change / Edit Budget"
                        style={{
                          width: 30, height: 30, border: '1.5px solid var(--border-soft)', borderRadius: 6,
                          background: 'transparent', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text3)', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--lime)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = '#171717'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.color = 'var(--text3)'; }}
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete budget limit for ${cat}?`)) {
                            deleteCatBudget(cat);
                          }
                        }}
                        title="Delete Budget"
                        style={{
                          width: 30, height: 30, border: '1.5px solid var(--border-soft)', borderRadius: 6,
                          background: 'transparent', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text3)', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.color = 'var(--text3)'; }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <ProgressBar pct={pct} />

                  {pct >= 80 && (
                    <div style={{ fontSize: 12, color: statusColor, marginTop: 5, fontWeight: 600 }}>
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

      {/* ── Add / Edit Category Budget Modal ───────────────────────────────── */}
      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCat(null); }}
        title={editingCat ? `Edit Budget · ${editingCat}` : 'Set Category Budget'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <Select
            label="Category"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
          >
            {(CATEGORIES?.expense || []).map(c => (
              <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </Select>
          <Input
            label="Monthly Limit (₹)"
            type="number"
            placeholder="5000"
            value={newAmt}
            onChange={e => setNewAmt(e.target.value)}
            autoFocus
          />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={() => { setModalOpen(false); setEditingCat(null); }} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn onClick={handleSaveCat} variant="primary" style={{ flex: 1 }}>
            {editingCat ? 'Update Budget' : 'Save Budget'}
          </Btn>
        </div>
      </Modal>

      {/* ── Set / Edit Total Monthly Budget Modal ──────────────────────────── */}
      <Modal
        open={totalModalOpen}
        onClose={() => setTotalModalOpen(false)}
        title={`Set Total Monthly Budget · ${monthName}`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          <Input
            label="Total Monthly Budget (₹)"
            type="number"
            placeholder="e.g. 50000"
            value={newTotalAmt}
            onChange={e => setNewTotalAmt(e.target.value)}
            autoFocus
          />

          {catTotal > 0 && (
            <div style={{
              background: 'var(--surface2)', border: '1.5px solid var(--border-soft)',
              borderRadius: 6, padding: '10px 12px', fontSize: 12, color: 'var(--text2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Sum of categories: <strong>{fmt(catTotal)}</strong></span>
              <button
                type="button"
                onClick={handleUseCategorySum}
                style={{
                  background: 'none', border: 'none', color: 'var(--text)',
                  fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontSize: 12,
                }}
              >
                Set to {fmt(catTotal)}
              </button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={() => setTotalModalOpen(false)} style={{ flex: 1 }}>
            Cancel
          </Btn>
          <Btn onClick={handleSaveTotal} variant="primary" style={{ flex: 1 }}>
            Save Total Budget
          </Btn>
        </div>
      </Modal>

    </div>
  );
}
