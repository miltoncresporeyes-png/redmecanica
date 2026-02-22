import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const popularLinks = [
    { path: '/solicitar', label: 'Solicitar Servicio', icon: '🔧' },
    { path: '/search', label: 'Buscar Mecánicos', icon: '🔍' },
    { path: '/triage', label: 'Diagnóstico', icon: '🚗' },
    { path: '/faq', label: 'Preguntas Frecuentes', icon: '❓' },
  ];

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SEO
        title="Página No Encontrada | 404"
        description="Lo sentimos, la página que buscas no existe. Encuentra servicios mecánicos a domicilio en RedMecánica."
        noIndex={true}
      />
      
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-9xl font-black text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-bounce">🔧</span>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¡Vaya! Página no encontrada
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Parece que esta página se ha ido a revisar un motor. 
            Pero no te preocupes, ¡podemos ayudarte a encontrar lo que buscas!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al inicio
            </Link>
            
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Página anterior
            </button>
          </div>

          {/* Popular Links */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Qué estabas buscando?
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popularLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {link.icon}
                  </span>
                  <span className="font-medium text-gray-700 group-hover:text-blue-600">
                    {link.label}
                  </span>
                  <svg 
                    className="w-5 h-5 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-8 text-sm text-gray-500">
            ¿Crees que esto es un error? {' '}
            <Link to="/contact" className="text-blue-600 hover:underline font-medium">
              Contáctanos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
