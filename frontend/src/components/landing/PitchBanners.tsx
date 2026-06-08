import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

const PitchBanners: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE 1: Calculadora de Transparencia ---
  const [sliderValue, setSliderValue] = useState(80000); // CLP

  // --- STATE 2: Simulador de Seguridad ---
  const [activeSeal, setActiveSeal] = useState<string>('rut');

  // --- STATE 3: SOS Tracker ---
  const [sosState, setSosState] = useState<'idle' | 'searching' | 'en_route' | 'arrived'>('idle');
  const [eta, setEta] = useState(15);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sosState === 'searching') {
      interval = setTimeout(() => {
        setSosState('en_route');
        setEta(12);
        setProgress(33);
      }, 2000);
    } else if (sosState === 'en_route') {
      interval = setTimeout(() => {
        setSosState('arrived');
        setEta(0);
        setProgress(100);
      }, 5000);
    }
    return () => clearTimeout(interval);
  }, [sosState]);

  const handleStartSOS = () => {
    setSosState('searching');
    setEta(15);
    setProgress(10);
  };

  const handleResetSOS = () => {
    setSosState('idle');
    setEta(15);
    setProgress(0);
  };

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
    <div className="max-w-6xl mx-auto px-4 mb-20 space-y-16">
      
      {/* Sección Header con Estilo Checkered de Carreras */}
      <div className="text-center max-w-2xl mx-auto relative">
        {/* Decoración de carreras sutil */}
        <div className="flex justify-center gap-1.5 mb-3 opacity-30 select-none">
          <span className="w-3 h-3 bg-slate-900"></span><span className="w-3 h-3 bg-slate-300"></span>
          <span className="w-3 h-3 bg-slate-900"></span><span className="w-3 h-3 bg-slate-300"></span>
          <span className="w-3 h-3 bg-slate-900"></span><span className="w-3 h-3 bg-slate-300"></span>
        </div>
        <span className="inline-block bg-yellow-400 text-slate-950 text-xs px-3 py-1 rounded-full font-black uppercase tracking-widest border border-yellow-500 shadow-sm animate-pulse-fast">
          ⚙️ RedMecánica High-Performance
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mt-3">
          El Marketplace que Revoluciona el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">Mundo Tuerca</span>
        </h2>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          Interactúa con los pilares del proyecto. Hemos inyectado potencia mecánica, transparencia y control absoluto para tu vehículo.
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
              className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md active:scale-95 hover-rev-vibrate"
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
              <div className="w-12 h-12 bg-slate-850 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-700">
                👨‍🔧
              </div>
              <div>
                <span className="font-black text-sm block text-slate-100">Pedro Gómez S.</span>
                <span className="text-[10px] text-yellow-400 font-bold block uppercase tracking-wider">Mecánico de Transmisión Elite</span>
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

        {/* BANNER 3: SIMULADOR SOS GRUAS TRACKER */}
        <Card className="p-6 flex flex-col border border-slate-800 shadow-2xl transition-all duration-500 rounded-[2rem] bg-carbon-fiber text-white relative overflow-hidden neon-border-red hover:scale-102 group">
          {/* Engranaje giratorio de decoración */}
          <div className="absolute -bottom-10 -right-10 w-28 h-28 text-slate-800/10 pointer-events-none z-0">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full animate-spin-slow">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          </div>

          <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black py-1.5 px-6 rounded-bl-3xl uppercase tracking-widest border-l border-b border-red-500/20">
            🚨 24/7 EN VIVO
          </div>

          <div className="mb-4 relative z-10">
            <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">🚛</span>
            <h3 className="font-extrabold text-2xl text-white mt-3 tracking-tight">
              Despacho de Grúas SOS
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              ¿Sufrió su vehículo una avería grave? Envíe un SOS interactivo y simule el despacho de una grúa de rescate en segundos.
            </p>
          </div>

          {/* Pantalla del Simulador con Estética de Consola de Coche */}
          <div className="my-3 p-4 bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl relative z-10 flex-1 flex flex-col justify-between min-h-[150px]">
            
            {sosState === 'idle' && (
              <div className="text-center py-6">
                <span className="text-3xl animate-bounce block">⚠️</span>
                <button
                  onClick={handleStartSOS}
                  className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-650 text-white text-xs font-black px-6 py-3 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest border border-red-500/30 hover-rev-vibrate"
                >
                  🚀 INICIAR SOS INTERACTIVO
                </button>
              </div>
            )}

            {sosState !== 'idle' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-900 pb-2">
                  <span className="font-black flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse-fast"></span>
                    {sosState === 'searching' ? 'DESPACHANDO RESCATE...' : 
                     sosState === 'en_route' ? 'CAMILLA EN RUTA' : '🚨 ¡UNIDAD LLEGÓ AL DESTINO!'}
                  </span>
                  <span className="text-red-400 font-extrabold bg-red-950/60 border border-red-500/20 px-2 py-0.5 rounded text-[10px] animate-pulse">
                    {eta > 0 ? `ETA: ${eta} MIN` : 'LLEGADA'}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-yellow-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 font-black mt-2.5 tracking-widest">
                    <span>SEÑAL ENVIADA</span>
                    <span>EN CAMINO</span>
                    <span>CARGA</span>
                  </div>
                </div>

                {/* Info del despachador */}
                <div className="bg-slate-900 p-2.5 rounded-2xl border border-slate-850 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🚛</span>
                    <div>
                      <span className="text-[10px] font-black block text-slate-200 uppercase tracking-tight">Camión Hidráulico Mercedes</span>
                      <span className="text-[8px] text-slate-500 font-bold block uppercase">Operador: Juan M. • Patente: DX-44-BB</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleResetSOS} 
                    className="text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded font-black uppercase tracking-wider"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse-fast"></span> SISTEMA GPS ACTIVO
            </span>
            <button 
              onClick={() => navigate('/search?emergency=true')}
              className="text-xs font-black text-red-500 hover:text-red-400 flex items-center gap-1 hover:underline hover-rev-vibrate"
            >
              Pedir Grúa 24/7 🚨
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PitchBanners;
