const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  schemeCode: {
    type: String,
    required: [true, 'Scheme code is required'],
    unique: true,
    trim: true,
    index: true
  },
  schemeName: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


watchlistSchema.index({ schemeCode: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);