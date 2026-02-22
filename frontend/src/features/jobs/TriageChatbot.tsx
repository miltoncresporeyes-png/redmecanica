import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { triageTree, TriageQuestion, TriageOption } from '../../data/triageData';
import { Service } from '../../types';
import { getServices } from '../../services/api';

interface TriageChatbotProps {
  onServiceSelect?: (service: Service) => void;
  availableServices?: Service[];
}

const TriageChatbot: React.FC<TriageChatbotProps> = ({ onServiceSelect, availableServices: initialServices }) => {
  const navigate = useNavigate();
  const [availableServices, setAvailableServices] = useState<Service[]>(initialServices || []);
  const [currentId, setCurrentId] = useState<'start' | string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ analysis: string; serviceId: string } | null>(null);

  useEffect(() => {
    if (!initialServices || initialServices.length === 0) {
      getServices().then(setAvailableServices).catch(console.error);
    }
  }, [initialServices]);

  const currentQuestion: TriageQuestion = triageTree[currentId] || triageTree['start'];

  const handleOptionClick = (option: TriageOption) => {
    if (option.resultServiceId && option.resultAnalysis) {
      setResult({
        serviceId: option.resultServiceId,
        analysis: option.resultAnalysis
      });
      setShowResult(true);
    } else if (option.nextQuestionId) {
      setHistory([...history, currentId]);
      setCurrentId(option.nextQuestionId);
    }
  };

  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      setResult(null);
      return;
    }
    const newHistory = [...history];
    const lastId = newHistory.pop();
    if (lastId) {
      setCurrentId(lastId);
      setHistory(newHistory);
    }
  };

  const handleSelectService = () => {
    if (result) {
      let service = availableServices.find(s => s.id === result.serviceId);
      
      // Fallback si no encuentra el ID específico
      if (!service) {
        service = availableServices.find(s => s.id === 'revision_general') || availableServices[0];
      }

      if (service) {
        if (onServiceSelect) {
          onServiceSelect(service);
        } else {
          // Si se usa como página independiente, navegar al flujo de solicitud
          navigate(`/solicitar?serviceId=${service.id}`);
        }
      }
    }
  };

  const restart = () => {
    setCurrentId('start');
    setHistory([]);
    setShowResult(false);
    setResult(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-inner border border-blue-100 overflow-hidden min-h-[400px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg flex items-center">
            <span className="mr-2">🔧</span> Asistente de Diagnóstico
          </h3>
          <p className="text-xs text-blue-100 italic">Identifiquemos el problema de tu vehículo paso a paso</p>
        </div>
        {(history.length > 0 || showResult) && (
          <button 
            onClick={restart}
            className="text-xs bg-blue-500 hover:bg-blue-400 px-2 py-1 rounded transition-colors"
          >
            Reiniciar
          </button>
        )}
      </div>

      <div className="flex-grow p-6 flex flex-col">
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-start">
              <div className="bg-blue-100 rounded-full h-8 w-8 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                🤖
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tl-none p-4 text-gray-800 shadow-sm max-w-[90%]">
                <p className="font-medium">{currentQuestion.text}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pl-11">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group flex justify-between items-center shadow-sm hover:shadow-md"
                >
                  <span className="text-gray-700 group-hover:text-blue-900 font-medium">{option.text}</span>
                  <span className="text-blue-200 group-hover:text-blue-500 transition-transform group-hover:translate-x-1">→</span>
                </button>
              ))}
            </div>
            
            {history.length > 0 && (
              <button 
                onClick={handleBack}
                className="ml-11 text-sm text-gray-500 hover:text-blue-600 flex items-center transition-colors"
              >
                <span className="mr-1">←</span> Volver a la pregunta anterior
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn text-center py-4">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center text-green-600 mx-auto mb-4 border-4 border-green-50 shadow-lg">
              <span className="text-2xl">✅</span>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-gray-900">Diagnóstico Preliminar</h4>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-gray-700 shadow-inner italic">
                "{result?.analysis}"
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 font-semibold mb-3">Recomendamos el siguiente servicio:</p>
              <div className="bg-white p-4 rounded-lg shadow-sm font-bold text-blue-600 text-lg border border-blue-200">
                {availableServices.find(s => s.id === result?.serviceId)?.name || 'Revisión General'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBack}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cambiar Respuesta
              </button>
              <button
                onClick={handleSelectService}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Seleccionar y Continuar
              </button>
            </div>
            
            <p className="text-xs text-gray-400 mt-6 px-10">
               * Este diagnóstico es orientativo. El resultado final será validado por el profesional mecánico.
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default TriageChatbot;
