
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

interface Provider {
  id: string;
  type: string;
  status: string;
  rut: string;
  user: {
    name: string;
    email: string;
  };
  submittedAt: string;
  idDocumentUrl?: string;
  backgroundCheckUrl?: string;
}

const ProviderReview: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/providers/pending`, {
        withCredentials: true
      });
      setProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/providers/${id}/${action}`, 
        { reason }, 
        { withCredentials: true }
      );
      setSelectedProvider(null);
      fetchProviders();
    } catch (error) {
      alert("Error al procesar la solicitud");
    }
  };

  if (loading) return <div>Cargando solicitudes...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Prestadores en Espera</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {providers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay solicitudes pendientes</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Envío</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedProvider(p)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{p.user.name}</div>
                    <div className="text-sm text-gray-500">{p.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.rut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900">Ver Detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl font-bold mb-4">Revisión de Proveedor</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold">Nombre</p>
                <p>{selectedProvider.user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold">RUT</p>
                <p>{selectedProvider.rut}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 uppercase font-bold">Documentos</p>
                <div className="flex gap-4 mt-2">
                  <a href={selectedProvider.idDocumentUrl} target="_blank" className="text-blue-600 underline">Cédula de Identidad</a>
                  <a href={selectedProvider.backgroundCheckUrl} target="_blank" className="text-blue-600 underline">Cert. Antecedentes</a>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cerrar
              </button>
              <button 
                onClick={() => handleAction(selectedProvider.id, 'reject', prompt("Razón de rechazo:") || "No cumple requisitos")}
                className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded"
              >
                Rechazar
              </button>
              <button 
                onClick={() => handleAction(selectedProvider.id, 'approve')}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
              >
                Aprobar Proveedor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderReview;
