const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables dynamically from local or project root (auto-picks newest edit)
const localEnv = path.resolve(__dirname, '.env');
const rootEnv = path.resolve(__dirname, '../../.env');

require('dotenv').config();
if (fs.existsSync(localEnv)) {
  require('dotenv').config({ path: localEnv, override: true });
}
if (fs.existsSync(rootEnv)) {
  const localMtime = fs.existsSync(localEnv) ? fs.statSync(localEnv).mtimeMs : 0;
  const rootMtime = fs.statSync(rootEnv).mtimeMs;
  if (rootMtime >= localMtime) {
    require('dotenv').config({ path: rootEnv, override: true });
  }
}

const app = express();

// ── CORS Configuration ──────────────────────────────────────────────────
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.trim().replace(/\/$/, ''));
}

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api/auth',         require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets',      require('./routes/budgets'));
app.use('/api/profile',      require('./routes/profile'));
app.use('/api/events',       require('./routes/events'));

app.get('/api/test', (req, res) => res.json({ message: 'Server working!' }));

// ── 404 Handler for undefined routes ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// ── Server Startup ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Listen immediately so Render health checks pass
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log('MONGO_URI found:', !!process.env.MONGO_URI);
  console.log('JWT_SECRET found:', !!process.env.JWT_SECRET);
});

// Connect to MongoDB in the background
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected!'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));
} else {
  console.error('❌ MONGO_URI is NOT set — database connection skipped!');
}