
import React, { useState, useEffect } from 'react';
import { useSuccessToast, useErrorToast } from '../contexts/ToastContext';
import { registerLaunchLead } from '../services/api';

const LaunchBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [targetDate, setTargetDate] = useState<number | null>(null);
  const showSuccess = useSuccessToast();
  const showError = useErrorToast();

  const LEAD_STORAGE_KEY = 'launch_lead_registered_email';
  const LEAD_COUNTDOWN_KEY = 'launch_lead_countdown_target';

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const storedTarget = localStorage.getItem(LEAD_COUNTDOWN_KEY);
    const now = Date.now();

    if (storedTarget) {
      const parsedTarget = Number(storedTarget);
      if (!Number.isNaN(parsedTarget) && parsedTarget > now) {
        setTargetDate(parsedTarget);
        return;
      }
    }

    const newTarget = now + (2 * 24 * 60 * 60 * 1000);
    localStorage.setItem(LEAD_COUNTDOWN_KEY, String(newTarget));
    setTargetDate(newTarget);
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsVisible(false);
        localStorage.removeItem(LEAD_COUNTDOWN_KEY);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    const storedEmail = localStorage.getItem(LEAD_STORAGE_KEY);
    if (storedEmail) {
      setIsRegistered(true);
      setRegisteredEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const result = await registerLaunchLead(email);
      // use server message when available
      showSuccess(result.message || '¡Excelente! Te avisaremos apenas estemos operativos. ¡Bienvenido a la comunidad!');
      localStorage.setItem(LEAD_STORAGE_KEY, email);
      setRegisteredEmail(email);
      setIsRegistered(true);
      setEmail('');
    } catch (err: any) {
      console.error('Error al registrar lead:', err);
      if (err.message && err.message.includes('Network Error')) {
        showError('No se pudo conectar con el servidor. ¿El backend está levantado o tu configuración de VITE_API_URL es correcta?');
      } else {
        const serverMsg = err?.response?.data?.error;
        showError(serverMsg || 'Hubo un problema al registrar tu correo. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Lado izquierdo: Contador */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white text-center md:w-1/3 flex flex-col justify-center min-h-[180px]">
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-80">Oferta válida en</p>
            <div className="flex justify-center gap-4">
              <div className="flex flex-col">
                <span className="text-3xl font-black">{timeLeft.days}</span>
                <span className="text-[10px] uppercase font-bold opacity-60">Días</span>
              </div>
              <span className="text-3xl font-light opacity-30 mt-[-4px]">:</span>
              <div className="flex flex-col">
                <span className="text-3xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase font-bold opacity-60">Hrs</span>
              </div>
              <span className="text-3xl font-light opacity-30 mt-[-4px]">:</span>
              <div className="flex flex-col">
                <span className="text-3xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase font-bold opacity-60">Min</span>
              </div>
              <span className="text-3xl font-light opacity-30 mt-[-4px]">:</span>
              <div className="flex flex-col">
                <span className="text-3xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[10px] uppercase font-bold opacity-60">Seg</span>
              </div>
            </div>
          </div>

          {/* Lado derecho: Captación */}
          <div className="p-8 flex-1 relative">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="mb-6">
<h3 className="text-xl font-bold text-white mb-2 leading-tight">
                ¡Últimos 2 días! 🇨🇱
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ¡No te quedes fuera! 
                <span className="text-blue-400 font-bold ml-1">Regístrate ahora</span> y obtén un <span className="text-white font-bold">40% de descuento</span> en tu primer servicio garantizado.
              </p>
            </div>

            {isRegistered ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-emerald-300 font-bold">Listo, ya quedaste registrado.</p>
                <p className="text-emerald-100/80 text-sm mt-1">
                  Te contactaremos a <span className="font-semibold">{registeredEmail}</span> cuando lancemos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(LEAD_STORAGE_KEY);
                    setRegisteredEmail('');
                    setIsRegistered(false);
                  }}
                  className="mt-3 text-xs font-semibold text-emerald-200 hover:text-white underline underline-offset-4"
                >
                  Cambiar correo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Ingresa tu correo aquí..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-slate-800/50 border border-slate-700 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 font-medium"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-blue-900/40 active:scale-95 disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Procesando...' : '¡Quiero mi descuento!'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchBanner;
