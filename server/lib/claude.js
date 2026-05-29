const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5';

const FEEDBACK_SYSTEM = `Eres un tutor experto en matemática financiera universitaria.
Un estudiante resolvió un ejercicio y necesitas evaluar su trabajo.
Responde SIEMPRE en español. Sé preciso, claro y motivador.
Responde SOLO en JSON con este formato exacto (sin markdown, sin texto extra):
{
  "isCorrect": boolean,
  "errorStep": "descripción del paso donde se equivocó, o null si es correcto",
  "correctApproach": "explicación breve del procedimiento correcto",
  "encouragement": "mensaje corto motivador (máx 1 oración)",
  "formulaReminder": "fórmula clave que debía usar"
}`;

const GENERATE_SYSTEM = `Eres un profesor experto en matemática financiera universitaria.
Genera ejercicios originales, bien planteados, con situaciones del mundo real.
Responde SOLO en JSON con este formato exacto (sin markdown, sin texto extra):
{
  "statement": "enunciado completo del ejercicio",
  "correctAnswer": número,
  "tolerance": 0.5,
  "solutionSteps": ["paso 1", "paso 2", "paso 3", "paso 4"],
  "formulaUsed": "fórmula principal usada",
  "category": "categoría",
  "difficulty": "dificultad"
}`;

async function generateFeedback(exercise, userAnswer, userProcedure) {
  const userPrompt = `Ejercicio: ${exercise.statement}

Respuesta correcta: ${exercise.correctAnswer}
Tolerancia: ${exercise.tolerance}%
Solución paso a paso correcta: ${JSON.parse(exercise.solutionSteps).join(' → ')}

Respuesta del estudiante: ${userAnswer}
Procedimiento del estudiante: ${userProcedure || '(sin procedimiento)'}

Evalúa si la respuesta numérica está dentro de la tolerancia aceptable y si el procedimiento es correcto.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: [{ type: 'text', text: FEEDBACK_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
}

async function generateExercise(category, difficulty, existingStatements) {
  const userPrompt = `Genera UN ejercicio nuevo del tema: ${category}
Dificultad: ${difficulty}
Contexto: usa situaciones reales (empresa, persona, inversión, préstamo, universidad, fondo de retiro)
Los valores numéricos y el contexto deben ser DIFERENTES a estos ejercicios existentes:
${existingStatements.slice(0, 5).join('\n')}

Asegúrate de que la respuesta correcta sea calculable y verificable.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: [{ type: 'text', text: GENERATE_SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
}

module.exports = { generateFeedback, generateExercise };
