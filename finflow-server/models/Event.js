const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true, trim: true },
  emoji:     { type: String, default: '🎉' },
  category:  { type: String, default: 'Personal' },
  budget:    { type: Number, required: true, min: 0 },
  startDate: { type: String, required: true },   // YYYY-MM-DD
  endDate:   { type: String, default: null },     // YYYY-MM-DD — null = open-ended
  note:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
