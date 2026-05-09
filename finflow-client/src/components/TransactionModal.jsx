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
      // ── FIX: use _id (MongoDB) with fallback to id (localStorage) ────────
      updateTransaction(editTx._id || editTx.id, tx);
    } else {
      addTransaction(tx);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editTx ? 'Edit Transaction' : 'Add Transaction'}>

      {/* Type toggle */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        border: '1px solid var(--border2)', borderRadius: 10,
        overflow: 'hidden', marginBottom: 18
      }}>
        {['income', 'expense'].map(t => (
          <button key={t}
            onClick={() => {
              set('type', t);
              set('category', CATEGORIES[t][0].name);
            }}
            style={{
              padding: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s',
              background: form.type === t
                ? (t === 'income' ? 'var(--green-light)' : 'var(--red-light)')
                : 'var(--surface2)',
              color: form.type === t
                ? (t === 'income' ? 'var(--green)' : 'var(--red)')
                : 'var(--text3)',
            }}>
            {t === 'income' ? '+ Income' : '− Expense'}
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
      <div style={{ marginBottom: 20 }}>
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