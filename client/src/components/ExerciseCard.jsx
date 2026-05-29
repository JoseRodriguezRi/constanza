import { useNavigate } from 'react-router-dom';

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

const DIFFICULTY_LABELS = {
  BASIC: 'Básico',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
};

export default function ExerciseCard({ exercise, failCount, lastAttempt }) {
  const navigate = useNavigate();

  return (
    <div className="card hover:bg-card-hover transition-colors duration-150 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className="badge bg-lavender/20 text-lavender">
            {CATEGORY_LABELS[exercise.category] || exercise.category}
          </span>
          <span className={`badge ${DIFFICULTY_STYLES[exercise.difficulty]}`}>
            {DIFFICULTY_LABELS[exercise.difficulty] || exercise.difficulty}
          </span>
        </div>
        {failCount !== undefined && (
          <span className="badge bg-red-900/50 text-red-400 ml-auto flex-shrink-0">
            ❌ {failCount} {failCount === 1 ? 'fallo' : 'fallos'}
          </span>
        )}
      </div>

      <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
        {exercise.statement}
      </p>

      <div className="flex items-center justify-between">
        {lastAttempt && (
          <span className="text-xs text-gray-600">
            Último: {new Date(lastAttempt).toLocaleDateString('es-MX')}
          </span>
        )}
        <button
          onClick={() => navigate(`/practice?id=${exercise.id}`)}
          className="ml-auto btn-primary text-sm py-1.5 px-4"
        >
          Reintentar →
        </button>
      </div>
    </div>
  );
}
