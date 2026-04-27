import { useState, useMemo } from 'react';

export default function useTransactionFilter(transactions) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => {
    let result = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (search) result = result.filter(t => (t.desc + t.category).toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter(t => t.category === category);
    if (type) result = result.filter(t => t.type === type);
    if (from) result = result.filter(t => t.date >= from);
    if (to) result = result.filter(t => t.date <= to);
    return result;
  }, [transactions, search, category, type, from, to]);

  const totalNet = filtered.reduce((s, t) => t.type === 'income' ? s + t.amount : s - t.amount, 0);
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  function reset() { setSearch(''); setCategory(''); setType(''); setFrom(''); setTo(''); }

  return {
    filtered, search, setSearch, category, setCategory,
    type, setType, from, setFrom, to, setTo, reset,
    summary: { totalNet, totalIncome, totalExpense, count: filtered.length }
  };
}
