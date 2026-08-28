const express = require('express');
const router = express.Router();
const Word = require('../models/Word');
const Progress = require('../models/Progress');
const Grammar = require('../models/Grammar');
const ai = require('../services/ai');

function friendlyError(err) {
  if (err.code === 'NO_API_KEY') return { status: 400, message: err.message };
  return { status: 502, message: err.message || 'The AI request failed. Please try again.' };
}

// POST /api/ai/generate-next-day
// Uses Claude to write a fresh set of 30 words/phrases for the day AFTER
// the current one, saves them, and advances the user straight into it.
// Only works if the next day doesn't already have a word set — if it
// does, use POST /api/progress/next-day instead.
router.post('/generate-next-day', async (req, res) => {
  try {
    const progress = await Progress.getSingleton();
    const nextDay = progress.currentDay + 1;

    const alreadyExists = await Word.countDocuments({ dayNumber: nextDay });
    if (alreadyExists > 0) {
      return res.status(400).json({ error: `Day ${nextDay} already has words. Use "Start Day ${nextDay}" instead.` });
    }

    const count = Math.min(Math.max(parseInt(req.body?.count, 10) || 30, 1), 30);
    const existing = await Word.find({});
    const existingWords = existing.map((w) => w.word);

    const generated = await ai.generateDailyWords({ count, existingWords });

    const docs = generated.map((w, i) => ({
      word: w.word,
      pronunciation: w.pronunciation,
      meaning: w.meaning,
      hindiMeaning: w.hindiMeaning,
      example: w.example,
      exampleMeaning: w.exampleMeaning,
      memoryTrick: w.memoryTrick,
      dayNumber: nextDay,
      order: i + 1,
    }));

    await Word.insertMany(docs);

    progress.currentDay = nextDay;
    await progress.save();

    res.json({ generated: docs.length, currentDay: nextDay });
  } catch (err) {
    const { status, message } = friendlyError(err);
    res.status(status).json({ error: message });
  }
});

// POST /api/ai/generate-grammar   body: { topic }
// Asks Claude for a structured grammar lesson on the given topic and
// saves it so it shows up in the Grammar section from then on.
router.post('/generate-grammar', async (req, res) => {
  try {
    const topic = (req.body?.topic || '').trim();
    if (!topic) return res.status(400).json({ error: 'Please enter a grammar topic.' });
    if (topic.length > 80) return res.status(400).json({ error: 'Keep the topic under 80 characters.' });

    const lesson = await ai.generateGrammarLesson({ topic });
    const doc = await Grammar.create({ ...lesson, source: 'ai' });

    res.json({ lesson: doc });
  } catch (err) {
    const { status, message } = friendlyError(err);
    res.status(status).json({ error: message });
  }
});

module.exports = router;
