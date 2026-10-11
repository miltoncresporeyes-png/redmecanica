import React, { useEffect } from 'react';
import { X, Wrench, Search, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { trackEvent } from '../../lib/analytics';

interface NewsletterModalProps {
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  // Cierra con la tecla Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleClientAction = () => {
    trackEvent('lead_modal_action_client');
    onClose();
    navigate('/search');
  };

  const handleProviderAction = () => {
    trackEvent('lead_modal_action_provider');
    onClose();
    navigate('/unete');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenido a RedMecánica"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cabecera Atractiva */}
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 pt-8 pb-6 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>Marketplace Automotriz de Chile</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight leading-tight mb-2">
            ¿Cómo podemos ayudarte hoy?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto">
            Acceso directo y gratuito: sin registro obligatorio ni trámites para empezar.
          </p>
        </div>

        {/* Dos Botones de Acción Claros (Sin campos obligatorios) */}
        <div className="p-6 space-y-3.5">
          {/* Opción 1: Cliente / Conductor */}
          <button
            type="button"
            onClick={handleClientAction}
            className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-left shadow-lg hover:shadow-xl transition-all flex items-center justify-between group cursor-pointer active:scale-98"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl shrink-0">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-base font-black leading-tight">
                  Encontrar mecánico ahora
                </span>
                <span className="block text-xs text-blue-100 font-medium mt-0.5">
                  Busca por comuna y contacta directo por WhatsApp
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Opción 2: Prestador / Taller */}
          <button
            type="button"
            onClick={handleProviderAction}
            className="w-full p-4.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-left shadow-md hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer active:scale-98 border border-slate-800"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-base font-black leading-tight">
                  Publicar mis servicios gratis
                </span>
                <span className="block text-xs text-slate-300 font-medium mt-0.5">
                  Para mecánicos, talleres, grúas y vulcanizaciones
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>

          {/* Garantías de confianza */}
          <div className="pt-2 flex items-center justify-center gap-4 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Gratuito
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sin comisiones
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Trato directo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
