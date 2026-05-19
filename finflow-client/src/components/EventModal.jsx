import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Btn } from './UI';
import { todayStr } from '../utils/helpers';

const EVENT_EMOJIS = [
  '🎉', '🎂', '✈️', '💒', '🎓', '🎄', '🏖️', '⚽',
  '🎸', '🍽️', '🎭', '🏕️', '🎁', '💼', '🏆', '🎪',
  '🌏', '🎵', '🏠', '💡',
];

const EVENT_CATEGORIES = [
  'Personal', 'Travel', 'Wedding', 'Festival', 'Work',
  'Education', 'Sports', 'Entertainment', 'Family', 'Other',
];

const EMPTY = {
  name: '', emoji: '🎉', category: 'Personal',
  budget: '', startDate: todayStr(), endDate: '', note: '',
};

export default function EventModal({ open, onClose, onSave, editEvent }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editEvent) {
      setForm({
        name:      editEvent.name || '',
        emoji:     editEvent.emoji || '🎉',
        category:  editEvent.category || 'Personal',
        budget:    String(editEvent.budget || ''),
        startDate: editEvent.startDate || todayStr(),
        endDate:   editEvent.endDate || '',
        note:      editEvent.note || '',
      });
    } else {
      setForm({ ...EMPTY, startDate: todayStr() });
    }
  }, [editEvent, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.name.trim()) return alert('Event name is required.');
    const budget = parseFloat(form.budget);
    if (!budget || budget <= 0) return alert('Please enter a valid budget amount.');
    if (!form.startDate) return alert('Start date is required.');

    setSaving(true);
    try {
      await onSave({
        name:      form.name.trim(),
        emoji:     form.emoji,
        category:  form.category,
        budget,
        startDate: form.startDate,
        endDate:   form.endDate || null,
        note:      form.note.trim(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editEvent ? 'Edit Event' : 'New Event'}>

      {/* Name */}
      <div style={{ marginBottom: 16 }}>
        <Input
          label="Event Name"
          placeholder="e.g. Birthday Party, Goa Trip, Wedding..."
          value={form.name}
          onChange={e => set('name', e.target.value)}
        />
      </div>

      {/* Emoji Picker */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, letterSpacing: '0.02em' }}>
          Emoji
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {EVENT_EMOJIS.map(em => (
            <button
              key={em}
              onClick={() => set('emoji', em)}
              style={{
                width: 40, height: 40, fontSize: 20, border: '2px solid',
                borderColor: form.emoji === em ? 'var(--purple)' : 'var(--border)',
                borderRadius: 10, background: form.emoji === em ? 'var(--purple-light)' : 'var(--surface2)',
                cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => { if (form.emoji !== em) e.currentTarget.style.borderColor = 'var(--purple)'; }}
              onMouseLeave={e => { if (form.emoji !== em) e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Category + Budget */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
          {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Input
          label="Total Budget (₹)"
          type="number"
          placeholder="0"
          value={form.budget}
          onChange={e => set('budget', e.target.value)}
          min="0"
        />
      </div>

      {/* Date Range */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <Input
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={e => set('startDate', e.target.value)}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Input
            label="End Date (optional)"
            type="date"
            value={form.endDate}
            onChange={e => set('endDate', e.target.value)}
            min={form.startDate}
          />
          {!form.endDate && (
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>
              Leave blank for open-ended / ongoing event
            </div>
          )}
        </div>
      </div>

      {/* Note */}
      <div style={{ marginBottom: 22 }}>
        <Input
          label="Note (optional)"
          placeholder="e.g. Venue booked, invite list pending..."
          value={form.note}
          onChange={e => set('note', e.target.value)}
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <Btn onClick={onClose} style={{ flex: 1 }} disabled={saving}>Cancel</Btn>
        <Btn onClick={handleSave} variant="primary" style={{ flex: 1, background: 'var(--purple)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }} disabled={saving}>
          {saving ? 'Saving…' : editEvent ? 'Update Event' : 'Create Event'}
        </Btn>
      </div>

    </Modal>
  );
}
