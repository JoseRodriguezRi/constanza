import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/client';
import FeedbackBanner from '../components/FeedbackBanner';
import GuideModal from '../components/GuideModal';

const CATEGORY_LABELS = {
  EQUIVALENCIA: 'Equivalencia',
  FUTURE_VALUE: 'Valor Futuro',
  PRESENT_VALUE: 'Valor Presente',
  PAYMENT: 'Cuota R',
  PERIODS: 'Periodos n',
};

const DIFFICULTY_STYLES = {
  BASIC: 'bg-primary/20 text-primary',
  INTERMEDIATE: 'bg-amber/20 text-amber',
  ADVANCED: 'bg-red-900/40 text-red-400',
};

export default function Practice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = localStorage.getItem('userId');

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [procedure, setProcedure] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [feedbackCollapsed, setFeedbackCollapsed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [seenIds, setSeenIds] = useState([]);

  const loadExercise = useCallback(async (id) => {
    setLoading(true);
    setResult(null);
    setProcedure('');
    setAnswer('');
    setFeedbackCollapsed(false);
    try {
      const ex = id
        ? await api.getExercise(id)
        : await api.getRandomExercise({ avoidIds: seenIds.join(',') });
      setExercise(ex);
      setSeenIds((prev) => [...new Set([...prev, ex.id])]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [seenIds]);

  useEffect(() => {
    const id = searchParams.get('id');
    loadExercise(id || null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e) {
    e.preventDefault();
    if (!answer || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitAttempt({
        userId: parseInt(userId),
        exerciseId: exercise.id,
        userAnswer: parseFloat(answer),
        userProcedure: procedure,
      });
      setResult(res);
      setFeedbackCollapsed(false);
    } catch (err) {
      console.error(err);
      alert('Error al enviar la respuesta: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGenerate() {
    if (!exercise || generating) return;
    setGenerating(true);
    try {
      const generated = await api.generateExercise(exercise.category, exercise.difficulty);
      const saved = await api.saveGeneratedExercise(generated);
      navigate(`/practice?id=${saved.id}`);
      loadExercise(saved.id);
    } catch (err) {
      alert('Error al generar ejercicio: ' + err.message);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Cargando ejercicio...</div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No se pudo cargar el ejercicio</p>
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            ← Dashboard
          </button>
          <span className="text-xs text-gray-600 font-mono">ID #{exercise.id}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        {/* Exercise card */}
        <section className="card space-y-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge bg-lavender/20 text-lavender">
              {CATEGORY_LABELS[exercise.category] || exercise.category}
            </span>
            <span className={`badge ${DIFFICULTY_STYLES[exercise.difficulty] || 'bg-gray-700 text-gray-300'}`}>
              {exercise.difficulty === 'BASIC' ? 'Básico' : exercise.difficulty === 'INTERMEDIATE' ? 'Intermedio' : 'Avanzado'}
            </span>
            <button
              onClick={() => setShowGuide(true)}
              className="ml-auto text-xs text-lavender hover:text-white transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-lavender/10"
            >
              📖 Ver guía de este tema
            </button>
          </div>

          {/* Statement */}
          <p className="text-gray-100 text-lg leading-relaxed font-body">
            {exercise.statement}
          </p>

          {/* Formula hint */}
          <div className="bg-bg rounded-lg px-3 py-2 border border-border inline-block">
            <span className="text-xs text-gray-600">Fórmula: </span>
            <span className="font-mono text-xs text-gray-400">{exercise.formulaUsed}</span>
          </div>
        </section>

        {/* Answer form */}
        {!result && (
          <form onSubmit={handleSubmit} className="card space-y-4 animate-slide-up">
            <h3 className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
              Tu resolución
            </h3>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Procedimiento paso a paso (opcional pero recomendado)
              </label>
              <textarea
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                rows={5}
                placeholder="Ej: i_mensual = 8%/12 = 0.6667% → n = 60 → R = 850000 × 0.006667 / [(1.006667)^60 - 1]..."
                className="input-field font-mono text-sm resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1.5">
                Tu respuesta final <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                step="0.01"
                placeholder="Ingresa solo el número (ej: 11492.02)"
                className="input-field font-mono text-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!answer || submitting}
              className="btn-primary w-full py-3 text-base"
            >
              {submitting ? '⏳ Analizando con IA...' : '✓ Verificar respuesta'}
            </button>
          </form>
        )}

        {/* Feedback */}
        {result && (
          <div className="space-y-4 animate-slide-up">
            <FeedbackBanner
              isCorrect={result.feedback.isCorrect}
              feedback={result.feedback}
              exercise={result.exercise}
              collapsed={feedbackCollapsed}
              onToggle={() => setFeedbackCollapsed((c) => !c)}
            />

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => loadExercise(null)}
                className="btn-primary flex-1"
              >
                → Siguiente ejercicio
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-secondary flex-1"
              >
                {generating ? '⏳ Generando...' : '⚡ Ejercicio similar con IA'}
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                ← Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {showGuide && (
        <GuideModal
          category={exercise.category}
          onClose={() => setShowGuide(false)}
        />
      )}
    </div>
  );
}
