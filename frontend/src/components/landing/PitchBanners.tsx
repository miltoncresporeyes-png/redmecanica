import React from 'react';
import { useNavigate } from 'react-router';
import { Search, GitCompareArrows, MessageCircle, Truck, CircleDot, BatteryCharging, ArrowRight, BadgeCheck, FileCheck2 } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: '1. Busca',
    text: 'Elige el servicio y tu comuna. Sin crear cuenta y sin costo.',
  },
  {
    icon: GitCompareArrows,
    title: '2. Compara',
    text: 'Revisa vitrinas con servicios, ubicación, calificación e insignia de verificación.',
  },
  {
    icon: MessageCircle,
    title: '3. Contacta',
    text: 'Escríbele directo por WhatsApp al prestador que elijas, sin intermediarios.',
  },
];

const EMERGENCY = [
  { icon: Truck, label: 'Grúa y remolque', to: '/search?category=grua' },
  { icon: CircleDot, label: 'Vulcanización y pinchazos', to: '/search?category=vulcanizacion' },
  { icon: BatteryCharging, label: 'Batería y electricidad', to: '/search?category=electrico' },
];

const PitchBanners: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto px-4 space-y-8 sm:space-y-10" aria-labelledby="how-title">
      <div className="text-center max-w-2xl mx-auto">
        <p className="badge-free mx-auto mb-3">Cómo funciona</p>
        <h2 id="how-title">
          Busca gratis por comuna y <span className="text-primary">contacta directo</span>
        </h2>
        <p className="section-sub !text-base mt-2">
          Un directorio automotriz simple: encuentras, comparas y hablas con el prestador.
        </p>
      </div>

      {/* Pasos */}
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <li key={title} className="card-market p-6 flex flex-col items-start">
            <span className="inline-flex w-12 h-12 items-center justify-center rounded-control bg-blue-50 text-primary mb-4" aria-hidden="true">
              <Icon className="w-6 h-6" />
            </span>
            <h3 className="text-slate-900 mb-1.5">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
          </li>
        ))}
      </ol>

      {/* Auxilio + Verificación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-card bg-slate-900 text-white p-6 sm:p-8 flex flex-col">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">Auxilio por comuna</p>
          <h3 className="text-xl sm:text-2xl text-white mb-2">Grúas y auxilio cerca de ti</h3>
          <p className="text-sm text-slate-300 mb-5">
            Busca prestadores publicados en tu comuna y llámalos directo. En una emergencia real, llama primero al número de la vitrina.
          </p>
          <div className="space-y-2.5 flex-1">
            {EMERGENCY.map(({ icon: Icon, label, to }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 bg-slate-800 hover:bg-slate-700 p-3.5 rounded-control border border-slate-700 transition-colors text-left min-h-[48px]"
              >
                <Icon className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-100">{label}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-slate-400" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="card-market p-6 sm:p-8 flex flex-col">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Insignia Verificado</p>
          <h3 className="text-xl sm:text-2xl text-slate-900 mb-2">Prestadores con documentos revisados</h3>
          <p className="text-sm text-slate-600 mb-5">
            Los prestadores pueden subir su cédula de identidad y su certificado de antecedentes. Nuestro equipo los revisa antes de entregar la insignia.
          </p>
          <ul className="space-y-3 flex-1">
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              Documentos subidos por el prestador y revisados por RedMecánica.
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-700">
              <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              La insignia aparece en su vitrina y en los resultados de búsqueda.
            </li>
          </ul>
          <button type="button" onClick={() => navigate('/unete')} className="btn-ghost mt-6 self-start">
            Publicar mi negocio
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PitchBanners;
