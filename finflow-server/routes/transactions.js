const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');

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
    const tx = await Transaction.create({ ...req.body, user: req.userId });
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!tx) return res.status(404).json({ message: 'Not found' });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;