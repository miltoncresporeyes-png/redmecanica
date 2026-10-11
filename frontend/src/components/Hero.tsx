import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Wrench, MapPin, Zap } from 'lucide-react';
import SEO from './SEO';
import { localBusinessSchema, webSiteSchema } from '../data/seoSchemas';
import { MARKETPLACE_CATEGORIES, POPULAR_COMUNAS } from '../data/marketplace';
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
        <div className="relative mb-6 sm:mb-8 rounded-3xl bg-slate-900 text-white overflow-hidden shadow-2xl border border-slate-800/80">
          {/* Fondo con brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 opacity-95" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center">
            {/* Badge de Urgencia */}
            <div className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 border border-amber-300/30 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 shadow-inner">
              <Zap className="w-3.5 h-3.5 fill-amber-300 animate-pulse" />
              <span>AUXILIO Y ATENCIÓN RÁPIDA · CONTACTO DIRECTO SIN REGISTRO</span>
            </div>

            {/* Título Principal Claro y Enfocado */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-3">
              Encuentra mecánicos y grúas de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
                urgencia en tu comuna
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto mb-6">
              Selecciona el servicio y tu ubicación para contactar talleres y mecánicos disponibles de inmediato.
            </p>

            {/* Buscador Limpio Estilo Airbnb */}
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 max-w-3xl mx-auto text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* Select 1: Servicio */}
                <div className="sm:col-span-5 relative group px-3 py-2 bg-slate-50/80 hover:bg-blue-50/50 rounded-xl sm:rounded-2xl border border-slate-200/80 transition-all">
                  <label htmlFor="service-select" className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    ¿Qué necesitas?
                  </label>
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
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
                <div className="sm:col-span-4 relative group px-3 py-2 bg-slate-50/80 hover:bg-blue-50/50 rounded-xl sm:rounded-2xl border border-slate-200/80 transition-all">
                  <label htmlFor="commune-select" className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-0.5">
                    ¿En qué comuna?
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
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
                    className="w-full h-full min-h-[48px] py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Search className="w-4 h-4 stroke-[3]" />
                    <span>Buscar Ahora</span>
                  </button>
                </div>

              </div>
            </form>

            {/* Accesos rápidos a comunas y servicios frecuentes */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Comunas frecuentes:</span>
              {POPULAR_COMUNAS.slice(0, 5).map((comuna) => (
                <button
                  key={comuna}
                  type="button"
                  onClick={() => navigate(`/search?commune=${encodeURIComponent(comuna)}`)}
                  className="text-[11px] bg-white/10 hover:bg-white/20 text-white font-medium px-2.5 py-1 rounded-full border border-white/15 transition-colors cursor-pointer"
                >
                  {comuna}
                </button>
              ))}
            </div>

            {/* Botones de categorías rápidas */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap justify-center gap-2">
              {MARKETPLACE_CATEGORIES.slice(0, 4).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => handleQuickCategory(c.slug)}
                  className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-slate-700/70 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
