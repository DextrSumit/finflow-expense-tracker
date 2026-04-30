const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/profile',      require('./routes/profile'));

app.get('/api/test', (req, res) => res.json({ message: 'Server working!' }));

// Add these console logs
console.log('MONGO_URI found:', !!process.env.MONGO_URI);
console.log('JWT_SECRET found:', !!process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });