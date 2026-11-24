import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Wrench, MapPin, Zap, ArrowRight } from 'lucide-react';
import SEO from './SEO';
import { localBusinessSchema, webSiteSchema } from '../data/seoSchemas';
import { MARKETPLACE_CATEGORIES, POPULAR_COMUNAS } from '../data/marketplace';
import { trackEvent } from '../lib/analytics';
import { COMUNAS_POR_REGION } from '../data/autocompleteData';

const ALL_COMUNAS: string[] = Array.from(
  new Set(Object.values(COMUNAS_POR_REGION).flat())
).sort((a, b) => a.localeCompare(b, 'es'));

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCommune, setSelectedCommune] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent('search_performed', { category: selectedCategory, commune: selectedCommune });
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCommune) params.set('commune', selectedCommune);
    navigate(`/search?${params.toString()}`);
  };

  const handleQuickCategory = (slug: string) => {
    navigate(`/search?category=${encodeURIComponent(slug)}${selectedCommune ? `&commune=${encodeURIComponent(selectedCommune)}` : ''}`);
  };

  return (
    <>
      <SEO
        title="RedMecánica — Encuentra mecánicos y grúas de urgencia en tu comuna"
        description="Directorio de auxilio y talleres mecánicos en Chile. Busca gratis por servicio y comuna, compara opciones y contacta directo por WhatsApp sin registros."
        keywords="mecanico de urgencia, gruas chile, taller mecanico, auxilio mecanico en mi comuna, vulcanizacion 24 horas"
        canonicalUrl="https://redmecanica.cl/"
        schema={[localBusinessSchema, webSiteSchema]}
      />

      <div className="relative">
        <div className="relative rounded-card bg-slate-900 text-white overflow-hidden shadow-2xl border border-slate-800/80">
          {/* Fondo con brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 opacity-98" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          {/* Ilustración sutil de fondo */}
          <svg className="absolute right-0 bottom-0 w-72 h-72 opacity-[0.07] pointer-events-none" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M20 120 L40 80 L80 70 L120 70 L160 80 L180 120 L180 140 L20 140 Z" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="55" cy="140" r="12" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="145" cy="140" r="12" stroke="#f59e0b" strokeWidth="2" />
            <path d="M90 85 L110 85 L115 100 L85 100 Z" stroke="#f59e0b" strokeWidth="2" />
          </svg>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16 text-center">
            {/* Badge unico: propuesta de valor */}
            <p className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 border border-amber-300/30 text-xs font-bold px-3.5 py-1.5 rounded-full mb-5">
              <Zap className="w-3.5 h-3.5 fill-amber-300" aria-hidden="true" />
              Gratis y sin registro · Contacto directo por WhatsApp
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] max-w-3xl mx-auto mb-4">
              Encuentra mecánicos y grúas de{' '}
              <span className="text-amber-400">urgencia en tu comuna</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Elige el servicio y tu comuna para contactar talleres y mecánicos disponibles ahora.
            </p>

            {/* Buscador Limpio Estilo Airbnb */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2 sm:p-2.5 rounded-card shadow-2xl border border-slate-100 max-w-3xl mx-auto text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* Select 1: Servicio */}
                <div className="sm:col-span-5 relative group px-3 py-2 bg-slate-50/80 hover:bg-blue-50/50 rounded-control border border-slate-200/80 transition-all">
                  <label htmlFor="service-select" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-0.5">
                    ¿Qué necesitas?
                  </label>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    <select
                      id="service-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                      aria-label="Seleccionar servicio automotriz"
                    >
                      <option value="">Todos los servicios automotrices</option>
                      {MARKETPLACE_CATEGORIES.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Select 2: Comuna */}
                <div className="sm:col-span-4 relative group px-3 py-2 bg-slate-50/80 hover:bg-blue-50/50 rounded-control border border-slate-200/80 transition-all">
                  <label htmlFor="commune-select" className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-0.5">
                    ¿En qué comuna?
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    <select
                      id="commune-select"
                      value={selectedCommune}
                      onChange={(e) => setSelectedCommune(e.target.value)}
                      className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                      aria-label="Seleccionar comuna"
                    >
                      <option value="">Todas las comunas (o cerca de mí)</option>
                      {ALL_COMUNAS.map((comm) => (
                        <option key={comm} value={comm}>
                          {comm}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Botón CTA Grande */}
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="btn-cta w-full h-full min-h-[48px]"
                  >
                    <Search className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                    <span>Buscar ahora</span>
                  </button>
                </div>

              </div>
            </form>

            {/* Accesos rápidos a comunas y servicios frecuentes */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-300 font-semibold mr-1">Comunas frecuentes:</span>
              {POPULAR_COMUNAS.slice(0, 5).map((comuna) => (
                <button
                  key={comuna}
                  type="button"
                  onClick={() => navigate(`/search?commune=${encodeURIComponent(comuna)}`)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-white font-medium px-3 py-1.5 rounded-full border border-white/15 transition-colors cursor-pointer"
                >
                  {comuna}
                </button>
              ))}
            </div>

            {/* Botones de categorías rápidas */}
            <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap justify-center gap-2">
              {MARKETPLACE_CATEGORIES.slice(0, 4).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleQuickCategory(c.slug)}
                  className="px-3.5 py-2 rounded-control bg-slate-800/80 hover:bg-slate-700/80 text-sm font-semibold text-slate-100 border border-slate-700/70 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* CTA prestadores */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/unete')}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
              >
                ¿Tienes un taller o servicio automotriz? Publícalo gratis en tu comuna <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
