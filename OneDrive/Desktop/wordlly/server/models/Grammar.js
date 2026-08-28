const mongoose = require('mongoose');

// One grammar lesson: a short explanation, a handful of plain-English
// rules, and example sentences paired with their Hindi meaning.
const exampleSchema = new mongoose.Schema(
  {
    sentence: { type: String, required: true, trim: true },
    meaning: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const grammarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    explanation: { type: String, required: true, trim: true },
    rules: { type: [String], default: [] },
    examples: { type: [exampleSchema], default: [] },
    source: { type: String, enum: ['seed', 'ai'], default: 'seed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grammar', grammarSchema);
