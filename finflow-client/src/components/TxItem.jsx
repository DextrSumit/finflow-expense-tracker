import React from 'react';
import { useApp } from '../context/AppContext';
import { Btn, Badge } from './UI';
import { fmt, fmtDate } from '../utils/helpers';
import { Edit2, Trash2 } from 'lucide-react';

export default function TxItem({ tx, onEdit, onDelete }) {
  const { getCatMeta } = useApp();
  const meta = getCatMeta(tx.category);
  const isIncome = tx.type === 'income';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
      borderBottom: '1px solid var(--border)', animation: 'fadeIn 0.2s ease',
      borderRadius: 'var(--radius-sm)', transition: 'all 0.2s ease',
      margin: '0 -8px'
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: isIncome ? 'var(--green-light)' : 'var(--red-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
      }}>{meta.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', color: 'var(--text)' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220, letterSpacing: '-0.01em' }}>
            {tx.desc || tx.category}
          </span>
          {tx.recur && <Badge color="var(--blue)" bg="var(--blue-light)">↻ {tx.recur}</Badge>}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4, fontWeight: 500 }}>
          {tx.category} • {fmtDate(tx.date)}
        </div>
      </div>

      <div style={{
        fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', flexShrink: 0, letterSpacing: '-0.02em',
        color: isIncome ? 'var(--green)' : 'var(--text)',
      }}>
        {isIncome ? '+' : '−'}{fmt(tx.amount)}
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 8 }}>
        {/* Edit button */}
        <button onClick={() => onEdit(tx)} style={{
          width: 32, height: 32, border: 'none', borderRadius: 8,
          background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text3)', transition: 'all 0.2s ease'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-light)'; e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.transform = 'none'; }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
        >
          <Edit2 size={14} />
        </button>

        {/* Delete button — uses tx._id (MongoDB) with fallback to tx.id (localStorage) */}
        <button onClick={() => onDelete(tx._id || tx.id)} style={{
          width: 32, height: 32, border: 'none', borderRadius: 8,
          background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
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
  );
}