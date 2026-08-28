// Thin wrapper around the Anthropic API. Everything AI-related in this
// app goes through the two functions exported here, so there's exactly
// one place that knows how to talk to Claude and parse its output.
const Anthropic = require('@anthropic-ai/sdk');

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Claude is told to return raw JSON, but models occasionally wrap it in a
// markdown code fence anyway — strip that defensively before parsing.
function parseJSON(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim();
  return JSON.parse(cleaned);
}

async function askClaude({ system, prompt, maxTokens = 4096 }) {
  const client = getClient();
  if (!client) {
    const err = new Error('AI features need an ANTHROPIC_API_KEY set in your .env file.');
    err.code = 'NO_API_KEY';
    throw err;
  }

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock) throw new Error('Claude did not return a text response.');

  try {
    return parseJSON(textBlock.text);
  } catch (err) {
    throw new Error('Could not parse the AI response as JSON. Try again.');
  }
}

const WORD_FIELDS = ['word', 'pronunciation', 'meaning', 'hindiMeaning', 'example', 'exampleMeaning', 'memoryTrick'];

function isValidWord(w) {
  return w && typeof w === 'object' && WORD_FIELDS.every((f) => typeof w[f] === 'string' && w[f].trim().length > 0);
}

// Generates `count` new vocabulary words or short phrases, avoiding
// anything already in `existingWords` (a plain array of word strings).
async function generateDailyWords({ count = 30, existingWords = [] } = {}) {
  const system = `You are a vocabulary curriculum designer for an English-learning app used by intermediate learners whose native language is Hindi.
Given a list of words the learner has already studied, generate NEW English words or short common phrases (not duplicates or close variants of the studied list).
Mix in some single words and some short useful phrases/idioms. Vary part of speech and keep difficulty intermediate to upper-intermediate.
For each entry, return an object with EXACTLY these fields (all strings):
- "word": the word or phrase
- "pronunciation": IPA transcription wrapped in slashes, e.g. "/əˈbʌndənt/"
- "meaning": a concise, clear English definition
- "hindiMeaning": an accurate Hindi translation/definition, written in Devanagari script
- "example": one natural English sentence using the word or phrase
- "exampleMeaning": the Hindi translation of that example sentence, written in Devanagari script
- "memoryTrick": a short, fun mnemonic that helps an English learner remember the word
Respond with ONLY a JSON array of exactly ${count} such objects. No markdown code fences, no explanation, no extra text before or after — just the raw JSON array.`;

  const prompt = existingWords.length
    ? `Words already studied — do not repeat these or very close variants:\n${existingWords.join(', ')}\n\nGenerate ${count} new words/phrases now.`
    : `Generate ${count} new words/phrases now, suitable as someone's very first day of study.`;

  const data = await askClaude({ system, prompt, maxTokens: 8192 });
  if (!Array.isArray(data)) throw new Error('Expected the AI to return a JSON array of words.');

  const valid = data.filter(isValidWord);
  if (!valid.length) throw new Error('The AI response did not contain any usable words.');
  return valid;
}

function isValidGrammarLesson(g) {
  return (
    g &&
    typeof g === 'object' &&
    typeof g.title === 'string' &&
    g.title.trim() &&
    typeof g.category === 'string' &&
    g.category.trim() &&
    typeof g.explanation === 'string' &&
    g.explanation.trim() &&
    Array.isArray(g.rules) &&
    g.rules.length &&
    g.rules.every((r) => typeof r === 'string' && r.trim()) &&
    Array.isArray(g.examples) &&
    g.examples.length &&
    g.examples.every((e) => e && typeof e.sentence === 'string' && typeof e.meaning === 'string' && e.sentence.trim() && e.meaning.trim())
  );
}

// Generates one structured grammar lesson for the given topic.
async function generateGrammarLesson({ topic }) {
  const system = `You are an English grammar teacher writing a lesson for an app used by Hindi-speaking English learners.
Given a grammar topic, return a single JSON object with EXACTLY these fields:
- "title": a short lesson title
- "category": one short label, e.g. "Tenses", "Articles", "Prepositions", "Punctuation", "Sentence Structure"
- "explanation": a clear, plain-English explanation of the concept, 2-4 sentences
- "rules": an array of 3-6 short rule strings
- "examples": an array of 4-6 objects, each with "sentence" (an English example sentence demonstrating the rule) and "meaning" (the Hindi translation/explanation of that sentence, in Devanagari script)
Respond with ONLY the JSON object. No markdown code fences, no explanation, no extra text before or after.`;

  const prompt = `Topic: ${topic}`;

  const data = await askClaude({ system, prompt, maxTokens: 2048 });
  if (!isValidGrammarLesson(data)) throw new Error('The AI response was missing required grammar lesson fields.');
  return data;
}

module.exports = { generateDailyWords, generateGrammarLesson };
