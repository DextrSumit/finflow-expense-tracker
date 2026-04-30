const router = require('express').Router();
const auth = require('../middleware/authMiddleware');

router.get('/', auth, (req, res) => {
  res.json({ message: 'Budgets route working' });
});

module.exports = router;