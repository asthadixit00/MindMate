const express = require('express');
const router = express.Router();
const { getDailyQuote, getRandomQuote } = require('../controllers/quoteController');

router.get('/daily', getDailyQuote);
router.get('/random', getRandomQuote);

module.exports = router;
