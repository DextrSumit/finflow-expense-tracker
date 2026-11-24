import React from 'react';
import { fmt } from '../utils/helpers';
import { ProgressBar } from './UI';
import { CalendarDays, ChevronRight } from 'lucide-react';

// Determine event status relative to today
function getStatus(startDate, endDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  const end   = endDate ? new Date(endDate) : null;

  if (start > today)                    return { label: 'Upcoming',  color: '#171717', bg: 'var(--blue)' };
  if (end && end < today)               return { label: 'Completed', color: 'var(--text3)', bg: 'var(--surface2)' };
  return                                       { label: 'Active',    color: '#171717', bg: 'var(--lime)' };
}

function fmtDateShort(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function EventCard({ event, onClick }) {
  const { name, emoji, category, budget, startDate, endDate, spent = 0 } = event;
  const pct    = budget > 0 ? (spent / budget) * 100 : 0;
  const status = getStatus(startDate, endDate);
  const remaining = budget - spent;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 8,
        padding: 18,
        cursor: 'pointer',
        boxShadow: '4px 4px 0px var(--border)',
        transition: 'all 0.15s ease',
        display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-2px, -2px)';
        e.currentTarget.style.boxShadow = '6px 6px 0px var(--border)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '4px 4px 0px var(--border)';
      }}
    >
      {/* Top accent border */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--purple)',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Emoji avatar — square box */}
        <div style={{
          width: 44, height: 44, borderRadius: 6, flexShrink: 0,
          background: 'var(--lavender)',
          border: '1.5px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          {emoji || '🎉'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>
              {name}
            </span>
            {/* Status chip */}
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
              color: status.color, background: status.bg, letterSpacing: '0.04em',
              textTransform: 'uppercase', border: '1px solid var(--border)',
            }}>
              {status.label}
            </span>
          </div>

          {/* Category + dates */}
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 500 }}>{category}</span>
            <span>·</span>
            <CalendarDays size={11} />
            <span>
              {fmtDateShort(startDate)}
              {endDate ? ` – ${fmtDateShort(endDate)}` : ' · Ongoing'}
            </span>
          </div>
        </div>

        <ChevronRight size={16} color="var(--text3)" style={{ flexShrink: 0, marginTop: 4 }} />
      </div>

      {/* Budget progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text)' }}>
            {fmt(spent)} <span style={{ fontWeight: 400, color: 'var(--text3)' }}>spent</span>
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--text3)'
          }}>
            {fmt(budget)} budget
          </span>
        </div>
        <ProgressBar pct={pct} />
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>
          {pct >= 100
            ? <span style={{ color: 'var(--red)', fontWeight: 700 }}>⚠ Over by {fmt(spent - budget)}</span>
            : <span>{fmt(remaining)} remaining · {Math.round(pct)}% used</span>
          }
        </div>
      </div>
    </div>
  );
}
