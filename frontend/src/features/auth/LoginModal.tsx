import React, { useState } from 'react';
import api, { setAuthToken } from '../../lib/http';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          
          <div className="mt-6 flex justify-center gap-4">
             <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">
                Sugerencia: usa admin123 para el seed
             </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; backdrop-filter: blur(0); } to { opacity: 1; backdrop-filter: blur(12px); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />
    </div>
  );
};

export default LoginModal;
