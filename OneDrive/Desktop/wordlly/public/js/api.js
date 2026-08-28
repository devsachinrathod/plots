const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  let body = null;
  try {
    body = await res.json();
  } catch (_) {
    /* no JSON body */
  }

  if (!res.ok) {
    throw new Error((body && body.error) || `Request failed (${res.status})`);
  }
  return body;
}

const api = {
  getToday: () => request('/words/today'),
  getReview: () => request('/words/review'),
  getLearned: () => request('/words/learned'),
  search: (q) => request(`/words/search?q=${encodeURIComponent(q)}`),

  remember: (id) => request(`/words/${id}/remember`, { method: 'PATCH' }),
  forgot: (id) => request(`/words/${id}/forgot`, { method: 'PATCH' }),
  reviewAgain: (id) => request(`/words/${id}/review-again`, { method: 'PATCH' }),

  deleteWord: (id) => request(`/words/${id}`, { method: 'DELETE' }),
  deleteAllToday: () => request('/words/today/all', { method: 'DELETE' }),

  getProgress: () => request('/progress'),
  nextDay: () => request('/progress/next-day', { method: 'POST' }),

  getGrammar: () => request('/grammar'),
  generateGrammar: (topic) => request('/ai/generate-grammar', { method: 'POST', body: JSON.stringify({ topic }) }),
  generateNextDayWords: () => request('/ai/generate-next-day', { method: 'POST', body: JSON.stringify({}) }),
};
