import React, { useState, useEffect } from 'react';
import { X, Mail, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { registerLaunchLead } from '../../services/api';

interface NewsletterModalProps {
  onClose: () => void;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cierra con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !accepted || isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response: any = await registerLaunchLead(email.trim().toLowerCase());
      if (response?.success) {
        setIsSuccess(true);
        if (response.ticket) {
          setSuccessTicket(response.ticket);
        }
        setTimeout(onClose, 3500);
      } else {
        setErrorMessage(response?.message || 'Hubo un error al suscribirte. Intenta nuevamente.');
      }
    } catch (err: any) {
      console.error('Error suscribiendo al newsletter:', err);
      const msg = err?.response?.data?.error || err?.message || 'Error al conectar con el servidor.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700/20 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 z-30 p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-all backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mitad Superior Oscura (Estilo Premium RedMecánica) */}
        <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-6 pt-7 pb-6 text-center isolate overflow-hidden">
          {/* Luces de fondo */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Badge de Marca */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-3 shadow-inner">
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                R
              </div>
              <span className="text-white font-extrabold text-xs tracking-wide">RedMecánica</span>
              <span className="text-yellow-400 text-[11px] font-bold flex items-center gap-1 pl-1 border-l border-white/10">
                <Sparkles className="w-3 h-3" /> 2026
              </span>
            </div>

            {/* Título Principal */}
            <h3 className="text-white font-black text-sm sm:text-[15px] uppercase tracking-tight leading-snug mb-3.5 max-w-[95%] text-balance">
              ¡Suscríbete a nuestro newsletter para estar enterado de nuestras promociones y lanzamientos!
            </h3>

            {/* Caja de Descuento Destacada */}
            <div className="relative w-full bg-gradient-to-r from-blue-900/60 via-slate-800/80 to-blue-900/60 rounded-2xl py-3 px-4 border border-blue-500/20 shadow-lg">
              <p className="text-slate-200 font-bold text-xs sm:text-sm tracking-wide">
                RECIBE UN <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 font-black text-base sm:text-lg">20% DE DESCUENTO</span>
              </p>
              <p className="text-blue-200/90 text-xs font-semibold uppercase tracking-wider mt-0.5">
                EN TU PRIMER SERVICIO
              </p>
            </div>
            
            <p className="text-slate-400 text-[10px] mt-2.5 font-medium tracking-wide">
              *Descuento no acumulable con otras promociones
            </p>
          </div>
          
          {/* Separador inferior estilo gradiente vibrante */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-400 to-amber-500 shadow-sm" />
        </div>

        {/* Mitad Inferior (Formulario) */}
        <div className="bg-white px-6 py-6">
          {isSuccess ? (
            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h4 className="text-slate-900 font-black text-lg">¡Suscripción Confirmada!</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xs mx-auto">
                Te enviamos un correo de confirmación. Tu ticket exclusivo es:
              </p>
              {successTicket && (
                <div className="inline-block mt-2.5 px-3.5 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono text-xs font-bold tracking-wider">
                  {successTicket}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Input Email con icono */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu E-mail"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Checkbox Privacidad */}
              <label className="flex items-start gap-2.5 cursor-pointer group mt-0.5">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
                  required
                />
                <span className="text-xs text-slate-600 select-none leading-relaxed">
                  Acepto la{' '}
                  <Link to="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                    Política de Privacidad
                  </Link>.
                </span>
              </label>

              {/* Botón de Envío */}
              <button
                type="submit"
                disabled={!email || !accepted || isSubmitting}
                className="w-full mt-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md hover:shadow-blue-600/25 active:scale-[0.99] text-sm uppercase tracking-wider flex items-center justify-center gap-2 min-h-[46px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Suscribiendo...</span>
                  </>
                ) : (
                  <span>Suscribirme</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;

