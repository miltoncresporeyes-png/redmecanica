import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Card from '../../components/common/Card';
import { registerProvider } from '../../services/api';
import AutocompleteInput from '../../components/common/AutocompleteInput';
import { COMUNAS_POR_REGION, CALLES_COMUNES, REGIONES } from '../../data/autocompleteData';
import { MARKETPLACE_CATEGORIES, getCategoryBySlug } from '../../data/marketplace';
import { validarRUT, formatearRUT, validarRUTDetalle } from '../../utils/rutValidator';
import { formatearWhatsAppChile, validarWhatsAppChile } from '../../utils/phoneValidator';
import { useAuth } from '../../app/providers';
import LoginModal from '../auth/LoginModal';
import { trackEvent } from '../../lib/analytics';
import api from '../../lib/http';
import { fileToDocumentDataUrl } from '../../utils/documentFile';
import { Car, Check, FileText, IdCard, CircleCheck } from 'lucide-react';

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
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [draftLoaded, setDraftLoaded] = useState(false);
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
    phone: '+56 ',
    website: '',
    paymentMethods: 'CASH,TRANSFER',
    backgroundCheckUrl: '',
    idDocumentUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Embudo de registro: inicio
  useEffect(() => {
    trackEvent('provider_registration_started');
  }, []);

  // Precarga desde /unete (borrador de vitrina en 2 minutos)
  useEffect(() => {
    const draftRaw = localStorage.getItem('provider_draft');
    const draft = draftRaw ? JSON.parse(draftRaw) : {};
    const categorySlug = searchParams.get('category') || draft.categorySlug || '';
    const cat = getCategoryBySlug(categorySlug);
    const servicesRaw = searchParams.get('services') || draft.services || '';
    const prefilledSpecs = servicesRaw
      ? servicesRaw.split(/[,;\n]+/).map((s: string) => s.trim()).filter(Boolean).slice(0, 6)
      : [];
    const hasPrefill =
      searchParams.get('businessName') || draft.businessName || categorySlug || searchParams.get('commune') || draft.commune;
    if (hasPrefill) {
      setFormData((prev: any) => ({
        ...prev,
        businessName: searchParams.get('businessName') || draft.businessName || prev.businessName,
        categorySlug: categorySlug || prev.categorySlug,
        type: cat?.backendType || prev.type,
        commune: searchParams.get('commune') || draft.commune || prev.commune,
        phone: searchParams.get('phone') || draft.phone || prev.phone,
        bio: prefilledSpecs.length > 0 ? `Servicios: ${prefilledSpecs.join(', ')}.` : prev.bio,
        specialties: prefilledSpecs.length > 0 ? prefilledSpecs : prev.specialties,
      }));
      setDraftLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const specialtyOptions = [
    { id: 'MEC_GENERAL', label: 'Mecánica General' },
    { id: 'ELECTRICITY', label: 'Electricidad / Electrónica' },
    { id: 'BRAKES', label: 'Frenos y Suspensión' },
    { id: 'VULCA', label: 'Vulcanización' },
    { id: 'PAINT', label: 'Hojalatería y Pintura' },
    { id: 'AC', label: 'Aire Acondicionado' },
    { id: 'ALIGMENT', label: 'Alineación y Balanceo' },
    { id: 'DIAG', label: 'Diagnóstico / Scanner' },
    { id: 'DETAIL', label: 'Detailing / Lavado' },
    { id: 'TOW', label: 'Grúa y Auxilio' },
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
    if (step === 1) {
      if (!formData.type && !formData.categorySlug) {
        setError('Elige la categoría de tu vitrina para continuar.');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.businessName.trim()) {
        setError('El nombre de fantasía es obligatorio.');
        return false;
      }
      if (formData.rut.trim()) {
        const rutCheck = validarRUTDetalle(formData.rut);
        if (!rutCheck.isValid) {
          setError(rutCheck.error || 'El RUT ingresado no es válido según Módulo 11.');
          return false;
        }
      }
      if (formData.experience && parseInt(formData.experience) < 0) {
        setError('Debes ingresar años de experiencia válidos.');
        return false;
      }
      if (formData.bio.trim() && formData.bio.length < 10) {
        setError('La presentación debe tener al menos 10 caracteres.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.commune.trim()) {
        setError('La comuna es obligatoria.');
        return false;
      }
      const phoneCheck = validarWhatsAppChile(formData.phone);
      if (!phoneCheck.isValid) {
        setError(phoneCheck.error || 'Debes ingresar un número de WhatsApp válido.');
        return false;
      }
    } else if (step === 4) {
      // Documentos opcionales para publicar; se pueden subir después para obtener "Verificado"
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      trackEvent('provider_registration_step_completed', { step });
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  // Las fotos se reducen en el navegador (una foto de celular pesa varios MB). El archivo queda en memoria y se
  // sube DESPUES de crear la vitrina, por separado: antes viajaba dentro de la misma peticion y el servidor la
  // rechazaba por tamaño, dejando a la persona sin respuesta al pulsar "Finalizar".
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDocumentDataUrl(file);
      setFormData((prev: any) => ({ ...prev, [field]: dataUrl }));
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'No se pudo preparar el archivo.');
    }
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

      // Valores por defecto para no dejar perfiles vacíos
      const bioValue = formData.bio?.trim() ? formData.bio : 'Servicios automotrices en tu comuna. Contacto directo por WhatsApp.';

      // Convertir specialties array a string separado por comas para el API si es necesario
      // Los documentos NO van en esta peticion (ver handleFileUpload): se suben aparte, despues.
      const { idDocumentUrl, backgroundCheckUrl, ...formRest } = formData;
      const payload = {
        ...formRest,
        userId: userId,
        bio: bioValue,
        specialties: (formData.specialties || []).join(','),
        vehicle: vehicleValue
      };
      await registerProvider(payload);
      trackEvent('provider_registration_completed', { hasDocs: Boolean(backgroundCheckUrl || idDocumentUrl) });
      localStorage.removeItem('provider_draft');

      // Documentos: si fallan, la vitrina ya existe y se pueden subir despues desde el panel (no se pierde el registro).
      let docsFailed = false;
      if (idDocumentUrl || backgroundCheckUrl) {
        try {
          await api.put('/providers/me/documents', {
            ...(idDocumentUrl ? { idDocumentUrl } : {}),
            ...(backgroundCheckUrl ? { backgroundCheckUrl } : {}),
          });
        } catch {
          docsFailed = true;
        }
      }
      if (docsFailed) {
        alert('Tu vitrina quedó creada, pero no pudimos subir tus documentos. Podrás subirlos desde tu panel, en “Mi negocio”.');
      }
      
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
    <div className="space-y-4 min-w-0">
      <h3 className="text-xl text-slate-900 break-words">¿Qué servicios promocionas?</h3>
      <p className="text-xs sm:text-sm text-slate-500 break-words">Tu vitrina aparecerá cuando busquen esta categoría en tu comuna.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setFormData({ ...formData, categorySlug: cat.slug, type: cat.backendType, specialties: [] })}
            className={`p-3.5 sm:p-4 border-2 rounded-card flex items-center gap-3 transition-all text-left min-w-0 cursor-pointer ${
              (formData.categorySlug === cat.slug || (!formData.categorySlug && formData.type === cat.backendType))
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                : 'border-slate-100 hover:border-blue-200 bg-white shadow-xs'
            }`}
          >
            <span className="text-2xl sm:text-3xl shrink-0">{cat.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="font-bold text-xs sm:text-sm tracking-tight block truncate">{cat.label}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 block truncate">{cat.shortDesc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2_Info = () => {
    const isTechnical = formData.type === 'MECHANIC' || formData.type === 'WORKSHOP';

    return (
      <div className="space-y-6">
        <h3 className="text-xl text-slate-900">Información del negocio</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de Fantasía o Empresa</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-control focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: Talleres Martínez Ltda."
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-slate-600">RUT (opcional)</label>
              {formData.rut && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  validarRUT(formData.rut) 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {validarRUT(formData.rut) ? '✓ DV Válido (Módulo 11)' : '⚠ DV Inválido'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: formatearRUT(e.target.value) })}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-control focus:ring-2 outline-none transition-all ${
                formData.rut && !validarRUT(formData.rut)
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
              placeholder="12.345.678-9"
            />
            {formData.rut && !validarRUT(formData.rut) && (
              <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1 animate-fadeIn">
                <span>⚠️</span> {validarRUTDetalle(formData.rut).error}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Años de Experiencia (opcional)</label>
            <input
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-control focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: 10"
            />
          </div>
          {!isTechnical && (
             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría</label>
                <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-control font-bold border border-blue-100">
                  {formData.type === 'TOWING' ? '🚚 Auxilio y Grúa' : '🛡️ Aseguradora'}
                </div>
             </div>
          )}
        </div>

        {isTechnical && (
          <div className="space-y-3 p-4 bg-slate-50 rounded-card border border-slate-100">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Especialidades (Selecciona una o más)</label>
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, specialties: specialtyOptions.map(s => s.label) })}
                className="text-sm text-primary font-bold hover:underline min-h-[44px]"
              >
                Seleccionar todas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  aria-pressed={(formData.specialties || []).includes(spec.label)}
                  onClick={() => toggleSpecialty(spec.label)}
                  className={`px-3 py-2 rounded-control text-sm font-semibold transition-all border min-h-[40px] ${
                    (formData.specialties || []).includes(spec.label)
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {(formData.specialties || []).includes(spec.label) && <span className="mr-1">✓</span>}
                  {spec.label}
                </button>
              ))}
            </div>
            {(formData.specialties || []).length === 0 && (
              <p className="text-xs text-slate-500 font-medium">Elige al menos una para aparecer en más búsquedas.</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Presentación / Propuesta de Valor (opcional)</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-control focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            placeholder="Cuéntanos por qué los clientes deberían elegirte..."
          />
        </div>
        
        {(formData.type === 'MECHANIC' || formData.type === 'TOWING') && (
          <div className="bg-slate-800 p-4 rounded-card text-white shadow-xl">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
              <Car className="w-4 h-4" aria-hidden="true" /> Datos del vehículo operativo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Marca del Vehículo</label>
                <select
                  value={formData.vehicleBrand}
                  onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value, customVehicleBrand: '' })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-control focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                >
                  <option value="" className="text-slate-800">Seleccionar marca...</option>
                  {VEHICLE_BRANDS.map((brand) => (
                    <option key={brand} value={brand} className="text-slate-800">{brand}</option>
                  ))}
                </select>
              </div>

              {formData.vehicleBrand === 'Otro' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Marca / Modelo</label>
                  <input
                    type="text"
                    value={formData.customVehicleBrand}
                    onChange={(e) => setFormData({ ...formData, customVehicleBrand: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-control focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                    placeholder="Ej: BYD Song Plus, Changan CS55..."
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Patente</label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-control focus:ring-2 focus:ring-blue-400 outline-none text-sm uppercase"
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
      <h3 className="text-xl text-slate-900">Ubicación y contacto</h3>
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Región</label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-control outline-none"
          >
            {REGIONES.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Comuna</label>
          <AutocompleteInput
            value={formData.commune}
            onChange={(value) => setFormData({ ...formData, commune: value })}
            suggestions={comunasSugeridas}
            placeholder="Ej: Las Condes"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-control"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-bold text-slate-600">WhatsApp / Teléfono</label>
            {formData.phone && formData.phone.trim() !== '+56' && formData.phone.trim() !== '+56 ' && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                validarWhatsAppChile(formData.phone).isValid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {validarWhatsAppChile(formData.phone).isValid ? '✓ Válido (+56 9)' : '⚠ 9 dígitos requeridos'}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: formatearWhatsAppChile(e.target.value) })}
              onFocus={() => {
                if (!formData.phone || formData.phone.trim() === '') {
                  setFormData({ ...formData, phone: '+56 ' });
                }
              }}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-control focus:ring-2 outline-none font-medium transition-all ${
                formData.phone && formData.phone.trim() !== '+56' && !validarWhatsAppChile(formData.phone).isValid
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-rose-500'
                  : 'border-slate-200 focus:ring-blue-500'
              }`}
              placeholder="+56 9 8341 4730"
            />
          </div>
          {formData.phone && formData.phone.trim() !== '+56' && !validarWhatsAppChile(formData.phone).isValid && (
            <p className="text-xs text-rose-600 mt-1 font-medium animate-fadeIn">
              ⚠️ {validarWhatsAppChile(formData.phone).error}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">
            Formato nacional: +56 seguido de 9 dígitos iniciando en 9.
          </p>
        </div>
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-bold text-slate-600">Dirección (opcional)</label>
            <span className="text-xs text-slate-500 font-medium">Escribe tu calle y número libremente</span>
          </div>
          <AutocompleteInput
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
            suggestions={CALLES_COMUNES}
            placeholder="Ej: Av. Providencia 1234, Depto 402..."
            suggestionsLabel="Avenidas sugeridas (puedes escribir cualquier calle y número):"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-control focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <p className="text-xs text-slate-500 mt-1">
            Las opciones del menú son solo atajos. Puedes escribir cualquier dirección, pasaje o número.
          </p>
        </div>
      </div>
    </div>
  );
  
  const renderStep4_Docs = () => (
    <div className="space-y-4">
       <h3 className="text-xl text-slate-900">Documentación (opcional)</h3>
       <p className="text-sm text-slate-500 mb-4">Puedes publicar ahora y subir tus documentos después. Con tu cédula y tu certificado de antecedentes obtienes la insignia «Verificado».</p>
      
      <div className="grid grid-cols-1 gap-4">
        {/* Certificado de Antecedentes */}
        <div 
          onClick={() => document.getElementById('file-antecedentes')?.click()}
          className={`p-8 border-2 border-dashed rounded-card text-center cursor-pointer transition-all ${
            formData.backgroundCheckUrl 
              ? 'border-emerald-500 bg-emerald-50' 
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
          <span className="block mb-2 text-slate-400">{formData.backgroundCheckUrl ? <CircleCheck className="w-10 h-10 mx-auto text-emerald-600" aria-hidden="true" /> : <FileText className="w-10 h-10 mx-auto" aria-hidden="true" />}</span>
          <span className={`font-bold ${formData.backgroundCheckUrl ? 'text-emerald-700' : 'text-slate-600'}`}>
            {formData.backgroundCheckUrl ? 'Certificado Cargado' : 'Certificado de Antecedentes'}
          </span>
          {formData.backgroundCheckUrl && <p className="text-xs text-emerald-600 mt-1">Haz clic para cambiar el archivo</p>}
        </div>

        {/* Cédula de Identidad */}
        <div 
          onClick={() => document.getElementById('file-id')?.click()}
          className={`p-8 border-2 border-dashed rounded-card text-center cursor-pointer transition-all ${
            formData.idDocumentUrl 
              ? 'border-emerald-500 bg-emerald-50' 
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
          <span className="block mb-2 text-slate-400">{formData.idDocumentUrl ? <CircleCheck className="w-10 h-10 mx-auto text-emerald-600" aria-hidden="true" /> : <IdCard className="w-10 h-10 mx-auto" aria-hidden="true" />}</span>
          <span className={`font-bold ${formData.idDocumentUrl ? 'text-emerald-700' : 'text-slate-600'}`}>
            {formData.idDocumentUrl ? 'Cédula Cargada' : 'Cédula de Identidad (Ambos Lados)'}
          </span>
          {formData.idDocumentUrl && <p className="text-xs text-emerald-600 mt-1">Haz clic para cambiar el archivo</p>}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto p-4 sm:p-8 shadow-2xl rounded-card animate-fadeIn overflow-hidden min-w-0">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-2 mb-4 min-w-0">
           <h2 className="truncate">Crea tu vitrina</h2>
           <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold shrink-0">Paso {step} de 4</span>
        </div>
        {draftLoaded && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-medium rounded-control p-3 mb-4 break-words">
            <CircleCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
            Cargamos tu borrador de “Publica tu negocio”. Revisa y completa para aparecer en el directorio.
          </div>
        )}
        <ol className="flex items-center gap-2" aria-label="Progreso del registro">
          {['Categoría', 'Negocio', 'Contacto', 'Documentos'].map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const current = n === step;
            return (
              <li key={label} className="flex-1 min-w-0" aria-current={current ? 'step' : undefined}>
                <div className={`h-1.5 rounded-full transition-colors ${done || current ? 'bg-primary' : 'bg-slate-200'}`} />
                <span className={`mt-1.5 hidden sm:flex items-center gap-1 text-xs font-semibold truncate ${current ? 'text-primary' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                  {done && <Check className="w-3 h-3" aria-hidden="true" />}{label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3.5 sm:p-4 rounded-card mb-5 sm:mb-6 text-xs sm:text-sm font-bold border border-red-100 animate-slideDown break-words">
          ⚠️ {error}
        </div>
      )}

      <div className="min-h-[300px] sm:min-h-[360px] min-w-0">
        {step === 1 && renderStep1_Type()}
        {step === 2 && renderStep2_Info()}
        {step === 3 && renderStep3_Location()}
        {step === 4 && renderStep4_Docs()}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-slate-100 min-w-0">
        <button 
          type="button"
          onClick={step > 1 ? handleBack : onCancel} 
          className="btn-ghost"
        >
          {step > 1 ? 'Atrás' : 'Cancelar'}
        </button>

        <button 
          type="button"
          onClick={step < 4 ? handleNext : handleSubmit} 
          disabled={loading}
          className={`${step < 4 ? 'btn-primary' : 'btn-cta'} flex-1 sm:flex-none sm:min-w-[180px] disabled:opacity-50`}
        >
          {loading ? 'Publicando…' : step < 4 ? 'Siguiente' : 'Publicar mi vitrina'}
        </button>
      </div>

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
