import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, StatCard, ProgressBar, EmptyState, Btn, Badge } from '../components/UI';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import EventExpenseModal from '../components/EventExpenseModal';
import { fmt, fmtDate } from '../utils/helpers';
import {
  Plus, ArrowLeft, Edit2, Trash2, CalendarDays, Wallet, TrendingDown, TrendingUp,
} from 'lucide-react';

// ── Event Detail View ──────────────────────────────────────────────────────
function EventDetail({ eventId, onBack }) {
  const { events, transactions, updateEvent, deleteEvent, deleteEventExpense, getCatMeta } = useApp();
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editModalOpen,    setEditModalOpen]    = useState(false);

  const event = events.find(e => e._id === eventId);
  if (!event) return null;

  // Get this event's expenses from global transactions
  const expenses = transactions
    .filter(t => t.eventId === eventId || t.eventId?._id === eventId || String(t.eventId) === eventId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const spent     = expenses.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
  const remaining = event.budget - spent;
  const pct       = event.budget > 0 ? (spent / event.budget) * 100 : 0;

  async function handleDelete() {
    if (!window.confirm(`Delete "${event.name}"? Its expenses will remain in your transactions.`)) return;
    await deleteEvent(eventId);
    onBack();
  }

  async function handleDeleteExpense(txId) {
    if (!window.confirm('Remove this expense from the event?')) return;
    await deleteEventExpense(eventId, txId);
  }

  const dateLabel = event.endDate
    ? `${fmtDate(event.startDate)} – ${fmtDate(event.endDate)}`
    : `From ${fmtDate(event.startDate)} · Ongoing`;

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* ── Back + Actions bar ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface)',
            color: 'var(--text2)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)';  e.currentTarget.style.color = 'var(--text2)'; }}
        >
          <ArrowLeft size={15} /> All Events
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn size="sm" onClick={() => setEditModalOpen(true)}>
            <Edit2 size={13} /> Edit
          </Btn>
          <Btn size="sm" variant="danger" onClick={handleDelete}>
            <Trash2 size={13} /> Delete
          </Btn>
        </div>
      </div>

      {/* ── Event Header Card ─────────────────────────────────────────────── */}
      <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--surface), var(--surface2))' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, background: 'var(--purple-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0,
          }}>
            {event.emoji || '🎉'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
              {event.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Badge color="var(--purple)" bg="var(--purple-light)">{event.category}</Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text3)' }}>
                <CalendarDays size={13} />
                <span>{dateLabel}</span>
              </div>
            </div>
            {event.note && (
              <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 6, fontStyle: 'italic' }}>
                {event.note}
              </p>
            )}
          </div>
        </div>

        {/* Budget Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Total Budget', value: fmt(event.budget), color: 'var(--purple)',   icon: <Wallet size={14} /> },
            { label: 'Spent',        value: fmt(spent),         color: 'var(--red)',      icon: <TrendingDown size={14} /> },
            { label: 'Remaining',    value: fmt(Math.abs(remaining)), color: remaining >= 0 ? 'var(--green)' : 'var(--red)', icon: <TrendingUp size={14} /> },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)', fontWeight: 600, marginBottom: 6 }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: s.color, letterSpacing: '-0.02em' }}>
                {remaining < 0 && s.label === 'Remaining' ? '-' : ''}{s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
          <span>{Math.round(pct)}% used</span>
          <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
        </div>
        <ProgressBar pct={pct} color="var(--purple)" />
        {pct >= 100 && (
          <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 6, fontWeight: 600 }}>
            ⚠ Over budget by {fmt(spent - event.budget)}
          </div>
        )}
      </Card>

      {/* ── Expenses List ─────────────────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Event Expenses</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>
              {expenses.length === 0 ? 'No expenses yet' : `${expenses.length} expense${expenses.length !== 1 ? 's' : ''} · ${fmt(spent)} total`}
            </div>
          </div>
          <Btn
            variant="primary"
            size="sm"
            onClick={() => setExpenseModalOpen(true)}
            style={{ background: 'var(--purple)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
          >
            <Plus size={14} /> Add Expense
          </Btn>
        </div>

        {expenses.length === 0
          ? <EmptyState icon="💸" title="No expenses yet" sub="Track your first expense for this event" />
          : expenses.map(tx => {
              const meta = getCatMeta(tx.category);
              return (
                <div key={tx._id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
                  borderBottom: '1px solid var(--border)', animation: 'fadeIn 0.2s ease',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: 'var(--red-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {tx.desc || tx.category}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
                      {tx.desc ? `${tx.category} · ` : ''}{fmtDate(tx.date)}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 15, color: 'var(--text)', flexShrink: 0 }}>
                    −{fmt(tx.amount)}
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(tx._id)}
                    title="Remove expense"
                    style={{
                      width: 30, height: 30, border: 'none', borderRadius: 8,
                      background: 'transparent', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text3)', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.color = 'var(--red)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text3)'; }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })
        }
      </Card>

      {/* Modals */}
      <EventExpenseModal
        open={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        eventId={eventId}
        eventName={event.name}
      />
      <EventModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        editEvent={event}
        onSave={(data) => updateEvent(eventId, data)}
      />
    </div>
  );
}

// ── Events List View ───────────────────────────────────────────────────────
export default function Events() {
  const { events, eventsLoading, addEvent } = useApp();
  const [selectedId,   setSelectedId]   = useState(null);
  const [createOpen,   setCreateOpen]   = useState(false);

  // If an event is selected, show its detail view
  if (selectedId) {
    return <EventDetail eventId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  const totalBudget = events.reduce((s, e) => s + (e.budget || 0), 0);
  const totalSpent  = events.reduce((s, e) => s + (e.spent  || 0), 0);

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* ── Summary Row ────────────────────────────────────────────────────── */}
      {events.length > 0 && (
        <div className="cards-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          <StatCard label="Total Events"    value={events.length}   sub="All events"     color="var(--purple)" />
          <StatCard label="Total Allocated" value={fmt(totalBudget)} sub="Across events"  color="var(--blue)" />
          <StatCard label="Total Spent"     value={fmt(totalSpent)}  sub="Across events"  color="var(--red)" />
        </div>
      )}

      {/* ── Events Grid ────────────────────────────────────────────────────── */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Your Events</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>
              Budget separately from your monthly spending
            </div>
          </div>
          <Btn
            variant="primary"
            onClick={() => setCreateOpen(true)}
            style={{ background: 'var(--purple)', boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}
          >
            <Plus size={16} /> New Event
          </Btn>
        </div>

        {eventsLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
            <div>Loading events…</div>
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="No events yet"
            sub="Create your first event — a birthday, trip, wedding — and track its budget separately."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {events.map(ev => (
              <EventCard key={ev._id} event={ev} onClick={() => setSelectedId(ev._id)} />
            ))}
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <EventModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(data) => addEvent(data)}
      />
    </div>
  );
}
