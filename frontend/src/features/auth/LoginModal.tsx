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
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(defaultMode === 'register');
  const [role, setRole] = useState<'client' | 'provider'>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resetear estado cuando se abre el modal con nuevos defaults
  useEffect(() => {
    if (isOpen) {
      setIsRegistering(defaultMode === 'register');
      setRole(defaultRole);
      setError('');
      setEmail('');
      setPassword('');
      setName('');
    }
  }, [isOpen, defaultMode, defaultRole]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  
    const handleSocialLogin = (provider: string) => {
      setLoading(true);
      setError('');
      
      // Simular tiempo de redirección y validación OAuth
      setTimeout(() => {
        const mockUser = {
          id: `oauth-${provider.toLowerCase()}-123`,
          name: `Usuario de ${provider}`,
          email: `usuario@${provider.toLowerCase()}.com`,
          role: role,
          avatar: provider === 'Google' ? 'https://ui-avatars.com/api/?name=G&background=4285F4&color=fff' : 'https://ui-avatars.com/api/?name=M&background=00a4ef&color=fff'
        };
        
        // Simular token de sesión
        setAuthToken(`mock-${provider.toLowerCase()}-jwt-token`);
        onLoginSuccess(mockUser);
        onClose();
        setLoading(false);
      }, 1500);
    };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10 opacity-10 blur-3xl"></div>
        
        <div className="p-8">
          {/* Selector de Portal (Separación Principal) */}
          <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-8 animate-fadeIn">
            <button
              type="button"
              onClick={() => {
                setRole('client');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                role === 'client' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-lg">👤</span>
              Usuario
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('provider');
                setError('');
              }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                role === 'provider' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-lg">🔧</span>
              Portal Prestadores
            </button>
          </div>

          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                {isRegistering ? 'Crear Cuenta' : 'Bienvenido'}
              </h2>
              <p className="text-slate-500 font-medium">
                {role === 'provider' 
                  ? (isRegistering ? 'Regístrate como Cliente (Taller/Mecánico)' : 'Ingresa a tu cuenta de Prestador')
                  : (isRegistering ? 'Únete como Usuario' : 'Ingresa a tu cuenta de Usuario')
                }
              </p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-100"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {isRegistering && (
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
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

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                <span>⚠️</span> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                isRegistering && role === 'provider' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-200' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-200'
              }`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'
              )}
            </button>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">O ingresa con</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:shadow-sm transition-all font-bold text-slate-600 disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button 
                type="button"
                onClick={() => handleSocialLogin('Microsoft')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:shadow-sm transition-all font-bold text-slate-600 disabled:opacity-50"
              >
                <svg viewBox="0 0 21 21" className="w-5 h-5">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                </svg>
                Microsoft
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'} <br />
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }} 
                className="text-blue-600 font-bold hover:underline mt-2"
              >
                {isRegistering ? 'Inicia sesión aquí' : 'Regístrate gratis'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
