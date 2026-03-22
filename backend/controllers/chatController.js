const { v4: uuidv4 } = require('uuid');
const { analyzeSentiment } = require('../services/sentimentService');
const { generateResponse } = require('../services/responseService');
const { readJSON, writeJSON } = require('../utils/storage');

const CHAT_FILE = 'conversations.json';

/**
 * POST /api/chat/message
 */
function sendMessage(req, res) {
  const { message, sessionId } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const sid = sessionId || uuidv4();
  const { sentiment, score, tags } = analyzeSentiment(message);
  const botResponse = generateResponse(sentiment, tags);

  const userMsg = {
    id: uuidv4(),
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
    sentiment,
    score,
    tags,
  };

  const botMsg = {
    id: uuidv4(),
    role: 'bot',
    content: botResponse,
    timestamp: new Date().toISOString(),
  };

  // Persist conversation
  const conversations = readJSON(CHAT_FILE);
  let session = conversations.find((s) => s.sessionId === sid);

  if (!session) {
    session = { sessionId: sid, messages: [], createdAt: new Date().toISOString() };
    conversations.push(session);
  }

  session.messages.push(userMsg, botMsg);
  session.updatedAt = new Date().toISOString();
  writeJSON(CHAT_FILE, conversations);

  return res.json({
    sessionId: sid,
    userMessage: userMsg,
    botMessage: botMsg,
    analysis: { sentiment, score, tags },
  });
}

/**
 * GET /api/chat/history/:sessionId
 */
function getHistory(req, res) {
  const { sessionId } = req.params;
  const conversations = readJSON(CHAT_FILE);
  const session = conversations.find((s) => s.sessionId === sessionId);

  if (!session) {
    return res.json({ sessionId, messages: [] });
  }

  return res.json(session);
}

/**
 * GET /api/chat/sessions
 */
function getSessions(req, res) {
  const conversations = readJSON(CHAT_FILE);
  const summary = conversations.map(({ sessionId, createdAt, updatedAt, messages }) => ({
    sessionId,
    createdAt,
    updatedAt,
    messageCount: messages.length,
  }));
  return res.json(summary);
}

module.exports = { sendMessage, getHistory, getSessions };
