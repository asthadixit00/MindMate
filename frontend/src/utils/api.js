const BASE = "https://mindmate-backend-iha3.onrender.com";
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

export const chatApi = {
  sendMessage: (message, sessionId) =>
    apiRequest('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    }),
  getHistory: (sessionId) => apiRequest(`/chat/history/${sessionId}`),
};

export const checkinApi = {
  create: (data) =>
    apiRequest('/checkin', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => apiRequest('/checkin'),
};

export const quoteApi = {
  daily: () => apiRequest('/quotes/daily'),
  random: () => apiRequest('/quotes/random'),
};
