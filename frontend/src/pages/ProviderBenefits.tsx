import React from 'react';

interface ProviderBenefitsProps {
  onClose: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToOnboarding?: () => void;
}

const ProviderBenefits: React.FC<ProviderBenefitsProps> = ({ 
  onClose, 
  onNavigateToPricing,
  onNavigateToOnboarding 
}) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Beneficios para Prestadores</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Haz crecer tu negocio con RedMecánica</h2>
        <p className="text-lg opacity-90 mb-6">
          Únete a la red de profesionales automotrices más grande de Chile y accede a 
          miles de clientes que necesitan tus servicios
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={onNavigateToOnboarding}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Registrarse Ahora
          </button>
          <button
            onClick={onNavigateToPricing}
            className="bg-purple-800 bg-opacity-50 text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-70 transition-colors border border-white"
          >
            Ver Planes y Precios
          </button>
        </div>
      </div>

      {/* Beneficios Principales */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">¿Por qué elegir RedMecánica?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💼</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Más Clientes</h3>
            <p className="text-gray-600">
              Accede a una base de datos de miles de conductores que buscan servicios como 
              el tuyo. Aumenta tus ventas hasta un 300% en los primeros 6 meses.
            </p>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verificación de Confianza</h3>
            <p className="text-gray-600">
              Nuestro sistema de verificación riguroso te diferencia de la competencia. 
              Los clientes confían en Prestadores verificados.
            </p>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">💳</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pagos Seguros</h3>
            <p className="text-gray-600">
              Sistema de pago con escrow que protege tu dinero. Recibe el pago completo 
              una vez que el cliente confirme la satisfacción del servicio.
            </p>
          </div>

          <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión Digital</h3>
            <p className="text-gray-600">
              Administra todos tus servicios desde una sola app: cotizaciones, agenda, 
              historial, pagos y comunicación con clientes.
            </p>
          </div>

          <div className="bg-white border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics Avanzados</h3>
            <p className="text-gray-600">
              Estadísticas detalladas de tu negocio: servicios completados, ingresos, 
              calificaciones, áreas de mejora y mucho más.
            </p>
          </div>

          <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Capacitación Continua</h3>
            <p className="text-gray-600">
              Acceso a webinars, cursos online y recursos educativos para mejorar tus 
              habilidades técnicas y de atención al cliente.
            </p>
          </div>
        </div>
      </div>

      {/* Beneficios por Plan */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Beneficios según tu Plan</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Básico */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🚀</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plan Básico (Gratuito)</h3>
                <p className="text-sm text-gray-600">Perfecto para empezar</p>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Perfil básico en la plataforma</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">10 cotizaciones al mes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Zona geográfica local</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Soporte por email</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-blue-300">
              <p className="text-sm text-gray-700">
                <strong>Comisión:</strong> 15% por servicio completado
              </p>
            </div>
          </div>

          {/* Plan Profesional */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-400 rounded-lg p-6 relative">
            <div className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
              MÁS POPULAR
            </div>
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">⭐</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plan Profesional</h3>
                <p className="text-sm text-gray-600">$14.900/mes</p>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm"><strong>Cotizaciones ilimitadas</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Badge "Verificado" destacado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Posicionamiento prioritario en búsquedas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Cobertura regional ampliada</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Estadísticas detalladas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Soporte por WhatsApp</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Certificados digitales para clientes</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-purple-300">
              <p className="text-sm text-gray-700">
                <strong>Comisión:</strong> Solo 10% por servicio
              </p>
            </div>
          </div>

          {/* Plan Premium */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">👑</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plan Premium</h3>
                <p className="text-sm text-gray-600">$29.900/mes</p>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Todo lo del Plan Profesional, más:</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm"><strong>Badge "Premium Elite"</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Destacado en primera posición</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Cobertura nacional</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Multi-usuario (hasta 5 cuentas)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Campañas promocionales incluidas</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Gestor de cuenta dedicado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">API para integración con tu sistema</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-yellow-300">
              <p className="text-sm text-gray-700">
                <strong>Comisión:</strong> Solo 7% por servicio
              </p>
            </div>
          </div>

          {/* Plan Empresarial */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">🏢</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plan Empresarial</h3>
                <p className="text-sm text-gray-600">Personalizado</p>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Todo lo del Plan Premium, más:</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Contrato personalizado a medida</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">SLA garantizado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Integración completa con ERP</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Usuarios ilimitados</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Dashboard corporativo</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Soporte 24/7 dedicado</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-sm">Asesor comercial exclusivo</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-green-300">
              <p className="text-sm text-gray-700">
                <strong>Comisión:</strong> Desde 5% (negociable)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficios Adicionales */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Beneficios Adicionales para Todos los Prestadores
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎁</div>
            <h4 className="font-bold text-gray-900 mb-1">Sin Permanencia</h4>
            <p className="text-sm text-gray-600">
              Cancela cuando quieras sin penalizaciones (planes mensuales)
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💰</div>
            <h4 className="font-bold text-gray-900 mb-1">Ahorro Anual</h4>
            <p className="text-sm text-gray-600">
              17% de descuento al pagar anualmente
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🎓</div>
            <h4 className="font-bold text-gray-900 mb-1">Capacitaciones</h4>
            <p className="text-sm text-gray-600">
              Webinars mensuales y cursos gratuitos
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🤝</div>
            <h4 className="font-bold text-gray-900 mb-1">Red de Contactos</h4>
            <p className="text-sm text-gray-600">
              Conéctate con otros profesionales del rubro
            </p>
          </div>
        </div>
      </div>

      {/* Primeros prestadores: sin historias inventadas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Sé de los primeros en tu comuna</h2>
        <p className="text-gray-600 mb-6 max-w-3xl text-sm sm:text-base">
          Estamos poblando el directorio con prestadores reales verificados. Sin testimonios inventados:
          las primeras historias de crecimiento se publicarán aquí con negocios reales, cuando completen
          sus primeros servicios a través de la plataforma.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '📍', title: 'Posiciónate primero', desc: 'Las primeras vitrinas verificadas de cada comuna aparecen al tope del directorio.' },
            { icon: '⭐', title: 'Construye reputación real', desc: 'Cada servicio completado suma a tu calificación. Nada simulado.' },
            { icon: '💬', title: 'Recibe contacto directo', desc: 'WhatsApp y teléfono visibles. El conductor te escribe a ti, sin intermediarios.' },
          ].map((c) => (
            <div key={c.title} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-4xl mb-3" aria-hidden>{c.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-sm text-gray-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-3">¿Listo para hacer crecer tu negocio?</h2>
        <p className="text-lg mb-6 opacity-90">
          Únete a RedMecánica hoy y empieza a recibir nuevos clientes desde el primer día
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={onNavigateToOnboarding}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Comenzar Ahora Gratis
          </button>
          <button
            onClick={onNavigateToPricing}
            className="bg-purple-800 bg-opacity-50 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-70 transition-colors border-2 border-white"
          >
            Ver Todos los Planes
          </button>
        </div>
        <p className="text-sm mt-4 opacity-75">
          Sin tarjeta de crédito requerida • Cancela cuando quieras • Soporte 24/7
        </p>
      </div>
    </div>
  );
};

export default ProviderBenefits;
