const { v4: uuidv4 } = require('uuid');
const { readJSON, writeJSON } = require('../utils/storage');

const CHECKIN_FILE = 'checkins.json';

const MOOD_LABELS = ['terrible', 'bad', 'okay', 'good', 'great'];

/**
 * POST /api/checkin
 */
function createCheckin(req, res) {
  const { mood, productivityScore, notes, sessionId } = req.body;

  if (mood === undefined || productivityScore === undefined) {
    return res.status(400).json({ error: 'mood and productivityScore are required' });
  }

  if (mood < 1 || mood > 5) {
    return res.status(400).json({ error: 'mood must be between 1 and 5' });
  }

  if (productivityScore < 0 || productivityScore > 10) {
    return res.status(400).json({ error: 'productivityScore must be between 0 and 10' });
  }

  const now = new Date();
  const checkin = {
    id: uuidv4(),
    mood,
    moodLabel: MOOD_LABELS[mood - 1],
    productivityScore,
    notes: notes || '',
    sessionId: sessionId || null,
    timestamp: now.toISOString(),
    dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
    date: now.toISOString().split('T')[0],
  };

  const checkins = readJSON(CHECKIN_FILE);
  checkins.push(checkin);
  writeJSON(CHECKIN_FILE, checkins);

  return res.status(201).json({ message: 'Check-in saved', checkin });
}

/**
 * GET /api/checkin
 */
function getCheckins(req, res) {
  const checkins = readJSON(CHECKIN_FILE);
  const limit = parseInt(req.query.limit) || 30;
  const recent = checkins.slice(-limit).reverse();

  const insights = generateInsights(checkins);

  return res.json({ checkins: recent, total: checkins.length, insights });
}

/**
 * Generate simple analytical insights
 */
function generateInsights(checkins) {
  if (checkins.length < 3) {
    return { message: 'Keep checking in — insights will appear after a few days! 📊' };
  }

  // Day-of-week mood average
  const dayMoods = {};
  checkins.forEach(({ dayOfWeek, mood }) => {
    if (!dayMoods[dayOfWeek]) dayMoods[dayOfWeek] = [];
    dayMoods[dayOfWeek].push(mood);
  });

  let worstDay = null;
  let lowestAvg = Infinity;
  for (const [day, moods] of Object.entries(dayMoods)) {
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    if (avg < lowestAvg) {
      lowestAvg = avg;
      worstDay = day;
    }
  }

  const avgMood = (checkins.reduce((s, c) => s + c.mood, 0) / checkins.length).toFixed(1);
  const avgProductivity = (checkins.reduce((s, c) => s + c.productivityScore, 0) / checkins.length).toFixed(1);

  // Consistency score: % of last 7 days with a check-in
  const last7 = new Set(
    checkins
      .filter((c) => {
        const d = new Date(c.timestamp);
        const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      })
      .map((c) => c.date)
  ).size;

  const consistencyScore = Math.round((last7 / 7) * 100);

  return {
    averageMood: parseFloat(avgMood),
    averageProductivity: parseFloat(avgProductivity),
    worstDay,
    consistencyScore,
    totalCheckins: checkins.length,
    message:
      worstDay
        ? `You tend to feel most stressed on ${worstDay}s. Plan lighter tasks then. 💡`
        : 'Keep tracking for personalized insights!',
  };
}

module.exports = { createCheckin, getCheckins };
