import katex from 'katex';

export default function FormulaBlock({ formula, displayMode = false, className = '' }) {
  if (!formula) return null;

  try {
    const html = katex.renderToString(formula, {
      throwOnError: false,
      displayMode,
      strict: false,
    });
    return (
      <span
        className={`katex-wrapper ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return (
      <span className={`font-mono text-primary text-sm ${className}`}>
        {formula}
      </span>
    );
  }
}
