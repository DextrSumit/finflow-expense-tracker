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
      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
      borderBottom: '1px solid var(--border)', animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: isIncome ? 'var(--green-light)' : 'var(--red-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
      }}>{meta.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {tx.desc || tx.category}
          </span>
          {tx.recur && <Badge color="var(--blue)" bg="var(--blue-light)">↻ {tx.recur}</Badge>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
          {tx.category} · {fmtDate(tx.date)}
        </div>
      </div>

      <div style={{
        fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-mono)', flexShrink: 0,
        color: isIncome ? 'var(--green)' : 'var(--red)',
      }}>
        {isIncome ? '+' : '−'}{fmt(tx.amount)}
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={() => onEdit(tx)} style={{
          width: 30, height: 30, border: '1px solid var(--border2)', borderRadius: 8,
          background: 'var(--surface2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text2)', transition: 'all 0.18s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--green-light)'; e.currentTarget.style.color = 'var(--green)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; }}
        >
          <Edit2 size={13} />
        </button>
        <button onClick={() => onDelete(tx.id)} style={{
          width: 30, height: 30, border: '1px solid var(--border2)', borderRadius: 8,
          background: 'var(--surface2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text2)', transition: 'all 0.18s'
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
