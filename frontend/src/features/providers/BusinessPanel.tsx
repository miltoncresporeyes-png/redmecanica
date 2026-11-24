import React, { useEffect, useState } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import api from '../../lib/http';
import CoverageDashboard from './CoverageDashboard';
import VerificationCard from './VerificationCard';
import ScheduleEditor from './ScheduleEditor';

interface Props {
  provider: any;
  onSaved: () => void;
  onUpgradePlan: () => void;
}

const FIELDS = [
  { key: 'businessName', label: 'Nombre del negocio', type: 'text', placeholder: 'Ej: Taller Martínez' },
  { key: 'phone', label: 'Teléfono / WhatsApp', type: 'tel', placeholder: '+56 9 8341 4730' },
  { key: 'commune', label: 'Comuna base', type: 'text', placeholder: 'Ej: Maipú' },
  { key: 'address', label: 'Dirección (opcional)', type: 'text', placeholder: 'Calle y número' },
  { key: 'website', label: 'Sitio web (opcional)', type: 'url', placeholder: 'https://' },
  { key: 'experience', label: 'Años de experiencia', type: 'number', placeholder: '0' },
] as const;

const toForm = (p: any) => ({
  businessName: p?.businessName || '',
  experience: p?.experience != null ? String(p.experience) : '',
  phone: p?.phone || '',
  commune: p?.commune || '',
  address: p?.address || '',
  website: p?.website || '',
  bio: p?.bio || '',
});

/**
 * Mi negocio: como te ve el cliente. Los datos de la vitrina primero y, plegada, la cobertura
 * (zonas) para que no abrume a quien solo quiere corregir un telefono.
 */
const BusinessPanel: React.FC<Props> = ({ provider, onSaved, onUpgradePlan }) => {
  const [form, setForm] = useState(toForm(provider));
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  // La cobertura hace sus propias consultas: solo se carga cuando la persona la abre.
  const [coverageOpen, setCoverageOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useEffect(() => { setForm(toForm(provider)); }, [provider?.id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider?.id) return;
    setSaving(true);
    setMsg(null);
    try {
      await api.put(`/providers/${provider.id}`, {
        businessName: form.businessName,
        experience: form.experience === '' ? null : Number(form.experience),
        phone: form.phone,
        commune: form.commune,
        address: form.address,
        website: form.website,
        bio: form.bio,
      });
      setMsg({ ok: true, text: 'Cambios guardados. Ya se ven en tu vitrina pública.' });
      onSaved();
    } catch (err: any) {
      setMsg({ ok: false, text: err.response?.data?.error || 'No se pudieron guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  const visible = provider?.status === 'ACTIVE' || provider?.status === 'APPROVED';

  return (
    <div className="space-y-4 max-w-2xl">
      <section className="bg-white rounded-card p-6 border border-slate-200 shadow-sm" aria-labelledby="biz-title">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 id="biz-title" className="text-lg text-slate-900">Tu vitrina</h2>
          {provider?.id && visible && (
            <a href={`/proveedor/${provider.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost !min-h-[40px] !py-2">
              Ver como la ve un cliente <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>

        <form onSubmit={save} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label htmlFor={`bz-${f.key}`} className="block text-sm font-semibold text-slate-700 mb-1.5">{f.label}</label>
              <input
                id={`bz-${f.key}`}
                type={f.type}
                min={f.type === 'number' ? 0 : undefined}
                max={f.type === 'number' ? 80 : undefined}
                value={(form as any)[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="input-market"
              />
            </div>
          ))}
          <div>
            <label htmlFor="bz-bio" className="block text-sm font-semibold text-slate-700 mb-1.5">Presentación</label>
            <textarea id="bz-bio" rows={4} value={form.bio} onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))} className="input-market" placeholder="Qué servicios ofreces y por qué elegirte" />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Guardando…' : 'Guardar cambios'}</button>
            {msg && <span role="status" className={`text-sm font-medium ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</span>}
          </div>
        </form>
      </section>

      {provider?.id && <VerificationCard provider={provider} onSaved={onSaved} />}

      <details className="group bg-white rounded-card border border-slate-200 shadow-sm" onToggle={(e) => setScheduleOpen((e.currentTarget as HTMLDetailsElement).open)}>
        <summary className="flex items-center justify-between gap-3 p-6 cursor-pointer list-none min-h-[44px]">
          <span>
            <span className="block text-lg font-heading font-bold text-slate-900">Horario de atención</span>
            <span className="block text-sm text-slate-600">Cuándo atiendes. Lo ve el cliente en tu vitrina.</span>
          </span>
          <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="px-6 pb-6">{scheduleOpen && provider?.id && <ScheduleEditor providerId={provider.id} />}</div>
      </details>

      <details className="group bg-white rounded-card border border-slate-200 shadow-sm" onToggle={(e) => setCoverageOpen((e.currentTarget as HTMLDetailsElement).open)}>
        <summary className="flex items-center justify-between gap-3 p-6 cursor-pointer list-none min-h-[44px]">
          <span>
            <span className="block text-lg font-heading font-bold text-slate-900">Zonas de cobertura</span>
            <span className="block text-sm text-slate-600">Dónde apareces y recibes clientes.</span>
          </span>
          <ChevronDown className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="px-6 pb-6">
          {coverageOpen && <CoverageDashboard onUpgradePlan={onUpgradePlan} />}
        </div>
      </details>
    </div>
  );
};

export default BusinessPanel;
