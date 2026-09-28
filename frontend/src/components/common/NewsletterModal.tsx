import React, { useState, useEffect, useMemo } from 'react';
import { X, Mail, CheckCircle, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { registerLaunchLead } from '../../services/api';
import { COMUNAS_POR_REGION } from '../../data/autocompleteData';

interface NewsletterModalProps {
  onClose: () => void;
}

type LeadRole = 'driver' | 'provider';

const ALL_COMUNAS: string[] = Array.from(
  new Set(Object.values(COMUNAS_POR_REGION).flat())
).sort((a, b) => a.localeCompare(b, 'es'));

// Acceso anticipado Lanzamiento 2026: distingue si buscas un servicio
// o si eres prestador, y captura email + comuna para avisarte primero.
const NewsletterModal: React.FC<NewsletterModalProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<LeadRole>('driver');
  const [email, setEmail] = useState('');
  const [commune, setCommune] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const comunas = useMemo(() => ALL_COMUNAS, []);

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
        // Rol y comuna se guardan localmente para personalizar el lanzamiento
        try {
          localStorage.setItem(
            'launch_lead_extra',
            JSON.stringify({ role, commune, email: email.trim().toLowerCase(), at: new Date().toISOString() })
          );
        } catch {
          // almacenamiento local no disponible: no bloquea el registro
        }
        setIsSuccess(true);
        if (response.ticket) {
          setSuccessTicket(response.ticket);
        }
        setTimeout(onClose, 5000);
      } else {
        setErrorMessage(response?.message || 'Hubo un error al suscribirte. Intenta nuevamente.');
      }
    } catch (err: any) {
      console.error('Error suscribiendo al acceso anticipado:', err);
      const msg = err?.response?.data?.error || err?.message || 'Error al conectar con el servidor.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goRoleDestination = () => {
    onClose();
    navigate(role === 'provider' ? '/unete' : '/search');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-full max-w-[340px] sm:max-w-[380px] max-h-[92dvh] overflow-y-auto rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Acceso anticipado RedMecánica"
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3.5 right-3.5 z-30 p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Zona superior oscura */}
        <div className="relative bg-gradient-to-b from-teal-950 via-slate-900 to-slate-900 px-5 pt-5 pb-4 text-center overflow-hidden">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-56 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" aria-hidden />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" aria-hidden />

          <div className="relative z-10">
            {/* Badge lanzamiento */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-white/10 mb-3">
              <span aria-hidden className="text-xs">🔧</span>
              <span className="text-white font-extrabold text-[11px] tracking-wide">RedMecánica · Lanzamiento 2026</span>
            </div>

            <h3 className="text-white font-black text-base sm:text-lg tracking-tight leading-tight mb-1">
              {role === 'driver' ? '¿Necesitas un mecánico de confianza?' : '¿Tienes taller, vulca o grúa?'}
            </h3>
            <p className="text-slate-300 text-xs mb-3">
              {role === 'driver'
                ? 'Súmate al acceso anticipado y recibe atención directa por WhatsApp.'
                : 'Súmate al acceso anticipado y publica tu vitrina gratis en tu comuna.'}
            </p>

            {/* Selector de rol */}
            <div className="bg-white/10 rounded-xl p-1 flex gap-1 mb-3" role="tablist" aria-label="Elige tu rol">
              <button
                type="button"
                role="tab"
                aria-selected={role === 'driver'}
                onClick={() => setRole('driver')}
                className={`flex-1 py-2 px-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1 ${
                  role === 'driver' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span aria-hidden>🏠</span> Necesito un mecánico
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={role === 'provider'}
                onClick={() => setRole('provider')}
                className={`flex-1 py-2 px-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all min-h-[40px] flex items-center justify-center gap-1 ${
                  role === 'provider' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span aria-hidden>🔧</span> Soy mecánico
              </button>
            </div>

            {/* Caja de beneficio */}
            <div className="w-full bg-black/30 rounded-xl py-2.5 px-3.5 border border-white/10 text-left">
              <p className="text-white font-black text-[13px] sm:text-sm mb-1.5">
                <span aria-hidden>🎁</span> 20% dcto. <span className="font-medium text-slate-200">en tu primer servicio</span>
              </p>
              <ul className="space-y-1">
                {(role === 'driver'
                  ? [
                      'Mecánicos verificados con contacto directo por WhatsApp',
                      'Aviso prioritario cuando abramos tu comuna',
                    ]
                  : [
                      'Publica tu vitrina gratis y aparece en tu comuna',
                      'Insignia fundadora + aviso prioritario de lanzamiento',
                    ]
                ).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-1.5 text-slate-200 text-[11px] sm:text-xs">
                    <span className="text-emerald-400 font-black" aria-hidden>✅</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Zona inferior clara (formulario) */}
        <div className="bg-white px-5 py-4">
          {isSuccess ? (
            <div className="text-center py-1">
              <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-slate-900 font-black text-base">¡Acceso reservado!</h4>
              <p className="text-slate-600 text-xs mt-1 max-w-xs mx-auto">
                Te avisaremos primero{commune ? ` en ${commune}` : ''}. Tu ticket exclusivo es:
              </p>
              {successTicket && (
                <div className="inline-block mt-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 font-mono text-[11px] font-bold tracking-wider">
                  {successTicket}
                </div>
              )}
              <button
                onClick={goRoleDestination}
                className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 rounded-xl transition-all text-[13px] min-h-[44px]"
              >
                {role === 'provider' ? 'Publicar mi negocio →' : 'Explorar el directorio →'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              {errorMessage && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-[11px] rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu e-mail"
                  disabled={isSubmitting}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-[13px] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 transition-all shadow-sm min-h-[44px]"
                  required
                />
              </div>

              {/* Comuna */}
              <div className="relative">
                <select
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 transition-all shadow-sm min-h-[44px] appearance-none text-slate-800"
                  aria-label="Tu comuna (opcional)"
                >
                  <option value="">Tu comuna (opcional)</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Consentimiento */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600 cursor-pointer"
                  required
                />
                <span className="text-[11px] text-slate-600 select-none leading-relaxed">
                  Quiero sumarme al lanzamiento y recibir beneficios exclusivos. Acepto la{' '}
                  <Link to="/privacy" target="_blank" className="text-teal-700 hover:text-teal-800 font-semibold hover:underline">
                    Política de Privacidad
                  </Link>.
                </span>
              </label>

              {/* CTA */}
              <button
                type="submit"
                disabled={!email || !accepted || isSubmitting}
                className="w-full mt-0.5 bg-slate-200 disabled:text-slate-400 enabled:bg-teal-700 enabled:hover:bg-teal-800 enabled:text-white text-slate-500 font-extrabold py-3 rounded-xl transition-all shadow-sm enabled:shadow-md active:scale-[0.99] text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reservando...</span>
                  </>
                ) : (
                  <span>Quiero mi acceso + 20% dcto.</span>
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
