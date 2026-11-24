import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../lib/http';
import { readCache, writeCache, clearAllCaches } from '../lib/cache';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Con sesion guardada se arranca con el ultimo usuario conocido: las rutas protegidas (panel, perfil) se muestran de
  // inmediato en vez de esperar la verificacion con el servidor (~1 s), que se hace en segundo plano.
  const cachedUser = typeof window !== 'undefined' && localStorage.getItem('auth_token') ? readCache<User>('user') : null;
  const [user, setUserState] = useState<User | null>(cachedUser);
  const [isLoading, setIsLoading] = useState(!cachedUser);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) writeCache('user', u);
    else clearAllCaches();
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setAuthToken(null);
      // Optional: Redirect or show notification
    };

    window.addEventListener('session-expired', handleSessionExpired);
    checkAuth();

    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch (error: any) {
      // Token invalido o expirado: se cierra la sesion. Un fallo de red NO la cierra (se conserva lo que ya se ve).
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const register = async (dto: any) => {
    const { data } = await api.post('/auth/register', dto);
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setAuthToken(null);
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser: setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
