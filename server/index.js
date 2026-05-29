require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
}

app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/attempts', require('./routes/attempts'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/flashcards', require('./routes/flashcards'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

if (isProd) {
  const distPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
