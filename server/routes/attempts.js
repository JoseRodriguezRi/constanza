const router = require('express').Router();
const prisma = require('../lib/prisma');
const { generateFeedback } = require('../lib/claude');

// POST /api/attempts — guardar intento + obtener feedback de Claude
router.post('/', async (req, res, next) => {
  try {
    const { userId, exerciseId, userAnswer, userProcedure } = req.body;

    if (!userId || !exerciseId || userAnswer === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos: userId, exerciseId, userAnswer' });
    }

    const exercise = await prisma.exercise.findUnique({ where: { id: parseInt(exerciseId) } });
    if (!exercise) return res.status(404).json({ error: 'Ejercicio no encontrado' });

    // Verificación numérica rápida como respaldo
    const answerNum = parseFloat(userAnswer);
    const correct = exercise.correctAnswer;
    const tol = exercise.tolerance / 100;
    const quickCheck = Math.abs(answerNum - correct) / Math.abs(correct) <= tol;

    let feedback;
    let isCorrect = quickCheck;
    let aiFeedback = null;

    try {
      feedback = await generateFeedback(exercise, answerNum, userProcedure);
      isCorrect = feedback.isCorrect;
      aiFeedback = JSON.stringify(feedback);
    } catch (claudeErr) {
      console.error('Claude API error:', claudeErr.message);
      feedback = {
        isCorrect: quickCheck,
        errorStep: quickCheck ? null : 'No se pudo analizar el procedimiento en detalle.',
        correctApproach: `La respuesta correcta es ${correct}. Revisa los pasos de la solución.`,
        encouragement: quickCheck ? '¡Buen trabajo!' : '¡Sigue intentando!',
        formulaReminder: exercise.formulaUsed,
      };
      aiFeedback = JSON.stringify(feedback);
    }

    const attempt = await prisma.attempt.create({
      data: {
        userId: parseInt(userId),
        exerciseId: parseInt(exerciseId),
        userAnswer: answerNum,
        userProcedure: userProcedure || '',
        isCorrect,
        aiFeedback,
      },
    });

    res.json({
      attempt: { ...attempt, aiFeedback: feedback },
      feedback,
      exercise: { ...exercise, solutionSteps: JSON.parse(exercise.solutionSteps) },
    });
  } catch (e) { next(e); }
});

module.exports = router;
