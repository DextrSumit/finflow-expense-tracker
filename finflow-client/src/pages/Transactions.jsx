import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Input, Select, Btn, EmptyState } from '../components/UI';
import TxItem from '../components/TxItem';
import { exportCSV, fmt } from '../utils/helpers';
import { Download, X } from 'lucide-react';

export default function Transactions({ onEdit, onDelete }) {
  const { transactions, ALL_CATEGORIES, txLoading, selectedMonth } = useApp();

  const monthFirstDay = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}-01`;
  const lastDayOfMonth = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate();
  const monthLastDay  = `${selectedMonth.year}-${String(selectedMonth.month + 1).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [type, setType]         = useState('');
  const [from, setFrom]         = useState(monthFirstDay);
  const [to, setTo]             = useState(monthLastDay);
  const [showAll, setShowAll]   = useState(false);

  // Synchronize date range immediately whenever the header month navigator changes
  useEffect(() => {
    setFrom(monthFirstDay);
    setTo(monthLastDay);
    setShowAll(false);
  }, [selectedMonth.year, selectedMonth.month, monthFirstDay, monthLastDay]);

  function reset() {
    setSearch(''); setCategory(''); setType('');
    setFrom(monthFirstDay); setTo(monthLastDay);
    setShowAll(false);
  }

  function clearDates() { setFrom(''); setTo(''); setShowAll(true); }

  const filtered = useMemo(() => {
    let result = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (search)   result = result.filter(t => (t.desc + t.category).toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(t => t.category === category);
    if (type)     result = result.filter(t => t.type === type);
    if (from)     result = result.filter(t => t.date >= from);
    if (to)       result = result.filter(t => t.date <= to);
    return result;
  }, [transactions, search, category, type, from, to]);

  const totalNet     = filtered.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const isMonthDefault = from === monthFirstDay && to === monthLastDay;
  const monthLabel = new Date(selectedMonth.year, selectedMonth.month, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* ── Filter Card ───────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 14 }}>
        <div className="filters-6col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <div className="filter-search">
            <Input placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)} label="Search" />
          </div>
          <Select label="Category" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </Select>
          <Select label="Type" value={type} onChange={e => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Input label="From" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          <Input label="To"   type="date" value={to}   onChange={e => setTo(e.target.value)} />
          <div className="filter-actions" style={{ display: 'flex', gap: 8 }}>
            <Btn onClick={reset} variant="ghost" style={{ height: 42 }} title="Reset to current month">
              <X size={14} />
            </Btn>
            <Btn onClick={() => exportCSV(filtered)} variant="ghost" style={{ height: 42 }}>
              <Download size={14} /> CSV
            </Btn>
          </div>
        </div>

        {/* Month pill + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          {isMonthDefault && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 4,
              background: 'var(--lime)', color: '#171717',
              fontSize: 11, fontWeight: 700,
              border: '1.5px solid var(--border)',
            }}>
              📅 {monthLabel}
            </span>
          )}
          <button
            onClick={showAll || !isMonthDefault ? reset : clearDates}
            style={{
              fontSize: 11, color: 'var(--text3)', background: 'none', border: 'none',
              cursor: 'pointer', textDecoration: 'underline', padding: 0,
            }}
          >
            {showAll || !isMonthDefault ? `Show ${monthLabel} only` : 'Show all time'}
          </button>
        </div>
      </Card>

      {/* ── Summary row ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 16, marginBottom: 14, fontSize: 13,
        color: 'var(--text2)', flexWrap: 'wrap', alignItems: 'center',
        padding: '8px 12px',
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 6,
        boxShadow: '2px 2px 0px var(--border)',
      }}>
        <span style={{ color: 'var(--text3)' }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
        <span style={{ color: 'var(--border-soft)' }}>|</span>
        <span>In: <strong style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14 }}>{fmt(totalIncome)}</strong></span>
        <span>Out: <strong style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14 }}>{fmt(totalExpense)}</strong></span>
        <span style={{ color: 'var(--border-soft)' }}>|</span>
        <span>Net: <strong style={{ color: totalNet >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14 }}>{totalNet >= 0 ? '+' : '−'}{fmt(Math.abs(totalNet))}</strong></span>
      </div>

      {/* ── Transactions list ─────────────────────────────────────────────── */}
      <Card>
        {txLoading ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text3)', fontSize: 14 }}>
            Loading transactions...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔍" title="No transactions found" sub="Try adjusting your filters" />
        ) : (
          filtered.map(tx => <TxItem key={tx._id || tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)
        )}
      </Card>
    </div>
  );
}
