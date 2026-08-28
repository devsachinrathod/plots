const mongoose = require('mongoose');

// This is a personal, single-user app, so there is exactly ONE
// progress document. It just keeps track of which "day" of
// vocabulary the user is currently on, plus a simple daily streak.
const progressSchema = new mongoose.Schema({
  currentDay: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null }, // stored as YYYY-MM-DD
});

// Fetch the single progress doc, creating it the first time.
progressSchema.statics.getSingleton = async function () {
  let progress = await this.findOne();
  if (!progress) {
    progress = await this.create({ currentDay: 1, streak: 0, lastActiveDate: null });
  }
  return progress;
};

module.exports = mongoose.model('Progress', progressSchema);
