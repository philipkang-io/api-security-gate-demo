require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ state: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: { name: 'notFoundError', message: `Route ${req.method} ${req.url} not found` } });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Orders API running at http://localhost:${PORT}`));
}

module.exports = app;
