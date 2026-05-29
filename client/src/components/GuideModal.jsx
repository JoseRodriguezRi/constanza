import { useEffect, useState } from 'react';
import api from '../api/client';
import FormulaBlock from './FormulaBlock';

export default function GuideModal({ category, onClose }) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getGuide(category)
      .then(setGuide)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="font-title text-lavender text-lg font-semibold">
            {loading ? 'Cargando...' : guide?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-border transition-colors"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando guía...</div>
        ) : !guide ? (
          <div className="p-8 text-center text-gray-500">Guía no disponible</div>
        ) : (
          <div className="p-6 space-y-5">
            <section>
              <h3 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                Definición
              </h3>
              <p className="text-gray-300 leading-relaxed">{guide.definition}</p>
            </section>

            <section>
              <h3 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                Cuándo usarlo
              </h3>
              <p className="text-gray-300 leading-relaxed">{guide.whenToUse}</p>
            </section>

            <section className="bg-bg rounded-xl p-4 border border-border text-center">
              <h3 className="text-xs text-lavender font-semibold uppercase tracking-wider mb-3">
                Fórmula
              </h3>
              <div className="text-lg overflow-x-auto">
                <FormulaBlock formula={guide.formula} displayMode />
              </div>
            </section>

            <section className="bg-amber/10 border border-amber/30 rounded-xl p-4">
              <h3 className="text-xs text-amber font-semibold uppercase tracking-wider mb-2">
                Truco para el examen
              </h3>
              <p className="text-gray-200 text-sm leading-relaxed">{guide.examTip}</p>
            </section>

            {guide.exampleProblem && (
              <section>
                <h3 className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
                  Ejemplo resuelto
                </h3>
                <div className="bg-bg rounded-xl p-4 border border-border space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Problema:</span>
                    <p className="text-gray-300 text-sm">{guide.exampleProblem}</p>
                  </div>
                  {guide.exampleSolution && (
                    <div>
                      <span className="text-xs text-primary block mb-1">Solución:</span>
                      <p className="text-gray-200 text-sm font-mono leading-relaxed">
                        {guide.exampleSolution}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
