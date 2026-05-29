import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import ExerciseCard from '../components/ExerciseCard';

const CATEGORY_LABELS = {
  EQUIVALENCIA: 'Equivalencia',
  FUTURE_VALUE: 'Valor Futuro',
  PRESENT_VALUE: 'Valor Presente',
  PAYMENT: 'Cuota R',
  PERIODS: 'Periodos n',
};

export default function Errors() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getErrors(userId)
      .then(setErrors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  // Group by category
  const byCategory = errors.reduce((acc, item) => {
    const cat = item.exercise.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="font-title text-red-400 text-lg font-semibold ml-2">
            Mis Errores
          </h1>
          {!loading && errors.length > 0 && (
            <span className="ml-auto badge bg-red-900/40 text-red-400">
              {errors.length} {errors.length === 1 ? 'ejercicio' : 'ejercicios'}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-32 animate-pulse" />
            ))}
          </div>
        ) : errors.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-title text-2xl font-bold text-white mb-2">
              ¡Sin errores registrados!
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Aún no tienes intentos fallidos, o todos tus intentos fueron correctos.
            </p>
            <button onClick={() => navigate('/practice')} className="btn-primary">
              Practicar ahora →
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <p className="text-gray-500 text-sm">
              Estos son los ejercicios donde más has fallado. Estudia sus guías y vuelve a intentarlos.
            </p>

            {Object.entries(byCategory).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                  {CATEGORY_LABELS[category] || category}
                  <span className="badge bg-red-900/30 text-red-500">
                    {items.length} {items.length === 1 ? 'ejercicio' : 'ejercicios'}
                  </span>
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <ExerciseCard
                      key={item.exercise.id}
                      exercise={item.exercise}
                      failCount={item.failCount}
                      lastAttempt={item.lastAttempt}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
