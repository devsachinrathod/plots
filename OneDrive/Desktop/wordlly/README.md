# Wordly — 30 Words a Day

A personal English vocabulary learning app. Every day you get 30 new words
to learn, a "Remember Mode" flashcard flow to test yourself, an automatic
Review pile for anything you forget, a Grammar section with AI-generated
lessons, and a searchable list of everything you've already learned.

Built with a plain HTML/CSS/JavaScript frontend (no frameworks, no build
step), a small Express + MongoDB backend, and optional AI features powered
by the Claude API.

## Features

- **Dashboard** — today's progress, streak, quick stats, and a preview of
  today's words and anything due for review.
- **Today's Words** — all 30 of today's words as cards (word, pronunciation,
  meaning, Hindi meaning, an example sentence *with its Hindi meaning*, a
  memory trick, and text-to-speech).
- **Remember Mode** — a focused flashcard flow: see the word, try to recall
  it, reveal the meaning, mark yourself right or wrong.
- **Review** — anything you marked "I forgot" shows up here until you get it.
- **Grammar** — short lessons (rules + example sentences with their Hindi
  meaning) on tenses, articles, prepositions, punctuation, and sentence
  structure. Ask the built-in AI for a lesson on any topic you like.
- **Vocabulary** — every word you've learned so far, with search.
- **AI-generated days** — once you finish a day's words, either continue
  into a day you've already prepared, or have Claude write tomorrow's 30
  words on the spot.
- **Notifications** — a small panel summarizing what's left to do today.

## Tech stack

- Frontend: HTML5, CSS3, vanilla JavaScript (served as static files)
- Backend: Node.js + Express
- Database: MongoDB (via Mongoose)
- AI: Anthropic API (`@anthropic-ai/sdk`), used for generating new daily
  word sets and grammar lessons — entirely optional

## 1. Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- A MongoDB database — either:
  - MongoDB installed locally ([macOS/Windows/Linux instructions](https://www.mongodb.com/docs/manual/installation/)), or
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (no local install needed)
- *(Optional, for AI features)* An Anthropic API key from
  [console.anthropic.com](https://console.anthropic.com)

## 2. Setup

```bash
# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Open `.env` and set `MONGO_URI`:

```env
# Local MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/wordly

# Or MongoDB Atlas
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/wordly
```

If you want the AI features (generating new daily word sets and grammar
lessons), also set:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Without a key, everything else in the app works normally — you'll just get
a friendly message if you try to use a "Generate with AI" button.

## 3. Add your first 30 words

A starter set of 30 words (Day 1) and 6 grammar lessons are included.
Load them into the database:

```bash
npm run seed
```

This only runs once per collection — if `words` or `grammar` already has
data, that part of the seed is skipped so nothing gets overwritten.

## 4. Run the app

```bash
npm start
```

Then open **http://localhost:5000** in your browser.

For development with auto-restart on file changes:

```bash
npm run dev
```

## Project structure

```
wordly-app/
├── server/
│   ├── server.js          # Express app entry point
│   ├── config/db.js       # MongoDB connection
│   ├── models/            # Word.js, Progress.js, Grammar.js (Mongoose schemas)
│   ├── routes/            # words.js, progress.js, grammar.js, ai.js
│   ├── services/ai.js     # Anthropic API wrapper (prompts + JSON parsing)
│   └── seed.js            # Loads the starter 30 words + 6 grammar lessons
├── public/
│   ├── index.html         # Single HTML file, all five views
│   ├── css/styles.css     # Purple + white design system
│   └── js/
│       ├── api.js         # fetch() wrapper for the backend
│       └── app.js         # All UI logic (rendering, events, state)
├── package.json
└── .env.example
```

## How "today's words" work

Each word has a `dayNumber`. The app tracks which day you're on in a single
`Progress` document (`currentDay`, plus a daily streak). "Today's Words"
shows every word for `currentDay`, regardless of whether you've already
acted on it — cards pick up a **Learned** or **Review** tag once you do.

Once every word for the current day has been marked (learned or moved to
review), a banner appears on the Today's Words page:

- If a word set for the next day **already exists** (you added it ahead of
  time), you'll see **"Start Day N"**.
- If it **doesn't exist yet**, you'll see **"Generate with AI"** — one click
  asks Claude to write 30 fresh words/phrases (avoiding anything you've
  already studied) and drops you straight into them. This needs
  `ANTHROPIC_API_KEY` to be set.

## AI features in detail

Both AI endpoints live in `server/routes/ai.js`, and all prompting/parsing
logic is isolated in `server/services/ai.js` — that's the one file to edit
if you want to change how words or lessons are generated, or swap models.

- **`POST /api/ai/generate-next-day`** — writes 30 new words/phrases for
  the day after your current one (skips anything already in your
  vocabulary), saves them, and advances your progress into that day.
- **`POST /api/ai/generate-grammar`** (body: `{ "topic": "..." }`) — writes
  a structured grammar lesson (explanation, rules, example sentences with
  Hindi meanings) for whatever topic you type into the Grammar page, and
  saves it so it's there for good.

By default these use `claude-haiku-4-5-20251001` — fast and inexpensive,
which is plenty for this kind of structured content. You can point it at a
different model by setting `ANTHROPIC_MODEL` in `.env`.

## Adding more days of words manually

You don't need AI to add more days — open `server/seed.js` and either add
more objects to the `day1` array with a different `dayNumber` before
inserting, or insert directly into MongoDB (with `mongosh`, MongoDB
Compass, or Atlas) using the same shape:

```js
{
  word: "Lucid",
  pronunciation: "/ˈluːsɪd/",
  meaning: "Expressed clearly; easy to understand.",
  hindiMeaning: "स्पष्ट / सुबोध",
  example: "The professor gave a lucid explanation.",
  exampleMeaning: "प्रोफेसर ने एक स्पष्ट व्याख्या दी।",
  memoryTrick: "...",
  dayNumber: 2,
  order: 1
}
```

The `status`, `reviewCount`, `learnedAt`, and `lastReviewedAt` fields don't
need to be set — they default automatically. `exampleMeaning` is optional;
cards and the word modal simply skip that line if it's left out.

## Notes

- This is a single-user, personal app — there's no login system by design.
- Word pronunciation audio uses your browser's built-in text-to-speech
  (Web Speech API), so no audio files or extra services are needed.
- All data lives in MongoDB, so your progress is safe across restarts and
  devices (as long as they point at the same database).
- AI responses are validated before being saved — if Claude ever returns
  something malformed, you'll get a clear error toast instead of bad data
  silently entering your database.
