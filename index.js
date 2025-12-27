require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({ windowMs: 15*60*1000, max: 200 });
app.use(limiter);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log('Server running on', PORT));
})
.catch(err => {
  console.error('Mongo connection error:', err.message || err);
  process.exit(1);
});
