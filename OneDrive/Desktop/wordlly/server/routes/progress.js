const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const Progress = require('../models/Progress');

router.get('/', async (req, res) => {
  try {
    const progress = await Progress.getSingleton();
    const day = progress.currentDay;

    const [dayStats, reviewCount, learnedTotal, hasNextDay] = await Promise.all([
      Word.aggregate([
        { $match: { dayNumber: day } },
        {
          $group: {
            _id: null,
            todayTotal: { $sum: 1 },
            todayLearned: { $sum: { $cond: [{ $eq: ['$status', 'learned'] }, 1, 0] } },
            todayRemaining: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
            todayHandled: { $sum: { $cond: [{ $ne: ['$status', 'new'] }, 1, 0] } },
          },
        },
      ]),
      Word.countDocuments({ status: 'review' }),
      Word.countDocuments({ status: 'learned' }),
      Word.exists({ dayNumber: day + 1 }),
    ]);

    const stats = dayStats[0] || {
      todayTotal: 0,
      todayLearned: 0,
      todayRemaining: 0,
      todayHandled: 0,
    };

    res.json({
      currentDay: progress.currentDay,
      streak: progress.streak,
      todayTotal: stats.todayTotal,
      todayLearned: stats.todayLearned,
      todayRemaining: stats.todayRemaining,
      todayHandled: stats.todayHandled,
      reviewCount,
      learnedTotal,
      canAdvanceDay: stats.todayRemaining === 0 && stats.todayTotal > 0 && !!hasNextDay,
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load progress.', details: err.message });
  }
});

router.post('/next-day', async (req, res) => {
  try {
    const progress = await Progress.getSingleton();

    const remaining = await Word.countDocuments({ dayNumber: progress.currentDay, status: 'new' });
    if (remaining > 0) {
      return res.status(400).json({ error: 'Finish today\'s words before moving on.' });
    }

    const nextDayHasWords = await Word.exists({ dayNumber: progress.currentDay + 1 });
    if (!nextDayHasWords) {
      return res.status(400).json({ error: 'No more word sets have been added yet.' });
    }

    progress.currentDay += 1;
    await progress.save();
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: 'Could not advance day.', details: err.message });
  }
});

module.exports = router;
