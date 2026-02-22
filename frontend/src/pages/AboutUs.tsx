import React from 'react';
import { 
  Gauge, 
  ShieldCheck, 
  Award, 
  Cpu, 
  Zap, 
  Scale, 
  Star,
  Clock,
  Target,
  Wrench,
  Check
} from 'lucide-react';
import SEO from '../components/SEO';

interface AboutUsProps {
  onClose: () => void;
  onNavigateToOnboarding?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onClose, onNavigateToOnboarding }) => {
  return (
    <>
      <SEO
        title="Acerca de Nosotros | RedMecánica"
        description="Conoce RedMecánica, la plataforma líder en Chile que conecta conductores con mecánicos certificados. Nuestra misión es revolucionar los servicios automotrices."
        keywords="sobre redmecánica, empresa mecánica chile, historia redmecánica"
        canonicalUrl="https://redmecanica.cl/about"
      />
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Acerca de <span className="text-blue-600">RedMecánica</span></h1>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-[2.5rem] p-12 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight relative z-10">
            Conectando conductores con los mejores servicios automotrices de Chile
          </h2>
          <p className="text-xl opacity-80 leading-relaxed font-medium relative z-10 max-w-2xl">
            Somos la plataforma líder que revoluciona la forma en que los chilenos acceden a 
            servicios de mecánica, talleres y asistencia vehicular con un estándar de nivel mundial.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Nuestra Misión</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Proporcionar una plataforma confiable y segura que conecte a conductores con 
              profesionales automotrices verificados, garantizando transparencia, calidad y 
              tranquilidad en cada servicio.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gauge className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Nuestra Visión</h3>
            <p className="text-slate-600 font-medium leading-relaxed">
              Ser la aplicación #1 en Chile para soluciones automotrices, estableciendo el 
              estándar de confianza, accesibilidad y profesionalismo en la industria de 
              servicios vehiculares.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16">
          <h3 className="text-2xl font-black text-slate-900 mb-8 px-2">Nuestros Valores Fundamentales</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-blue-200 transition-colors">
              <ShieldCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-black text-slate-900 mb-2">Confianza</h4>
              <p className="text-sm text-slate-500 font-medium">
                Verificamos exhaustivamente a cada prestador antes de su ingreso.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-emerald-200 transition-colors">
              <Award className="w-10 h-10 text-emerald-600 mb-4" />
              <h4 className="font-black text-slate-900 mb-2">Calidad</h4>
              <p className="text-sm text-slate-500 font-medium">
                Solo trabajamos con técnicos expertos y talleres certificados.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-indigo-200 transition-colors">
              <Cpu className="w-10 h-10 text-indigo-600 mb-4" />
              <h4 className="font-black text-slate-900 mb-2">Tecnología</h4>
              <p className="text-sm text-slate-500 font-medium">
                Innovación aplicada al diagnóstico y gestión de mantenimientos.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-amber-200 transition-colors">
              <Zap className="w-10 h-10 text-amber-500 mb-4" />
              <h4 className="font-black text-slate-900 mb-2">Efectividad</h4>
              <p className="text-sm text-slate-500 font-medium">
                Resoluciones rápidas bajo estándares técnicos rigurosos.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
              <Scale className="w-10 h-10 text-slate-600 mb-4" />
              <h4 className="font-black text-slate-900 mb-2">Transparencia</h4>
              <p className="text-sm text-slate-500 font-medium">
                Presupuestos detallados y precios justos en toda la plataforma.
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:border-yellow-200 transition-colors">
              <Star className="w-10 h-10 text-yellow-500 mb-4" />
              <h4 className="font-black text-slate-900 mb-2">Excelencia</h4>
              <p className="text-sm text-slate-500 font-medium">
                Compromiso total con la satisfacción y seguridad del conductor.
              </p>
            </div>
          </div>
        </div>

        {/* Historia */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wrench className="w-32 h-32 rotate-12" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-6">Nuestra Trayectoria</h3>
          <div className="space-y-6 text-slate-600 font-medium leading-relaxed text-lg">
            <p>
              RedMecánica está iniciando su camino en este 2026 con una visión clara: transformar la industria de reparación 
              vehicular en Chile mediante tecnología avanzada y estándares de confianza reales.
            </p>
            <p>
              Actualmente nos encontramos en nuestra <strong>Fase de Lanzamiento</strong>, construyendo el ecosistema 
              donde la validación técnica y la transparencia son los pilares fundamentales para los primeros adoptantes.
            </p>
          </div>
        </div>

        {/* Cifras Realistas - Fase de Lanzamiento */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-900 text-white rounded-3xl p-8 text-center shadow-lg border border-slate-800">
            <div className="text-3xl font-black mb-1">Fase 1</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Lanzamiento</div>
          </div>
          <div className="bg-blue-600 text-white rounded-3xl p-8 text-center shadow-lg">
            <div className="text-3xl font-black mb-1">0</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Expertos Unidos</div>
          </div>
          <div className="bg-indigo-600 text-white rounded-3xl p-8 text-center shadow-lg">
            <div className="text-3xl font-black mb-1">--</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Valoración Comunidad</div>
          </div>
          <div className="bg-emerald-600 text-white rounded-3xl p-8 text-center shadow-lg">
            <div className="text-3xl font-black mb-1">100%</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">Compromiso</div>
          </div>
        </div>

        {/* Equipo y Compromiso */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8">
            <h3 className="text-2xl font-black text-slate-900 mb-6">Experiencia Técnica</h3>
            <ul className="space-y-4">
              {[
                'Ingenieros en Mecánica Automotriz',
                'Especialistas en Diagnóstico Computarizado',
                'Analistas de Control de Calidad',
                'Arquitectos de Software'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-600 text-white rounded-[2rem] p-10 flex flex-col justify-center shadow-2xl shadow-blue-200">
            <h3 className="text-2xl font-black mb-4 leading-tight">¿Listo para experimentar el cambio?</h3>
            <p className="mb-8 opacity-80 font-medium">
              Únete a la red más grande y profesional de asistencia automotriz en el país.
            </p>
            <button
              onClick={() => onNavigateToOnboarding ? onNavigateToOnboarding() : onClose()}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all active:scale-95 shadow-xl"
            >
              Comenzar Ahora
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
