import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { validarRUT, formatearRUT } from '../../utils/rutValidator';

interface UserProfileProps {
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

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'vehicles' | 'history' | 'payments'>('profile');
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
    console.log('Guardando perfil:', userData);
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ✏️ Editar
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              💾 Guardar
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
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
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RUT</label>
          <input
            type="text"
            value={userData.rut}
            onChange={(e) => setUserData({ ...userData, rut: formatearRUT(e.target.value) })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
          <input
            type="text"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
          <input
            type="text"
            value={userData.region}
            onChange={(e) => setUserData({ ...userData, region: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comuna</label>
          <input
            type="text"
            value={userData.commune}
            onChange={(e) => setUserData({ ...userData, commune: e.target.value })}
            disabled={!editMode}
            className={`w-full p-3 border rounded-lg ${editMode ? 'border-blue-300' : 'border-gray-200 bg-gray-50'}`}
          />
        </div>
      </div>

      <div className="pt-6 border-t">
        <h4 className="text-lg font-semibold mb-4">Configuración de Cuenta</h4>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
            🔒 Cambiar contraseña
          </button>
          <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
            🔔 Notificaciones
          </button>
          <button className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors">
            🌐 Preferencias de idioma
          </button>
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Agregar Vehículo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-6">
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
              <button className="text-red-500 hover:text-red-700">
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

      <div className="text-center mt-8">
        <p className="text-gray-500">Total gastado este año: <span className="font-bold text-lg">${serviceHistory.reduce((sum, s) => sum + s.cost, 0).toLocaleString('es-CL')}</span></p>
      </div>
    </div>
  );

  const renderPaymentsTab = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Métodos de Pago</h3>
      
      <div className="space-y-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
                VISA
              </div>
              <div className="ml-4">
                <p className="font-semibold">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Vence 12/25</p>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700">Eliminar</button>
          </div>
        </Card>

        <button className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <p className="font-semibold text-blue-600">+ Agregar Método de Pago</p>
        </button>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">💳 Pago Seguro</h4>
        <p className="text-sm text-gray-600">
          Todos tus métodos de pago están encriptados con tecnología SSL de 256 bits. Nunca almacenamos información sensible.
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Mi Cuenta</h2>
              <p className="text-blue-100">Gestiona tu perfil y preferencias</p>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white text-2xl hover:text-blue-200">
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'profile', label: '👤 Perfil', icon: '👤' },
              { id: 'vehicles', label: '🚗 Vehículos', icon: '🚗' },
              { id: 'history', label: '📋 Historial', icon: '📋' },
              { id: 'payments', label: '💳 Pagos', icon: '💳' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'vehicles' && renderVehiclesTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
