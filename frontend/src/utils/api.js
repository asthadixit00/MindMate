// Base URL for deployed backend
const BASE = "https://mindmate-backend-iha3.onrender.com";

// Generic API request function
async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Request failed');
  }

  return res.json();
}

// Chat APIs
export const chatApi = {
  sendMessage: (message, sessionId) =>
    apiRequest('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    }),

  getHistory: (sessionId) =>
    apiRequest(`/api/chat/history/${sessionId}`),
};

// Check-in APIs
export const checkinApi = {
  create: (data) =>
    apiRequest('/api/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiRequest('/api/checkin'),
};

// Quotes APIs
export const quoteApi = {
  daily: () =>
    apiRequest('/api/quotes/daily'),

  random: () =>
    apiRequest('/api/quotes/random'),
};