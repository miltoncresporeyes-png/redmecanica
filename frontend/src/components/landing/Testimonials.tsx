import React from 'react';
import { useNavigate } from 'react-router';
import Card from '../common/Card';

// Sin testimonios inventados: la reputación real se construye con
// prestadores y conductores reales. Esta sección explica el valor
// para cada lado del marketplace.
const Testimonials: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: '🔍',
      title: 'Conductores',
      text: 'Busca por comuna y categoría, compara vitrinas con servicios y reputación, y contacta directo por WhatsApp. Gratis y sin cuenta.',
      cta: 'Buscar en mi comuna',
      to: '/search',
    },
    {
      icon: '🏭',
      title: 'Prestadores',
      text: 'Publica tu vitrina en 2 minutos con tus servicios, cobertura y contacto. Apareces cuando tus vecinos busquen tu categoría.',
      cta: 'Publicar mi negocio',
      to: '/unete',
    },
    {
      icon: '⭐',
      title: 'Reputación real',
      text: 'Sin reseñas inventadas: la calificación de cada vitrina se construye solo con servicios completados y verificados en la plataforma.',
      cta: 'Cómo funciona',
      to: '/how-it-works',
    },
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-1 sm:px-0">
        <div className="section-head text-center max-w-2xl mx-auto">
          <p className="badge-free mx-auto mb-2"> marketplace en marcha </p>
          <h2 className="section-title">Conductores buscan gratis · prestadores se promocionan</h2>
          <p className="section-sub">Un directorio por comuna, con contacto directo y reputación verificada</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((c) => (
            <Card key={c.title} className="card-market p-5 sm:p-6 flex flex-col">
              <div className="text-3xl mb-3" aria-hidden>{c.icon}</div>
              <h3 className="font-bold text-gray-800 text-base mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">{c.text}</p>
              <button
                onClick={() => navigate(c.to)}
                className="mt-4 text-sm font-extrabold text-blue-700 hover:text-blue-900 text-left min-h-[44px]"
              >
                {c.cta} →
              </button>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 bg-slate-900 rounded-2xl px-5 py-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-6 sm:gap-8 text-white">
            <div>
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-yellow-300">Gratis</p>
              <p className="text-[11px] sm:text-xs text-slate-300">buscar y contactar</p>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <div>
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-yellow-300">2 min</p>
              <p className="text-[11px] sm:text-xs text-slate-300">publicar tu vitrina</p>
            </div>
            <div className="h-10 w-px bg-white/15" />
            <div>
              <p className="font-heading text-xl sm:text-2xl font-extrabold text-yellow-300">Directo</p>
              <p className="text-[11px] sm:text-xs text-slate-300">WhatsApp sin intermediarios</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button onClick={() => navigate('/search')} className="btn-accent w-full sm:w-auto">
              🔍 Buscar en mi comuna
            </button>
            <button onClick={() => navigate('/unete')} className="btn-ghost-light w-full sm:w-auto">
              Publicar mi negocio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
