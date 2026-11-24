import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn } from '../components/UI';
import { fmt, getLast6Months, parseLocalDate } from '../utils/helpers';
import { exportPDF } from '../utils/pdfExport';
import { FileDown } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

// Neo-brutalist chart palette: lime + coral + lavender + muted tones
const CHART_COLORS = ['#C6F135','#FF6B6B','#C8B8FA','#F59E0B','#60A5FA','#34D399','#F472B6','#A78BFA','#FB923C','#4ADE80'];

export default function Analytics() {
  const { transactions, budgets, theme, selectedMonth } = useApp();
  const [includeEvents, setIncludeEvents] = useState(false);
  const cm     = selectedMonth.month;
  const cy     = selectedMonth.year;
  const months = getLast6Months();

  function handleExportPDF() { exportPDF(transactions, budgets, cm, cy); }

  const isDark      = theme === 'dark';
  const gridColor   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(23,23,23,0.06)';
  const tickColor   = isDark ? '#5a6070' : '#888';
  const tooltipBg   = isDark ? '#1a1a1a' : '#fff';
  const tooltipText = isDark ? '#f0f0f0' : '#171717';

  const filterTx = (txs) => includeEvents ? txs : txs.filter(t => !t.eventId);

  // Category pie data
  const catMap = {};
  filterTx(
    transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const d = parseLocalDate(t.date);
      return d.getMonth() === cm && d.getFullYear() === cy;
    })
  ).forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + (parseFloat(t.amount) || 0); });
  const pieLabels = Object.keys(catMap);
  const pieData   = Object.values(catMap);

  // Bar + Line data (6 months)
  const incData = months.map(m =>
    transactions.filter(t => {
      if (t.type !== 'income') return false;
      const d = parseLocalDate(t.date);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    }).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
  );
  const expData = months.map(m =>
    filterTx(transactions).filter(t => {
      if (t.type !== 'expense') return false;
      const d = parseLocalDate(t.date);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    }).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
  );

  const commonTooltip = {
    backgroundColor: tooltipBg,
    titleColor: tooltipText,
    bodyColor: tickColor,
    borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#171717',
    borderWidth: 1.5,
    padding: 12,
    cornerRadius: 4,
    callbacks: { label: ctx => ' ' + fmt(ctx.raw) },
  };

  const pieTotal = pieData.reduce((s, v) => s + v, 0);

  const eventTxCount = transactions.filter(t => {
    if (t.type !== 'expense' || !t.eventId) return false;
    const d = parseLocalDate(t.date);
    return d.getMonth() === cm && d.getFullYear() === cy;
  }).length;

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>

      {/* ── Header row ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            {new Date(cy, cm, 1).toLocaleString('default', { month: 'long', year: 'numeric' })} · all time data below
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Event toggle — neo-brutalist 2-block selector */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            border: '1.5px solid var(--border)', borderRadius: 6,
            overflow: 'hidden', boxShadow: '2px 2px 0px var(--border)',
          }}>
            {[
              { label: 'All',       value: true },
              { label: 'No Events', value: false },
            ].map((opt, idx) => (
              <button
                key={String(opt.value)}
                onClick={() => setIncludeEvents(opt.value)}
                style={{
                  padding: '7px 14px', border: 'none',
                  borderRight: idx === 0 ? '1.5px solid var(--border)' : 'none',
                  fontSize: 12, fontWeight: 700, fontFamily: 'var(--font)',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: includeEvents === opt.value ? 'var(--lime)' : 'var(--surface2)',
                  color: includeEvents === opt.value ? '#171717' : 'var(--text3)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Btn onClick={handleExportPDF} variant="ghost" size="sm">
            <FileDown size={14} /> Export PDF
          </Btn>
        </div>
      </div>

      {/* ── Event exclusion banner ─────────────────────────────────────────── */}
      {!includeEvents && eventTxCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px',
          background: 'var(--purple-light)', border: '1.5px solid var(--purple)',
          borderRadius: 6, marginBottom: 16, fontSize: 12, color: 'var(--purple)', fontWeight: 500,
          boxShadow: '2px 2px 0px var(--border)',
        }}>
          <span>🎉</span>
          <span>
            <strong>{eventTxCount} event expense{eventTxCount !== 1 ? 's' : ''}</strong> hidden from charts this month.
            Switch to "All" to include them.
          </span>
        </div>
      )}

      {/* ── Doughnut + Bar ────────────────────────────────────────────────── */}
      <div className="charts-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, marginBottom: 14 }}>

        {/* Doughnut */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
            Expenses by Category
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
            This month · {fmt(pieTotal)}
            {!includeEvents && <span style={{ color: 'var(--purple)', marginLeft: 6 }}>· no events</span>}
          </div>
          {pieLabels.length === 0
            ? <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text3)', fontSize: 13 }}>No expense data this month</div>
            : <>
              <div style={{ position: 'relative', height: 200 }}>
                <Doughnut
                  data={{
                    labels: pieLabels,
                    datasets: [{
                      data: pieData,
                      backgroundColor: CHART_COLORS.slice(0, pieLabels.length),
                      borderWidth: 2,
                      borderColor: isDark ? '#161616' : '#fff',
                      hoverOffset: 6,
                    }]
                  }}
                  options={{
                    responsive: true, maintainAspectRatio: false, cutout: '65%',
                    plugins: { legend: { display: false }, tooltip: { ...commonTooltip } }
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 14 }}>
                {pieLabels.map((l, i) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS[i], flexShrink: 0 }} />
                    {l} <span style={{ color: 'var(--text3)' }}>({Math.round(pieData[i] / pieTotal * 100)}%)</span>
                  </div>
                ))}
              </div>
            </>
          }
        </Card>

        {/* Bar */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
            Income vs Expenses
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>
            Last 6 months
            {!includeEvents && <span style={{ color: 'var(--purple)', marginLeft: 6 }}>· no events</span>}
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            {[{ color: '#C6F135', label: 'Income' }, { color: '#FF6B6B', label: 'Expenses' }].map(x => (
              <span key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: x.color, border: '1px solid var(--border-soft)' }} />{x.label}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: 230 }}>
            <Bar
              data={{
                labels: months.map(m => m.label),
                datasets: [
                  { label: 'Income',   data: incData, backgroundColor: 'rgba(198,241,53,0.85)', borderRadius: 4, borderSkipped: false },
                  { label: 'Expenses', data: expData, backgroundColor: 'rgba(255,107,107,0.85)', borderRadius: 4, borderSkipped: false },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { ...commonTooltip } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: tickColor, font: { family: 'var(--font)' } } },
                  y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: 'var(--font-mono)' }, callback: v => '₹' + Math.round(v / 1000) + 'k' } }
                }
              }}
            />
          </div>
        </Card>
      </div>

      {/* ── Line chart ─────────────────────────────────────────────────────── */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
          Spending Trend
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
          Monthly expense trend over 6 months
          {!includeEvents && <span style={{ color: 'var(--purple)', marginLeft: 6 }}>· excl. events</span>}
        </div>
        <div style={{ position: 'relative', height: 180 }}>
          <Line
            data={{
              labels: months.map(m => m.label),
              datasets: [{
                label: 'Expenses', data: expData,
                borderColor: '#FF6B6B', backgroundColor: 'rgba(255,107,107,0.08)',
                fill: true, tension: 0.4,
                pointBackgroundColor: '#FF6B6B',
                pointBorderColor: '#171717',
                pointBorderWidth: 1.5,
                pointRadius: 5, pointHoverRadius: 7,
              }]
            }}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { ...commonTooltip } },
              scales: {
                x: { grid: { display: false }, ticks: { color: tickColor, font: { family: 'var(--font)' } } },
                y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: 'var(--font-mono)' }, callback: v => '₹' + Math.round(v / 1000) + 'k' } }
              }
            }}
          />
        </div>
      </Card>

      {/* ── Summary stats ──────────────────────────────────────────────────── */}
      <div className="cards-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }}>
        {[
          { label: 'Avg Monthly Income',  value: fmt(incData.reduce((s, v) => s + v, 0) / 6) },
          { label: 'Avg Monthly Expense', value: fmt(expData.reduce((s, v) => s + v, 0) / 6) },
          { label: 'Best Savings Month',  value: (() => {
            let best = -Infinity, idx = 0;
            months.forEach((_, i) => { if (incData[i] - expData[i] > best) { best = incData[i] - expData[i]; idx = i; } });
            return months[idx]?.label || '—';
          })() },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: 8, padding: '14px 16px',
            boxShadow: '3px 3px 0px var(--border)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
