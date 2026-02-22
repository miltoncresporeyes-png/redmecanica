
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers';
import LoginModal from '../features/auth/LoginModal';
import { SkipToContent } from './common/Accessibility';

const Header: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleAccountClick = () => {
    if (user) {
      if (user.role === 'MECHANIC' || user.role === 'WORKSHOP' || user.role === 'TOWING') {
        navigate('/provider-dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <SkipToContent />
      <header className="bg-white shadow-md" role="banner">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center" aria-label="Navegación principal">
          <Link 
            to="/" 
            className="flex items-center space-x-2 cursor-pointer"
            aria-label="RedMecánica - Inicio"
          >
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 0a2 2 0 100-4m0 4a2 2 0 110-4M6 12a2 2 0 100-4m0 4a2 2 0 110-4m12 0a2 2 0 100-4m0 4a2 2 0 110-4M12 18v-2m0 2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6a2 2 0 100-4m0 4a2 2 0 110-4"></path></svg>
            <h1 className="text-2xl font-bold text-gray-800">
              Red<span className="text-blue-600">Mecánica</span>
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <Link 
                  to="/admin"
                  className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  🛡️ Admin
                </Link>
              )}
              <Link 
                  to="/about"
                  className="hidden md:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                  Quiénes somos
              </Link>
              <Link 
                  to="/how-it-works"
                  className="hidden md:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                  ¿Cómo funciona?
              </Link>
              <Link 
                  to="/pricing"
                  className="hidden md:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                  Planes y precios
              </Link>
              <Link 
                  to="/onboarding"
                  className="hidden lg:inline-block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                  Registra tu negocio
              </Link>

              <div className="flex items-center gap-2">
                <button 
                onClick={handleAccountClick}
                className={`hidden md:inline-block px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  user 
                    ? 'text-blue-700 bg-blue-50 border border-blue-100 font-bold' 
                    : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
                }`}>
                  {user ? `👋 Hola, ${user.name.split(' ')[0]}` : 'Mi Cuenta'}
                </button>
                
                {user && (
                  <button 
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Cerrar Sesión"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  </button>
                )}
              </div>
          </div>
        </nav>
      </header>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={(u) => {
            updateUser(u);
            setIsLoginModalOpen(false);
        }}
      />
    </>
  );
};

export default Header;
