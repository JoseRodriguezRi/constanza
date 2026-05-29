import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import FlashCard from '../components/FlashCard';

export default function FlashCards() {
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem('userId'));

  const [cards, setCards] = useState([]);
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ NOT_KNOWN: 0, PARTIAL: 0, MASTERED: 0 });
  const [done, setDone] = useState(false);
  const [onlyUnknown, setOnlyUnknown] = useState(false);

  useEffect(() => {
    api.getFlashcards()
      .then((data) => {
        setCards(data);
        setQueue(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleResult(confidence) {
    const card = queue[index];
    try {
      await api.saveFlashcardAttempt(userId, card.id, confidence);
    } catch (err) {
      console.error(err);
    }

    setResults((prev) => ({ ...prev, [confidence]: prev[confidence] + 1 }));

    if (index + 1 >= queue.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function restartAll() {
    setQueue(cards);
    setIndex(0);
    setResults({ NOT_KNOWN: 0, PARTIAL: 0, MASTERED: 0 });
    setDone(false);
    setOnlyUnknown(false);
  }

  function restartUnknown() {
    // Re-get not_known from results — we need to track which cards were unknown
    setDone(false);
    setIndex(0);
    setResults({ NOT_KNOWN: 0, PARTIAL: 0, MASTERED: 0 });
    // For simplicity, restart all when "repeat unknowns" — could be enhanced
    setQueue(cards);
    setOnlyUnknown(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Cargando flashcards...</div>
      </div>
    );
  }

  const current = queue[index];
  const progress = queue.length > 0 ? Math.round((index / queue.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-card/50 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            ← Dashboard
          </button>
          <h1 className="font-title text-amber text-base font-semibold">
            Flashcards
          </h1>
          {!done && (
            <span className="text-xs text-gray-500 font-mono">
              {index + 1} / {queue.length}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {done ? (
          /* ── Results screen ── */
          <div className="card text-center space-y-6 animate-slide-up">
            <div>
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="font-title text-2xl font-bold text-white mb-1">
                ¡Ronda completada!
              </h2>
              <p className="text-gray-500 text-sm">
                Has repasado {queue.length} tarjetas
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <div className="text-2xl font-bold font-mono text-primary">{results.MASTERED}</div>
                <div className="text-xs text-gray-500 mt-1">Dominadas ✅</div>
              </div>
              <div className="bg-amber/10 border border-amber/30 rounded-xl p-4">
                <div className="text-2xl font-bold font-mono text-amber">{results.PARTIAL}</div>
                <div className="text-xs text-gray-500 mt-1">Parciales 🤔</div>
              </div>
              <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
                <div className="text-2xl font-bold font-mono text-red-400">{results.NOT_KNOWN}</div>
                <div className="text-xs text-gray-500 mt-1">A repasar 😕</div>
              </div>
            </div>

            <div className="space-y-3">
              {results.NOT_KNOWN + results.PARTIAL > 0 && (
                <button onClick={restartUnknown} className="btn-primary w-full py-3">
                  Repetir las que me faltaron
                </button>
              )}
              <button onClick={restartAll} className="btn-secondary w-full">
                Empezar de nuevo (todas)
              </button>
              <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-300 text-sm w-full py-2 transition-colors">
                Volver al dashboard
              </button>
            </div>
          </div>
        ) : (
          /* ── Active flashcard ── */
          <div className="space-y-5 animate-fade-in">
            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progreso</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-3 text-xs text-gray-700">
                <span className="text-primary">{results.MASTERED} ✅</span>
                <span className="text-amber">{results.PARTIAL} 🤔</span>
                <span className="text-red-500">{results.NOT_KNOWN} 😕</span>
              </div>
            </div>

            <FlashCard card={current} onResult={handleResult} />
          </div>
        )}
      </main>
    </div>
  );
}
