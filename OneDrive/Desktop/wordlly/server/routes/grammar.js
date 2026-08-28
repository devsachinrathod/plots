const express = require('express');
const router = express.Router();
const Grammar = require('../models/Grammar');

// GET /api/grammar
// All grammar lessons, oldest (curated) first, AI-generated ones appended
// as they're created.
router.get('/', async (req, res) => {
  try {
    const lessons = await Grammar.find({}).sort({ createdAt: 1 }).lean();
    res.json({ total: lessons.length, lessons });
  } catch (err) {
    res.status(500).json({ error: 'Could not load grammar lessons.', details: err.message });
  }
});

module.exports = router;
