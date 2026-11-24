const router    = require('express').Router();
const mongoose  = require('mongoose');
const auth      = require('../middleware/authMiddleware');
const Event       = require('../models/Event');
const Transaction = require('../models/Transaction');

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

router.use(auth);

// ── GET all events for the logged-in user ─────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ user: req.userId }).sort({ startDate: -1 });

    // Attach spent amount to each event
    const withSpent = await Promise.all(events.map(async (ev) => {
      const txs = await Transaction.find({ user: req.userId, eventId: ev._id });
      const spent = txs.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      return { ...ev.toObject(), spent };
    }));

    res.json(withSpent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET single event with its expenses ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const ev = await Event.findOne({ _id: req.params.id, user: req.userId });
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const expenses = await Transaction.find({ user: req.userId, eventId: ev._id }).sort({ date: -1 });
    const spent    = expenses.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);

    res.json({ ...ev.toObject(), spent, expenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST create event ─────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, emoji, category, budget, startDate, endDate, note } = req.body;
    if (!name || budget === undefined || !startDate) {
      return res.status(400).json({ message: 'name, budget and startDate are required' });
    }
    const parsedBudget = parseFloat(budget);
    if (isNaN(parsedBudget) || parsedBudget < 0) {
      return res.status(400).json({ message: 'Budget must be a non-negative number' });
    }
    const ev = await Event.create({
      user: req.userId, name: String(name).trim(), emoji: emoji || '🎉', category: category || 'Personal', budget: parsedBudget,
      startDate, endDate: endDate || null, note: note || '',
    });
    res.status(201).json({ ...ev.toObject(), spent: 0, expenses: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT update event ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.user;

    if (updates.budget !== undefined) {
      const parsedBudget = parseFloat(updates.budget);
      if (isNaN(parsedBudget) || parsedBudget < 0) {
        return res.status(400).json({ message: 'Budget must be a non-negative number' });
      }
      updates.budget = parsedBudget;
    }

    const ev = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const expenses = await Transaction.find({ user: req.userId, eventId: ev._id });
    const spent    = expenses.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    res.json({ ...ev.toObject(), spent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE event (orphans linked transactions — they revert to monthly budget) ──
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const ev = await Event.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    // Transactions are intentionally NOT deleted — they become orphaned
    // and their eventId points to the now-deleted event document.
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST add expense to event ─────────────────────────────────────────────
router.post('/:id/expenses', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const ev = await Event.findOne({ _id: req.params.id, user: req.userId });
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    const { amount, category, date, desc, recur } = req.body;
    if (amount === undefined || !category || !date) {
      return res.status(400).json({ message: 'amount, category and date are required' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const tx = await Transaction.create({
      user: req.userId,
      type: 'expense',
      amount: parsedAmount,
      category,
      date,
      desc:    desc || '',
      recur:   recur || '',
      eventId: ev._id,          // ← the key field for Approach C
    });

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE remove an expense from an event ────────────────────────────────
router.delete('/:id/expenses/:txId', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    if (!isValidId(req.params.txId)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const ev = await Event.findOne({ _id: req.params.id, user: req.userId });
    if (!ev) return res.status(404).json({ message: 'Event not found' });

    await Transaction.findOneAndDelete({ _id: req.params.txId, user: req.userId, eventId: ev._id });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
