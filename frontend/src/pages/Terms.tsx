import React from 'react';

interface TermsProps {
  onClose: () => void;
}

const Terms: React.FC<TermsProps> = ({ onClose }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Last Update */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">
          <strong>Última actualización:</strong> 09 de Febrero de 2026
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Versión:</strong> 2.0
        </p>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-6 text-gray-700">
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Aceptación de los Términos</h2>
          <p className="mb-3">
            Al acceder y utilizar la plataforma RedMecánica (en adelante, "la Plataforma"), 
            usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo 
            con alguna parte de estos términos, no debe utilizar nuestros servicios.
          </p>
          <p>
            Estos términos constituyen un acuerdo legal vinculante entre usted (en adelante, 
            "el Usuario" o "usted") y RedMecánica SpA (en adelante, "RedMecánica", "nosotros" 
            o "la Empresa").
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Descripción del Servicio</h2>
          <p className="mb-3">
            RedMecánica es una plataforma tecnológica que conecta a usuarios que requieren 
            servicios automotrices (en adelante, "Clientes") con Prestadores de servicios 
            profesionales verificados (en adelante, "Prestadores").
          </p>
          <p className="mb-3">
            <strong>Servicios incluidos:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Mecánica general y especializada</li>
            <li>Talleres certificados</li>
            <li>Servicios de grúa</li>
            <li>Asistencia de emergencia 24/7</li>
            <li>Diagnóstico computarizado</li>
            <li>Mantenciones preventivas y correctivas</li>
          </ul>
          <p className="mt-3">
            <strong>Importante:</strong> RedMecánica NO presta directamente los servicios 
            automotrices. Actuamos únicamente como intermediarios tecnológicos entre Clientes 
            y Prestadores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Registro de Usuario</h2>
          <h3 className="text-lg font-bold text-gray-900 mb-2">3.1 Requisitos</h3>
          <p className="mb-3">
            Para utilizar ciertos servicios de la Plataforma, debe crear una cuenta 
            proporcionando información veraz, completa y actualizada.
          </p>
          <p className="mb-3">
            <strong>Usuarios Clientes:</strong> Deben ser mayores de 18 años o contar con 
            autorización parental.
          </p>
          <p className="mb-3">
            <strong>Prestadores:</strong> Deben cumplir con todos los requisitos legales para 
            operar como prestadores de servicios automotrices en Chile, incluyendo pero no 
            limitado a:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Tener RUT vigente y patente municipal al día</li>
            <li>Certificaciones técnicas aplicables</li>
            <li>Seguro de responsabilidad civil</li>
            <li>Documentos personales al día (cédula de identidad, licencia de conducir)</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4">3.2 Seguridad de la Cuenta</h3>
          <p>
            Usted es responsable de mantener la confidencialidad de sus credenciales de acceso 
            y de todas las actividades realizadas bajo su cuenta. Debe notificar inmediatamente 
            a RedMecánica sobre cualquier uso no autorizado.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Proceso de Servicios</h2>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">4.1 Para Clientes</h3>
          <ul className="list-decimal list-inside space-y-2 ml-4 mb-4">
            <li>El Cliente describe su necesidad en la Plataforma</li>
            <li>Recibe cotizaciones de Prestadores verificados</li>
            <li>Compara y selecciona la oferta de su preferencia</li>
            <li>Acepta la cotización y confirma el servicio</li>
            <li>El Prestador realiza el servicio acordado</li>
            <li>El Cliente valida la entrega y califica el servicio</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 mb-2">4.2 Para Prestadores</h3>
          <ul className="list-decimal list-inside space-y-2 ml-4">
            <li>El Prestador recibe notificaciones de solicitudes en su zona</li>
            <li>Envía una cotización detallada al Cliente</li>
            <li>Si es aceptada, confirma disponibilidad y se dirige al lugar</li>
            <li>Realiza el servicio según lo cotizado</li>
            <li>Registra la finalización en la Plataforma</li>
            <li>Recibe el pago (menos la comisión de RedMecánica)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Pagos y Tarifas</h2>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">5.1 Para Clientes</h3>
          <p className="mb-3">
            El uso de la Plataforma es <strong>100% gratuito</strong> para Clientes. Solo 
            pagan el valor del servicio directamente al Prestador según la cotización aceptada.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">5.2 Para Prestadores</h3>
          <p className="mb-3">
            Los Prestadores deben seleccionar un plan de suscripción:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Plan Básico:</strong> Gratuito - Comisión 15% por servicio completado</li>
            <li><strong>Plan Profesional:</strong> $29.900/mes - Comisión 10%</li>
            <li><strong>Plan Premium:</strong> $59.900/mes - Comisión 7%</li>
            <li><strong>Plan Empresarial:</strong> Personalizado - Comisión desde 5%</li>
          </ul>
          <p className="mt-3">
            La comisión se cobra <strong>únicamente sobre servicios completados y aceptados</strong> 
            por el Cliente. No se cobra comisión por cotizaciones enviadas pero no aceptadas.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4">5.3 Sistema de Pago Seguro (Escrow)</h3>
          <p>
            Para proteger a ambas partes, los pagos de servicios se retienen en una cuenta 
            escrow hasta que el Cliente confirme la satisfacción del servicio. Solo entonces 
            se libera el pago al Prestador (menos la comisión aplicable).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Verificación de Prestadores</h2>
          <p className="mb-3">
            RedMecánica implementa un proceso de verificación riguroso para todos los 
            Prestadores que incluye:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Verificación de identidad y antecedentes</li>
            <li>Validación de licencias y certificaciones profesionales</li>
            <li>Revisión de documentación legal (RUT, patente, seguros)</li>
            <li>Inspección de herramientas y equipos (cuando aplique)</li>
            <li>Entrevista de evaluación técnica</li>
          </ul>
          <p className="mt-3">
            <strong>Importante:</strong> La verificación no garantiza la calidad del servicio 
            ni exime al Prestador de su responsabilidad profesional. RedMecánica no se hace 
            responsable por actos u omisiones de los Prestadores.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Calificaciones y Comentarios</h2>
          <p className="mb-3">
            Los Clientes pueden calificar y comentar los servicios recibidos. Estas 
            calificaciones son públicas y visibles para otros usuarios.
          </p>
          <p className="mb-3">
            <strong>Política de calificaciones:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Solo usuarios que hayan recibido un servicio pueden calificar</li>
            <li>Las calificaciones deben ser honestas y basadas en la experiencia real</li>
            <li>Están prohibidos comentarios difamatorios, ofensivos o fraudulentos</li>
            <li>RedMecánica se reserva el derecho de eliminar calificaciones inapropiadas</li>
            <li>Los Prestadores pueden responder a las calificaciones</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Cancelaciones y Reembolsos</h2>
          
          <h3 className="text-lg font-bold text-gray-900 mb-2">8.1 Cancelación por el Cliente</h3>
          <p className="mb-3">
            Los Clientes pueden cancelar un servicio sin costo si el Prestador aún no 
            ha iniciado el desplazamiento. Si el Prestador ya está en camino, pueden 
            aplicarse cargos de cancelación según la política de cada Prestador.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">8.2 Cancelación por el Prestador</h3>
          <p className="mb-3">
            Si un Prestador cancela un servicio confirmado, será penalizado con reducción 
            en su calificación y el Cliente recibirá una compensación o se le asignará 
            un Prestador alternativo.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mb-2">8.3 Reembolsos</h3>
          <p>
            Si un servicio no se completa según lo acordado y el Cliente no está satisfecho, 
            puede iniciar un proceso de mediación. RedMecánica evaluará el caso y, de 
            proceder, autorizará un reembolso parcial o total.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Garantías</h2>
          <p className="mb-3">
            Los servicios realizados a través de la Plataforma deben incluir garantía 
            mínima de <strong>30 días sobre mano de obra</strong>. Los repuestos tienen 
            la garantía del fabricante.
          </p>
          <p className="mb-3">
            Si surge un problema dentro del período de garantía, el Cliente debe contactar 
            al Prestador a través de la Plataforma. El Prestador está obligado a atender 
            el reclamo sin costo adicional si está cubierto por la garantía.
          </p>
          <p>
            En caso de disputa sobre garantías, RedMecánica actuará como mediador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Limitación de Responsabilidad</h2>
          <p className="mb-3">
            RedMecánica <strong>NO es responsable por:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>La calidad, seguridad o legalidad de los servicios prestados por Prestadores</li>
            <li>Daños causados por Prestadores durante la prestación de servicios</li>
            <li>Pérdidas económicas derivadas de servicios mal ejecutados</li>
            <li>Incumplimiento de compromisos entre Cliente y Prestador</li>
            <li>Disponibilidad continua e ininterrumpida de la Plataforma</li>
            <li>Pérdida de datos por fallas técnicas o ataques informáticos</li>
          </ul>
          <p className="mt-3">
            La responsabilidad total de RedMecánica nunca excederá el monto de la comisión 
            cobrada por el servicio en cuestión.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Prohibiciones</h2>
          <p className="mb-3">
            <strong>Está estrictamente prohibido:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Utilizar la Plataforma para actividades ilegales o fraudulentas</li>
            <li>Proporcionar información falsa o engañosa</li>
            <li>Evadir el sistema de pagos de la Plataforma</li>
            <li>Hostigar, amenazar o discriminar a otros usuarios</li>
            <li>Publicar contenido ofensivo, difamatorio o inapropiado</li>
            <li>Intentar hackear, dañar o interferir con el funcionamiento de la Plataforma</li>
            <li>Crear cuentas múltiples para manipular calificaciones</li>
            <li>Utilizar bots o herramientas automatizadas no autorizadas</li>
          </ul>
          <p className="mt-3">
            El incumplimiento de estas prohibiciones resultará en la suspensión o eliminación 
            permanente de la cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Propiedad Intelectual</h2>
          <p className="mb-3">
            Todos los derechos de propiedad intelectual sobre la Plataforma, incluyendo pero 
            no limitado a código fuente, diseño, logotipos, marcas y contenido, son propiedad 
            exclusiva de RedMecánica SpA.
          </p>
          <p>
            Queda prohibida la reproducción, distribución o modificación de cualquier elemento 
            de la Plataforma sin autorización expresa por escrito.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Modificación de Términos</h2>
          <p className="mb-3">
            RedMecánica se reserva el derecho de modificar estos Términos y Condiciones en 
            cualquier momento. Los cambios entrarán en vigencia inmediatamente después de su 
            publicación en la Plataforma.
          </p>
          <p>
            Es responsabilidad del Usuario revisar periódicamente estos términos. El uso 
            continuado de la Plataforma después de cambios constituye aceptación de los nuevos 
            términos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Ley Aplicable y Jurisdicción</h2>
          <p className="mb-3">
            Estos Términos y Condiciones se rigen por las leyes de la República de Chile.
          </p>
          <p>
            Cualquier disputa derivada de estos términos será sometida a la jurisdicción 
            exclusiva de los tribunales ordinarios de justicia de Santiago, Chile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">15. Contacto</h2>
          <p className="mb-2">
            Para consultas sobre estos Términos y Condiciones, puede contactarnos:
          </p>
          <ul className="list-none space-y-1 ml-4">
            <li><strong>Email:</strong> legal@redmecanica.cl</li>
            <li><strong>Teléfono:</strong> +56 9 83414730</li>
            <li><strong>Dirección:</strong> Placer 1156, Piso 4, Santiago</li>
          </ul>
        </section>

        <div className="bg-gray-50 border-l-4 border-blue-600 p-4 mt-8">
          <p className="text-sm text-gray-700">
            <strong>Nota importante:</strong> Estos Términos y Condiciones constituyen un 
            acuerdo legal vinculante. Si tiene dudas sobre alguna cláusula, le recomendamos 
            consultar con un asesor legal antes de utilizar la Plataforma.
          </p>
        </div>
      </div>

      {/* Accept CTA */}
      <div className="text-center mt-6">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-shadow"
        >
          He Leído y Acepto los Términos
        </button>
      </div>
    </div>
  );
};

export default Terms;
