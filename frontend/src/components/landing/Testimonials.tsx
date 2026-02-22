import React from 'react';
import Card from '../common/Card';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'María González',
      role: 'Conductora',
      content: 'Excelente servicio. El mecánico llegó en 15 minutos y solucionó mi problema de batería al instante. 100% recomendado.',
      rating: 5,
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Carlos Pérez',
      role: 'Conductor de Uber',
      content: 'Como conductor, necesito soluciones rápidas. RedMecánica me ha salvado varias veces. ¡Servicio de primera!',
      rating: 5,
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Andrea Silva',
      role: 'Dueña de flota',
      content: 'Manejo una flota de 10 vehículos. Con RedMecánica encontré talleres certificados y precios justos. Muy profesional.',
      rating: 5,
      avatar: '👩‍💼'
    }
  ];

  const renderStars = (rating: number) => {
    return Array(rating).fill(0).map((_, i) => (
      <span key={i} className="text-yellow-500">★</span>
    ));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Lo que dicen nuestros usuarios</h2>
          <p className="text-gray-600">Miles de conductores confían en RedMecánica cada día</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">{testimonial.avatar}</div>
                <div>
                  <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mb-3 text-lg">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <div className="inline-flex items-center space-x-8 text-gray-700">
            <div>
              <p className="text-3xl font-bold text-blue-600">15,000+</p>
              <p className="text-sm">Servicios Realizados</p>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div>
              <p className="text-3xl font-bold text-blue-600">4.8/5</p>
              <p className="text-sm">Calificación Promedio</p>
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-sm">Clientes Satisfechos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
