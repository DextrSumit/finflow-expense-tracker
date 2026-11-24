import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from './UI';
import { fmt, fmtDate } from '../utils/helpers';
import { Edit2, Trash2 } from 'lucide-react';

export default function TxItem({ tx, onEdit, onDelete }) {
  const { getCatMeta } = useApp();
  const meta = getCatMeta(tx.category);
  const isIncome = tx.type === 'income';

  return (
    <div
      className="tx-item"
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px',
        borderBottom: '1px solid var(--border-soft)', animation: 'fadeIn 0.2s ease',
        borderRadius: 6, transition: 'all 0.15s ease', margin: '0 -6px',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Category icon — square neo-brutalist box */}
      <div style={{
        width: 42, height: 42, borderRadius: 6, flexShrink: 0,
        background: isIncome ? 'var(--lime-light)' : 'var(--red-light)',
        border: `1.5px solid ${isIncome ? 'var(--lime)' : 'var(--red)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>
        {meta.icon}
      </div>

      {/* Description + sub */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: 'var(--text)',
          display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {tx.desc || tx.category}
          </span>
          {tx.recur   && <Badge color="var(--blue)"   bg="var(--blue-light)">↻ {tx.recur}</Badge>}
          {tx.eventId && <Badge color="var(--purple)" bg="var(--purple-light)">🎉 Event</Badge>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
          {tx.desc ? `${tx.category} · ` : ''}{fmtDate(tx.date)}
        </div>
      </div>

      {/* Amount — bold mono, high-contrast green for income, coral for expense */}
      <div style={{
        fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)',
        flexShrink: 0, letterSpacing: '-0.02em',
        color: isIncome ? 'var(--green)' : 'var(--red)',
      }}>
        {isIncome ? '+' : '−'}{fmt(tx.amount)}
      </div>

      {/* Action buttons — square, bordered */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(tx)}
          title="Edit"
          style={{
            width: 30, height: 30, borderRadius: 6, border: '1.5px solid var(--border-soft)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text3)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--lime-light)';
            e.currentTarget.style.borderColor = 'var(--lime)';
            e.currentTarget.style.color = '#555';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border-soft)';
            e.currentTarget.style.color = 'var(--text3)';
          }}
        >
          <Edit2 size={13} />
        </button>

        <button
          onClick={() => onDelete(tx._id || tx.id)}
          title="Delete"
          style={{
            width: 30, height: 30, borderRadius: 6, border: '1.5px solid var(--border-soft)',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text3)', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--red-light)';
            e.currentTarget.style.borderColor = 'var(--red)';
            e.currentTarget.style.color = 'var(--red)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border-soft)';
            e.currentTarget.style.color = 'var(--text3)';
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
