import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Política de Privacidad</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Last Update */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">
          <strong>Última actualización:</strong> 09 de Febrero de 2026
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Versión:</strong> 2.0
        </p>
        <p className="text-sm text-green-700 mt-2">
          <strong>✓</strong> Cumplimos con la Ley 19.628 de Protección de Datos Personales de Chile
        </p>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-6 text-gray-700">

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introducción</h2>
          <p className="mb-3">
            En RedMecánica SpA (en adelante, "RedMecánica", "nosotros" o "la Empresa"),
            respetamos su privacidad y nos comprometemos a proteger sus datos personales.
          </p>
          <p>
            Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y
            protegemos su información personal cuando utiliza nuestra plataforma y servicios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Datos que Recopilamos</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-2">2.1 Información Proporcionada Directamente</h3>
          <p className="mb-3">
            Al registrarse y utilizar RedMecánica, recopilamos:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
            <li><strong>Datos de identificación:</strong> Nombre completo, RUT, fecha de nacimiento</li>
            <li><strong>Datos de contacto:</strong> Dirección email, número de teléfono, dirección física</li>
            <li><strong>Información del vehículo:</strong> Marca, modelo, año, patente, kilometraje</li>
            <li><strong>Datos de pago:</strong> Información de tarjetas de crédito/débito, cuentas bancarias (encriptados)</li>
            <li><strong>Datos profesionales (Prestadores):</strong> Certificaciones, licencias, experiencia laboral</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2">2.2 Información Recopilada Automáticamente</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Datos de ubicación:</strong> GPS en tiempo real durante servicios activos</li>
            <li><strong>Información del dispositivo:</strong> Modelo, sistema operativo, identificador único</li>
            <li><strong>Datos de uso:</strong> Páginas visitadas, tiempo de sesión, clics, búsquedas</li>
            <li><strong>Cookies y tecnologías similares:</strong> Para mejorar la experiencia del usuario</li>
            <li><strong>Dirección IP:</strong> Para seguridad y análisis de tráfico</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Cómo Usamos sus Datos</h2>
          <p className="mb-3">
            Utilizamos su información personal para:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Proveer el servicio:</strong> Conectar Clientes con Prestadores, procesar pagos, gestionar servicios</li>
            <li><strong>Verificación:</strong> Validar identidad de Prestadores y prevenir fraude</li>
            <li><strong>Comunicación:</strong> Enviar notificaciones, actualizaciones, cotizaciones y confirmaciones</li>
            <li><strong>Seguridad:</strong> Detectar y prevenir actividades fraudulentas o ilegales</li>
            <li><strong>Mejora del servicio:</strong> Analizar patrones de uso para optimizar la plataforma</li>
            <li><strong>Marketing:</strong> Enviar ofertas, promociones y contenido relevante (solo con su consentimiento)</li>
            <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
            <li><strong>Resolución de conflictos:</strong> Mediar en disputas entre Clientes y Prestadores</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Compartir Información</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-2">4.1 Con Prestadores de Servicio</h3>
          <p className="mb-3">
            Cuando acepta una cotización, compartimos información necesaria con el Prestador:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
            <li>Nombre y número de contacto</li>
            <li>Ubicación del servicio</li>
            <li>Detalles del vehículo (si aplica)</li>
            <li>Descripción del problema</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2">4.2 Con Terceros Autorizados</h3>
          <p className="mb-3">
            Podemos compartir datos con:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
            <li><strong>Pasarelas de pago:</strong> Webpay, MercadoPago (según método elegido)</li>
            <li><strong>Servicios de verificación:</strong> Para validar identidad y antecedentes</li>
            <li><strong>Prestadores de análisis:</strong> Google Analytics, Firebase (datos anónimos)</li>
            <li><strong>Servicios de comunicación:</strong> Para enviar emails y SMS</li>
            <li><strong>Prestadores de almacenamiento en la nube:</strong> AWS, Google Cloud</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2">4.3 Requisitos Legales</h3>
          <p>
            Podemos divulgar su información si así lo requiere la ley, orden judicial,
            investigación policial o para proteger los derechos y seguridad de RedMecánica
            y sus usuarios.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Seguridad de los Datos</h2>
          <p className="mb-3">
            Implementamos medidas técnicas y organizativas para proteger sus datos:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Encriptación:</strong> SSL/TLS para transmisión de datos, encriptación AES-256 para almacenamiento</li>
            <li><strong>Autenticación:</strong> Verificación de dos factores disponible</li>
            <li><strong>Control de acceso:</strong> Solo personal autorizado puede acceder a datos sensibles</li>
            <li><strong>Monitoreo:</strong> Vigilancia 24/7 de sistemas para detectar intrusiones</li>
            <li><strong>Auditorías:</strong> Revisiones periódicas de seguridad por expertos</li>
            <li><strong>Backups:</strong> Copias de seguridad diarias encriptadas</li>
          </ul>
          <p className="mt-3">
            <strong>Importante:</strong> Ningún sistema es 100% seguro. Aunque implementamos
            las mejores prácticas, no podemos garantizar seguridad absoluta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Retención de Datos</h2>
          <p className="mb-3">
            Conservamos sus datos personales mientras:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Mantenga una cuenta activa en RedMecánica</li>
            <li>Sea necesario para proveer nuestros servicios</li>
            <li>Lo requiera una obligación legal (generalmente 6 años para fines tributarios)</li>
            <li>Sea necesario para resolver disputas o hacer cumplir nuestros términos</li>
          </ul>
          <p className="mt-3">
            Cuando elimine su cuenta, sus datos personales serán borrados permanentemente
            dentro de 90 días, excepto aquellos que debamos conservar por ley.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Sus Derechos</h2>
          <p className="mb-3">
            Según la legislación chilena, usted tiene derecho a:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre usted
            </li>
            <li>
              <strong>Rectificación:</strong> Corregir datos inexactos o incompletos
            </li>
            <li>
              <strong>Eliminación:</strong> Solicitar la eliminación de sus datos (sujeto a obligaciones legales)
            </li>
            <li>
              <strong>Portabilidad:</strong> Recibir sus datos en formato estructurado y legible
            </li>
            <li>
              <strong>Oposición:</strong> Oponerse al procesamiento de sus datos para fines de marketing
            </li>
            <li>
              <strong>Limitación:</strong> Solicitar que restrinjamos el uso de sus datos
            </li>
            <li>
              <strong>Retirar consentimiento:</strong> Revocar el consentimiento otorgado previamente
            </li>
          </ul>
          <p className="mt-3">
            Para ejercer estos derechos, contáctenos en: <strong>privacidad@redmecanica.cl</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Cookies y Tecnologías de Seguimiento</h2>

          <h3 className="text-lg font-bold text-gray-900 mb-2">8.1 Tipos de Cookies que Usamos</h3>
          <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
            <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico de la plataforma</li>
            <li><strong>Cookies de rendimiento:</strong> Analizan cómo los usuarios interactúan con la plataforma</li>
            <li><strong>Cookies funcionales:</strong> Recuerdan preferencias y configuraciones</li>
            <li><strong>Cookies de publicidad:</strong> Personalizan anuncios relevantes (solo con su consentimiento)</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2">8.2 Gestión de Cookies</h3>
          <p>
            Puede controlar y eliminar cookies desde la configuración de su navegador.
            Sin embargo, deshabilitar ciertas cookies puede afectar la funcionalidad de la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Menores de Edad</h2>
          <p className="mb-3">
            RedMecánica no está dirigida a menores de 18 años. No recopilamos intencionalmente
            datos de menores.
          </p>
          <p>
            Si descubrimos que hemos recopilado datos de un menor sin consentimiento parental,
            eliminaremos inmediatamente dicha información de nuestros servidores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Transferencias Internacionales</h2>
          <p className="mb-3">
            Sus datos pueden ser transferidos y procesados en servidores ubicados fuera de Chile,
            particularmente en Estados Unidos (AWS, Google Cloud).
          </p>
          <p>
            Nos aseguramos de que estos Prestadores cumplan con estándares adecuados de
            protección de datos mediante cláusulas contractuales estándar y certificaciones
            como Privacy Shield (cuando aplique).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Marketing y Comunicaciones</h2>
          <p className="mb-3">
            Podemos enviarle comunicaciones de marketing sobre:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Nuevas funcionalidades de la plataforma</li>
            <li>Promociones y descuentos especiales</li>
            <li>Consejos de mantenimiento vehicular</li>
            <li>Encuestas de satisfacción</li>
          </ul>
          <p className="mt-3">
            <strong>Puede darse de baja en cualquier momento:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Haciendo clic en "Cancelar suscripción" en nuestros emails</li>
            <li>Ajustando preferencias en su cuenta</li>
            <li>Contactándonos directamente</li>
          </ul>
          <p className="mt-3">
            <strong>Nota:</strong> Seguirá recibiendo comunicaciones transaccionales (confirmaciones,
            facturas, actualizaciones de servicio) independientemente de sus preferencias de marketing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Cambios a esta Política</h2>
          <p className="mb-3">
            Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios
            en nuestras prácticas o por razones legales.
          </p>
          <p className="mb-3">
            Le notificaremos sobre cambios significativos mediante:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Aviso destacado en la plataforma</li>
            <li>Email a su cuenta registrada</li>
            <li>Notificación push (si tiene la app móvil)</li>
          </ul>
          <p className="mt-3">
            La versión actualizada entrará en vigencia inmediatamente después de su publicación.
            Le recomendamos revisar esta política periódicamente.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contacto</h2>
          <p className="mb-3">
            Para cualquier consulta sobre esta Política de Privacidad o sobre cómo manejamos
            sus datos personales:
          </p>
          <ul className="list-none space-y-2 ml-4">
            <li><strong>Email de Privacidad:</strong> privacidad@redmecanica.cl</li>
            <li><strong>Oficial de Protección de Datos:</strong> dpo@redmecanica.cl</li>
            <li><strong>Teléfono:</strong> +56 9 8341 4730</li>
            <li><strong>Dirección:</strong> Placer 1156, Piso 4, Santiago, Santiago, Chile</li>
          </ul>
          <p className="mt-3">
            Nos comprometemos a responder todas las consultas dentro de 30 días hábiles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Autoridad de Control</h2>
          <p className="mb-3">
            Si considera que no hemos tratado sus datos personales de conformidad con la ley,
            tiene derecho a presentar una reclamación ante:
          </p>
          <ul className="list-none space-y-1 ml-4">
            <li><strong>Consejo para la Transparencia</strong></li>
            <li>Amunátegui 341, Santiago Centro</li>
            <li>Tel: +56 2 2753 2300</li>
            <li>Web: www.consejotransparencia.cl</li>
          </ul>
        </section>

        <div className="bg-green-50 border-l-4 border-green-600 p-4 mt-8">
          <p className="text-sm text-gray-700 flex items-start">
            <span className="text-green-600 text-xl mr-2">✓</span>
            <span>
              <strong>Su privacidad es nuestra prioridad.</strong> En RedMecánica implementamos
              las mejores prácticas de la industria y cumplimos estrictamente con toda la
              legislación chilena aplicable para proteger sus datos personales.
            </span>
          </p>
        </div>
      </div>

      {/* Accept CTA */}
      <div className="text-center mt-6">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
        >
          He Leído la Política de Privacidad
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
