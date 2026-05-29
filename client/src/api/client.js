const BASE = '/api';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),

  // Users
  loginOrCreate: (name) => api.post('/users', { name }),
  getStats: (userId) => api.get(`/users/${userId}/stats`),
  getErrors: (userId) => api.get(`/users/${userId}/errors`),
  getFlashcardStats: (userId) => api.get(`/users/${userId}/flashcard-stats`),

  // Exercises
  getExercises: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/exercises${q ? '?' + q : ''}`);
  },
  getRandomExercise: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/exercises/random${q ? '?' + q : ''}`);
  },
  getExercise: (id) => api.get(`/exercises/${id}`),
  generateExercise: (category, difficulty) =>
    api.post('/exercises/generate', { category, difficulty }),
  saveGeneratedExercise: (data) => api.post('/exercises/save-generated', data),

  // Attempts
  submitAttempt: (data) => api.post('/attempts', data),

  // Guides
  getGuides: () => api.get('/guides'),
  getGuide: (category) => api.get(`/guides/${category}`),

  // Flashcards
  getFlashcards: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api.get(`/flashcards${q ? '?' + q : ''}`);
  },
  saveFlashcardAttempt: (userId, flashCardId, confidence) =>
    api.post('/flashcards/attempts', { userId, flashCardId, confidence }),
};

export default api;
