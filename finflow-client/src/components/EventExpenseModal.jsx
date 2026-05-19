import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Modal, Input, Select, Btn } from './UI';
import { todayStr } from '../utils/helpers';

const EMPTY = { amount: '', category: 'Food', date: todayStr(), desc: '' };

export default function EventExpenseModal({ open, onClose, eventId, eventName }) {
  const { CATEGORIES } = useApp();
  const [form, setForm]   = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { addEventExpense } = useApp();

  useEffect(() => {
    if (open) setForm({ ...EMPTY, date: todayStr() });
  }, [open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cats = CATEGORIES.expense;

  async function handleSave() {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return alert('Please enter a valid amount.');
    if (!form.date)             return alert('Please select a date.');
    if (!form.category)         return alert('Please select a category.');

    setSaving(true);
    try {
      await addEventExpense(eventId, {
        amount,
        category: form.category,
        date:     form.date,
        desc:     form.desc.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Add Expense${eventName ? ` · ${eventName}` : ''}`}
    >
      {/* Info banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
        background: 'var(--purple-light)', borderRadius: 10, marginBottom: 18,
        fontSize: 13, color: 'var(--purple)', fontWeight: 500,
        border: '1px solid rgba(139,92,246,0.2)',
      }}>
        <span>🎉</span>
        <span>This expense will be tracked against the event budget and excluded from your monthly budget.</span>
      </div>

      {/* Amount + Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
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

      {/* Category */}
      <div style={{ marginBottom: 14 }}>
        <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
          {cats.map(c => (
            <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
          ))}
        </Select>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 22 }}>
        <Input
          label="Description (optional)"
          placeholder="e.g. Catering, Venue deposit, Flight tickets..."
          value={form.desc}
          onChange={e => set('desc', e.target.value)}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn onClick={onClose} style={{ flex: 1 }} disabled={saving}>Cancel</Btn>
        <Btn
          onClick={handleSave}
          variant="primary"
          style={{ flex: 1, background: 'var(--purple)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Add Expense'}
        </Btn>
      </div>
    </Modal>
  );
}
