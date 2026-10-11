import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Car, Wrench, 
  MapPin, Clock, MessageCircle, AlertTriangle, 
  CheckCircle2, Sparkles, BatteryCharging, Truck 
} from 'lucide-react';
import { COMUNAS_POR_REGION } from '../../data/autocompleteData';
import { trackEvent } from '../../lib/analytics';

const ALL_COMUNAS: string[] = Array.from(
  new Set(Object.values(COMUNAS_POR_REGION).flat())
).sort((a, b) => a.localeCompare(b, 'es'));

interface LeadQualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phonePrestador: string;
  nombrePrestador?: string;
  comunaSugerida?: string;
}

// Opciones de problemas (Paso 2)
const PROBLEMAS = [
  {
    id: 'Mecánica',
    label: 'Mecánica General',
    desc: 'Motor, frenos, ruidos, embrague',
    icon: Wrench,
    color: 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/50',
    iconColor: 'text-blue-600 bg-blue-100',
  },
  {
    id: 'Eléctrico',
    label: 'Eléctrico / Batería',
    desc: 'No arranca, alternador, luces',
    icon: BatteryCharging,
    color: 'border-amber-200 hover:border-amber-500 hover:bg-amber-50/50',
    iconColor: 'text-amber-600 bg-amber-100',
  },
  {
    id: 'Grúa/Neumático',
    label: 'Grúa o Neumático',
    desc: 'Remolque, pana en ruta, pinchazo',
    icon: Truck,
    color: 'border-purple-200 hover:border-purple-500 hover:bg-purple-50/50',
    iconColor: 'text-purple-600 bg-purple-100',
  },
  {
    id: 'Mantención',
    label: 'Mantención Preventiva',
    desc: 'Aceite, filtros, revisión técnica',
    icon: Sparkles,
    color: 'border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50',
    iconColor: 'text-emerald-600 bg-emerald-100',
  },
];

// Opciones de urgencia (Paso 4)
const NIVELES_URGENCIA = [
  {
    id: 'Emergencia (Auto detenido / Hoy mismo)',
    titulo: '🚨 Emergencia Inmediata',
    subtitulo: 'Quedé botado o lo necesito hoy mismo',
    badge: 'Prioridad Máxima',
    color: 'border-red-300 hover:border-red-500 bg-red-50/40 text-red-950',
  },
  {
    id: 'Esta semana',
    titulo: '📅 Esta Semana',
    subtitulo: 'Puedo coordinar en los próximos 2 a 3 días',
    badge: 'Coordinable',
    color: 'border-blue-200 hover:border-blue-500 bg-blue-50/30 text-blue-950',
  },
  {
    id: 'Solo cotizando',
    titulo: '💬 Solo Cotizando',
    subtitulo: 'Comparando presupuestos y disponibilidad',
    badge: 'Informativo',
    color: 'border-slate-200 hover:border-slate-400 bg-slate-50 text-slate-900',
  },
];

export const LeadQualificationModal: React.FC<LeadQualificationModalProps> = ({
  isOpen,
  onClose,
  phonePrestador,
  nombrePrestador = 'el prestador',
  comunaSugerida = 'Santiago',
}) => {
  // Modo de usuario: 'selection' (bifurcación inicial), 'driver' (wizard 4 pasos de auto), 'provider' (mecánico/taller)
  const [userRole, setUserRole] = useState<'selection' | 'driver' | 'provider'>('selection');

  // Manejo de estado del paso actual del conductor (1 a 4)
  const [paso, setPaso] = useState<number>(1);

  // Estados de las 4 respuestas
  const [autoInfo, setAutoInfo] = useState<string>(''); // Paso 1: Marca, Modelo y Año
  const [step1Error, setStep1Error] = useState<string>(''); // Mensaje de validación amigable inline
  const [problema, setProblema] = useState<string>('Mecánica'); // Paso 2: Problema
  const [comuna, setComuna] = useState<string>(comunaSugerida); // Paso 3: Comuna
  const [urgencia, setUrgencia] = useState<string>('Emergencia (Auto detenido / Hoy mismo)'); // Paso 4: Urgencia

  // Bloquear scroll del fondo y reiniciar limpio al cerrar/abrir
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      trackEvent('lead_modal_opened', { providerName: nombrePrestador });
    } else {
      document.body.style.overflow = '';
      setUserRole('selection');
      setPaso(1);
      setAutoInfo('');
      setStep1Error('');
      setProblema('Mecánica');
      setComuna(comunaSugerida);
      setUrgencia('Emergencia (Auto detenido / Hoy mismo)');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, comunaSugerida, nombrePrestador]);

  if (!isOpen) return null;

  // Barra de progreso dinámica (25%, 50%, 75%, 100%)
  const progresoPorcentaje = paso * 25;

  const handleNext = () => {
    if (paso === 1) {
      if (!autoInfo.trim()) {
        setStep1Error('Por favor ingresa la marca, modelo y año de tu auto (ej. Toyota Yaris 2018).');
        return;
      }
      setStep1Error('');
      trackEvent('lead_step_1_done', { vehicle: autoInfo.trim() });
    }

    if (paso === 2) {
      trackEvent('lead_step_2_done', { problem: problema });
    }

    if (paso === 3) {
      trackEvent('lead_step_3_done', { commune: comuna });
    }

    if (paso < 4) {
      setPaso((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (userRole === 'provider') {
      setUserRole('selection');
      return;
    }
    if (paso > 1) {
      setPaso((prev) => prev - 1);
    } else {
      setUserRole('selection');
    }
  };

  // Redirección directa para prestadores mecánicos
  const handleProviderWhatsApp = () => {
    const sanitizedPhone = phonePrestador.replace(/[^0-9]/g, '');
    const mensaje = `Hola equipo de RedMecánica, soy mecánico / tengo un taller automotriz y me interesa saber cómo funciona la plataforma para recibir solicitudes de clientes en mi comuna.`;
    trackEvent('lead_provider_whatsapp_clicked');
    
    const url = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(mensaje)}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
    onClose();
  };

  // Lógica de salida: concatenación amigable y redirección a WhatsApp para conductores
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedPhone = phonePrestador.replace(/[^0-9]/g, '');
    const mensajeFormateado = `Hola, busco ayuda. Mi auto es ${autoInfo.trim()}, presenta un tema de ${problema} en ${comuna}. Mi nivel de urgencia es: ${urgencia}.`;

    trackEvent('lead_step_4_submitted', {
      vehicle: autoInfo.trim(),
      problem: problema,
      commune: comuna,
      urgency: urgencia,
    });

    const whatsAppUrl = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(mensajeFormateado)}`;

    // Manejo de apertura compatible con navegadores móviles sin bloqueo de pop-up
    const newWindow = window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback si el navegador móvil bloquea window.open
      window.location.href = whatsAppUrl;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-lg min-w-0 bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88dvh] animate-slideUp text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de Progreso Superior Fluida (solo activa cuando es conductor en el wizard) */}
        {userRole === 'driver' && (
          <div className="w-full bg-slate-100 h-1.5 sm:h-2 overflow-hidden shrink-0">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${progresoPorcentaje}%` }}
            />
          </div>
        )}

        {/* Encabezado con Control de Pasos y Navegación Adaptable */}
        <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {userRole !== 'selection' ? (
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition shrink-0 cursor-pointer"
                aria-label="Volver atrás"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-1 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              {userRole === 'driver' ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block truncate">
                    Paso {paso} de 4 · {progresoPorcentaje}%
                  </span>
                  <h2 id="modal-title" className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                    {paso === 1 && 'Identifica tu vehículo'}
                    {paso === 2 && '¿Qué problema presenta?'}
                    {paso === 3 && '¿En qué comuna estás?'}
                    {paso === 4 && 'Nivel de urgencia'}
                  </h2>
                </>
              ) : userRole === 'provider' ? (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block truncate">
                    Talleres y Mecánicos · RedMecánica Pro
                  </span>
                  <h2 id="modal-title" className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                    ¿Cómo funciona para prestadores?
                  </h2>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block truncate">
                    Atención y Soporte
                  </span>
                  <h2 id="modal-title" className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                    ¿En qué podemos ayudarte hoy?
                  </h2>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition shrink-0 cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Dinámico con Scroll Vertical Seguro */}
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0 min-w-0 space-y-4">
          {/* ======================================================== */}
          {/* BIFURCACIÓN INICIAL: Conductor vs Prestador Mecánico     */}
          {/* ======================================================== */}
          {userRole === 'selection' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-lg font-black text-slate-900">
                  Selecciona tu perfil
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Derivamos tu consulta al canal correcto para responderte de inmediato.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                {/* Opción 1: Conductor que busca ayuda */}
                <button
                  type="button"
                  onClick={() => setUserRole('driver')}
                  className="flex flex-col xs:flex-row items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all active:scale-[0.99] group cursor-pointer min-w-0"
                >
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 truncate">
                        Busco ayuda para mi auto
                      </h4>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 transition-all" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed break-words">
                      Necesito mecánico urgente, grúa, taller o mantención en mi comuna.
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      ⚡ Pre-calificación en 4 pasos
                    </span>
                  </div>
                </button>

                {/* Opción 2: Prestador / Mecánico / Dueño de Taller */}
                <button
                  type="button"
                  onClick={() => setUserRole('provider')}
                  className="flex flex-col xs:flex-row items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all active:scale-[0.99] group cursor-pointer min-w-0"
                >
                  <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                    <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                  </span>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-emerald-700 truncate">
                        Soy mecánico o tengo un taller
                      </h4>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0 transition-all" />
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed break-words">
                      Quiero captar clientes, recibir trabajos en mi comuna y registrarme.
                    </p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      🛠️ Registro gratis sin comisión
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA B2B: Explicación y contacto para Mecánicos/Talleres */}
          {/* ======================================================== */}
          {userRole === 'provider' && (
            <div className="space-y-3.5 animate-fadeIn min-w-0">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 min-w-0">
                <span className="text-xl sm:text-2xl mb-1 block">🤝</span>
                <h3 className="font-black text-emerald-950 text-sm sm:text-base leading-tight break-words">
                  Haz crecer tu cartera de clientes locales
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-800 mt-1 leading-relaxed break-words">
                  RedMecánica conecta a conductores de tu comuna directamente con tu taller o servicio a domicilio vía WhatsApp sin intermediarios ni comisiones.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700 min-w-0">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 block truncate">Perfil público verificado</span>
                    <span className="text-[11px] text-slate-500 leading-tight block break-words">Aparece en búsquedas orgánicas de Google y en tu comuna.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 block truncate">Trato y cobro 100% directo</span>
                    <span className="text-[11px] text-slate-500 leading-tight block break-words">Tú fijas tus precios y el cliente te paga a ti directamente.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-slate-900 block truncate">Alta en menos de 1 minuto</span>
                    <span className="text-[11px] text-slate-500 leading-tight block break-words">Crea tu perfil gratis con tu especialidad y teléfono.</span>
                  </div>
                </div>
              </div>

              <div className="pt-1 space-y-2 min-w-0">
                <button
                  type="button"
                  onClick={handleProviderWhatsApp}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer min-w-0 text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-white stroke-emerald-600 shrink-0" />
                  <span className="truncate">Hablar con Soporte de Prestadores</span>
                </button>
                <a
                  href="/onboarding"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 min-w-0 text-center"
                >
                  <span className="truncate">Registrar mi taller / servicio gratis</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </a>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 1: Marca, Modelo y Año (Conductor)                  */}
          {/* ======================================================== */}
          {userRole === 'driver' && paso === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center sm:text-left">
                <span className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-3 shadow-inner">
                  <Car className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  ¿Qué vehículo necesita atención?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Permite que {nombrePrestador} verifique compatibilidad de repuestos o herramientas antes de responder.
                </p>
              </div>

              <div>
                <label htmlFor="auto-input" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Marca, Modelo y Año *
                </label>
                <input
                  id="auto-input"
                  type="text"
                  autoFocus
                  placeholder="Ej: Toyota Hilux 2019 o Chevrolet Sail 2017"
                  value={autoInfo}
                  onChange={(e) => setAutoInfo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  className={`w-full px-4 py-3.5 rounded-2xl border bg-slate-50/50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 shadow-inner transition-all ${
                    step1Error
                      ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                      : 'border-slate-300 focus:ring-blue-500'
                  }`}
                />
                {step1Error && (
                  <p className="text-red-600 text-xs font-bold mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                    <span>⚠️</span> {step1Error}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold">Ejemplos rápidos:</span>
                {['Hyundai Tucson 2018', 'Suzuki Swift 2021', 'Nissan Navara 2016'].map((ej) => (
                  <button
                    key={ej}
                    type="button"
                    onClick={() => setAutoInfo(ej)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-semibold transition"
                  >
                    + {ej}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 2: Selección de Problema (Botones Tap-Friendly) */}
          {/* ======================================================== */}
          {paso === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="mb-2">
                <h3 className="text-lg font-black text-slate-900">
                  ¿Cuál es el motivo de contacto?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona la categoría principal para preparar el presupuesto.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PROBLEMAS.map((item) => {
                  const Icon = item.icon;
                  const isSelected = problema === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setProblema(item.id);
                        setPaso(3); // Avance automático táctil
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer active:scale-98 min-h-[76px] ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600'
                          : `border-slate-200 bg-white ${item.color}`
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-black text-slate-900 leading-tight">
                          {item.label}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5 font-medium leading-tight">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 3: Selector de Comuna */}
          {/* ======================================================== */}
          {paso === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center sm:text-left">
                <span className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-3 shadow-inner">
                  <MapPin className="w-6 h-6" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  ¿En qué comuna se encuentra el auto?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Para confirmar si el prestador atiende a domicilio o está cerca de tu taller.
                </p>
              </div>

              <div>
                <label htmlFor="comuna-select" className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Comuna de Atención *
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    id="comuna-select"
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-inner appearance-none"
                  >
                    {ALL_COMUNAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Prestador con cobertura activa confirmada en <strong>{comuna}</strong>.
                </span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PASO 4: Nivel de Urgencia */}
          {/* ======================================================== */}
          {paso === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="mb-2">
                <h3 className="text-lg font-black text-slate-900">
                  ¿Con qué urgencia necesitas el servicio?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  El taller priorizará tu mensaje en WhatsApp según este nivel.
                </p>
              </div>

              <div className="space-y-2 sm:space-y-2.5 min-w-0">
                {NIVELES_URGENCIA.map((item) => {
                  const isSelected = urgencia === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setUrgencia(item.id)}
                      className={`w-full p-3 sm:p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-98 min-w-0 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                          : `border-slate-200 ${item.color}`
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-xs sm:text-sm font-black text-slate-900 break-words">
                            {item.titulo}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600 shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <span className="block text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium leading-tight break-words">
                          {item.subtitulo}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Vista previa del mensaje */}
              <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs min-w-0">
                <span className="block text-[10px] font-black uppercase text-slate-400 mb-0.5">
                  Mensaje que se enviará:
                </span>
                <p className="italic text-slate-700 font-medium break-words text-[11px] sm:text-xs leading-relaxed">
                  "Hola, busco ayuda. Mi auto es {autoInfo || '[Auto]'}, presenta un tema de {problema} en {comuna}. Mi nivel de urgencia es: {urgencia}."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Acciones Inferior Adaptada a Una Mano (solo para conductores en wizard) */}
        {userRole === 'driver' && (
          <div className="p-3.5 sm:p-5 border-t border-slate-100 bg-slate-50/80 shrink-0 min-w-0">
            {paso < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-w-0"
              >
                <span>Continuar</span>
                <ChevronRight className="w-4 h-4 stroke-[3] shrink-0" />
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleFinalSubmit}
                className="w-full py-3.5 sm:py-4 px-3 sm:px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer active:scale-98 tracking-tight min-w-0 text-center"
              >
                <MessageCircle className="w-5 h-5 fill-white stroke-emerald-500 shrink-0" />
                <span className="break-words">Contactar Prestador por WhatsApp</span>
              </button>
            )}

            <p className="text-[10px] text-center text-slate-400 mt-1.5 sm:mt-2 font-medium break-words">
              Trato directo sin comisiones · RedMecánica abre WhatsApp con el mensaje listo
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadQualificationModal;
