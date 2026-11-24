import React from 'react';
import { useNavigate } from 'react-router';
import { Search, Store, Star, ArrowRight } from 'lucide-react';

// Sin testimonios inventados: la reputación real se construye con
// prestadores y conductores reales. Esta sección explica el valor
// para cada lado del marketplace.
const CARDS = [
  {
    icon: Search,
    title: 'Conductores',
    text: 'Busca por comuna y categoría, compara vitrinas con servicios y reputación, y contacta directo por WhatsApp. Gratis y sin cuenta.',
    cta: 'Buscar en mi comuna',
    to: '/search',
  },
  {
    icon: Store,
    title: 'Prestadores',
    text: 'Publica tu vitrina en 2 minutos con tus servicios, cobertura y contacto. Apareces cuando tus vecinos busquen tu categoría.',
    cta: 'Publicar mi negocio',
    to: '/unete',
  },
  {
    icon: Star,
    title: 'Reputación real',
    text: 'Sin reseñas inventadas: la calificación de cada vitrina se construye solo con servicios completados y verificados en la plataforma.',
    cta: 'Cómo funciona',
    to: '/how-it-works',
  },
];

const STATS = [
  { value: 'Gratis', label: 'buscar y contactar' },
  { value: '2 min', label: 'publicar tu vitrina' },
  { value: 'Directo', label: 'WhatsApp sin intermediarios' },
];

const Testimonials: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 sm:py-12" aria-labelledby="audience-title">
      <div className="max-w-6xl mx-auto px-4">
        <div className="section-head text-center max-w-2xl mx-auto">
          <p className="badge-free mx-auto mb-3">Marketplace en marcha</p>
          <h2 id="audience-title">Conductores buscan gratis, prestadores se promocionan</h2>
          <p className="section-sub !text-base mt-2">Un directorio por comuna, con contacto directo y reputación verificada.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {CARDS.map(({ icon: Icon, title, text, cta, to }) => (
            <div key={title} className="card-market p-6 flex flex-col">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-control bg-blue-50 text-primary mb-4" aria-hidden="true">
                <Icon className="w-6 h-6" />
              </span>
              <h3 className="text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">{text}</p>
              <button
                onClick={() => navigate(to)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-blue-800 min-h-[44px]"
              >
                {cta}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 bg-slate-900 rounded-card px-6 py-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
          <dl className="flex items-center gap-6 sm:gap-10 text-white">
            {STATS.map((s, i) => (
              <React.Fragment key={s.value}>
                {i > 0 && <div className="h-10 w-px bg-white/15" aria-hidden="true" />}
                <div>
                  <dt className="font-heading text-xl sm:text-2xl font-extrabold text-amber-300">{s.value}</dt>
                  <dd className="text-xs sm:text-sm text-slate-300">{s.label}</dd>
                </div>
              </React.Fragment>
            ))}
          </dl>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button onClick={() => navigate('/search')} className="btn-cta w-full sm:w-auto">
              <Search className="w-4 h-4" aria-hidden="true" />
              Buscar en mi comuna
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
