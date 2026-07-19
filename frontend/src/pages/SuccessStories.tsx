import React, { useState } from 'react';

interface SuccessStoriesProps {
  onClose: () => void;
  onNavigateToOnboarding?: () => void;
}

interface Story {
  name: string;
  business: string;
  type: string;
  location: string;
  rating: number;
  services: number;
  monthlyIncrease: string;
  quote: string;
  achievement: string;
  before: string;
  after: string;
}

const SuccessStories: React.FC<SuccessStoriesProps> = ({ onClose, onNavigateToOnboarding }) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const stories: Story[] = [
    {
      name: 'Juan Morales',
      business: 'Mecánico Móvil JM',
      type: 'Mecánico Independiente',
      location: 'Providencia, Santiago',
      rating: 4.9,
      services: 320,
      monthlyIncrease: '+280%',
      quote: 'RedMecánica transformó mi negocio. Pasé de buscar clientes en la calle a tener una agenda llena todos los días.',
      achievement: 'De 10 a 80+ clientes mensuales en 3 meses',
      before: 'Hace un año trabajaba como mecánico en un taller donde ganaba $600.000 mensuales. Tenía el sueño de independizarme pero no sabía cómo conseguir clientes.',
      after: 'Hoy tengo mi propio negocio móvil con agenda completa. Gano más de $2.000.000 al mes y sigo creciendo. Mis clientes me recomiendan constantemente.'
    },
    {
      name: 'Carolina Vera',
      business: 'Taller Express',
      type: 'Taller Certificado',
      location: 'La Florida, Santiago',
      rating: 4.8,
      services: 450,
      monthlyIncrease: '+180%',
      quote: 'La verificación de RedMecánica nos dio la credibilidad que necesitábamos. Ahora los clientes confían en nosotros desde el primer contacto.',
      achievement: 'De taller de barrio a referente en la zona sur',
      before: 'Teníamos un taller pequeño con solo clientela del barrio. Los meses eran irregulares y a veces apenas cubríamos costos.',
      after: 'Hoy somos el taller mejor calificado de La Florida en RedMecánica. Tuvimos que contratar 3 mecánicos más y ampliar las instalaciones.'
    },
    {
      name: 'Roberto Silva',
      business: 'Grúas Silva Hnos.',
      type: 'Servicio de Grúa',
      location: 'Maipú, Santiago',
      rating: 5.0,
      services: 580,
      monthlyIncrease: '+340%',
      quote: 'Las emergencias 24/7 de RedMecánica nos mantienen activos día y noche. Es un flujo constante de trabajo.',
      achievement: 'De 2 grúas a una flota de 6 vehículos',
      before: 'Éramos un servicio de grúa familiar con solo 2 vehículos. Dependíamos de ser llamados por conocidos o accidentes que veíamos en la calle.',
      after: 'Compramos 4 grúas más y contratamos 8 operadores. Trabajamos 24/7 con turnos rotativos. RedMecánica es el 80% de nuestros ingresos.'
    },
    {
      name: 'Miguel Contreras',
      business: 'Auto-Diagnóstico MC',
      type: 'Diagnóstico Computarizado',
      location: 'Las Condes, Santiago',
      rating: 4.9,
      services: 290,
      monthlyIncrease: '+220%',
      quote: 'La plataforma me permitió especializarme y cobrar lo que realmente vale mi servicio. Los clientes entienden el valor del diagnóstico profesional.',
      achievement: 'De empleado a dueño de su propio negocio especializado',
      before: 'Trabajaba en un taller multimarca haciendo de todo un poco. Quería especializarme en diagnóstico computarizado pero no tenía clientes.',
      after: 'Hoy soy el prestador de diagnóstico mejor calificado en la zona oriente. Trabajo solo con diagnóstico avanzado y gano el triple que antes.'
    },
    {
      name: 'Andrea Muñoz',
      business: 'Taller Femenino AM',
      type: 'Taller Especializado',
      location: 'Ñuñoa, Santiago',
      rating: 4.9,
      services: 410,
      monthlyIncrease: '+260%',
      quote: 'Como mujer mecánico, RedMecánica me dio la oportunidad de demostrar mi experiencia. Mis clientes valoran la profesionalidad y atención.',
      achievement: 'Primer taller especializado en atención a mujeres conductoras',
      before: 'Era difícil conseguir clientes que confiaran en una mecánica mujer. Muchos prejuicios en el rubro.',
      after: 'Hoy tengo un nicho súper fiel de clientas mujeres que buscan un espacio cómodo y confiable. Mi agenda está llena por semanas.'
    },
    {
      name: 'Cristián Lagos',
      business: 'Mantenimiento Empresarial CL',
      type: 'Servicio Corporativo',
      location: 'Vitacura, Santiago',
      rating: 4.8,
      services: 950,
      monthlyIncrease: '+420%',
      quote: 'RedMecánica me conectó con empresas que necesitan mantención de flotas. Es un mercado que nunca había podido acceder solo.',
      achievement: 'De autónomo a prestador corporativo de múltiples empresas',
      before: 'Trabajaba con autos particulares uno por uno. Nunca pude acceder a contratos con empresas por falta de plataforma.',
      after: 'Hoy mantengo flotas de 5 empresas importantes: 120+ vehículos corporativos bajo contrato mensual. Contraté equipo administrativo y técnico.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Casos de Éxito de Mecánicos y Talleres en RedMecánica</h1>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 mb-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Historias Reales de Prestadores Exitosos</h2>
        <p className="text-lg opacity-90 mb-6">
          Conoce cómo profesionales como tú han transformado sus negocios con RedMecánica
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-3xl font-bold">80+</div>
            <div className="text-sm opacity-90">Prestadores Activos</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-3xl font-bold">1,200+</div>
            <div className="text-sm opacity-90">Servicios Completados</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-3xl font-bold">100%</div>
            <div className="text-sm opacity-90">Garantizado</div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stories.map((story, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="flex items-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 ${
                index % 6 === 0 ? 'bg-blue-600' :
                index % 6 === 1 ? 'bg-purple-600' :
                index % 6 === 2 ? 'bg-green-600' :
                index % 6 === 3 ? 'bg-yellow-600' :
                index % 6 === 4 ? 'bg-pink-600' : 'bg-indigo-600'
              }`}>
                {story.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{story.name}</h3>
                <p className="text-sm text-gray-600">{story.business}</p>
                <p className="text-xs text-gray-500">{story.location}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="text-yellow-500 mr-2">⭐ {story.rating}</div>
                <span className="text-sm text-gray-500">• {story.services} servicios</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded px-3 py-2 mb-3">
                <div className="text-2xl font-bold text-green-700">{story.monthlyIncrease}</div>
                <div className="text-xs text-green-600">Aumento mensual</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 italic mb-4">
              "{story.quote}"
            </p>

            <button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Leer Historia Completa
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Historia Detallada */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStory(null)}>
          <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                  {selectedStory.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedStory.name}</h2>
                  <p className="text-gray-600">{selectedStory.business}</p>
                  <p className="text-sm text-gray-500">{selectedStory.type} • {selectedStory.location}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-2">⭐ {selectedStory.rating}</span>
                    <span className="text-sm text-gray-500">{selectedStory.services} servicios completados</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Logro Principal</h3>
              <p className="text-gray-700">{selectedStory.achievement}</p>
              <div className="mt-3 bg-white rounded px-4 py-2 inline-block">
                <span className="text-2xl font-bold text-green-600">{selectedStory.monthlyIncrease}</span>
                <span className="text-sm text-gray-600 ml-2">incremento en ingresos</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Su Historia</h3>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <h4 className="font-bold text-red-900 mb-2">❌ Antes de RedMecánica:</h4>
                <p className="text-gray-700">{selectedStory.before}</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h4 className="font-bold text-green-900 mb-2">✅ Después de RedMecánica:</h4>
                <p className="text-gray-700">{selectedStory.after}</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Testimonio</h3>
              <p className="text-gray-700 italic text-lg">
                "{selectedStory.quote}"
              </p>
              <p className="text-sm text-gray-500 mt-2">— {selectedStory.name}, {selectedStory.business}</p>
            </div>

            <button
              onClick={onNavigateToOnboarding}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-shadow"
            >
              Comienza Tu Historia de Éxito Hoy
            </button>
          </div>
        </div>
      )}

      {/* Beneficios Clave */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ¿Qué tienen en común todos estos Prestadores exitosos?
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h4 className="font-bold text-gray-900 mb-1">Enfoque</h4>
            <p className="text-sm text-gray-600">
              Se especializaron en lo que mejor hacen
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h4 className="font-bold text-gray-900 mb-1">Calidad</h4>
            <p className="text-sm text-gray-600">
              Mantienen calificaciones altas constantemente
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💬</div>
            <h4 className="font-bold text-gray-900 mb-1">Comunicación</h4>
            <p className="text-sm text-gray-600">
              Responden rápido y son profesionales
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <h4 className="font-bold text-gray-900 mb-1">Consistencia</h4>
            <p className="text-sm text-gray-600">
              Usan la plataforma activamente todos los días
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-3">Tu historia de éxito comienza aquí</h2>
        <p className="text-lg mb-6 opacity-90">
          Únete a RedMecánica y forma parte de la próxima generación de Prestadores exitosos en Chile
        </p>
        <button
          onClick={onNavigateToOnboarding}
          className="bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Comenzar Mi Historia Ahora
        </button>
        <p className="text-sm mt-4 opacity-75">
          Plan básico gratuito • Sin permanencia • Soporte 24/7
        </p>
      </div>
    </div>
  );
};

export default SuccessStories;
