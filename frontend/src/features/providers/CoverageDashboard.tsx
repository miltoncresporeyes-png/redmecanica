import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin, Plus, Trash2, AlertCircle, CheckCircle2, ShieldCheck,
  Sparkles, Layers, Info, X, ChevronRight, Search, Loader2, Wrench
} from 'lucide-react';
import {
  getMyCoverage,
  addCoverageCommune,
  removeCoverageCommune,
  MyCoverageResponse,
  ProviderCoverageItem,
  ExpansionProduct
} from '../../services/api';
import { REGIONES, COMUNAS_POR_REGION } from '../../data/autocompleteData';
import { trackEvent } from '../../lib/analytics';

export function getFriendlySourceBadge(source: string, isPrimary: boolean) {
  if (isPrimary || source === 'BASE_COMMUNE') {
    return {
      label: 'Comuna principal (Taller/Base)',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
  }
  switch (source) {
    case 'PLAN_INCLUDED':
      return {
        label: 'Incluida en tu plan',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    case 'EXPANSION_PAID':
      return {
        label: 'Expansión territorial',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
      };
    case 'PROMOTIONAL':
      return {
        label: 'Promocional',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    default:
      return {
        label: 'Activa',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      };
  }
}

interface CoverageDashboardProps {
  onUpgradePlan?: () => void;
}

export default function CoverageDashboard({ onUpgradePlan }: CoverageDashboardProps) {
  const [data, setData] = useState<MyCoverageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal agregar comuna
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('Metropolitana');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [communeSearch, setCommuneSearch] = useState('');
  const [savingCommune, setSavingCommune] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal de compra de expansión
  const [showExpansionModal, setShowExpansionModal] = useState(false);
  const [selectedExpansion, setSelectedExpansion] = useState<ExpansionProduct | null>(null);

  const loadCoverage = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyCoverage();
      setData(res);
      trackEvent('coverage_dashboard_view', { plan: res.plan, used: res.totalUsedCommunes });
    } catch (err: any) {
      console.error('Error cargando cobertura:', err);
      setError('No pudimos cargar tu cobertura territorial. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoverage();
  }, []);

  const availableCommunes = useMemo(() => {
    const list = COMUNAS_POR_REGION[selectedRegion] || [];
    if (!communeSearch.trim()) return list;
    const q = communeSearch.toLowerCase();
    return list.filter((c) => c.toLowerCase().includes(q));
  }, [selectedRegion, communeSearch]);

  const handleAddCommune = async () => {
    if (!selectedCommune) {
      setModalError('Selecciona una comuna para agregar');
      return;
    }
    try {
      setSavingCommune(true);
      setModalError(null);
      await addCoverageCommune({
        commune: selectedCommune,
        region: selectedRegion,
      });

      setSuccessToast(`¡${selectedCommune} agregada a tu cobertura!`);
      setTimeout(() => setSuccessToast(null), 4000);
      setShowAddModal(false);
      setSelectedCommune('');
      setCommuneSearch('');
      await loadCoverage();
    } catch (err: any) {
      setModalError(err.response?.data?.error || 'Error al agregar comuna a la cobertura');
    } finally {
      setSavingCommune(false);
    }
  };

  const handleRemoveCommune = async (cov: ProviderCoverageItem) => {
    if (cov.isPrimary) {
      alert('Tu comuna base no se puede eliminar.');
      return;
    }
    const confirm = window.confirm(`¿Seguro que deseas dejar de atender en ${cov.commune}? Ya no aparecerás en búsquedas de esa zona.`);
    if (!confirm) return;

    try {
      setDeletingId(cov.id);
      await removeCoverageCommune(cov.id);
      setSuccessToast(`Comuna ${cov.commune} removida de tu cobertura`);
      setTimeout(() => setSuccessToast(null), 4000);
      await loadCoverage();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error al remover comuna');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-semibold text-slate-600">Cargando tu cobertura territorial...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error || 'Error desconocido'}</p>
        </div>
        <button
          onClick={loadCoverage}
          className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const isAtLimit = data.totalUsedCommunes >= data.totalAllowedCommunes;

  return (
    <div className="space-y-6">
      {/* Toast de éxito */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-slideUp">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner de Cobertura */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              Gestión de Territorio y Comunas
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              ¿Dónde quieres que te llamen?
            </h2>
            <p className="text-sm text-blue-100/90 max-w-xl mt-1 leading-relaxed">
              Define en qué comunas aparecerá tu vitrina y recibirás clientes por WhatsApp. Los conductores solo ven prestadores con cobertura activa en su comuna.
            </p>
          </div>

          <button
            onClick={() => {
              if (isAtLimit) {
                setShowExpansionModal(true);
              } else {
                setShowAddModal(true);
              }
            }}
            className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            {isAtLimit ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Ampliar Cobertura</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Agregar Comuna</span>
              </>
            )}
          </button>
        </div>

        {/* Barra de progreso de cupos */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-blue-200/80 font-medium block">Tu Plan Actual</span>
            <div className="text-xl font-black mt-1 flex items-center gap-2">
              <span>{data.plan === 'FREE' ? 'Vitrina Gratis' : data.plan === 'MONTHLY' ? 'Plan Destacado' : data.plan}</span>
              {data.plan === 'FREE' && onUpgradePlan && (
                <button
                  onClick={onUpgradePlan}
                  className="text-[10px] bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 px-2 py-0.5 rounded-full font-bold transition"
                >
                  Mejorar
                </button>
              )}
            </div>
            <span className="text-[11px] text-blue-200/60 mt-0.5 block">{data.planMaxCommunes} comuna(s) base incluidas</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-blue-200/80 font-medium block">Cupos de Comunas</span>
            <div className="text-xl font-black mt-1">
              <span className="text-yellow-400">{data.totalUsedCommunes}</span>
              <span className="text-white/60 text-base"> / {data.totalAllowedCommunes} utilizadas</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isAtLimit ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (data.totalUsedCommunes / data.totalAllowedCommunes) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-blue-200/80 font-medium block">Expansiones Contratadas</span>
            <div className="text-xl font-black mt-1 text-purple-300">
              +{data.expansionSlots} comunas extra
            </div>
            <span className="text-[11px] text-blue-200/60 mt-0.5 block">
              {data.activeExpansions.length > 0
                ? `${data.activeExpansions.length} pack(s) activo(s)`
                : 'Sin packs adicionales'}
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de Límite Alcanzado */}
      {isAtLimit && (
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                Has alcanzado el límite de {data.totalAllowedCommunes} comuna(s) de tu cuenta.
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                ¿Quieres que te llamen conductores de comunas vecinas? Adquiere un Pack de Expansión Territorial desde $7.990/mes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowExpansionModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Packs de Expansión</span>
          </button>
        </div>
      )}

      {/* Lista de Comunas Activas */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black text-gray-900">Tus Comunas con Vitrina Activa</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Aquí es donde tu perfil se indexa en Google y aparece en el buscador de RedMecánica.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
            {data.coverages.length} activas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.coverages.map((cov) => {
            const badge = getFriendlySourceBadge(cov.source, cov.isPrimary);
            return (
              <div
                key={cov.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-start justify-between gap-3 bg-slate-50/50"
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold shrink-0">
                    📍
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{cov.commune}</h4>
                    <p className="text-xs text-gray-500">{cov.region || 'Región Metropolitana'}</p>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-2 ${badge.badgeClass}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                {!cov.isPrimary && (
                  <button
                    onClick={() => handleRemoveCommune(cov)}
                    disabled={deletingId === cov.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Remover comuna"
                  >
                    {deletingId === cov.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Agregar Comuna */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-gray-900 text-lg">Sumar Nueva Comuna</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setModalError(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 my-4 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
                {modalError}
              </div>
            )}

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  1. Región
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => {
                    setSelectedRegion(e.target.value);
                    setSelectedCommune('');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {REGIONES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  2. Filtrar Comuna
                </label>
                <div className="relative mb-2">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={communeSearch}
                    onChange={(e) => setCommuneSearch(e.target.value)}
                    placeholder="Escribe para buscar (ej: Maipú, La Florida)..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-1 divide-y divide-slate-100">
                  {availableCommunes.length === 0 ? (
                    <p className="p-3 text-xs text-gray-400 text-center">No se encontraron comunas</p>
                  ) : (
                    availableCommunes.map((c) => {
                      const isAlreadyActive = data.coverages.some(
                        (cov) => cov.commune.toLowerCase() === c.toLowerCase()
                      );
                      return (
                        <button
                          key={c}
                          disabled={isAlreadyActive}
                          onClick={() => setSelectedCommune(c)}
                          className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition ${
                            selectedCommune === c
                              ? 'bg-blue-600 text-white'
                              : isAlreadyActive
                              ? 'opacity-40 cursor-not-allowed text-gray-400'
                              : 'hover:bg-blue-50 text-gray-700'
                          }`}
                        >
                          <span>{c}</span>
                          {isAlreadyActive && (
                            <span className="text-[10px] text-gray-400">Ya activa</span>
                          )}
                          {selectedCommune === c && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCommune}
                disabled={!selectedCommune || savingCommune}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                {savingCommune ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <span>Activar en {selectedCommune || 'comuna'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compra de Expansión Territorial */}
      {showExpansionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" />
                <div>
                  <h3 className="font-black text-gray-900 text-lg">Packs de Expansión Territorial</h3>
                  <p className="text-xs text-gray-500">Haz crecer tu taller en comunas con alta demanda de conductores</p>
                </div>
              </div>
              <button
                onClick={() => setShowExpansionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {data.expansionProducts.map((prod) => (
                <div
                  key={prod.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer ${
                    prod.popular
                      ? 'border-blue-500 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  onClick={() => setSelectedExpansion(prod)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-sm">{prod.name}</h4>
                      {prod.popular && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{prod.description}</p>
                    <span className="text-xs font-bold text-blue-700 mt-2 block">
                      +{prod.blockSize} cupos de comunas adicionales
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-gray-900">
                      ${prod.price.toLocaleString('es-CL')}
                    </div>
                    <span className="text-[11px] text-gray-500">/mes</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Sin comisiones por trabajos. Pagas tarifa plana mensual y atiendes directamente sin intermediarios.</span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowExpansionModal(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-slate-100 rounded-xl transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert('Redirigiendo a Webpay para contratar pack territorial...');
                  setShowExpansionModal(false);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Contratar Expansión</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
