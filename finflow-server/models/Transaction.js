const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, enum: ['income', 'expense'], required: true },
  amount:   { type: Number, required: true },
  category: { type: String, required: true },
  date:     { type: String, required: true },
  desc:     { type: String },
  recur:    { type: String },
  eventId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);