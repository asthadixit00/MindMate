const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/quotes', quoteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MindMate API is running' });
});

app.listen(PORT, () => {
  console.log(`MindMate backend running on http://localhost:${PORT}`);
});
