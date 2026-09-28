import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Card from '../common/Card';

const PitchBanners: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE 1: Calculadora de Transparencia ---
  const [sliderValue, setSliderValue] = useState(80000); // CLP

  // --- STATE 2: Simulador de Seguridad ---
  const [activeSeal, setActiveSeal] = useState<string>('rut');

  // Cálculos dinámicos para calculadora
  const estimatedTraditionalSurcharge = Math.round(sliderValue * 0.35);
  const estimatedTraditionalTotal = sliderValue + estimatedTraditionalSurcharge;
  const redMecanicaDiscount = estimatedTraditionalTotal - sliderValue;

  const seals = [
    {
      id: 'rut',
      icon: '🪪',
      title: 'Identidad y Antecedentes',
      desc: 'Validamos el RUT en el Registro Civil y exigimos el Certificado de Antecedentes penales actualizado cada 6 meses.',
      badge: '100% LIMPIO'
    },
    {
      id: 'cert',
      icon: '🎓',
      title: 'Certificación Técnica',
      desc: 'Comprobamos títulos de mecánica automotriz, certificaciones de marcas oficiales (INACAP, DUOC) y experiencia comprobada.',
      badge: 'APROBADO'
    },
    {
      id: 'escrow',
      icon: '💸',
      title: 'Pago Escrow Seguro',
      desc: 'Tu pago queda retenido de forma segura en la plataforma y solo se libera al mecánico cuando confirmas que estás conforme.',
      badge: 'GARANTIZADO'
    },
    {
      id: 'insur',
      icon: '🛡️',
      title: 'Seguro de Daños',
      desc: 'Todos los trabajos cuentan con respaldo de póliza de responsabilidad civil activa que protege tu auto ante imprevistos.',
      badge: 'COBERTURA GLOBAL'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-10 sm:space-y-12">
      
      {/* Sección Header con Estilo Checkered de Carreras */}
      <div className="text-center max-w-2xl mx-auto relative">
        {/* Decoración de carreras sutil */}
        <div className="flex justify-center gap-1.5 mb-3 opacity-30 select-none" aria-hidden>
          <span className="w-3 h-3 bg-slate-900"></span><span className="w-3 h-3 bg-slate-300"></span>
          <span className="w-3 h-3 bg-slate-900"></span><span className="w-3 h-3 bg-slate-300"></span>
          <span className="w-3 h-3 bg-slate-900"></span><span className="w-3 h-3 bg-slate-300"></span>
        </div>
        <span className="inline-block bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-extrabold uppercase tracking-widest">
          ⚙️ Cómo funciona el marketplace
        </span>
        <h2 className="section-title mt-3 !text-2xl sm:!text-3xl md:!text-4xl">
          Busca gratis por comuna · <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">contacta directo</span>
        </h2>
        <p className="section-sub mt-2">
          Sin cuenta, sin intermediarios. Compara vitrinas verificadas y cierra por WhatsApp.
        </p>
      </div>

      {/* Grid de Banners Interactivos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BANNER 1: CALCULADORA DE TRANSPARENCIA */}
        <Card className="p-6 flex flex-col border border-slate-800 shadow-2xl transition-all duration-500 rounded-[2rem] bg-carbon-fiber text-white relative overflow-hidden neon-border-blue hover:scale-102 group">
          {/* Engranajes giratorios de decoración de fondo en SVG */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 text-slate-800/10 pointer-events-none z-0">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full animate-spin-slow">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </div>
          
          <div className="absolute top-0 right-0 bg-blue-600/80 text-white text-[10px] font-black py-1.5 px-6 rounded-bl-3xl uppercase tracking-widest border-l border-b border-blue-500/20">
            📊 DINÁMICO
          </div>
          
          <div className="mb-4 relative z-10">
            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">⚙️</span>
            <h3 className="font-extrabold text-2xl text-white mt-3 tracking-tight flex items-center gap-2">
              Calculadora de Tarifas y RPM
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Mueva el acelerador de tarifas y compruebe cómo el depósito en garantía de RedMecánica le protege de cobros inesperados.
            </p>
          </div>

          {/* Slider interactivo con look de tablero de instrumentos */}
          <div className="my-6 p-5 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-3xl relative z-10 shadow-2xl">
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 text-center">
              PRESUPUESTO ACORDADO (DIAGNOSTICADO)
            </label>
            <div className="text-3xl font-black text-blue-400 text-center mb-5 tracking-tighter drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]">
              ${sliderValue.toLocaleString('clp')} <span className="text-xs font-bold text-slate-500">CLP</span>
            </div>
            <input
              type="range"
              min="30000"
              max="300000"
              step="5000"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500 border border-slate-700 shadow-inner"
            />
            <div className="flex justify-between text-[8px] text-slate-600 font-black mt-2 tracking-wider">
              <span>RPM MIN (30K)</span>
              <span>LÍMITE (300K)</span>
            </div>
          </div>

          {/* Comparativa con Glow Neon */}
          <div className="space-y-3.5 flex-1 relative z-10">
            <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-2xl flex items-center justify-between transition-all hover:bg-red-950/60">
              <div>
                <span className="text-xs font-bold text-red-400 block">Taller Tradicional Común</span>
                <span className="text-[10px] text-red-500/80 block">Sobrecargos típicos de repuestos (+35%)</span>
              </div>
              <span className="font-extrabold text-red-400 text-sm">
                ${estimatedTraditionalTotal.toLocaleString('clp')}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex items-center justify-between transition-all hover:bg-emerald-950/60 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <div>
                <span className="text-xs font-bold text-emerald-400 block">Depósito Escrow RedMecánica</span>
                <span className="text-[10px] text-emerald-500/80 block">Precios cerrados, seguros y garantizados</span>
              </div>
              <span className="font-extrabold text-emerald-400 text-sm">
                ${sliderValue.toLocaleString('clp')}
              </span>
            </div>
          </div>

          {/* Ahorro Estimado */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Ahorro Neto:</span>
              <span className="text-xs font-black text-yellow-400 block tracking-tight animate-pulse-fast">⚡ Evitas pagar ${redMecanicaDiscount.toLocaleString('clp')} de más</span>
            </div>
            <button 
              onClick={() => navigate('/solicitar')} 
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md active:scale-95 hover-rev-vibrate flex items-center justify-center whitespace-nowrap"
            >
              Cotizar ⚡
            </button>
          </div>
        </Card>

        {/* BANNER 2: SIMULADOR DE SEGURIDAD (CONTRATO / REPUTACIÓN) */}
        <Card className="p-6 flex flex-col border border-slate-800 shadow-2xl transition-all duration-500 rounded-[2rem] bg-carbon-fiber text-white relative overflow-hidden neon-border-yellow hover:scale-102 group">
          {/* Engranajes de decoración contrarrotativos */}
          <div className="absolute -top-10 -right-10 w-28 h-28 text-slate-800/10 pointer-events-none z-0">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full animate-spin-reverse-slow">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </div>

          <div className="absolute top-0 right-0 bg-yellow-500 text-slate-950 text-[10px] font-black py-1.5 px-6 rounded-bl-3xl uppercase tracking-widest border-l border-b border-yellow-400/20">
            🛡️ AUDITORÍA
          </div>

          <div className="mb-4 relative z-10">
            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]">🏁</span>
            <h3 className="font-extrabold text-2xl text-white mt-3 tracking-tight">
              Filtros de Seguridad Elite
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Audita y comprueba la hoja de ruta de los mecánicos haciendo clic en los sellos digitales del tacómetro de seguridad.
            </p>
          </div>

          {/* Credencial Interactiva en Dashboard Look */}
          <div className="my-4 p-4.5 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-inner relative z-10">
            <div className="absolute top-3.5 right-3.5 text-[8px] font-black tracking-widest text-yellow-400 uppercase bg-yellow-500/10 px-2.5 py-0.5 rounded border border-yellow-400/20">
              CLASE S 🏁
            </div>
            
            <div className="flex gap-3 items-center mb-4 pr-20">
              <div className="w-12 h-12 bg-slate-850 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-700" aria-hidden>
                🔧
              </div>
              <div>
                <span className="font-black text-sm block text-slate-100">Prestador verificado</span>
                <span className="text-[10px] text-yellow-400 font-bold block uppercase tracking-wider">Vitrina verificada · Ilustrativa</span>
              </div>
            </div>

            {/* Fila de Sellos Interactivos */}
            <div className="grid grid-cols-4 gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-800">
              {seals.map(seal => (
                <button
                  key={seal.id}
                  onClick={() => setActiveSeal(seal.id)}
                  className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                    activeSeal === seal.id
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-950 shadow-lg scale-110 rotate-2'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-white'
                  }`}
                  title={seal.title}
                >
                  {seal.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Detalle Dinámico del Sello */}
          <div className="p-4 bg-slate-950/80 border border-slate-850 rounded-2xl flex-1 flex flex-col justify-center relative z-10 shadow-inner">
            {(() => {
              const current = seals.find(s => s.id === activeSeal);
              return (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-xs text-yellow-400 uppercase tracking-widest">{current?.title}</span>
                    <span className="bg-yellow-400/10 text-yellow-400 text-[8px] font-black px-2 py-0.5 rounded border border-yellow-400/20">
                      {current?.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {current?.desc}
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between relative z-10">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> INSPECCIONADO
            </span>
            <button 
              onClick={() => navigate('/unete')}
              className="text-xs font-black text-yellow-400 hover:text-yellow-300 flex items-center gap-1 hover:underline hover-rev-vibrate"
            >
              Registrar Taller 🏭
            </button>
          </div>
        </Card>

        {/* BANNER 3: GRÚAS Y AUXILIO REAL POR COMUNA */}
        <Card className="p-6 flex flex-col border border-slate-800 shadow-2xl transition-all duration-500 rounded-[2rem] bg-carbon-fiber text-white relative overflow-hidden neon-border-red hover:scale-102 group">
          {/* Engranaje giratorio de decoración */}
          <div className="absolute -bottom-10 -right-10 w-28 h-28 text-slate-800/10 pointer-events-none z-0" aria-hidden>
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full animate-spin-slow">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </div>

          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black py-1.5 px-6 rounded-bl-3xl uppercase tracking-widest border-l border-b border-red-500/20">
            🚨 AUXILIO POR COMUNA
          </div>

          <div className="mb-4 relative z-10">
            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" aria-hidden>🚛</span>
            <h3 className="font-extrabold text-2xl text-white mt-3 tracking-tight">
              Grúas y auxilio reales cerca de ti
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Sin simuladores: busca grúas publicadas en tu comuna, revisa su teléfono y llámalas directo. Gratis y sin cuenta.
            </p>
          </div>

          {/* Directorio real de auxilio */}
          <div className="my-3 p-4 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl relative z-10 flex-1 flex flex-col justify-between min-h-[150px]">
            <div className="space-y-2.5">
              {[
                { icon: '🚛', label: 'Grúa y remolque', to: '/search?category=grua' },
                { icon: '🛞', label: 'Vulcanización y pinchazos', to: '/search?category=vulcanizacion' },
                { icon: '⚡', label: 'Batería y electricidad', to: '/search?category=electrico' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.to)}
                  className="w-full flex items-center gap-3 bg-slate-900 hover:bg-slate-800 p-3 rounded-2xl border border-slate-800 transition-all text-left min-h-[44px]"
                >
                  <span className="text-xl" aria-hidden>{item.icon}</span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-200">{item.label}</span>
                  <span className="ml-auto text-red-400 font-black">→</span>
                </button>
              ))}
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                El contacto es directo con cada prestador. En emergencia real llama primero al número publicado en la vitrina.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> DIRECTORIO REAL
            </span>
            <button
              onClick={() => navigate('/search?category=grua')}
              className="text-xs font-black text-red-400 hover:text-red-300 flex items-center gap-1 hover:underline"
            >
              Buscar grúas ahora 🚨
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PitchBanners;
