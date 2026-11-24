const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');

const isValidId = id => mongoose.Types.ObjectId.isValid(id);

router.use(auth);

// GET all transactions for logged-in user
router.get('/', async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, date, desc, recur, eventId } = req.body;

    if (!type || amount === undefined || !category || !date) {
      return res.status(400).json({ message: 'type, amount, category, and date are required' });
    }

    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'type must be either income or expense' });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const cleanEventId = (eventId && isValidId(eventId)) ? eventId : null;

    const tx = await Transaction.create({
      user: req.userId,
      type,
      amount: parsedAmount,
      category: String(category).trim(),
      date: String(date).trim(),
      desc: desc ? String(desc).trim() : '',
      recur: recur ? String(recur).trim() : '',
      eventId: cleanEventId,
    });

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const updates = { ...req.body };
    delete updates._id;
    delete updates.user;

    if (updates.amount !== undefined) {
      const parsedAmount = parseFloat(updates.amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
      updates.amount = parsedAmount;
    }

    if (updates.type && updates.type !== 'income' && updates.type !== 'expense') {
      return res.status(400).json({ message: 'type must be either income or expense' });
    }

    if (updates.eventId !== undefined) {
      updates.eventId = (updates.eventId && isValidId(updates.eventId)) ? updates.eventId : null;
    }

    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;