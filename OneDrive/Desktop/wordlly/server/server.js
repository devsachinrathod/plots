require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const wordsRouter = require('./routes/words');
const progressRouter = require('./routes/progress');
const grammarRouter = require('./routes/grammar');
const aiRouter = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/words', wordsRouter);
app.use('/api/progress', progressRouter);
app.use('/api/grammar', grammarRouter);
app.use('/api/ai', aiRouter);

// Serve the frontend (plain HTML/CSS/JS, no build step needed)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Any non-API route falls back to index.html (keeps things simple for a
// single-page app with client-side view switching).
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Wordly server running at http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\nPort ${PORT} is already in use.`);
        console.error(`Wordly may already be running — open http://localhost:${PORT} in your browser.`);
        console.error('To restart: stop the other process, then run npm start again.\n');
        process.exit(1);
      }
      console.error('Server failed to start:', err.message);
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Make sure MongoDB is running, then try again.');
    process.exit(1);
  });
