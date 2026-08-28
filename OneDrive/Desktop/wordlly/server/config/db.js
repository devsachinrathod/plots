const mongoose = require('mongoose');

// Keep this simple on purpose: one function, one job.
// It connects to MongoDB using the URI from .env and exits
// with a clear message if it can't connect.
async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wordly';

  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected -> ${uri}`);
  } catch (err) {
    console.error('Could not connect to MongoDB.');
    console.error(err.message);
    console.error(
      '\nMake sure MongoDB is running locally, or that MONGO_URI in your .env ' +
      'file points to a valid MongoDB Atlas connection string.'
    );
    process.exit(1);
  }
}

module.exports = connectDB;
