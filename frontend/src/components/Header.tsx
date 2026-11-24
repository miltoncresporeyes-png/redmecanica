
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../app/providers';
import LoginModal from '../features/auth/LoginModal';
import { SkipToContent } from './common/Accessibility';

const NAV_LINKS = [
  { to: '/unete', label: 'Publica tu negocio' },
  { to: '/how-it-works', label: '¿Cómo funciona?' },
  { to: '/pricing', label: 'Precios' },
];

const NAV_LINK_CLASS =
  'px-3 py-2 text-sm font-semibold text-slate-600 hover:text-primary hover:bg-blue-50 rounded-control transition-colors';

const LogoMark: React.FC<{ className?: string }> = ({ className }) => (
  <span className={`${className ?? ''} inline-flex items-center justify-center rounded-control bg-primary text-primary-foreground shrink-0`} aria-hidden="true">
    <svg className="w-[60%] h-[60%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  </span>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Header: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <SkipToContent />
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200" role="banner">
        <nav className="container mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-6" aria-label="Navegación principal">
          <Link
            to="/"
            className="flex items-center gap-2.5 touch-target shrink-0"
            aria-label="RedMecánica - Inicio"
          >
            <LogoMark className="w-9 h-9" />
            <span className="text-xl font-heading font-extrabold text-slate-900 tracking-tight">
              Red<span className="text-primary">Mecánica</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={NAV_LINK_CLASS}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="btn-dark !min-h-[40px] !py-2">
                Admin
              </Link>
            )}
            <Link to="/search" className="btn-cta !min-h-[40px] !py-2">
              <SearchIcon className="w-4 h-4" />
              Buscar mecánico
            </Link>
            <button
              onClick={handleAccountClick}
              className="btn-ghost !min-h-[40px] !py-2"
            >
              {user ? `Hola, ${user.name?.split(' ')[0] || 'Usuario'}` : 'Ingresar'}
            </button>
            {user && (
              <button
                onClick={() => { logout(); closeMobileMenu(); }}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-control transition-colors touch-target"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden touch-target p-2 text-slate-600 hover:text-primary hover:bg-blue-50 rounded-control transition-colors"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-[290px] max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col justify-between ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!isMobileMenuOpen}
          inert={!isMobileMenuOpen}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-2">
              <LogoMark className="w-8 h-8" />
              <span className="text-lg font-heading font-extrabold text-slate-900">Red<span className="text-primary">Mecánica</span></span>
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2 touch-target text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-control transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="px-4 py-4 space-y-1 overflow-y-auto">
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-purple-700 bg-purple-50 rounded-control hover:bg-purple-100 transition-colors"
              >
                Admin
              </Link>
            )}
            <Link
              to="/search"
              onClick={closeMobileMenu}
              className="btn-cta w-full justify-start gap-3 px-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Buscar mecánico gratis
            </Link>
            <Link
              to="/unete"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-control transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              Publica tu negocio
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-control transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Quiénes somos
            </Link>
            <Link
              to="/how-it-works"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-control transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              ¿Cómo funciona?
            </Link>
            <Link
              to="/pricing"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-control transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Precios prestadores
            </Link>

            {/* Divider */}
            <div className="border-t border-slate-100 my-3" />

            {/* Account Section */}
            <button
              onClick={handleAccountClick}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-control transition-colors ${
                user
                  ? 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
            >
              {user ? (
                <>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span>Mi Cuenta</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
                  <span>Iniciar Sesión</span>
                </>
              )}
            </button>

            {user && (
              <button
                onClick={() => { logout(); closeMobileMenu(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-control transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(u) => {
            updateUser(u);
            setIsLoginModalOpen(false);
            closeMobileMenu();
            if (u.role === 'MECHANIC' || u.role === 'WORKSHOP' || u.role === 'TOWING') {
              navigate('/provider-dashboard');
            } else if (u.role === 'ADMIN') {
              navigate('/admin');
            } else {
              navigate('/profile');
            }
        }}
      />
    </>
  );
};

export default Header;
