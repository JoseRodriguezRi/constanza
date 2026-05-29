const router = require('express').Router();
const prisma = require('../lib/prisma');

// POST /api/users — crear o recuperar usuario por nombre
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Se requiere un nombre' });

    const user = await prisma.user.upsert({
      where: { name: name.trim() },
      update: {},
      create: { name: name.trim() },
    });
    res.json(user);
  } catch (e) { next(e); }
});

// GET /api/users/:id/stats — estadísticas del usuario
router.get('/:id/stats', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const attempts = await prisma.attempt.findMany({
      where: { userId },
      include: { exercise: { select: { category: true } } },
    });

    const byCategory = {};
    for (const a of attempts) {
      const cat = a.exercise.category;
      if (!byCategory[cat]) byCategory[cat] = { total: 0, correct: 0 };
      byCategory[cat].total++;
      if (a.isCorrect) byCategory[cat].correct++;
    }

    const categoryStats = Object.entries(byCategory).map(([category, s]) => ({
      category,
      total: s.total,
      correct: s.correct,
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
    }));

    const totalAttempts = attempts.length;
    const totalCorrect = attempts.filter((a) => a.isCorrect).length;
    const globalAccuracy = totalAttempts > 0
      ? Math.round((totalCorrect / totalAttempts) * 100)
      : 0;

    const sorted = [...categoryStats].sort((a, b) => b.accuracy - a.accuracy);
    const bestCategory = sorted[0]?.category || null;
    const worstCategory = sorted[sorted.length - 1]?.category || null;

    res.json({ totalAttempts, totalCorrect, globalAccuracy, bestCategory, worstCategory, categoryStats });
  } catch (e) { next(e); }
});

// GET /api/users/:id/errors — ejercicios fallados con frecuencia
router.get('/:id/errors', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const attempts = await prisma.attempt.findMany({
      where: { userId, isCorrect: false },
      include: { exercise: true },
      orderBy: { attemptedAt: 'desc' },
    });

    const byExercise = {};
    for (const a of attempts) {
      const id = a.exerciseId;
      if (!byExercise[id]) {
        byExercise[id] = { exercise: a.exercise, failCount: 0, lastAttempt: a.attemptedAt };
      }
      byExercise[id].failCount++;
    }

    const errors = Object.values(byExercise)
      .sort((a, b) => b.failCount - a.failCount)
      .map((e) => ({
        ...e,
        exercise: { ...e.exercise, solutionSteps: JSON.parse(e.exercise.solutionSteps) },
      }));

    res.json(errors);
  } catch (e) { next(e); }
});

// GET /api/users/:id/flashcard-stats — progreso en flashcards
router.get('/:id/flashcard-stats', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const allCards = await prisma.flashCard.findMany();
    const latestAttempts = await prisma.$queryRaw`
      SELECT fa.flashCardId, fa.confidence
      FROM FlashCardAttempt fa
      INNER JOIN (
        SELECT flashCardId, MAX(attemptedAt) as maxDate
        FROM FlashCardAttempt
        WHERE userId = ${userId}
        GROUP BY flashCardId
      ) latest ON fa.flashCardId = latest.flashCardId AND fa.attemptedAt = latest.maxDate
      WHERE fa.userId = ${userId}
    `;

    const confidenceMap = {};
    for (const a of latestAttempts) confidenceMap[a.flashCardId] = a.confidence;

    const stats = {
      total: allCards.length,
      mastered: 0,
      partial: 0,
      notKnown: 0,
      unattempted: 0,
    };
    for (const card of allCards) {
      const c = confidenceMap[card.id];
      if (!c) stats.unattempted++;
      else if (c === 'MASTERED') stats.mastered++;
      else if (c === 'PARTIAL') stats.partial++;
      else stats.notKnown++;
    }

    res.json(stats);
  } catch (e) { next(e); }
});

module.exports = router;
