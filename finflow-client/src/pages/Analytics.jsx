import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn } from '../components/UI';
import { fmt, getLast6Months } from '../utils/helpers';
import { exportPDF } from '../utils/pdfExport';
import { FileDown } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const CHART_COLORS = ['#FF7043','#2196F3','#4CAF50','#FF9800','#9C27B0','#00BCD4','#F44336','#607D8B','#E91E63','#795548'];

export default function Analytics() {
  const { transactions, budgets, theme } = useApp();
  const now = new Date();
  const cm = now.getMonth(), cy = now.getFullYear();
  const months = getLast6Months();

  function handleExportPDF() {
    exportPDF(transactions, budgets, cm, cy);
  }

  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const tickColor = isDark ? '#5a6070' : '#9aa0b0';
  const tooltipBg = isDark ? '#1e2130' : '#fff';
  const tooltipText = isDark ? '#eef0f5' : '#1a1d23';

  // Category pie data (current month)
  const catMap = {};
  transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === cm && new Date(t.date).getFullYear() === cy)
    .forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const pieLabels = Object.keys(catMap);
  const pieData = Object.values(catMap);

  // Bar data (6 months)
  const incData = months.map(m => transactions.filter(t => t.type === 'income' && new Date(t.date).getMonth() === m.month && new Date(t.date).getFullYear() === m.year).reduce((s, t) => s + t.amount, 0));
  const expData = months.map(m => transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === m.month && new Date(t.date).getFullYear() === m.year).reduce((s, t) => s + t.amount, 0));

  const commonTooltip = {
    backgroundColor: tooltipBg,
    titleColor: tooltipText,
    bodyColor: tickColor,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    padding: 12,
    cornerRadius: 10,
    callbacks: { label: ctx => ' ' + fmt(ctx.raw) }
  };

  const pieTotal = pieData.reduce((s, v) => s + v, 0);

  return (
    <div style={{ animation: 'slideUp 0.3s ease' }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>
            {now.toLocaleString('default', { month: 'long', year: 'numeric' })} · all time data below
          </div>
        </div>
        <Btn onClick={handleExportPDF} variant="ghost" size="sm">
          <FileDown size={14} /> Export PDF Report
        </Btn>
      </div>
      {/* Top row */}
      <div className="charts-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 14, marginBottom: 14 }}>
        {/* Doughnut */}
        <Card>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Expenses by Category</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>This month · {fmt(pieTotal)}</div>
          {pieLabels.length === 0
            ? <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text3)', fontSize: 13 }}>No expense data this month</div>
            : <>
              <div style={{ position: 'relative', height: 200 }}>
                <Doughnut
                  data={{
                    labels: pieLabels,
                    datasets: [{ data: pieData, backgroundColor: CHART_COLORS.slice(0, pieLabels.length), borderWidth: 2, borderColor: isDark ? '#161920' : '#fff', hoverOffset: 6 }]
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
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Income vs Expenses</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Last 6 months</div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            {[{ color: '#4CAF50', label: 'Income' }, { color: '#FF7043', label: 'Expenses' }].map(x => (
              <span key={x.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: x.color }} />{x.label}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: 230 }}>
            <Bar
              data={{
                labels: months.map(m => m.label),
                datasets: [
                  { label: 'Income', data: incData, backgroundColor: 'rgba(76,175,80,0.85)', borderRadius: 6, borderSkipped: false },
                  { label: 'Expenses', data: expData, backgroundColor: 'rgba(255,112,67,0.85)', borderRadius: 6, borderSkipped: false },
                ]
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { ...commonTooltip } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: tickColor, font: { family: 'DM Sans' } } },
                  y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: 'DM Mono' }, callback: v => '₹' + Math.round(v / 1000) + 'k' } }
                }
              }}
            />
          </div>
        </Card>
      </div>

      {/* Line chart */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Spending Trend</div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>Monthly expense trend over 6 months</div>
        <div style={{ position: 'relative', height: 180 }}>
          <Line
            data={{
              labels: months.map(m => m.label),
              datasets: [{
                label: 'Expenses', data: expData,
                borderColor: '#FF7043', backgroundColor: 'rgba(255,112,67,0.07)',
                fill: true, tension: 0.45, pointBackgroundColor: '#FF7043', pointRadius: 5, pointHoverRadius: 7,
              }]
            }}
            options={{
              responsive: true, maintainAspectRatio: false,
              plugins: { legend: { display: false }, tooltip: { ...commonTooltip } },
              scales: {
                x: { grid: { display: false }, ticks: { color: tickColor, font: { family: 'DM Sans' } } },
                y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: 'DM Mono' }, callback: v => '₹' + Math.round(v / 1000) + 'k' } }
              }
            }}
          />
        </div>
      </Card>

      {/* Summary stats */}
      <div className="cards-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 14 }}>
        {[
          { label: 'Avg Monthly Income', value: fmt(incData.reduce((s, v) => s + v, 0) / 6) },
          { label: 'Avg Monthly Expense', value: fmt(expData.reduce((s, v) => s + v, 0) / 6) },
          { label: 'Best Savings Month', value: (() => { let best = -Infinity, idx = 0; months.forEach((_, i) => { if (incData[i] - expData[i] > best) { best = incData[i] - expData[i]; idx = i; } }); return months[idx]?.label || '—'; })() },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
