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

      {/* Back + Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            border: '1.5px solid var(--border)', borderRadius: 6,
            background: 'var(--surface)', color: 'var(--text2)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
            boxShadow: '2px 2px 0px var(--border)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px var(--border)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px var(--border)'; }}
        >
          <ArrowLeft size={15} /> All Events
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn size="sm" onClick={() => setEditModalOpen(true)}>
            <Edit2 size={13} /> Edit
          </Btn>
          <Btn size="sm" variant="danger" onClick={handleDelete}>
            <Trash2 size={13} /> Delete
          </Btn>
        </div>
      </div>

      {/* Event Header Card */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 8,
            background: 'var(--lavender)', border: '2px solid var(--border)',
            boxShadow: '3px 3px 0px var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>
            {event.emoji || '🎉'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>
              {event.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Badge color="var(--purple)" bg="var(--purple-light)">{event.category}</Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text3)' }}>
                <CalendarDays size={12} />
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total Budget', value: fmt(event.budget),         color: 'var(--purple)',                                    icon: <Wallet size={13} /> },
            { label: 'Spent',        value: fmt(spent),                color: 'var(--red)',                                       icon: <TrendingDown size={13} /> },
            { label: 'Remaining',    value: fmt(Math.abs(remaining)),  color: remaining >= 0 ? 'var(--green)' : 'var(--red)',     icon: <TrendingUp size={13} /> },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface2)', border: '1.5px solid var(--border)',
              borderRadius: 6, padding: '12px 14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                {s.icon} {s.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color, letterSpacing: '-0.02em' }}>
                {remaining < 0 && s.label === 'Remaining' ? '-' : ''}{s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>
          <span style={{ fontWeight: 600 }}>{Math.round(pct)}% used</span>
          <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
        </div>
        <ProgressBar pct={pct} />
        {pct >= 100 && (
          <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 6, fontWeight: 700 }}>
            ⚠ Over budget by {fmt(spent - event.budget)}
          </div>
        )}
      </Card>

      {/* Expenses List */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Event Expenses
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              {expenses.length === 0 ? 'No expenses yet' : `${expenses.length} expense${expenses.length !== 1 ? 's' : ''} · ${fmt(spent)} total`}
            </div>
          </div>
          <Btn
            variant="primary"
            size="sm"
            onClick={() => setExpenseModalOpen(true)}
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
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0',
                  borderBottom: '1px solid var(--border-soft)', animation: 'fadeIn 0.2s ease',
                  transition: 'background 0.15s', borderRadius: 4, margin: '0 -4px', paddingLeft: 4, paddingRight: 4,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 6,
                    background: 'var(--red-light)', border: '1.5px solid var(--red)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 17, flexShrink: 0,
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {tx.desc || tx.category}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                      {tx.desc ? `${tx.category} · ` : ''}{fmtDate(tx.date)}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--red)', flexShrink: 0 }}>
                    −{fmt(tx.amount)}
                  </div>
                  <button
                    onClick={() => handleDeleteExpense(tx._id)}
                    title="Remove expense"
                    style={{
                      width: 28, height: 28, border: '1.5px solid var(--border-soft)', borderRadius: 5,
                      background: 'transparent', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text3)', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-light)'; e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.color = 'var(--text3)'; }}
                  >
                    <Trash2 size={12} />
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
  const { events, eventsLoading, addEvent, selectedMonth } = useApp();
  const [selectedId, setSelectedId]   = useState(null);
  const [createOpen, setCreateOpen]   = useState(false);
  const [showAll, setShowAll]         = useState(false);

  const sm = selectedMonth?.month ?? new Date().getMonth();
  const sy = selectedMonth?.year ?? new Date().getFullYear();
  const monthName = new Date(sy, sm, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

  // First & last day strings of selected month: YYYY-MM-DD
  const monthStartStr = `${sy}-${String(sm + 1).padStart(2, '0')}-01`;
  const lastDayNum    = new Date(sy, sm + 1, 0).getDate();
  const monthEndStr   = `${sy}-${String(sm + 1).padStart(2, '0')}-${String(lastDayNum).padStart(2, '0')}`;

  function isEventInSelectedMonth(ev) {
    if (!ev?.startDate) return false;
    const evStart = ev.startDate.slice(0, 10);
    const evEnd   = ev.endDate ? ev.endDate.slice(0, 10) : null;

    if (evEnd) {
      // Overlaps selected month range
      return evStart <= monthEndStr && evEnd >= monthStartStr;
    } else {
      // Single date or ongoing event starting in this month
      return evStart >= monthStartStr && evStart <= monthEndStr;
    }
  }

  if (selectedId) {
    return <EventDetail eventId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  const displayedEvents = showAll ? events : events.filter(isEventInSelectedMonth);
  const totalBudget = displayedEvents.reduce((s, e) => s + (e.budget || 0), 0);
  const totalSpent  = displayedEvents.reduce((s, e) => s + (e.spent  || 0), 0);

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* Summary Row */}
      {displayedEvents.length > 0 && (
        <div className="cards-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Events',    value: displayedEvents.length, sub: showAll ? 'All events' : monthName, color: 'var(--purple)' },
            { label: 'Total Allocated', value: fmt(totalBudget),        sub: showAll ? 'Across events' : monthName, color: 'var(--blue)' },
            { label: 'Total Spent',     value: fmt(totalSpent),         sub: showAll ? 'Across events' : monthName, color: 'var(--red)' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 8, padding: '14px 16px',
              boxShadow: '3px 3px 0px var(--border)',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono)', color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* Events Grid */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Your Events
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              Budget separately from your monthly spending
            </div>
          </div>
          <Btn variant="primary" onClick={() => setCreateOpen(true)}>
            <Plus size={16} /> New Event
          </Btn>
        </div>

        {/* Month scope pill + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 4,
            background: showAll ? 'var(--surface2)' : 'var(--lime)',
            color: '#171717', fontSize: 11, fontWeight: 700,
            border: '1.5px solid var(--border)',
          }}>
            {showAll ? '🌐 All Time' : `📅 ${monthName}`}
          </span>
          <button
            onClick={() => setShowAll(s => !s)}
            style={{
              fontSize: 11, color: 'var(--text3)', background: 'none', border: 'none',
              cursor: 'pointer', textDecoration: 'underline', padding: 0, fontWeight: 600,
            }}
          >
            {showAll ? `Show ${monthName} only` : 'Show all events'}
          </button>
        </div>

        {eventsLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text3)' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⏳</div>
            <div>Loading events…</div>
          </div>
        ) : displayedEvents.length === 0 ? (
          <EmptyState
            icon="🎉"
            title={showAll ? "No events yet" : `No events in ${monthName}`}
            sub={showAll
              ? "Create your first event — a birthday, trip, wedding — and track its budget separately."
              : `You have no events scheduled for ${monthName}. Create an event or click "Show all events".`
            }
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {displayedEvents.map(ev => (
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
