import React, { useState, useMemo } from 'react';
import Card from '../../components/common/Card';
import { registerProvider } from '../../services/api';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import { COMUNAS_POR_REGION, CALLES_COMUNES, REGIONES } from '../../data/autocompleteData';
import { validarRUT, formatearRUT } from '../../utils/rutValidator';
import { useAuth } from '../../app/providers';
import LoginModal from '../auth/LoginModal';

interface ProviderOnboardingProps {
  onComplete: () => void;
  onCancel: () => void;
}

const VEHICLE_BRANDS = [
  'Chevrolet',
  'Ford',
  'Toyota',
  'Hyundai',
  'Kia',
  'Nissan',
  'Suzuki',
  'Mazda',
  'Honda',
  'Volkswagen',
  'Mitsubishi',
  'Jeep',
  'Renault',
  'Fiat',
  'Peugeot',
  'Citroën',
  'Subaru',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volvo',
  'Isuzu',
  'Hino',
  'Scania',
  'Mercedes-Benz (Camiones)',
  'Otro'
];

const ProviderOnboarding: React.FC<ProviderOnboardingProps> = ({ onComplete, onCancel }) => {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    userId: '', 
    businessName: '', 
    rut: '', 
    experience: '', 
    specialties: [], 
    bio: '',
    vehicleBrand: '',
    customVehicleBrand: '',
    vehicle: '',
    licensePlate: '',
    latitude: -33.4489, 
    longitude: -70.6693,
    address: '',
    commune: '',
    region: 'Metropolitana',
    phone: '',
    website: '',
    paymentMethods: 'CASH,TRANSFER',
    backgroundCheckUrl: '',
    idDocumentUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  const specialtyOptions = [
    { id: 'MECHANIC', label: 'Mecánica General' },
    { id: 'ELECTRICITY', label: 'Electricidad / Electrónica' },
    { id: 'BRAKES', label: 'Frenos y Suspensión' },
    { id: 'PAINT', label: 'Hojalatería y Pintura' },
    { id: 'AC', label: 'Aire Acondicionado' },
    { id: 'ALIGMENT', label: 'Alineación y Balanceo' }
  ];

  const toggleSpecialty = (specLabel: string) => {
    const current = formData.specialties || [];
    if (current.includes(specLabel)) {
      setFormData({ ...formData, specialties: current.filter((s: string) => s !== specLabel) });
    } else {
      setFormData({ ...formData, specialties: [...current, specLabel] });
    }
  };

  const comunasSugeridas = useMemo(() => {
    if (formData.region && COMUNAS_POR_REGION[formData.region]) {
      return COMUNAS_POR_REGION[formData.region];
    }
    return Object.values(COMUNAS_POR_REGION).flat();
  }, [formData.region]);

  const validateStep = () => {
    setError(null);
    if (step === 2) {
      if (!formData.businessName.trim()) {
        setError('El nombre de fantasía es obligatorio.');
        return false;
      }
      if (!formData.rut.trim()) {
        setError('El RUT es obligatorio.');
        return false;
      }
      if (!validarRUT(formData.rut)) {
        setError('El RUT ingresado no es válido.');
        return false;
      }
      if (!formData.experience || parseInt(formData.experience) < 0) {
        setError('Debes ingresar años de experiencia válidos.');
        return false;
      }
      if ((formData.type === 'MECHANIC' || formData.type === 'WORKSHOP') && formData.specialties.length === 0) {
        setError('Debes seleccionar al menos una especialidad.');
        return false;
      }
      if (!formData.bio.trim() || formData.bio.length < 20) {
        setError('La presentación debe tener al menos 20 caracteres.');
        return false;
      }
      if ((formData.type === 'MECHANIC' || formData.type === 'TOWING')) {
        if (!formData.vehicleBrand) {
          setError('Debes seleccionar la marca del vehículo.');
          return false;
        }
        if (formData.vehicleBrand === 'Otro' && !formData.customVehicleBrand.trim()) {
          setError('Debes ingresar la marca y modelo del vehículo.');
          return false;
        }
        if (!formData.licensePlate.trim()) {
          setError('La patente del vehículo es obligatoria.');
          return false;
        }
      }
    } else if (step === 3) {
      if (!formData.commune.trim()) {
        setError('La comuna es obligatoria.');
        return false;
      }
      if (!formData.phone.trim() || formData.phone.length < 9) {
        setError('Debes ingresar un número de teléfono válido.');
        return false;
      }
      if (!formData.address.trim()) {
        setError('La dirección es obligatoria.');
        return false;
      }
    } else if (step === 4) {
      if (!formData.backgroundCheckUrl) {
        setError('El Certificado de Antecedentes es obligatorio.');
        return false;
      }
      if (!formData.idDocumentUrl) {
        setError('La Cédula de Identidad es obligatoria.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación básica
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande (máx 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, [field]: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    // Si no está autenticado, mostrar modal de login
    if (!user?.id) {
      setPendingSubmit(true);
      setShowLoginModal(true);
      return;
    }

    await submitRegistration(user.id);
  };

  const submitRegistration = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Construir el nombre completo del vehículo
      const vehicleValue = formData.vehicleBrand === 'Otro' 
        ? formData.customVehicleBrand 
        : formData.vehicleBrand;

      // Convertir specialties array a string separado por comas para el API si es necesario
      const payload = {
        ...formData,
        userId: userId,
        specialties: formData.specialties.join(','),
        vehicle: vehicleValue
      };
      await registerProvider(payload);
      
      const savedPlan = localStorage.getItem('selectedPlan');
      if (savedPlan) {
        const { planId } = JSON.parse(savedPlan);
        localStorage.removeItem('selectedPlan');
        if (planId === 'free') {
          alert('¡Registro exitoso! Tu plan Básico está activo.');
        } else {
          alert('¡Registro exitoso! Serás redirigido para completar el pago.');
        }
      } else {
        alert('¡Registro exitoso! Tu solicitud está siendo revisada.');
      }
      onComplete();
    } catch (err: any) {
      console.error("Registration failed", err);
      setError(err.response?.data?.error || "Error al registrar prestador.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (loggedInUser: any) => {
    updateUser(loggedInUser);
    setShowLoginModal(false);
    // Si había un pendiente de envío, continuar con el registro
    if (pendingSubmit) {
      setPendingSubmit(false);
      // Usar el ID del usuario directamente del parámetro
      await submitRegistration(loggedInUser.id);
    }
  };

  const renderStep1_Type = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-slate-800">Selecciona tu tipo de servicio</h3>
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'MECHANIC', label: 'Mecánico a Domicilio', icon: '🔧' },
          { id: 'WORKSHOP', label: 'Taller Establecido', icon: '🏭' },
          { id: 'TOWING', label: 'Servicio de Grúa', icon: '🚛' },
          { id: 'INSURANCE', label: 'Aseguradora', icon: '🛡️' }
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setFormData({ ...formData, type: type.id, specialties: [] })}
            className={`p-6 border-2 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all ${
              formData.type === type.id 
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-100' 
                : 'border-slate-100 hover:border-blue-200 bg-white shadow-sm'
            }`}
          >
            <span className="text-4xl">{type.icon}</span>
            <span className="font-bold text-sm tracking-tight">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2_Info = () => {
    const isTechnical = formData.type === 'MECHANIC' || formData.type === 'WORKSHOP';

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800">Información del Prestador</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Nombre de Fantasía o Empresa</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Talleres Martínez Ltda."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">RUT (Personal o Empresa)</label>
            <input
              type="text"
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: formatearRUT(e.target.value) })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="12.345.678-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-1">Años de Experiencia</label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: 10"
            />
          </div>
          {!isTechnical && (
             <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Categoría</label>
                <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100">
                  {formData.type === 'TOWING' ? '🚚 Auxilio y Grúa' : '🛡️ Aseguradora'}
                </div>
             </div>
          )}
        </div>

        {isTechnical && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Especialidades (Selecciona una o más)</label>
              <button 
                onClick={() => setFormData({ ...formData, specialties: specialtyOptions.map(s => s.label) })}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Seleccionar todas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => toggleSpecialty(spec.label)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    (formData.specialties || []).includes(spec.label)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {(formData.specialties || []).includes(spec.label) && <span className="mr-1">✓</span>}
                  {spec.label}
                </button>
              ))}
            </div>
            {(formData.specialties || []).length === 0 && (
              <p className="text-[10px] text-red-500 font-medium">Debes seleccionar al menos una especialidad.</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-600 mb-1">Presentación / Propuesta de Valor</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            placeholder="Cuéntanos por qué los clientes deberían elegirte..."
          />
        </div>
        
        {(formData.type === 'MECHANIC' || formData.type === 'TOWING') && (
          <div className="bg-slate-800 p-4 rounded-2xl text-white shadow-xl">
            <h4 className="text-sm font-black mb-3 flex items-center gap-2">
              <span>🚗</span> Datos del Vehículo Operativo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Marca del Vehículo</label>
                <select
                  value={formData.vehicleBrand}
                  onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value, customVehicleBrand: '' })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                >
                  <option value="" className="text-slate-800">Seleccionar marca...</option>
                  {VEHICLE_BRANDS.map((brand) => (
                    <option key={brand} value={brand} className="text-slate-800">{brand}</option>
                  ))}
                </select>
              </div>

              {formData.vehicleBrand === 'Otro' && (
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Marca / Modelo</label>
                  <input
                    type="text"
                    value={formData.customVehicleBrand}
                    onChange={(e) => setFormData({ ...formData, customVehicleBrand: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                    placeholder="Ej: BYD Song Plus, Changan CS55..."
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Patente</label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm uppercase"
                  placeholder="AB-CD-11"
                  maxLength={8}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep3_Location = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-black">Ubicación y Contacto</h3>
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-600 mb-1">Región</label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
          >
            {REGIONES.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-1">Comuna</label>
          <AutocompleteInput
            value={formData.commune}
            onChange={(value) => setFormData({ ...formData, commune: value })}
            suggestions={comunasSugeridas}
            placeholder="Ej: Las Condes"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-600 mb-1">Teléfono</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
            placeholder="+56 9 83414730"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-600 mb-1">Dirección</label>
          <AutocompleteInput
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
            suggestions={CALLES_COMUNES}
            placeholder="Calle, número..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
  
  const renderStep4_Docs = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-black">Documentación Obligatoria</h3>
      <p className="text-sm text-slate-500 mb-4">Sube fotos o PDFs claros de tus documentos para validar tu cuenta.</p>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Certificado de Antecedentes */}
        <div 
          onClick={() => document.getElementById('file-antecedentes')?.click()}
          className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
            formData.backgroundCheckUrl 
              ? 'border-green-500 bg-green-50' 
              : 'border-slate-200 hover:border-blue-400 bg-slate-50'
          }`}
        >
          <input 
            id="file-antecedentes"
            type="file" 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={(e) => handleFileUpload(e, 'backgroundCheckUrl')}
          />
          <span className="text-4xl block mb-2">{formData.backgroundCheckUrl ? '✅' : '📄'}</span>
          <span className={`font-bold ${formData.backgroundCheckUrl ? 'text-green-700' : 'text-slate-600'}`}>
            {formData.backgroundCheckUrl ? 'Certificado Cargado' : 'Certificado de Antecedentes'}
          </span>
          {formData.backgroundCheckUrl && <p className="text-xs text-green-600 mt-1">Haz clic para cambiar el archivo</p>}
        </div>

        {/* Cédula de Identidad */}
        <div 
          onClick={() => document.getElementById('file-id')?.click()}
          className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
            formData.idDocumentUrl 
              ? 'border-green-500 bg-green-50' 
              : 'border-slate-200 hover:border-blue-400 bg-slate-50'
          }`}
        >
          <input 
            id="file-id"
            type="file" 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={(e) => handleFileUpload(e, 'idDocumentUrl')}
          />
          <span className="text-4xl block mb-2">{formData.idDocumentUrl ? '✅' : '🆔'}</span>
          <span className={`font-bold ${formData.idDocumentUrl ? 'text-green-700' : 'text-slate-600'}`}>
            {formData.idDocumentUrl ? 'Cédula Cargada' : 'Cédula de Identidad (Ambos Lados)'}
          </span>
          {formData.idDocumentUrl && <p className="text-xs text-green-600 mt-1">Haz clic para cambiar el archivo</p>}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto p-8 shadow-2xl rounded-3xl animate-fadeIn">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
           <h2 className="text-2xl font-black text-slate-800 tracking-tight">Registro de Prestadores</h2>
           <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-black">Paso {step} de 4</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 text-sm font-bold border border-red-100 animate-slideDown">
          ⚠️ {error}
        </div>
      )}

      <div className="min-h-[400px]">
        {step === 1 && renderStep1_Type()}
        {step === 2 && renderStep2_Info()}
        {step === 3 && renderStep3_Location()}
        {step === 4 && renderStep4_Docs()}
      </div>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100">
        <button 
          onClick={step > 1 ? handleBack : onCancel} 
          className="px-6 py-3 text-slate-400 font-black hover:text-slate-800 transition-colors"
        >
          {step > 1 ? 'Atrás' : 'Cancelar'}
        </button>

        <button 
          onClick={step < 4 ? handleNext : handleSubmit} 
          disabled={loading}
          className={`px-10 py-4 font-black rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
            step < 4 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
              : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
          }`}
        >
          {loading ? 'Procesando...' : step < 4 ? 'Siguiente' : 'Finalizar Registro'}
        </button>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}} />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingSubmit(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        defaultMode="register"
        defaultRole="provider"
      />
    </Card>
  );
};

export default ProviderOnboarding;
