require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connect } = require('./config/db');

const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const aiRoutes = require('./routes/ai');

const PORT = process.env.PORT || 4000;

async function main() {
  await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mTestDB');

  const app = express();
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/ai', aiRoutes);

  app.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

  app.use((err, req, res, next) => {
    console.error('Server error', err);
    res.status(500).json({ error: 'server_error' });
  });

  app.listen(PORT, () => console.log('Server listening on', PORT));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
