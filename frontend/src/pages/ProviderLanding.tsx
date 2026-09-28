import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import SEO from '../components/SEO';
import { MARKETPLACE_CATEGORIES } from '../data/marketplace';
import { COMUNAS_POR_REGION } from '../data/autocompleteData';

const ALL_COMUNAS: string[] = Array.from(new Set(Object.values(COMUNAS_POR_REGION).flat())).sort((a, b) =>
  a.localeCompare(b, 'es')
);

const ProviderLanding: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '',
    categorySlug: '',
    commune: '',
    phone: '',
    email: '',
    services: '',
  });
  const [communeFocus, setCommuneFocus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredComunas = useMemo(() => {
    const q = formData.commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!q) return ALL_COMUNAS.slice(0, 8);
    return ALL_COMUNAS.filter((c) =>
      c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
    ).slice(0, 8);
  }, [formData.commune]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.businessName.trim()) return setError('Ponle nombre a tu vitrina (tu taller, vulca, grúa…).');
    if (!formData.categorySlug) return setError('Elige tu categoría principal.');
    if (!formData.commune.trim()) return setError('Indica tu comuna base para aparecer en búsquedas.');
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 9)
      return setError('Agrega tu WhatsApp para recibir contactos directos.');

    // Guardar borrador real y pasar al onboarding con precarga
    localStorage.setItem('provider_draft', JSON.stringify({ ...formData, createdAt: new Date().toISOString() }));
    const params = new URLSearchParams({
      businessName: formData.businessName,
      category: formData.categorySlug,
      commune: formData.commune,
      phone: formData.phone,
      ...(formData.email ? { email: formData.email } : {}),
      ...(formData.services ? { services: formData.services } : {}),
    });
    navigate(`/onboarding?${params.toString()}`);
  };

  const selectedCategory = MARKETPLACE_CATEGORIES.find((c) => c.slug === formData.categorySlug);

  return (
    <>
      <SEO
        title="Publica tu negocio gratis | RedMecánica marketplace automotriz"
        description="Crea tu vitrina en 2 minutos: talleres, mecánicos, grúas, vulcanizaciones, eléctricos y más. Aparece cuando busquen en tu comuna y recibe contactos directos por WhatsApp. Sin comisión por contacto."
        keywords="publicar taller mecánico, registrar vulcanización, ofrecer servicios grúa, vitrina automotriz gratis Chile"
        canonicalUrl="https://redmecanica.cl/unete"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 -m-4 sm:-m-0 sm:rounded-2xl overflow-hidden">
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2" aria-label="Volver al inicio">
              <span className="text-2xl">🔧</span>
              <span className="text-2xl font-bold text-white">
                Red<span className="text-yellow-300">Mecánica</span>
              </span>
            </button>
            <button onClick={() => navigate('/search')} className="text-white/70 hover:text-white text-sm font-semibold">
              Ver directorio →
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 pb-10">
          <div className="grid lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto">
            {/* Propuesta */}
            <div className="text-white pt-2">
              <div className="inline-block bg-emerald-400/15 text-emerald-300 border border-emerald-300/20 px-4 py-1.5 rounded-full font-bold text-xs mb-5">
                VITRINA GRATUITA · PUBLICA EN 2 MINUTOS
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight">
                Aparece cuando busquen{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                  en tu comuna
                </span>
              </h1>
              <p className="text-blue-100/90 mb-6 max-w-lg text-sm sm:text-base leading-relaxed">
                Los conductores buscan gratis por comuna y categoría. Tú promocionas tus servicios
                y recibes el contacto <strong className="text-white">directo por WhatsApp</strong>, sin intermediarios ni comisión por contacto.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  { n: '1', t: 'Crea tu vitrina', d: 'Nombre, categoría, comuna, WhatsApp y servicios. 2 minutos.' },
                  { n: '2', t: 'Aparece en el directorio', d: 'Te ordenamos primero en tu comuna cuando busquen tu categoría.' },
                  { n: '3', t: 'Recibe contactos directos', d: 'El conductor te escribe por WhatsApp o te llama. Tú cierras el trato.' },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="w-8 h-8 shrink-0 bg-yellow-400 text-blue-950 font-black rounded-full flex items-center justify-center text-sm">
                      {s.n}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm">{s.t}</p>
                      <p className="text-blue-100/70 text-xs sm:text-sm">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-blue-100/80">
                💰 <strong className="text-white">Modelo honesto:</strong> publicar y aparecer es gratis.
                Si quieres destacar sobre tu competencia, hay planes de posicionamiento. Nunca pagas por cada contacto.
              </div>
            </div>

            {/* Form borrador */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-xl font-black text-gray-900">Crea tu borrador de vitrina</h2>
              <p className="text-sm text-gray-500 mb-5">Te tomará 2 minutos. Después completas verificación.</p>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded-xl p-3 mb-4">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de tu negocio *</label>
                  <input
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Ej: Vulca El Rayo, Taller Martínez, Grúas Sur"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Categoría principal *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MARKETPLACE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, categorySlug: cat.slug }))}
                        className={`text-left px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          formData.categorySlug === cat.slug
                            ? 'border-blue-600 bg-blue-50 text-blue-800'
                            : 'border-gray-100 hover:border-blue-200 text-gray-600'
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                  {selectedCategory && (
                    <p className="text-xs text-blue-600 font-semibold mt-1">✓ {selectedCategory.shortDesc}</p>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Comuna base *</label>
                  <input
                    name="commune"
                    value={formData.commune}
                    onChange={handleChange}
                    onFocus={() => setCommuneFocus(true)}
                    onBlur={() => setTimeout(() => setCommuneFocus(false), 150)}
                    placeholder="Ej: Maipú"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    autoComplete="off"
                  />
                  {communeFocus && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden">
                      {filteredComunas.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onMouseDown={() => setFormData((p) => ({ ...p, commune: c }))}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm font-medium text-gray-700"
                        >
                          📍 {c}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-1">Aparecerás primero cuando busquen en {formData.commune || 'tu comuna'}.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp *</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+56 9 1234 5678"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@negocio.cl"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">¿Qué servicios promocionas?</label>
                  <textarea
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ej: pinchazos, cambio de neumáticos, balanceo, frenos…"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black transition-all shadow-lg active:scale-[0.99]"
                >
                  Continuar → completar verificación
                </button>
                <p className="text-[11px] text-center text-gray-400">
                  Al continuar aceptas términos y verificación de identidad. Sin tarjeta.
                </p>
              </form>

              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <a href="https://wa.me/56983414730" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                  💬 ¿Dudas? Escríbenos por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 text-center text-white/50 text-xs border-t border-white/10">
          © 2026 RedMecánica · Marketplace automotriz de Chile · contacto@redmecanica.cl
        </footer>
      </div>
    </>
  );
};

export default ProviderLanding;
