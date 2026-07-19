import React, { useState } from 'react';
import Card from '../components/common/Card';
import { validarRUT, formatearRUT } from '../utils/rutValidator';

interface ClientDashboardProps {
  onClose?: () => void;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface ServiceHistory {
  id: string;
  date: string;
  service: string;
  provider: string;
  cost: number;
  rating: number;
  status: string;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'history'>('profile');
  const [editMode, setEditMode] = useState(false);

  // Mock data - en producción vendría del API
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+56 9 83414730',
    rut: '12.345.678-5',
    address: 'Av. Providencia 1234, Providencia',
    region: 'Metropolitana',
    commune: 'Providencia'
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', make: 'Toyota', model: 'Corolla', year: 2020, licensePlate: 'ABCD-12' },
    { id: '2', make: 'Chevrolet', model: 'Spark', year: 2018, licensePlate: 'WXYZ-34' }
  ]);

  const serviceHistory: ServiceHistory[] = [
    {
      id: '1',
      date: '2026-01-15',
      service: 'Cambio de aceite',
      provider: 'Taller Express',
      cost: 35000,
      rating: 5,
      status: 'COMPLETED'
    },
    {
      id: '2',
      date: '2025-12-20',
      service: 'Revisión técnica',
      provider: 'AutoCheck',
      cost: 18000,
      rating: 4.5,
      status: 'COMPLETED'
    },
    {
      id: '3',
      date: '2025-11-10',
      service: 'Cambio de pastillas de freno',
      provider: 'Frenos Rápidos',
      cost: 65000,
      rating: 4.8,
      status: 'COMPLETED'
    }
  ];

  const handleSaveProfile = () => {
    // Aquí iría la llamada al API
    if (userData.rut && !validarRUT(userData.rut)) {
      alert('Error: El RUT ingresado no es válido');
      return;
    }
    setEditMode(false);
  };

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: ''
    };
    setVehicles([...vehicles, newVehicle]);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Información Personal</h3>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✏️ Editar
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RUT</label>
          <input
            type="text"
            value={userData.rut}
            onChange={(e) => setUserData({ ...userData, rut: formatearRUT(e.target.value) })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
          <input
            type="text"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
          <input
            type="text"
            value={userData.region}
            onChange={(e) => setUserData({ ...userData, region: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comuna</label>
          <input
            type="text"
            value={userData.commune}
            onChange={(e) => setUserData({ ...userData, commune: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg transition-colors ${editMode ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>
      </div>
    </div>
  );

  const renderVehiclesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Mis Vehículos</h3>
        <button
          onClick={handleAddVehicle}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Agregar Vehículo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white text-2xl">
                  🚗
                </div>
                <div className="ml-4">
                  <h4 className="font-bold text-lg">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-gray-600">Año {vehicle.year}</p>
                </div>
              </div>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                🗑️
              </button>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">Patente</p>
              <p className="font-semibold text-lg">{vehicle.licensePlate}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Historial de Servicios</h3>
      
      <div className="space-y-4">
        {serviceHistory.map((service) => (
          <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h4 className="font-bold text-lg">{service.service}</h4>
                  <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    {service.status === 'COMPLETED' ? 'Completado' : service.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">🔧 {service.provider}</p>
                <p className="text-sm text-gray-500">📅 {new Date(service.date).toLocaleDateString('es-CL')}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">{'⭐'.repeat(Math.floor(service.rating))}</span>
                  <span className="ml-2 text-sm text-gray-600">{service.rating}/5</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">${service.cost.toLocaleString('es-CL')}</p>
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  Ver detalles
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total invertido este año</p>
            <p className="text-3xl font-bold text-blue-600">
              ${serviceHistory.reduce((sum, s) => sum + s.cost, 0).toLocaleString('es-CL')}
            </p>
          </div>
          <div className="text-5xl">💰</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <Card className="overflow-hidden shadow-lg border border-slate-200/80 rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 sm:p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight mb-1">Mi Cuenta</h2>
              <p className="text-blue-200 text-xs sm:text-sm font-medium">Panel de Cliente RedMecánica</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white text-2xl hover:text-blue-200 transition-colors p-2 touch-target">
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/50">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              { id: 'profile', label: '👤 Perfil', icon: '👤' },
              { id: 'vehicles', label: '🚗 Vehículos', icon: '🚗' },
              { id: 'history', label: '📋 Historial', icon: '📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3.5 font-bold text-xs sm:text-sm transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'vehicles' && renderVehiclesTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </div>
      </Card>
    </div>
  );
};

export default ClientDashboard;
