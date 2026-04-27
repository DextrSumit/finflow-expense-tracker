export function fmt(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function fmtDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function todayStr() {
  return new Date().toISOString().split('T')[0];
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
    ['Date', 'Type', 'Category', 'Description', 'Amount (₹)', 'Recurring'],
    ...transactions.map(t => [t.date, t.type, t.category, t.desc || '', t.amount, t.recur || ''])
  ];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'finflow_transactions.csv';
  a.click();
}
