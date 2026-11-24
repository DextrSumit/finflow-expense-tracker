export function fmt(n) {
  return '₹' + Math.round(n || 0).toLocaleString('en-IN');
}

// Safely parses a "YYYY-MM-DD" or ISO string as local date without UTC offset shifting
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dateStr);
}

export function fmtDate(dateStr) {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleString('default', { month: 'short', year: '2-digit' });
}

export function getLast6Months() {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: getMonthLabel(d.getFullYear(), d.getMonth()), year: d.getFullYear(), month: d.getMonth() });
  }
  return months;
}

export function exportCSV(transactions) {
  const rows = [
    ['Date', 'Type', 'Category', 'Description', 'Amount (₹)', 'Recurring', 'Event'],
    ...transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.desc || '',
      t.amount,
      t.recur || '',
      t.eventId ? 'Yes' : 'No'
    ])
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'finflow_transactions.csv';
  a.click();
}
