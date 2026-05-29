const router = require('express').Router();
const prisma = require('../lib/prisma');

// GET /api/guides — todas las guías
router.get('/', async (_req, res, next) => {
  try {
    const guides = await prisma.guide.findMany({ orderBy: { id: 'asc' } });
    res.json(guides);
  } catch (e) { next(e); }
});

// GET /api/guides/:category — guía de categoría específica
router.get('/:category', async (req, res, next) => {
  try {
    const guide = await prisma.guide.findUnique({
      where: { category: req.params.category.toUpperCase() },
    });
    if (!guide) return res.status(404).json({ error: 'Guía no encontrada' });
    res.json(guide);
  } catch (e) { next(e); }
});

module.exports = router;
