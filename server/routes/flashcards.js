const router = require('express').Router();
const prisma = require('../lib/prisma');

// GET /api/flashcards — todas las flashcards
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const cards = await prisma.flashCard.findMany({ where, orderBy: { id: 'asc' } });
    res.json(cards);
  } catch (e) { next(e); }
});

// POST /api/flashcards/attempts — guardar resultado de flashcard
router.post('/attempts', async (req, res, next) => {
  try {
    const { userId, flashCardId, confidence } = req.body;

    const VALID = ['NOT_KNOWN', 'PARTIAL', 'MASTERED'];
    if (!VALID.includes(confidence)) {
      return res.status(400).json({ error: `confidence debe ser: ${VALID.join(', ')}` });
    }

    const attempt = await prisma.flashCardAttempt.create({
      data: {
        userId: parseInt(userId),
        flashCardId: parseInt(flashCardId),
        confidence,
      },
    });
    res.json(attempt);
  } catch (e) { next(e); }
});

module.exports = router;
