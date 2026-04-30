const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  avatar:     { type: String, default: '' },   // ← NEW: base64 or URL

  // ── Email Verification ──────────────────────────────────────────────────
  isVerified:  { type: Boolean, default: false },
  otp:         { type: String },
  otpExpires:  { type: Date },

}, { timestamps: true }); // timestamps adds createdAt + updatedAt automatically

module.exports = mongoose.model('User', userSchema);
