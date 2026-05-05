import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Input, Select, Btn, EmptyState } from '../components/UI';
import TxItem from '../components/TxItem';
import useTransactionFilter from '../hooks/useTransactionFilter';
import { exportCSV, fmt } from '../utils/helpers';
import { Download, X } from 'lucide-react';

export default function Transactions({ onEdit, onDelete }) {
  const { transactions, ALL_CATEGORIES } = useApp();
  const {
    filtered, search, setSearch, category, setCategory,
    type, setType, from, setFrom, to, setTo, reset, summary
  } = useTransactionFilter(transactions);

  const totalAmt = summary.totalNet;

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      <Card style={{ marginBottom: 14 }}>
        <div className="filters-6col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto auto', gap: 10, alignItems: 'end' }}>
          <Input placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)} label="Search" />
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
          <Input label="To" type="date" value={to} onChange={e => setTo(e.target.value)} />
          <Btn onClick={reset} variant="ghost" style={{ height: 42 }} title="Clear filters">
            <X size={14} />
          </Btn>
          <Btn onClick={() => exportCSV(filtered)} variant="ghost" style={{ height: 42 }}>
            <Download size={14} /> CSV
          </Btn>
        </div>
      </Card>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 13, color: 'var(--text2)', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: 'var(--text3)' }}>{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
        <span style={{ color: 'var(--border2)' }}>|</span>
        <span>In: <strong style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{fmt(summary.totalIncome)}</strong></span>
        <span>Out: <strong style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{fmt(summary.totalExpense)}</strong></span>
        <span style={{ color: 'var(--border2)' }}>|</span>
        <span>Net: <strong style={{ color: totalAmt >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-mono)' }}>{totalAmt >= 0 ? '+' : '−'}{fmt(Math.abs(totalAmt))}</strong></span>
      </div>

      <Card>
        {filtered.length === 0
          ? <EmptyState icon="🔍" title="No transactions found" sub="Try adjusting your filters" />
          : filtered.map(tx => <TxItem key={tx._id || tx.id} tx={tx} onEdit={onEdit} onDelete={onDelete} />)
        }
      </Card>
    </div>
  );
}
