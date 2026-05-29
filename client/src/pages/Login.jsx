import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const user = await api.loginOrCreate(name.trim());
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-5">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="font-title text-4xl font-bold text-white mb-2">
            MathFinance
          </h1>
          <p className="text-gray-400 text-base">
            Domina la matemática financiera con ejercicios adaptativos e IA
          </p>
        </div>

        <div className="card shadow-2xl">
          <h2 className="text-gray-300 font-semibold text-lg mb-6">
            ¿Cómo te llamas?
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre o apodo"
                className="input-field text-base"
                autoFocus
                maxLength={50}
              />
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? 'Entrando...' : 'Comenzar a estudiar →'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border grid grid-cols-3 gap-3 text-center">
            {[
              { icon: '🎯', label: '7 ejercicios', sub: 'resueltos con IA' },
              { icon: '📖', label: '5 guías', sub: 'de teoría' },
              { icon: '🃏', label: '14 flashcards', sub: 'de conceptos' },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="text-xs font-semibold text-gray-300">{item.label}</div>
                <div className="text-xs text-gray-600">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-4">
          Temas: Equivalencia · Valor Futuro · Valor Presente · Cuota R · Periodos n
        </p>
      </div>
    </div>
  );
}
