const mongoose = require('mongoose');

// A single vocabulary word and everything needed to learn it.
//
// status:
//   'new'     -> not seen yet / part of today's list, untouched
//   'learned' -> user tapped "I remember"
//   'review'  -> user tapped "I forgot", needs another pass
const wordSchema = new mongoose.Schema(
  {
    word: { type: String, required: true, trim: true },
    pronunciation: { type: String, required: true, trim: true }, // IPA, e.g. /əˈbʌndənt/
    meaning: { type: String, required: true, trim: true },
    hindiMeaning: { type: String, required: true, trim: true },
    example: { type: String, required: true, trim: true },
    exampleMeaning: { type: String, default: '', trim: true }, // Hindi translation of the example sentence
    memoryTrick: { type: String, required: true, trim: true },

    // Which daily batch this word belongs to (Day 1, Day 2, ...)
    dayNumber: { type: Number, required: true, default: 1 },
    // Order within that day's list of 30
    order: { type: Number, required: true, default: 0 },

    status: {
      type: String,
      enum: ['new', 'learned', 'review'],
      default: 'new',
    },

    reviewCount: { type: Number, default: 0 },
    learnedAt: { type: Date, default: null },
    lastReviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

wordSchema.index({ dayNumber: 1, order: 1 });
wordSchema.index({ dayNumber: 1, status: 1 });
wordSchema.index({ status: 1, lastReviewedAt: -1 });
wordSchema.index({ status: 1, learnedAt: -1 });
wordSchema.index({ word: 'text' });

module.exports = mongoose.model('Word', wordSchema);
