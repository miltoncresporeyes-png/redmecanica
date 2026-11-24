import React, { useState, useEffect, useRef } from 'react';
import api, { setAuthToken } from '../../lib/http';

declare global {
  interface Window {
    google?: any;
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisPromise: Promise<void> | null = null;
const loadGoogleScript = (): Promise<void> => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const el = document.createElement('script');
      el.src = GIS_SRC;
      el.async = true;
      el.defer = true;
      el.onload = () => resolve();
      el.onerror = () => { gisPromise = null; reject(new Error('gis')); };
      document.head.appendChild(el);
    });
  }
  return gisPromise;
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
  defaultMode?: 'login' | 'register';
  defaultRole?: 'client' | 'provider';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess, defaultMode = 'login', defaultRole = 'client' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(defaultMode === 'register');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [role, setRole] = useState<'client' | 'provider'>(defaultRole);
  // Google: cuenta nueva que aun debe elegir tipo de cuenta
  const [pendingGoogle, setPendingGoogle] = useState<{ credential: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInfo, setOtpInfo] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef(role);
  roleRef.current = role;
  const registeringRef = useRef(isRegistering);
  registeringRef.current = isRegistering;

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Acceso con Google: solo se muestra si el backend lo tiene configurado
  useEffect(() => {
    if (!isOpen || googleClientId !== null) return;
    let cancelled = false;
    api.get('/auth/google/config')
      .then(({ data }) => { if (!cancelled) setGoogleClientId(data?.enabled && data?.clientId ? data.clientId : ''); })
      .catch(() => { if (!cancelled) setGoogleClientId(''); });
    return () => { cancelled = true; };
  }, [isOpen, googleClientId]);

  const showGoogle = Boolean(googleClientId) && !otpStep && !isForgotPassword;

  useEffect(() => {
    if (!isOpen || !showGoogle || !googleClientId) return;
    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        const container = googleBtnRef.current;
        if (cancelled || !container || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (resp: { credential?: string }) => {
            if (!resp?.credential) return;
            setLoading(true);
            setError('');
            try {
              const { data } = await api.post('/auth/google', { credential: resp.credential, ...(registeringRef.current ? { role: roleRef.current } : {}) });
              if (data?.needsRole) {
                setPendingGoogle({ credential: resp.credential, name: data.name, email: data.email });
                return;
              }
              finishLogin(data);
            } catch (err: any) {
              setError(err.response?.data?.error || err.response?.data?.message || 'No se pudo iniciar sesión con Google.');
            } finally {
              setLoading(false);
            }
          },
        });
        container.innerHTML = '';
        window.google.accounts.id.renderButton(container, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: isRegistering ? 'signup_with' : 'signin_with',
          logo_alignment: 'left',
          locale: 'es',
          width: Math.min(Math.max(container.clientWidth || 320, 200), 400),
        });
      })
      .catch(() => { /* sin conexión a Google: el formulario por correo sigue disponible */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showGoogle, googleClientId, isRegistering]);

  // Resetear estado cuando se abre el modal con nuevos defaults
  useEffect(() => {
    if (isOpen) {
      setIsRegistering(defaultMode === 'register');
      setIsForgotPassword(false);
      setForgotSuccess('');
      setRole(defaultRole);
      setError('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setOtpStep(false);
      setOtpCode('');
      setOtpInfo('');
      setResendCooldown(0);
    }
  }, [isOpen, defaultMode, defaultRole]);

  if (!isOpen) return null;

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setForgotSuccess('');

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setForgotSuccess(data.message || 'Te enviamos las instrucciones de recuperación a tu correo.');
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al solicitar recuperación. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const finishLogin = (data: any) => {
    setAuthToken(data.token);
    onLoginSuccess(data.user);
    onClose();
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setOtpStep(false);
    setOtpCode('');
    setIsRegistering(false);
  };

  const completeGoogleSignup = async () => {
    if (!pendingGoogle) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/google', { credential: pendingGoogle.credential, role });
      setPendingGoogle(null);
      finishLogin(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'No se pudo crear la cuenta. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      setError('Ingresa el código de 6 dígitos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-email', { email, code: otpCode });
      finishLogin(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'No se pudo verificar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setOtpInfo('');
    try {
      await api.post('/auth/resend-verification', { email });
      setOtpInfo('Te enviamos un nuevo código.');
      setResendCooldown(60);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'No se pudo reenviar el código.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpStep) {
      return handleVerifyOtp();
    }
    if (isForgotPassword) {
      return handleForgotPasswordSubmit(e);
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden. Por favor verifícalas.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isRegistering ? 'register' : 'login';
      const body: any = { email, password };
      
      if (isRegistering) {
        body.name = name;
        body.role = role;
      }

      const { data } = await api.post(`/auth/${endpoint}`, body);

      if (data.requiresEmailVerification && !data.token) {
        setOtpStep(true);
        setOtpCode('');
        setOtpInfo(data.emailSent === false ? 'No pudimos enviar el código; usa "Reenviar código".' : `Enviamos un código de 6 dígitos a ${email}.`);
        setResendCooldown(60);
        return;
      }

      finishLogin(data);

    } catch (err: any) {
        if (err.response?.data?.requiresEmailVerification) {
          setOtpStep(true);
          setOtpCode('');
          setOtpInfo('Tu cuenta está pendiente de verificación. Reenvía el código si lo necesitas.');
          return;
        }
        // Handle axios error
        const errorMessage = err.response?.data?.error || err.response?.data?.message || `Error al ${isRegistering ? 'registrar' : 'iniciar sesión'}`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-card shadow-2xl overflow-hidden relative border border-slate-100 max-h-[92dvh] sm:max-h-[90dvh] flex flex-col my-auto">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10 opacity-10 blur-2xl pointer-events-none"></div>
        
        {pendingGoogle && (
          <div className="absolute inset-0 z-20 bg-white p-5 sm:p-7 overflow-y-auto" role="dialog" aria-labelledby="g-role-title">
            <h2 id="g-role-title" className="text-2xl font-black text-slate-800 tracking-tight">Un paso más</h2>
            <p className="text-sm text-slate-600 mt-1 mb-5">Aún no tienes cuenta con <strong>{pendingGoogle.email}</strong>. ¿Cómo quieres usar RedMecánica?</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {([
                { value: 'client', icon: '👤', title: 'Busco un servicio', hint: 'Soy cliente: quiero encontrar mecánicos y grúas.' },
                { value: 'provider', icon: '🔧', title: 'Ofrezco servicios', hint: 'Tengo un taller, soy mecánico o grúa.' },
              ] as const).map((o) => (
                <label key={o.value} className={`cursor-pointer rounded-card border-2 p-3 text-left transition-all focus-within:ring-2 focus-within:ring-primary ${role === o.value ? 'border-primary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <input type="radio" name="google-account-type" value={o.value} checked={role === o.value} onChange={() => setRole(o.value)} className="sr-only" />
                  <span className="text-xl" aria-hidden="true">{o.icon}</span>
                  <span className="block text-sm font-bold text-slate-900 mt-1">{o.title}</span>
                  <span className="block text-xs text-slate-600 leading-snug mt-0.5">{o.hint}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-700 mb-3" role="alert">{error}</p>}
            <button type="button" onClick={completeGoogleSignup} disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Creando cuenta…' : 'Crear mi cuenta'}</button>
            <button type="button" onClick={() => { setPendingGoogle(null); setError(''); }} className="w-full mt-3 text-sm font-semibold text-slate-600 hover:text-slate-800 min-h-[44px]">Cancelar</button>
          </div>
        )}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 min-h-0">
          {/* Al registrarse se elige explicitamente el tipo de cuenta. Al iniciar sesion no hace falta: el sistema ya sabe quien eres. */}
          {isRegistering && !isForgotPassword && !otpStep && (
            <fieldset className="mb-5 sm:mb-6 animate-fadeIn">
              <legend className="text-sm font-bold text-slate-800 mb-2">¿Cómo quieres usar RedMecánica?</legend>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { value: 'client', icon: '👤', title: 'Busco un servicio', hint: 'Soy cliente: quiero encontrar mecánicos y grúas.' },
                  { value: 'provider', icon: '🔧', title: 'Ofrezco servicios', hint: 'Tengo un taller, soy mecánico o grúa.' },
                ] as const).map((o) => (
                  <label
                    key={o.value}
                    className={`cursor-pointer rounded-card border-2 p-3 text-left transition-all focus-within:ring-2 focus-within:ring-primary ${role === o.value ? 'border-primary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <input type="radio" name="account-type" value={o.value} checked={role === o.value} onChange={() => { setRole(o.value); setError(''); }} className="sr-only" />
                    <span className="text-xl" aria-hidden="true">{o.icon}</span>
                    <span className="block text-sm font-bold text-slate-900 mt-1">{o.title}</span>
                    <span className="block text-xs text-slate-600 leading-snug mt-0.5">{o.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight truncate">
                {otpStep ? 'Verifica tu correo' : isForgotPassword
                  ? 'Recuperar Cuenta'
                  : (isRegistering ? 'Crear Cuenta' : 'Bienvenido')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium break-words mt-0.5">
                {otpStep
                  ? 'Ingresa el código que enviamos a tu correo'
                  : isForgotPassword
                  ? 'Ingresa tu correo y te enviaremos un enlace de recuperación'
                  : (isRegistering ? (role === 'provider' ? 'Crea tu cuenta de prestador' : 'Crea tu cuenta de cliente') : 'Ingresa a tu cuenta')
                }
              </p>
            </div>
            <button 
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100 shrink-0 cursor-pointer"
            >
              <span className="text-xl sm:text-2xl leading-none">&times;</span>
            </button>
          </div>

          {showGoogle && (
            <div className="mb-5 sm:mb-6">
              <div ref={googleBtnRef} className="flex justify-center min-h-[44px]" />
              <div className="flex items-center gap-3 mt-5 text-xs font-semibold text-slate-500" role="separator" aria-label="o">
                <span className="flex-1 h-px bg-slate-200" />
                <span>o con tu correo</span>
                <span className="flex-1 h-px bg-slate-200" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {otpStep && (
              <div className="space-y-3 animate-fadeIn">
                {otpInfo && <p className="text-sm text-slate-600 font-medium">{otpInfo}</p>}
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Código de verificación</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-card outline-none transition-all font-black text-2xl tracking-[0.5em] text-center text-slate-700"
                  placeholder="······"
                />
                <div className="flex justify-between text-xs font-bold">
                  <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0} className="text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer">
                    {resendCooldown > 0 ? `Reenviar código (${resendCooldown}s)` : 'Reenviar código'}
                  </button>
                  <button type="button" onClick={() => { setOtpStep(false); setOtpCode(''); setError(''); }} className="text-slate-500 hover:underline cursor-pointer">
                    ← Volver
                  </button>
                </div>
              </div>
            )}

            {isRegistering && !isForgotPassword && !otpStep && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">👤</span>
                  <input 
                    type="text"
                    required={isRegistering}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-card outline-none transition-all font-medium text-slate-700"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            )}

            <div className={`space-y-2 ${otpStep ? 'hidden' : ''}`}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">📧</span>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-card outline-none transition-all font-medium text-slate-700"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            {!isForgotPassword && !otpStep && (
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contraseña</label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                        setForgotSuccess('');
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔒</span>
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-card outline-none transition-all font-medium text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {isRegistering && !isForgotPassword && !otpStep && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Repetir Contraseña</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔒</span>
                  <input 
                    type="password"
                    required={isRegistering}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-card outline-none transition-all font-medium text-slate-700 ${
                      confirmPassword && confirmPassword !== password 
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500' 
                        : confirmPassword && confirmPassword === password
                        ? 'border-emerald-400 bg-emerald-50/20 focus:border-emerald-500'
                        : 'border-transparent focus:border-blue-500 focus:bg-white'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[11px] text-red-500 font-semibold ml-1 animate-fadeIn">
                    Las contraseñas no coinciden
                  </p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="text-[11px] text-emerald-600 font-semibold ml-1 animate-fadeIn">
                    ✓ Las contraseñas coinciden
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-card text-sm font-bold flex items-center gap-3 animate-shake break-words">
                <span>⚠️</span> {error}
              </div>
            )}

            {forgotSuccess && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-card text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn break-words">
                <span className="text-lg">✅</span> {forgotSuccess}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3.5 sm:py-4 rounded-card font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
                isForgotPassword
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200'
                  : (isRegistering && role === 'provider' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200')
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                otpStep
                  ? 'Verificar y continuar'
                  : isForgotPassword
                  ? 'Enviar Enlace de Recuperación'
                  : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')
              )}
            </button>

            <p className="text-[11px] sm:text-xs text-slate-400 text-center leading-relaxed">
              {isForgotPassword
                ? 'Revisa tu bandeja de entrada o spam tras enviar la solicitud.'
                : 'Acceso seguro con tu correo registrado. Tus datos se usan solo para gestionar tu cuenta.'}
            </p>
          </form>

          <div className="mt-5 pt-5 sm:mt-6 sm:pt-6 border-t border-slate-100 text-center">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError('');
                  setForgotSuccess('');
                }}
                className="text-blue-600 font-bold hover:underline text-xs sm:text-sm cursor-pointer"
              >
                ← Volver a Iniciar Sesión
              </button>
            ) : (
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'} <br />
                <button 
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                  }} 
                  className="text-blue-600 font-bold hover:underline mt-1.5 cursor-pointer"
                >
                  {isRegistering ? 'Inicia sesión aquí' : 'Regístrate gratis'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
