
import React, { useState, useRef } from 'react';
import { estimateVisualDamage } from '../../services/geminiService';
import { Service, VisualEstimatorResponse } from '../../types';
interface VisualEstimatorProps {
  onServiceSelect: (service: Service) => void;
  availableServices: Service[];
}

const VisualEstimator: React.FC<VisualEstimatorProps> = ({ onServiceSelect, availableServices }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<VisualEstimatorResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResponse(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResponse(null);
    const base64Image = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];
    const result = await estimateVisualDamage(base64Image, mimeType);
    setResponse(result);
    setLoading(false);
  };

  const handleSelect = (serviceId: string) => {
    let service = availableServices.find(s => s.id === serviceId);
    
    if (!service) {
      service = availableServices.find(s => s.id === 'revision_general') || availableServices[0];
    }

    if(service) onServiceSelect(service);
  };

  return (
    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {!image && (
          <button onClick={() => fileInputRef.current?.click()} className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-semibold">Subir Foto del Daño</span>
          </button>
      )}
      {image && (
        <div className="mb-4">
          <img src={image} alt="Daño del vehículo" className="max-h-60 w-auto mx-auto rounded-lg shadow-md" />
        </div>
      )}
      {image && !loading && !response && (
        <button onClick={handleAnalyze} className="w-full px-4 py-2 mt-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
          Analizar Daño
        </button>
      )}
      {loading && (
        <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="ml-2">Nuestra IA está inspeccionando la foto...</p>
        </div>
      )}
      {response && (
        <div className="mt-4 p-3 bg-white rounded-md shadow-sm space-y-2">
            <p><span className="font-semibold">Partes Afectadas:</span> {response.damagedParts.join(', ')}</p>
            <p><span className="font-semibold">Tipo de Daño:</span> {response.damageType}</p>
            <p><span className="font-semibold">Análisis Preliminar:</span> {response.assessment}</p>
            {response.suggestedServices.length > 0 && (
                 <button onClick={() => handleSelect(response.suggestedServices[0].id)} className="w-full mt-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                     Seleccionar "{response.suggestedServices[0].name}"
                 </button>
            )}
        </div>
      )}
    </div>
  );
};

export default VisualEstimator;
