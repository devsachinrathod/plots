const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const Progress = require('../models/Progress');
const { todayString, yesterdayString } = require('../utils/date');

async function touchStreak() {
  const progress = await Progress.getSingleton();
  const today = todayString();

  if (progress.lastActiveDate === today) return progress;

  progress.streak = progress.lastActiveDate === yesterdayString() ? progress.streak + 1 : 1;
  progress.lastActiveDate = today;
  await progress.save();
  return progress;
}

async function getDayStats(dayNumber) {
  const [stats] = await Word.aggregate([
    { $match: { dayNumber } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        learned: { $sum: { $cond: [{ $eq: ['$status', 'learned'] }, 1, 0] } },
        remaining: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
        handled: { $sum: { $cond: [{ $ne: ['$status', 'new'] }, 1, 0] } },
      },
    },
  ]);

  const total = stats?.total || 0;
  const learned = stats?.learned || 0;
  const remaining = stats?.remaining || 0;
  const handled = stats?.handled || 0;

  return { total, learned, remaining, handled, allHandled: remaining === 0 && total > 0 };
}

router.get('/today', async (req, res) => {
  try {
    const progress = await Progress.getSingleton();
    const [words, stats] = await Promise.all([
      Word.find({ dayNumber: progress.currentDay }).sort({ order: 1 }).lean(),
      getDayStats(progress.currentDay),
    ]);

    res.json({ currentDay: progress.currentDay, ...stats, words });
  } catch (err) {
    res.status(500).json({ error: 'Could not load today\'s words.', details: err.message });
  }
});

router.get('/review', async (req, res) => {
  try {
    const words = await Word.find({ status: 'review' }).sort({ lastReviewedAt: -1 }).lean();
    res.json({ total: words.length, words });
  } catch (err) {
    res.status(500).json({ error: 'Could not load review words.', details: err.message });
  }
});

router.get('/learned', async (req, res) => {
  try {
    const words = await Word.find({ status: 'learned' }).sort({ learnedAt: -1 }).lean();
    res.json({ total: words.length, words });
  } catch (err) {
    res.status(500).json({ error: 'Could not load your vocabulary.', details: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ total: 0, words: [] });

    let words;
    if (q.length >= 2) {
      words = await Word.find(
        { status: 'learned', $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .lean();
    }

    if (!words || words.length === 0) {
      words = await Word.find({
        status: 'learned',
        word: { $regex: q, $options: 'i' },
      })
        .sort({ word: 1 })
        .limit(100)
        .lean();
    }

    res.json({ total: words.length, words });
  } catch (err) {
    res.status(500).json({ error: 'Search failed.', details: err.message });
  }
});

router.delete('/today/all', async (req, res) => {
  try {
    const progress = await Progress.getSingleton();
    const result = await Word.deleteMany({ dayNumber: progress.currentDay });

    res.json({
      deleted: result.deletedCount,
      currentDay: progress.currentDay,
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete today\'s words.', details: err.message });
  }
});

router.patch('/:id/remember', async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      { status: 'learned', learnedAt: new Date() },
      { new: true }
    ).lean();
    if (!word) return res.status(404).json({ error: 'Word not found.' });

    const progress = await touchStreak();
    res.json({ word, progress });
  } catch (err) {
    res.status(500).json({ error: 'Could not update word.', details: err.message });
  }
});

router.patch('/:id/forgot', async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      { status: 'review', $inc: { reviewCount: 1 }, lastReviewedAt: new Date() },
      { new: true }
    ).lean();
    if (!word) return res.status(404).json({ error: 'Word not found.' });

    const progress = await touchStreak();
    res.json({ word, progress });
  } catch (err) {
    res.status(500).json({ error: 'Could not update word.', details: err.message });
  }
});

router.patch('/:id/review-again', async (req, res) => {
  try {
    const word = await Word.findByIdAndUpdate(
      req.params.id,
      { status: 'review', $inc: { reviewCount: 1 }, lastReviewedAt: new Date() },
      { new: true }
    ).lean();
    if (!word) return res.status(404).json({ error: 'Word not found.' });
    res.json({ word });
  } catch (err) {
    res.status(500).json({ error: 'Could not update word.', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id).lean();
    if (!word) return res.status(404).json({ error: 'Word not found.' });
    res.json({ deleted: true, word });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete word.', details: err.message });
  }
});

module.exports = router;
