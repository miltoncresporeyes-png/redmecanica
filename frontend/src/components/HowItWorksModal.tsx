import React from 'react';
import Card from './common/Card';

interface HowItWorksModalProps {
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl transition-colors"
        >
          ×
        </button>

        <div className="p-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ¿Cómo funciona RedMecánica?
            </h2>
            <p className="text-xl text-gray-600">
              Conectamos las necesidades de los conductores con la experiencia de los mecánicos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Sección para Clientes */}
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">🚗</span> Para Clientes
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">1</div>
                    <p className="text-gray-700"><strong>Busca o solicita:</strong> Usa nuestro asistente IA o busca el servicio que necesitas.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">2</div>
                    <p className="text-gray-700"><strong>Recibe ofertas:</strong> Los talleres y mecánicos cercanos te enviarán presupuestos.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">3</div>
                    <p className="text-gray-700"><strong>Agenda y paga:</strong> Elige la mejor opción según precio y reputación. Paga de forma segura.</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-blue-200 text-center">
                  <p className="font-bold text-blue-600">✨ SIEMPRE GRATIS PARA EL CLIENTE ✨</p>
                  <p className="text-xs text-blue-500 mt-1">Busca, cotiza y agenda sin costos adicionales por uso de plataforma.</p>
                </div>
              </div>
            </div>

            {/* Sección para Prestadores */}
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h3 className="text-2xl font-bold text-purple-800 mb-4 flex items-center">
                  <span className="mr-3 text-3xl">🔧</span> Para Prestadores
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-purple-200 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">1</div>
                    <p className="text-gray-700"><strong>Crea tu perfil:</strong> Regístrate, sube tus documentos y elige el plan que mejor se adapte a tu taller.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-200 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">2</div>
                    <p className="text-gray-700"><strong>Recibe solicitudes:</strong> Te notificaremos cuando haya conductores cerca pidiendo tus servicios.</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-200 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 shrink-0">3</div>
                    <p className="text-gray-700"><strong>Haz crecer tu negocio:</strong> Atiende, gana reputación y recibe tus pagos directamente en tu cuenta.</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-purple-200 space-y-3">
                  <p className="text-xs text-purple-800 font-semibold mb-2">Modelo de Suscripción:</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Plan Básico</span>
                    <span className="font-bold text-purple-700">Gratis (15% Comisión)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Plan Profesional</span>
                    <span className="font-bold text-purple-700">$14.900/mes (10% Comisión)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Plan Premium</span>
                    <span className="font-bold text-purple-700">$29.900/mes (7% Comisión)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Plan Empresarial</span>
                    <span className="font-bold text-purple-700">A medida (Desde 5% Comisión)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-gray-800 mb-2">💡 ¿Por qué RedMecánica?</h4>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma utiliza Inteligencia Artificial para diagnosticar problemas visualmente, 
              ahorrando tiempo y dinero. Garantizamos que los Prestadores estén certificados y los 
              pagos sean seguros para ambas partes.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <button 
              onClick={onClose}
              className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1"
            >
              ¡Entendido, vamos!
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HowItWorksModal;
