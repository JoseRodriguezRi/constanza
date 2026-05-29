export default function FeedbackBanner({ isCorrect, feedback, exercise, collapsed, onToggle }) {
  if (!feedback) return null;

  return (
    <div className={`rounded-xl border animate-slide-up overflow-hidden ${
      isCorrect
        ? 'border-primary/40 bg-primary/5'
        : 'border-red-500/40 bg-red-900/10'
    }`}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 ${
        isCorrect ? 'bg-primary/10' : 'bg-red-900/20'
      }`}>
        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
        <div className="flex-1">
          <p className={`font-semibold text-base ${isCorrect ? 'text-primary' : 'text-red-400'}`}>
            {isCorrect ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
          </p>
          <p className="text-gray-300 text-sm mt-0.5 italic">
            {feedback.encouragement}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-200 text-sm underline"
        >
          {collapsed ? 'Ver detalle' : 'Ocultar'}
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-5 py-4 space-y-4">
          {!isCorrect && feedback.errorStep && (
            <div className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
              <p className="text-xs text-red-400 font-semibold uppercase tracking-wide mb-1">
                Dónde te equivocaste
              </p>
              <p className="text-gray-300 text-sm">{feedback.errorStep}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
              Procedimiento correcto
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{feedback.correctApproach}</p>
          </div>

          <div className="bg-lavender/10 rounded-lg p-3 border border-lavender/20">
            <p className="text-xs text-lavender font-semibold uppercase tracking-wide mb-1">
              Fórmula clave
            </p>
            <p className="font-mono text-gray-200 text-sm">{feedback.formulaReminder}</p>
          </div>

          {exercise?.solutionSteps?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
                Solución paso a paso
              </p>
              <ol className="space-y-2">
                {exercise.solutionSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lavender/20 text-lavender text-xs flex items-center justify-center font-mono">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
