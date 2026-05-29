const router = require('express').Router();
const prisma = require('../lib/prisma');
const { generateExercise } = require('../lib/claude');

function parseExercise(e) {
  return { ...e, solutionSteps: JSON.parse(e.solutionSteps) };
}

// GET /api/exercises — todos (filtro por category, difficulty)
router.get('/', async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    const where = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const exercises = await prisma.exercise.findMany({ where, orderBy: { id: 'asc' } });
    res.json(exercises.map(parseExercise));
  } catch (e) { next(e); }
});

// GET /api/exercises/random — ejercicio aleatorio
router.get('/random', async (req, res, next) => {
  try {
    const { category, avoidIds } = req.query;
    const avoid = avoidIds
      ? avoidIds.split(',').map(Number).filter(Boolean)
      : [];

    const where = {};
    if (category) where.category = category;
    if (avoid.length) where.id = { notIn: avoid };

    const exercises = await prisma.exercise.findMany({ where });
    if (!exercises.length) {
      // Si no hay con avoidIds, buscar sin ese filtro
      const all = await prisma.exercise.findMany({ where: category ? { category } : {} });
      if (!all.length) return res.status(404).json({ error: 'No hay ejercicios disponibles' });
      const pick = all[Math.floor(Math.random() * all.length)];
      return res.json(parseExercise(pick));
    }

    const pick = exercises[Math.floor(Math.random() * exercises.length)];
    res.json(parseExercise(pick));
  } catch (e) { next(e); }
});

// GET /api/exercises/:id — ejercicio específico
router.get('/:id', async (req, res, next) => {
  try {
    const exercise = await prisma.exercise.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado' });
    res.json(parseExercise(exercise));
  } catch (e) { next(e); }
});

// POST /api/exercises/generate — generar ejercicio con Claude
router.post('/generate', async (req, res, next) => {
  try {
    const { category = 'FUTURE_VALUE', difficulty = 'BASIC' } = req.body;

    const existing = await prisma.exercise.findMany({
      where: { category },
      select: { statement: true },
    });
    const statements = existing.map((e) => e.statement);

    const generated = await generateExercise(category, difficulty, statements);
    res.json(generated);
  } catch (e) { next(e); }
});

// POST /api/exercises/save-generated — guardar ejercicio generado
router.post('/save-generated', async (req, res, next) => {
  try {
    const { statement, correctAnswer, tolerance, solutionSteps, formulaUsed, category, difficulty } = req.body;

    const exercise = await prisma.exercise.create({
      data: {
        statement,
        correctAnswer: parseFloat(correctAnswer),
        tolerance: parseFloat(tolerance) || 0.5,
        category,
        difficulty,
        formulaUsed,
        solutionSteps: JSON.stringify(Array.isArray(solutionSteps) ? solutionSteps : [solutionSteps]),
      },
    });
    res.json(parseExercise(exercise));
  } catch (e) { next(e); }
});

module.exports = router;
