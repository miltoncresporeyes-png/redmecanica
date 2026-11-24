import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import api, { setAuthToken } from '../lib/http';
import { useAuth } from '../app/providers';
import SEO from '../components/SEO';

const ResetPassword: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  // El token se guarda en memoria y se quita de la URL enseguida: asi no queda en el historial ni viaja en Referer.
  const tokenRef = useRef<string>(params.get('token') || '');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (params.get('token')) navigate('/restablecer', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rules = [
    { ok: password.length >= 8, text: 'Al menos 8 caracteres' },
    { ok: /[A-Za-z]/.test(password) && /\d/.test(password), text: 'Letras y números' },
    { ok: repeat.length > 0 && password === repeat, text: 'Las dos contraseñas coinciden' },
  ];
  const valid = rules.every((r) => r.ok);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/reset-password', { token: tokenRef.current, password });
      setAuthToken(data.token);
      updateUser(data.user);
      setDone(true);
      const role = data.user?.role;
      setTimeout(() => {
        navigate(role === 'MECHANIC' || role === 'WORKSHOP' || role === 'TOWING' ? '/provider-dashboard' : role === 'ADMIN' || role === 'SUPER_ADMIN' ? '/admin' : '/profile', { replace: true });
      }, 1800);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const noToken = !tokenRef.current;

  return (
    <div className="max-w-md mx-auto py-10 sm:py-16 px-4">
      <SEO title="Restablecer contraseña | RedMecánica" description="Elige una nueva contraseña para tu cuenta de RedMecánica." canonicalUrl="https://redmecanica.cl/restablecer" noIndex />
      <div className="bg-white rounded-card border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="w-12 h-12 rounded-control bg-blue-50 text-primary flex items-center justify-center mb-4" aria-hidden="true">
          <KeyRound className="w-6 h-6" />
        </div>

        {done ? (
          <div role="status">
            <h1 className="text-slate-900 mb-2">¡Contraseña actualizada!</h1>
            <p className="text-sm text-slate-600">Ya iniciaste sesión. Te estamos llevando a tu cuenta…</p>
          </div>
        ) : noToken ? (
          <div>
            <h1 className="text-slate-900 mb-2">Enlace no válido</h1>
            <p className="text-sm text-slate-600 mb-5">
              Este enlace no es válido o ya fue usado. Solicita uno nuevo desde “¿Olvidaste tu contraseña?” al iniciar sesión.
            </p>
            <Link to="/" className="btn-primary">Ir al inicio</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <h1 className="text-slate-900 mb-1">Elige tu nueva contraseña</h1>
              <p className="text-sm text-slate-600">Usa una contraseña que no hayas usado en otros sitios.</p>
            </div>

            <div>
              <label htmlFor="rp-new" className="block text-sm font-semibold text-slate-700 mb-1">Nueva contraseña</label>
              <div className="relative">
                <input
                  id="rp-new"
                  type={show ? 'text' : 'password'}
                  autoComplete="new-password"
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-market pr-12"
                />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-slate-800 min-h-[40px] min-w-[40px] flex items-center justify-center">
                  {show ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="rp-repeat" className="block text-sm font-semibold text-slate-700 mb-1">Repetir contraseña</label>
              <input
                id="rp-repeat"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="input-market"
              />
            </div>

            <ul className="space-y-1" aria-label="Requisitos de la contraseña">
              {rules.map((r) => (
                <li key={r.text} className={`text-sm flex items-center gap-2 ${r.ok ? 'text-emerald-700' : 'text-slate-500'}`}>
                  <span aria-hidden="true" className={`inline-block w-2 h-2 rounded-full ${r.ok ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  {r.text}
                </li>
              ))}
            </ul>

            {error && (
              <div role="alert" className="text-sm font-medium text-red-700 bg-red-50 border border-red-100 rounded-control p-3">
                {error}{' '}
                <span className="block text-red-600 mt-1">Puedes pedir un enlace nuevo desde “¿Olvidaste tu contraseña?”.</span>
              </div>
            )}

            <button type="submit" disabled={!valid || loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
