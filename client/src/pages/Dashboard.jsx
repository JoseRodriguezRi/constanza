import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import StatsChart from '../components/StatsChart';

const CATEGORY_LABELS = {
  EQUIVALENCIA: 'Equivalencia',
  FUTURE_VALUE: 'Valor Futuro',
  PRESENT_VALUE: 'Valor Presente',
  PAYMENT: 'Cuota R',
  PERIODS: 'Periodos n',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats(userId)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/');
  }

  const StatCard = ({ icon, value, label, color = 'text-white' }) => (
    <div className="card flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </div>
  );

  const ActionButton = ({ emoji, title, sub, color, onClick }) => (
    <button
      onClick={onClick}
      className={`card hover:bg-card-hover transition-all duration-150 active:scale-[0.98] text-left group border-l-4 ${color}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{emoji}</span>
        <div>
          <div className="font-semibold text-white group-hover:text-primary transition-colors">
            {title}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
        </div>
        <span className="ml-auto text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">📐</span>
            <div>
              <div className="font-title font-bold text-white text-base leading-tight">MathFinance</div>
              <div className="text-xs text-gray-500">Hola, {userName}</div>
            </div>
          </div>
          <button onClick={logout} className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-border">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Stats */}
        <section>
          <h2 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">
            Tu progreso
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-20 animate-pulse bg-card" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard
                icon="📊"
                value={stats?.totalAttempts ?? 0}
                label="Total intentos"
              />
              <StatCard
                icon="✅"
                value={`${stats?.globalAccuracy ?? 0}%`}
                label="Aciertos global"
                color={
                  (stats?.globalAccuracy ?? 0) >= 70
                    ? 'text-primary'
                    : (stats?.globalAccuracy ?? 0) >= 40
                    ? 'text-amber'
                    : 'text-red-400'
                }
              />
              <StatCard
                icon="🏆"
                value={CATEGORY_LABELS[stats?.bestCategory] ?? '—'}
                label="Tema dominado"
                color="text-primary"
              />
              <StatCard
                icon="🎯"
                value={CATEGORY_LABELS[stats?.worstCategory] ?? '—'}
                label="Tema a mejorar"
                color="text-amber"
              />
            </div>
          )}
        </section>

        {/* Chart */}
        {stats?.categoryStats?.length > 0 && (
          <section className="card">
            <h2 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">
              Aciertos por tema
            </h2>
            <StatsChart data={stats.categoryStats} />
          </section>
        )}

        {/* Actions */}
        <section>
          <h2 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-4">
            ¿Qué quieres hacer?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionButton
              emoji="🎯"
              title="Practicar ahora"
              sub="Ejercicio aleatorio con feedback de IA"
              color="border-primary"
              onClick={() => navigate('/practice')}
            />
            <ActionButton
              emoji="🔴"
              title="Estudiar mis errores"
              sub="Ejercicios donde más fallas"
              color="border-red-600"
              onClick={() => navigate('/errors')}
            />
            <ActionButton
              emoji="📖"
              title="Ver guías y teoría"
              sub="Fórmulas, ejemplos y trucos de examen"
              color="border-lavender"
              onClick={() => navigate('/guides')}
            />
            <ActionButton
              emoji="🃏"
              title="Flashcards del examen"
              sub="14 tarjetas de conceptos clave"
              color="border-amber"
              onClick={() => navigate('/flashcards')}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
