const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, getSessions } = require('../controllers/chatController');

router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);
router.get('/sessions', getSessions);

module.exports = router;
