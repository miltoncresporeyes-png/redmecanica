import React, { useState } from 'react';
import SEO from '../components/SEO';

interface FAQProps {
  onClose: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'servicios' | 'pagos' | 'Prestadores' | 'seguridad';
}

const FAQ: React.FC<FAQProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    // General
    {
      category: 'general',
      question: '¿Qué es RedMecánica?',
      answer: 'RedMecánica es la plataforma líder en Chile que conecta a conductores con profesionales automotrices verificados. Ofrecemos servicios de mecánica, talleres certificados, grúas y asistencia de emergencia 24/7.'
    },
    {
      category: 'general',
      question: '¿Cómo funciona la plataforma?',
      answer: 'Es muy simple: 1) Describe tu problema o necesidad, 2) Recibe cotizaciones de Prestadores verificados cercanos a ti, 3) Compara y elige el que mejor se ajuste a tus necesidades, 4) El prestador realiza el servicio, 5) Calificas la experiencia. Todo desde la comodidad de tu celular.'
    },
    {
      category: 'general',
      question: '¿En qué ciudades están disponibles?',
      answer: 'Actualmente operamos en las principales ciudades de Chile: Santiago, Valparaíso, Viña del Mar, Concepción, La Serena, Antofagasta, Temuco, Puerto Montt y estamos expandiéndonos continuamente a nuevas regiones.'
    },
    {
      category: 'general',
      question: '¿Es gratis usar RedMecánica?',
      answer: 'Sí, para usuarios (conductores) la plataforma es 100% gratuita. No cobramos por buscar, comparar o solicitar cotizaciones. Solo pagas directamente al prestador por el servicio que recibes.'
    },

    // Servicios
    {
      category: 'servicios',
      question: '¿Qué tipos de servicios ofrecen?',
      answer: 'Ofrecemos una amplia gama de servicios: mecánica general, revisión técnica, cambio de aceite, diagnóstico computarizado, frenos, suspensión, electricidad automotriz, aire acondicionado, grúas, servicios de emergencia 24/7 y mucho más.'
    },
    {
      category: 'servicios',
      question: '¿Puedo solicitar un servicio de emergencia?',
      answer: 'Sí, contamos con servicio de emergencias 24/7. Puedes usar el botón SOS en la app para conectarte inmediatamente con Prestadores disponibles en tu zona. Los tiempos de respuesta para emergencias son menores a 15 minutos.'
    },
    {
      category: 'servicios',
      question: '¿Cuánto tiempo tarda en llegar un prestador?',
      answer: 'Los tiempos varían según la ubicación y el tipo de servicio. En emergencias, el promedio es de 20-45 minutos. Para servicios programados, puedes coordinar el horario que mejor te convenga.'
    },
    {
      category: 'servicios',
      question: '¿Los servicios incluyen garantía?',
      answer: 'Sí, todos los trabajos realizados a través de RedMecánica incluyen garantía mínima de 30 días sobre mano de obra. Los repuestos tienen la garantía del fabricante. Los detalles específicos se especifican en cada cotización.'
    },
    {
      category: 'servicios',
      question: '¿Puedo cancelar un servicio ya solicitado?',
      answer: 'Sí, puedes cancelar un servicio antes de que el prestador se dirija a tu ubicación sin costo. Si el prestador ya está en camino, pueden aplicar cargos de cancelación según la política de cada prestador.'
    },

    // Pagos
    {
      category: 'pagos',
      question: '¿Cómo funciona el pago?',
      answer: 'Aceptamos múltiples formas de pago: transferencia bancaria, tarjetas de crédito/débito (Webpay Plus), MercadoPago y efectivo. El pago se realiza solo cuando el servicio ha sido completado a tu satisfacción.'
    },
    {
      category: 'pagos',
      question: '¿Cuándo debo pagar?',
      answer: 'El pago se realiza después de que el servicio ha sido completado y tú has validado que está todo correcto. Utilizamos un sistema de pago seguro (escrow) donde el dinero queda retenido hasta que confirmes tu satisfacción.'
    },
    {
      category: 'pagos',
      question: '¿Qué pasa si no estoy satisfecho con el servicio?',
      answer: 'Si no estás satisfecho, no confirmes el pago. Abre un reporte en la plataforma y nuestro equipo mediará entre tú y el prestador para resolver el problema. El prestador debe corregir el trabajo sin costo adicional.'
    },
    {
      category: 'pagos',
      question: '¿Hay cargos ocultos?',
      answer: 'No. Los Prestadores deben especificar todos los costos en la cotización (mano de obra, repuestos, desplazamiento, etc.). Si surge un gasto adicional durante el servicio, el prestador debe solicitar tu aprobación antes de proceder.'
    },
    {
      category: 'pagos',
      question: '¿Puedo obtener una factura?',
      answer: 'Sí, todos los Prestadores registrados en RedMecánica están obligados a emitir boleta o factura por sus servicios. Puedes solicitarla directamente en la plataforma.'
    },

    // Prestadores
    {
      category: 'Prestadores',
      question: '¿Cómo verifican a los Prestadores?',
      answer: 'Todos nuestros Prestadores pasan por un riguroso proceso de validación que incluye: verificación de identidad y antecedentes, validación de licencias y certificaciones profesionales, inspección de herramientas y equipos, y evaluación de experiencia comprobable.'
    },
    {
      category: 'Prestadores',
      question: '¿Puedo confiar en las calificaciones?',
      answer: 'Sí, nuestro sistema de calificaciones es 100% transparente y verificado. Solo usuarios que han recibido un servicio pueden calificar. No permitimos calificaciones falsas y monitoreamos activamente posibles irregularidades.'
    },
    {
      category: 'Prestadores',
      question: '¿Qué significa el badge "Verificado" o "Elite"?',
      answer: 'Los badges indican diferentes niveles: "Verificado" significa que el prestador ha completado el proceso de validación, "Elite" se otorga a Prestadores con más de 50 servicios completados y calificación promedio mayor a 4.7 estrellas.'
    },
    {
      category: 'Prestadores',
      question: '¿Puedo contactar directamente al prestador?',
      answer: 'Sí, una vez que aceptas una cotización, puedes comunicarte directamente con el prestador a través de la plataforma (chat/llamada). Recomendamos mantener toda la comunicación dentro de la app para tu protección.'
    },

    // Seguridad
    {
      category: 'seguridad',
      question: '¿Es seguro usar RedMecánica?',
      answer: 'Absolutamente. Implementamos múltiples capas de seguridad: verificación de identidad de Prestadores, sistema de pago seguro con escrow, seguimiento GPS en tiempo real, grabación de timeline de eventos, y botón de pánico disponible durante el servicio.'
    },
    {
      category: 'seguridad',
      question: '¿Qué hago en caso de emergencia durante el servicio?',
      answer: 'Tenemos un botón de pánico visible durante todo el servicio. Al presionarlo, se alerta inmediatamente a nuestro equipo de soporte y, si es necesario, se contacta a las autoridades. Tu seguridad es nuestra prioridad #1.'
    },
    {
      category: 'seguridad',
      question: '¿Cómo protegen mis datos personales?',
      answer: 'Cumplimos estrictamente con la Ley de Protección de Datos Personales de Chile. Tus datos están encriptados, nunca los compartimos con terceros sin tu consentimiento, y solo son accesibles por Prestadores durante servicios activos.'
    },
    {
      category: 'seguridad',
      question: '¿Qué pasa si un prestador no llega?',
      answer: 'Si un prestador no llega en el tiempo estimado (2x el ETA), el servicio se cancela automáticamente sin costo. El prestador es penalizado en su Trust Score y te ofrecemos un cupón de descuento para tu próximo servicio.'
    }
  ];

  const categories = [
    { id: 'general', name: 'General', icon: '📋' },
    { id: 'servicios', name: 'Servicios', icon: '🔧' },
    { id: 'pagos', name: 'Pagos', icon: '💳' },
    { id: 'Prestadores', name: 'Prestadores', icon: '👷' },
    { id: 'seguridad', name: 'Seguridad', icon: '🛡️' }
  ];

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <>
      <SEO
        title="Preguntas Frecuentes | RedMecánica"
        description="Encuentra respuestas a las preguntas más comunes sobre RedMecánica. Información sobre servicios, pagos, Prestadores y seguridad."
        keywords="faq redmecánica, preguntas frecuentes, ayuda mecánico, cómo funciona"
        canonicalUrl="https://redmecanica.cl/faq"
      />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Preguntas Frecuentes</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-3">¿Tienes alguna duda?</h2>
        <p className="opacity-90">
          Aquí encontrarás respuestas a las preguntas más comunes sobre RedMecánica
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setOpenQuestion(null);
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

      {/* FAQ List */}
      <div className="space-y-3 mb-8">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors text-left"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openQuestion === index ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openQuestion === index && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">¿No encontraste lo que buscabas?</h3>
        <p className="text-gray-600 mb-4">
          Nuestro equipo de soporte está disponible 24/7 para ayudarte
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="mailto:contacto@redmecanica.cl"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📧 Email: contacto@redmecanica.cl
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
    </>
  );
};

export default FAQ;
