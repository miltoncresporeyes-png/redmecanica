import React, { useState } from 'react';

interface HelpCenterProps {
  onClose: () => void;
}

interface HelpArticle {
  title: string;
  content: string;
  category: string;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Primeros Pasos', icon: '🚀' },
    { id: 'account', name: 'Mi Cuenta', icon: '👤' },
    { id: 'services', name: 'Gestión de Servicios', icon: '🔧' },
    { id: 'payments', name: 'Pagos y Facturación', icon: '💳' },
    { id: 'quality', name: 'Calidad y Calificaciones', icon: '⭐' },
    { id: 'technical', name: 'Soporte Técnico', icon: '🛠️' }
  ];

  const articles: HelpArticle[] = [
    // Getting Started
    {
      category: 'getting-started',
      title: '¿Cómo me registro como prestador?',
      content: `
        <h3>Proceso de Registro</h3>
        <ol>
          <li><strong>Haz clic en "Trabaja con nosotros"</strong> en el header de la plataforma</li>
          <li><strong>Completa el formulario de 4 pasos:</strong>
            <ul>
              <li>Información básica (nombre, RUT, teléfono, email)</li>
              <li>Tipo de servicio que ofreces</li>
              <li>Documentación legal (RUT, patente municipal, seguros)</li>
              <li>Verificación de identidad y certificaciones</li>
            </ul>
          </li>
          <li><strong>Espera la verificación:</strong> Revisaremos tu documentación en 24-48 horas</li>
          <li><strong>Activa tu plan:</strong> Elige entre Plan Básico (gratis) o planes de pago</li>
          <li><strong>¡Comienza a recibir solicitudes!</strong></li>
        </ol>
        
        <h3>Documentos Requeridos</h3>
        <ul>
          <li>✓ Cédula de identidad vigente</li>
          <li>✓ Certificado de RUT (SII)</li>
          <li>✓ Patente municipal al día</li>
          <li>✓ Seguro de responsabilidad civil (recomendado)</li>
          <li>✓ Certificaciones técnicas (si aplica)</li>
        </ul>
      `
    },
    {
      category: 'getting-started',
      title: '¿Cuánto tiempo tarda la verificación?',
      content: `
        <h3>Tiempos de Verificación</h3>
        <p>El proceso completo toma entre <strong>24 a 48 horas hábiles</strong>, dependiendo de:</p>
        <ul>
          <li>Completitud de la documentación</li>
          <li>Claridad de las fotos/escaneos</li>
          <li>Verificación de antecedentes</li>
          <li>Validación de certificaciones</li>
        </ul>
        
        <h3>Acelerarlo</h3>
        <p>Puedes acelerar el proceso asegurándote de:</p>
        <ul>
          <li>Subir documentos legibles en alta calidad</li>
          <li>Completar TODOS los campos obligatorios</li>
          <li>Tener documentación vigente y al día</li>
          <li>Responder rápidamente si te solicitamos información adicional</li>
        </ul>
        
        <h3>Estados del Proceso</h3>
        <ol>
          <li><strong>En Revisión:</strong> Estamos verificando tu documentación</li>
          <li><strong>Información Adicional Requerida:</strong> Te contactaremos por email</li>
          <li><strong>Aprobado:</strong> ¡Ya puedes activar tu plan y comenzar!</li>
          <li><strong>Rechazado:</strong> Te explicaremos las razones y cómo corregirlo</li>
        </ol>
      `
    },
    {
      category: 'getting-started',
      title: '¿Qué plan debo elegir?',
      content: `
        <h3>Comparación de Planes</h3>
        
        <h4>Plan Básico (Gratuito)</h4>
        <p><strong>Ideal para:</strong> Probar la plataforma, Prestadores part-time</p>
        <ul>
          <li>✓ Sin costo mensual</li>
          <li>✓ Comisión 15% por servicio</li>
          <li>✓ Hasta 10 cotizaciones/mes</li>
          <li>✗ Solo zona local</li>
        </ul>
        
        <h4>Plan Profesional ($29.900/mes)</h4>
        <p><strong>Ideal para:</strong> Prestadores independientes full-time</p>
        <ul>
          <li>✓ Cotizaciones ilimitadas</li>
          <li>✓ Comisión reducida al 10%</li>
          <li>✓ Badge "Verificado"</li>
          <li>✓ Posicionamiento prioritario</li>
          <li>✓ Cobertura regional</li>
        </ul>
        
        <h4>Plan Premium ($59.900/mes)</h4>
        <p><strong>Ideal para:</strong> Talleres y empresas establecidas</p>
        <ul>
          <li>✓ Todo lo del Profesional, más:</li>
          <li>✓ Comisión ultra-reducida al 7%</li>
          <li>✓ Badge "Premium Elite"</li>
          <li>✓ Destacado en búsquedas</li>
          <li>✓ Multi-usuario (5 cuentas)</li>
          <li>✓ Gestor de cuenta dedicado</li>
        </ul>
        
        <h3>Recomendación</h3>
        <p>Si recién comienzas: <strong>Plan Básico</strong> para probar sin riesgo.</p>
        <p>Si eres profesional serio: <strong>Plan Profesional</strong> para maximizar ingresos.</p>
        <p>Si tienes un taller establecido: <strong>Plan Premium</strong> para escalar rápidamente.</p>
      `
    },

    // Account
    {
      category: 'account',
      title: '¿Cómo actualizo mi información de perfil?',
      content: `
        <h3>Actualizar Perfil</h3>
        <ol>
          <li>Inicia sesión en tu cuenta de prestador</li>
          <li>Ve al Dashboard y haz clic en "Mi Perfil"</li>
          <li>Haz clic en "Editar Información"</li>
          <li>Modifica los campos que necesites</li>
          <li>Haz clic en "Guardar Cambios"</li>
        </ol>
        
        <h3>Información Editable</h3>
        <ul>
          <li>✓ Descripción de tu negocio</li>
          <li>✓ Zona de cobertura</li>
          <li>✓ Horario de atención</li>
          <li>✓ Foto de perfil y del negocio</li>
          <li>✓ Especialidades y servicios ofrecidos</li>
          <li>✓ Teléfono y email de contacto</li>
        </ul>
        
        <h3>Información NO Editable</h3>
        <p>Algunos datos requieren <strong>verificación por soporte:</strong></p>
        <ul>
          <li>RUT</li>
          <li>Patente municipal</li>
          <li>Certificaciones profesionales</li>
        </ul>
        <p>Para cambiar estos datos, contacta a soporte en contacto@redmecanica.cl</p>
      `
    },
    {
      category: 'account',
      title: '¿Cómo cambio mi plan de suscripción?',
      content: `
        <h3>Cambiar de Plan</h3>
        
        <h4>Upgrade (subir de plan)</h4>
        <ol>
          <li>Ve a "Mi Cuenta" → "Suscripción"</li>
          <li>Haz clic en "Cambiar Plan"</li>
          <li>Selecciona el nuevo plan</li>
          <li>Confirma el pago</li>
          <li>El cambio es <strong>inmediato</strong></li>
        </ol>
        
        <h4>Downgrade (bajar de plan)</h4>
        <ol>
          <li>Ve a "Mi Cuenta" → "Suscripción"</li>
          <li>Haz clic en "Cambiar Plan"</li>
          <li>Selecciona el plan inferior</li>
          <li>El cambio toma efecto al <strong>finalizar el período actual</strong></li>
        </ol>
        
        <h4>Cancelar Suscripción</h4>
        <p>Planes mensuales sin permanencia:</p>
        <ul>
          <li>Cancela en cualquier momento</li>
          <li>Sin penalizaciones</li>
          <li>Acceso hasta el fin del período pagado</li>
        </ul>
        
        <p>Planes anuales:</p>
        <ul>
          <li>No reembolsables</li>
          <li>Puedes cancelar pero seguirás con acceso hasta fin de año</li>
        </ul>
      `
    },

    // Services
    {
      category: 'services',
      title: '¿Cómo respondo a una solicitud de servicio?',
      content: `
        <h3>Responder Solicitudes</h3>
        
        <h4>Paso 1: Recibir Notificación</h4>
        <p>Recibirás alertas por:</p>
        <ul>
          <li>✓ Push notification en la app</li>
          <li>✓ Email</li>
          <li>✓ SMS (emergencias)</li>
        </ul>
        
        <h4>Paso 2: Revisar Solicitud</h4>
        <ul>
          <li>Lee el problema descrito</li>
          <li>Revisa fotos si las hay</li>
          <li>Verifica la ubicación del servicio</li>
          <li>Comprueba tu disponibilidad</li>
        </ul>
        
        <h4>Paso 3: Enviar Cotización</h4>
        <ol>
          <li>Haz clic en "Cotizar"</li>
          <li>Completa:
            <ul>
              <li>Diagnóstico preliminar</li>
              <li>Desglose de costos (mano de obra + repuestos)</li>
              <li>Tiempo estimado</li>
              <li>Garantía ofrecida</li>
              <li>Forma de pago aceptada</li>
            </ul>
          </li>
          <li>Revisa y envía</li>
        </ol>
        
        <h3>Tiempos Máximos</h3>
        <ul>
          <li>Servicios normales: <strong>30 minutos</strong></li>
          <li>Urgentes: <strong>15 minutos</strong></li>
          <li>Emergencias: <strong>5 minutos</strong></li>
        </ul>
        <p><strong>Consejo:</strong> Respuestas rápidas mejoran tu Trust Score</p>
      `
    },
    {
      category: 'services',
      title: '¿Qué hago si el trabajo necesita más tiempo del estimado?',
      content: `
        <h3>Extensiones de Tiempo</h3>
        
        <h4>Si el aumento es menor al 50%:</h4>
        <ol>
          <li>Notifica al cliente dentro de la app</li>
          <li>Explica la razón del retraso</li>
          <li>Proporciona nuevo tiempo estimado</li>
          <li>Cliente debe aprobar la extensión</li>
        </ol>
        
        <h4>Si el aumento es mayor al 50%:</h4>
        <ol>
          <li>Detén el trabajo temporalmente</li>
          <li>Contacta al cliente inmediatamente</li>
          <li>Explica en detalle el problema encontrado</li>
          <li>Ofrece opciones:
            <ul>
              <li>Continuar con extensión de tiempo</li>
              <li>Hacer solo lo cotizado originalmente</li>
              <li>Cancelar el servicio</li>
            </ul>
          </li>
        </ol>
        
        <h3>Cobros Adicionales por Tiempo</h3>
        <p><strong>NO puedes cobrar más</strong> si el retraso es por:</p>
        <ul>
          <li>Mala estimación inicial</li>
          <li>Falta de herramientas adecuadas</li>
          <li>Errores propios</li>
        </ul>
        
        <p><strong>SÍ puedes renegociar</strong> si encuentras:</p>
        <ul>
          <li>Problemas adicionales no descritos originalmente</li>
          <li>Daños ocultos descubiertos durante el servicio</li>
          <li>Necesidad de repuestos no cotizados</li>
        </ul>
        
        <h3>Best Practices</h3>
        <ul>
          <li>Siempre estima con 20% de margen</li>
          <li>Comunica temprano, no cuando ya pasó el tiempo</li>
          <li>Documenta con fotos los hallazgos nuevos</li>
          <li>Mantén al cliente informado cada 30 minutos</li>
        </ul>
      `
    },

    // Payments
    {
      category: 'payments',
      title: '¿Cuándo recibo el pago de un servicio?',
      content: `
        <h3>Flujo de Pago</h3>
        
        <h4>Sistema de Escrow (Pago Retenido)</h4>
        <ol>
          <li><strong>Cliente acepta cotización:</strong> Paga el monto total</li>
          <li><strong>Dinero queda retenido:</strong> En cuenta escrow de RedMecánica</li>
          <li><strong>Tú realizas el servicio:</strong> Ves "Pago confirmado - Retenido"</li>
          <li><strong>Cliente valida entrega:</strong> Confirma satisfacción en la app</li>
          <li><strong>Pago liberado:</strong> Recibes el monto menos la comisión</li>
        </ol>
        
        <h3>Tiempos de Liberación</h3>
        <ul>
          <li><strong>Con validación inmediata:</strong> 24-48 horas hábiles</li>
          <li><strong>Sin validación del cliente:</strong> Automático después de 7 días</li>
          <li><strong>Con disputa:</strong> Se retiene hasta resolución</li>
        </ul>
        
        <h3>Métodos de Retiro</h3>
        <p>Puedes recibir tu dinero por:</p>
        <ul>
          <li>✓ Transferencia bancaria (gratis)</li>
          <li>✓ Cuenta RUT (gratis)</li>
          <li>✓ MercadoPago (comisión adicional)</li>
        </ul>
        
        <h3>Calendario de Pagos</h3>
        <ul>
          <li>Lunes a Viernes: Transferencias procesadas en el día</li>
          <li>Sábado/Domingo: Se procesan el lunes siguiente</li>
          <li>Feriados: Se procesan el día hábil siguiente</li>
        </ul>
      `
    },
    {
      category: 'payments',
      title: '¿Cómo funciona la facturación?',
      content: `
        <h3>Facturación de Servicios</h3>
        
        <h4>Tú emites factura al cliente:</h4>
        <ul>
          <li>Por el servicio prestado</li>
          <li>Con tu RUT de prestador</li>
          <li>Por el monto total del servicio</li>
          <li>Puedes usar facturación electrónica del SII</li>
        </ul>
        
        <h4>RedMecánica emite boleta a ti:</h4>
        <ul>
          <li>Por la comisión de uso de plataforma</li>
          <li>Mensualmente para suscripciones</li>
          <li>Por cada servicio completado (comisión variable)</li>
        </ul>
        
        <h3>Documentos Disponibles</h3>
        <p>Desde tu dashboard puedes descargar:</p>
        <ul>
          <li>✓ Resumen mensual de servicios</li>
          <li>✓ Detalle de comisiones cobradas</li>
          <li>✓ Boletas de RedMecánica</li>
          <li>✓ Certificado anual para declaración de impuestos</li>
        </ul>
        
        <h3>Consejo Tributario</h3>
        <p>Guarda registro de:</p>
        <ul>
          <li>Todas tus facturas emitidas</li>
          <li>Comprobantes de pago de RedMecánica</li>
          <li>Gastos operacionales (combustible, herramientas)</li>
          <li>Puedes deducir la comisión como gasto del negocio</li>
        </ul>
      `
    },

    // Quality
    {
      category: 'quality',
      title: '¿Cómo mejoro mi calificación?',
      content: `
        <h3>Factores que Afectan tu Rating</h3>
        
        <h4>1. Calidad del Trabajo (peso 40%)</h4>
        <ul>
          <li>Resuelve el problema completamente</li>
          <li>Usa repuestos de calidad</li>
          <li>Limpieza después del trabajo</li>
          <li>Prueba que todo funcione antes de irte</li>
        </ul>
        
        <h4>2. Profesionalismo (peso 25%)</h4>
        <ul>
          <li>Llega limpio y presentable</li>
          <li>Trato respetuoso</li>
          <li>Explica claramente el trabajo</li>
          <li>Respeta el vehículo y la propiedad</li>
        </ul>
        
        <h4>3. Puntualidad (peso 20%)</h4>
        <ul>
          <li>Llega en el ETA indicado (±15 min)</li>
          <li>Avisa si te retrasarás</li>
          <li>Cumple el tiempo de trabajo estimado</li>
        </ul>
        
        <h4>4. Comunicación (peso 15%)</h4>
        <ul>
          <li>Responde mensajes rápidamente</li>
          <li>Actualiza el estado del trabajo</li>
          <li>Informa sobre hallazgos adicionales</li>
        </ul>
        
        <h3>Trust Score</h3>
        <p>Además del rating, tenemos un Trust Score que incluye:</p>
        <ul>
          <li>Rating promedio (0-100 pts)</li>
          <li>Servicios completados (0-100 pts)</li>
          <li>Tiempo de respuesta (0-50 pts)</li>
          <li>Tasa de aceptación (0-50 pts)</li>
          <li>Tasa de cancelación (0-50 pts, penaliza)</li>
          <li>Disputas resueltas (0-50 pts)</li>
        </ul>
        <p><strong>Trust Score óptimo:</strong> 70+ puntos</p>
        
        <h3>Consejos Pro</h3>
        <ul>
          <li>Toma fotos antes/después del trabajo</li>
          <li>Explica todo lo que haces al cliente</li>
          <li>Ofrece garantía clara y por escrito</li>
          <li>Da consejos de mantenimiento preventivo</li>
          <li>Pide feedback durante el servicio, no después</li>
        </ul>
      `
    },

    // Technical
    {
      category: 'technical',
      title: 'Problemas con la app - Soluciones rápidas',
      content: `
        <h3>Problemas Comunes</h3>
        
        <h4>La app se cierra sola</h4>
        <ol>
          <li>Verifica tener la última versión instalada</li>
          <li>Cierra completamente y vuelve a abrir</li>
          <li>Borra caché: Ajustes → Apps → RedMecánica → Limpiar caché</li>
          <li>Reinicia tu teléfono</li>
          <li>Si persiste: Desinstala y reinstala</li>
        </ol>
        
        <h4>No recibo notificaciones</h4>
        <ol>
          <li>Verifica permisos: Ajustes → RedMecánica → Notificaciones (activado)</li>
          <li>Desactiva modo "No molestar"</li>
          <li>Revisa configuración de ahorro de batería</li>
          <li>En Android: Asegura que la app NO esté en "Optimización de batería"</li>
        </ol>
        
        <h4>GPS no funciona correctamente</h4>
        <ol>
          <li>Activa ubicación de alta precisión</li>
          <li>Verifica permisos de ubicación (siempre, no solo al usar)</li>
          <li>Sal de edificios/estacionamientos subterráneos</li>
          <li>Reinicia el GPS del teléfono</li>
        </ol>
        
        <h4>No puedo subir fotos</h4>
        <ol>
          <li>Verifica espacio disponible en tu teléfono</li>
          <li>Permisos de cámara/galería activados</li>
          <li>Tamaño máximo: 10MB por foto</li>
          <li>Formatos aceptados: JPG, PNG, HEIC</li>
        </ol>
        
        <h3>Requisitos del Sistema</h3>
        <ul>
          <li><strong>Android:</strong> Versión 8.0 o superior</li>
          <li><strong>iOS:</strong> Versión 13.0 o superior</li>
          <li><strong>Espacio:</strong> Mínimo 150 MB libres</li>
          <li><strong>Conexión:</strong> WiFi o datos móviles 4G/5G</li>
        </ul>
        
        <h3>Contactar Soporte</h3>
        <p>Si ninguna solución funciona:</p>
        <ul>
          <li>Email: soporte@redmecanica.cl</li>
          <li>WhatsApp: +56 9 83414730</li>
          <li>Chat en vivo (dentro de la app)</li>
        </ul>
        <p><strong>Incluye:</strong> Modelo de teléfono, versión de app, captura de error</p>
      `
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = article.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda para Prestadores</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca tu pregunta aquí..."
            className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setSelectedArticle(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-400'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>

      {/* Articles */}
      {!selectedArticle ? (
        <div className="space-y-3">
          {filteredArticles.map((article, index) => (
            <button
              key={index}
              onClick={() => setSelectedArticle(article)}
              className="w-full bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow text-left flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{article.title}</h3>
                <p className="text-sm text-gray-500">
                  Haz clic para leer el artículo completo
                </p>
              </div>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
              <p className="text-gray-600">
                Intenta con otros términos o contacta a soporte directamente
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{selectedArticle.title}</h2>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />
        </div>
      )}

      {/* Contact Support */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">¿No encontraste lo que buscabas?</h3>
          <p className="text-gray-600 mb-4">
            Nuestro equipo de soporte está disponible para ayudarte
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="mailto:contacto@redmecanica.cl"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              📧 Email de Soporte
            </a>
            <a
              href="https://wa.me/56983414730"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              💬 WhatsApp: +56 9 83414730
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
