const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ Database sync failed:', err));