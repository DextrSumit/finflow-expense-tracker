import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Input, Select, Btn } from './UI';
import { todayStr } from '../utils/helpers';

const EMPTY = { type: 'expense', amount: '', category: 'Food', date: todayStr(), desc: '', recur: '' };

export default function TransactionModal({ open, onClose, editTx }) {
  const { addTransaction, updateTransaction, CATEGORIES } = useApp();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (editTx) setForm({ ...editTx, amount: String(editTx.amount) });
    else setForm({ ...EMPTY, date: todayStr() });
  }, [editTx, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cats = CATEGORIES[form.type] || [];

  function handleSave() {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0 || !form.date || !form.category) {
      return alert('Please fill in all required fields.');
    }
    const tx = { ...form, amount };
    if (editTx) {
      updateTransaction(editTx._id || editTx.id, tx);
    } else {
      addTransaction(tx);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editTx ? 'Edit Transaction' : 'Add Transaction'}>

      {/* Type toggle — neo-brutalist 2-block selector */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        border: '1.5px solid var(--border)', borderRadius: 6,
        overflow: 'hidden', marginBottom: 20, boxShadow: '2px 2px 0px var(--border)',
      }}>
        {['income', 'expense'].map(t => (
          <button
            key={t}
            onClick={() => { set('type', t); set('category', CATEGORIES[t][0].name); }}
            style={{
              padding: '11px', border: 'none',
              borderRight: t === 'income' ? '1.5px solid var(--border)' : 'none',
              cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 700,
              transition: 'all 0.15s',
              background: form.type === t
                ? (t === 'income' ? 'var(--lime)' : '#FF6B6B')
                : 'var(--surface2)',
              color: form.type === t ? '#171717' : 'var(--text3)',
            }}
          >
            {t === 'income' ? '↑ Income' : '↓ Expense'}
          </button>
        ))}
      </div>

      {/* Amount + Date */}
      <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Input
          label="Amount (₹)"
          type="number"
          placeholder="0"
          value={form.amount}
          onChange={e => set('amount', e.target.value)}
          min="0"
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={e => set('date', e.target.value)}
        />
      </div>

      {/* Category + Recurring */}
      <div className="modal-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Select
          label="Category"
          value={form.category}
          onChange={e => set('category', e.target.value)}
        >
          {cats.map(c => (
            <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
          ))}
        </Select>
        <Select
          label="Recurring"
          value={form.recur}
          onChange={e => set('recur', e.target.value)}
        >
          <option value="">One-time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 22 }}>
        <Input
          label="Description"
          placeholder="e.g. Grocery run at D-Mart"
          value={form.desc}
          onChange={e => set('desc', e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
        <Btn onClick={handleSave} variant="primary" style={{ flex: 1 }}>
          {editTx ? 'Update' : 'Save Transaction'}
        </Btn>
      </div>

    </Modal>
  );
}
