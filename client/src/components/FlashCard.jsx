import { useState } from 'react';

export default function FlashCard({ card, onResult }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-6">
      {/* Card */}
      <div
        className={`flip-card ${flipped ? 'flipped' : ''}`}
        style={{ height: '280px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="flip-card-inner">
          {/* Front */}
          <div className="flip-card-front bg-card border border-border text-center">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-lavender/20 text-lavender text-xs rounded-full font-medium">
                Pregunta — haz click para responder
              </span>
              <p className="text-gray-100 text-lg font-medium leading-relaxed">
                {card.question}
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-card border border-primary/30 text-center">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                Respuesta
              </span>
              <p className="text-gray-200 text-base leading-relaxed">
                {card.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence buttons — only show when flipped */}
      {flipped && (
        <div className="flex gap-3 animate-fade-in">
          <button
            onClick={() => { setFlipped(false); onResult('NOT_KNOWN'); }}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border border-red-700/50 bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-all active:scale-95"
          >
            <span className="text-xl">😕</span>
            <span className="text-xs font-medium">No lo sé</span>
          </button>
          <button
            onClick={() => { setFlipped(false); onResult('PARTIAL'); }}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border border-amber/50 bg-amber/10 hover:bg-amber/20 text-amber transition-all active:scale-95"
          >
            <span className="text-xl">🤔</span>
            <span className="text-xs font-medium">Más o menos</span>
          </button>
          <button
            onClick={() => { setFlipped(false); onResult('MASTERED'); }}
            className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary transition-all active:scale-95"
          >
            <span className="text-xl">✅</span>
            <span className="text-xs font-medium">¡Lo domino!</span>
          </button>
        </div>
      )}

      {!flipped && (
        <p className="text-center text-gray-600 text-sm animate-fade-in">
          Haz click en la tarjeta para ver la respuesta
        </p>
      )}
    </div>
  );
}
