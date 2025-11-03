require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const itemsRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);

// health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// start server and sync DB
(async () => {
  try {
    await sequelize.sync({ /* force: true */ });
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to sync database', err);
  }
})();