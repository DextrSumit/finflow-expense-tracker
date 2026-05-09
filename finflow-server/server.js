const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── CORS Configuration ──────────────────────────────────────────────────
// Allow local development and any vercel.app deployment
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets',      require('./routes/budgets'));
app.use('/api/profile',      require('./routes/profile'));

app.get('/api/test', (req, res) => res.json({ message: 'Server working!' }));

// ── Server Startup ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Listen immediately so Render health checks pass
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log('MONGO_URI found:', !!process.env.MONGO_URI);
  console.log('JWT_SECRET found:', !!process.env.JWT_SECRET);
});

// Connect to MongoDB in the background
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));