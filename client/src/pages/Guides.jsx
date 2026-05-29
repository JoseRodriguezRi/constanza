import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import FormulaBlock from '../components/FormulaBlock';
import GuideModal from '../components/GuideModal';

const CATEGORY_META = {
  EQUIVALENCIA: { icon: '⚖️', color: 'border-primary text-primary', bg: 'bg-primary/10' },
  FUTURE_VALUE:  { icon: '📈', color: 'border-lavender text-lavender', bg: 'bg-lavender/10' },
  PRESENT_VALUE: { icon: '💰', color: 'border-amber text-amber', bg: 'bg-amber/10' },
  PAYMENT:       { icon: '💳', color: 'border-purple-400 text-purple-400', bg: 'bg-purple-900/20' },
  PERIODS:       { icon: '⏱️', color: 'border-pink-400 text-pink-400', bg: 'bg-pink-900/20' },
};

export default function Guides() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getGuides()
      .then(setGuides)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="font-title text-lavender text-lg font-semibold ml-2">
            Guías y Teoría
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500 text-sm mb-6">
          Haz click en cualquier guía para ver la definición completa, fórmula con notación matemática, truco de examen y ejemplo resuelto.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {guides.map((guide) => {
              const meta = CATEGORY_META[guide.category] || { icon: '📚', color: 'border-gray-500 text-gray-400', bg: 'bg-gray-900/20' };
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelected(guide.category)}
                  className={`card text-left hover:bg-card-hover transition-all duration-150 active:scale-[0.98] border-l-4 ${meta.color} group`}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${meta.bg} mb-3 text-xl`}>
                    {meta.icon}
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-primary transition-colors leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3">
                    {guide.definition}
                  </p>
                  <div className="bg-bg rounded-lg p-2 border border-border overflow-hidden text-xs text-center opacity-70 group-hover:opacity-100 transition-opacity">
                    <FormulaBlock formula={guide.formula} />
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-lavender mt-2 block transition-colors">
                    Ver guía completa →
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {selected && (
        <GuideModal
          category={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
