import React, { useState, useEffect } from 'react';
import api, { setAuthToken } from '../../lib/http';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setError(err.response?.data?.error || 'Error al solicitar recuperación. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      setAuthToken(data.token);
      onLoginSuccess(data.user);
      onClose();
      // Reset form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setIsRegistering(false);

    } catch (err: any) {
        // Handle axios error
        const errorMessage = err.response?.data?.error || `Error al ${isRegistering ? 'registrar' : 'iniciar sesión'}`;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[200] p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100 max-h-[92dvh] sm:max-h-[90dvh] flex flex-col my-auto">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10 opacity-10 blur-2xl pointer-events-none"></div>
        
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 min-h-0">
          {/* Selector de Portal (Separación Principal) */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-5 sm:mb-6 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                setRole('client');
                setError('');
              }}
              className={`flex-1 py-2 sm:py-2.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-1.5 leading-tight cursor-pointer ${
                role === 'client' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-sm sm:text-base">👤</span>
              Usuario
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('provider');
                setError('');
              }}
              className={`flex-1 py-2 sm:py-2.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-1.5 leading-tight cursor-pointer ${
                role === 'provider' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-sm sm:text-base">🔧</span>
              Portal Prestadores
            </button>
          </div>

          <div className="flex justify-between items-start mb-5 sm:mb-6 gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight truncate">
                {isForgotPassword 
                  ? 'Recuperar Cuenta' 
                  : (isRegistering ? 'Crear Cuenta' : 'Bienvenido')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium break-words mt-0.5">
                {isForgotPassword
                  ? 'Ingresa tu correo y te enviaremos un enlace de recuperación'
                  : (role === 'provider' 
                      ? (isRegistering ? 'Regístrate como Taller / Mecánico' : 'Ingresa a tu cuenta de Prestador')
                      : (isRegistering ? 'Únete como Usuario' : 'Ingresa a tu cuenta de Usuario')
                    )
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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            {isRegistering && !isForgotPassword && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">👤</span>
                  <input 
                    type="text"
                    required={isRegistering}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                    placeholder="Juan Pérez"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">📧</span>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            {!isForgotPassword && (
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
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-700"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {isRegistering && !isForgotPassword && (
              <div className="space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Repetir Contraseña</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">🔒</span>
                  <input 
                    type="password"
                    required={isRegistering}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-medium text-slate-700 ${
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
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake break-words">
                <span>⚠️</span> {error}
              </div>
            )}

            {forgotSuccess && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-fadeIn break-words">
                <span className="text-lg">✅</span> {forgotSuccess}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3.5 sm:py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
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
                isForgotPassword 
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
