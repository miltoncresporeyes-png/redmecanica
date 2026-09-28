import React from 'react';
import { useNavigate } from 'react-router';

interface SuccessStoriesProps {
  onClose: () => void;
  onNavigateToOnboarding?: () => void;
}

// Página honesta: las historias de éxito reales se publicarán cuando
// prestadores reales completen sus primeros servicios. Nada inventado.
const SuccessStories: React.FC<SuccessStoriesProps> = ({ onClose, onNavigateToOnboarding }) => {
  const navigate = useNavigate();

  const goOnboarding = () => {
    if (onNavigateToOnboarding) onNavigateToOnboarding();
    else navigate('/onboarding');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Historias de prestadores</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold min-h-[44px] min-w-[44px]"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-8 mb-8 text-center">
        <p className="inline-block bg-white/10 border border-white/15 text-xs font-bold px-3 py-1 rounded-full mb-3">
          DIRECTORIO EN CRECIMIENTO
        </p>
        <h2 className="text-2xl sm:text-3xl font-black mb-3">Las primeras historias se están escribiendo ahora</h2>
        <p className="opacity-90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
          Aquí publicaremos casos reales de prestadores verificados —con su comuna, sus servicios
          y sus resultados— a medida que completen trabajos en la plataforma. Sin cifras inventadas.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-xl mx-auto">
          <button
            onClick={goOnboarding}
            className="btn-accent w-full sm:w-auto"
          >
            Quiero ser la primera historia
          </button>
          <button
            onClick={() => navigate('/search')}
            className="btn-ghost-light w-full sm:w-auto"
          >
            Ver el directorio
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {[
          { icon: '📍', title: 'Cómo aparecerás aquí', desc: 'Publica tu vitrina, verifica tu identidad y completa servicios. Tu comuna y tu calificación quedarán registradas.' },
          { icon: '⭐', title: 'Qué mediremos', desc: 'Servicios completados, calificación promedio y comunas donde atiendes. Solo datos reales de la plataforma.' },
          { icon: '💬', title: 'Qué publicaremos', desc: 'Tu historia con tu autorización: negocio, comuna, crecimiento y una cita textual tuya.' },
        ].map((c) => (
          <div key={c.title} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="text-4xl mb-3" aria-hidden>{c.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
