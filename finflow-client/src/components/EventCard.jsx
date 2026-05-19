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

  if (start > today)                    return { label: 'Upcoming',  color: 'var(--blue)',  bg: 'var(--blue-light)' };
  if (end && end < today)               return { label: 'Completed', color: 'var(--text3)', bg: 'var(--surface2)' };
  return                                       { label: 'Active',    color: 'var(--green)', bg: 'var(--green-light)' };
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
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: 20, cursor: 'pointer',
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', gap: 14, position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--purple)',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Emoji avatar */}
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'var(--purple-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
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
              fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
              color: status.color, background: status.bg, letterSpacing: '0.03em',
            }}>
              {status.label}
            </span>
          </div>

          {/* Category + dates */}
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{category}</span>
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
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text2)' }}>
            {fmt(spent)} <span style={{ fontWeight: 400 }}>spent</span>
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            color: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--amber)' : 'var(--text3)'
          }}>
            {fmt(budget)} budget
          </span>
        </div>
        <ProgressBar pct={pct} color="var(--purple)" />
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5 }}>
          {pct >= 100
            ? <span style={{ color: 'var(--red)', fontWeight: 600 }}>⚠ Over by {fmt(spent - budget)}</span>
            : <span>{fmt(remaining)} remaining · {Math.round(pct)}% used</span>
          }
        </div>
      </div>
    </div>
  );
}
