
import React, { useState } from 'react';
import { getServiceSuggestion } from '../../services/geminiService';
import { AIAssistantResponse, Service } from '../../types';
interface AIAssistantProps {
  onServiceSelect: (service: Service) => void;
  availableServices: Service[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onServiceSelect, availableServices }) => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAssistantResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;
    setLoading(true);
    setResponse(null);
    const result = await getServiceSuggestion(problem);
    setResponse(result);
    setLoading(false);
  };
  
  const handleSelect = (serviceId: string) => {
    let service = availableServices.find(s => s.id === serviceId);
    
    if (!service) {
      service = availableServices.find(s => s.id === 'revision_general') || availableServices[0];
    }

    if(service) {
        onServiceSelect(service);
    }
  }

  return (
    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Ej: El motor suena como una tetera..."
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
          disabled={loading}
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300" disabled={loading}>
          {loading ? 'Analizando...' : 'Diagnosticar'}
        </button>
      </form>
      {loading && (
        <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-2">Nuestra IA está pensando...</p>
        </div>
      )}
      {response && (
        <div>
            <p className="text-gray-700 mb-2 p-3 bg-white rounded-md shadow-sm">{response.analysis}</p>
            {response.suggestedServices.length > 0 && (
                <>
                    <h4 className="font-semibold mt-4 mb-2">Servicios Sugeridos:</h4>
                    <ul className="space-y-2">
                        {response.suggestedServices.map(s => (
                            <li key={s.id} onClick={() => handleSelect(s.id)} className="p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-100 shadow flex justify-between items-center">
                                <span>{s.name}</span>
                                <span className="text-sm capitalize px-2 py-1 bg-green-100 text-green-800 rounded-full">{s.confidence}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
