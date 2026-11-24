import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  providerId: string;
}

interface DayRow {
  dayOfWeek: number; // 0 = domingo ... 6 = sabado (como en la base)
  enabled: boolean;
  start: string;
  end: string;
}

// Se muestra de lunes a domingo
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const defaults = (): DayRow[] =>
  [0, 1, 2, 3, 4, 5, 6].map((d) => ({ dayOfWeek: d, enabled: d >= 1 && d <= 5, start: '09:00', end: '18:00' }));

const errMsg = (e: any, fallback: string) => e?.response?.data?.error || e?.response?.data?.errors?.[0]?.message || fallback;

/** Horario de atencion: lo que ve el cliente en la vitrina ("Hoy 09:00–18:00" / "Cerrado"). */
const ScheduleEditor: React.FC<Props> = ({ providerId }) => {
  const { addToast } = useToast();
  const [rows, setRows] = useState<DayRow[]>(defaults());
  const [loaded, setLoaded] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.get(`/availability/${providerId}`)
      .then(({ data }) => {
        if (cancelled || !Array.isArray(data) || data.length === 0) return;
        setHasSaved(true);
        setRows(defaults().map((d) => {
          const found = data.find((a: any) => a.dayOfWeek === d.dayOfWeek);
          return found ? { dayOfWeek: d.dayOfWeek, enabled: found.isActive !== false, start: found.startTime, end: found.endTime } : { ...d, enabled: false };
        }));
      })
      .catch(() => { /* sin horario guardado: se muestran los valores por defecto */ })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [providerId]);

  const update = (day: number, patch: Partial<DayRow>) => setRows((prev) => prev.map((r) => (r.dayOfWeek === day ? { ...r, ...patch } : r)));

  const save = async () => {
    const open = rows.filter((r) => r.enabled);
    const bad = open.find((r) => r.end <= r.start);
    if (bad) {
      addToast(`${DAY_NAMES[bad.dayOfWeek]}: la hora de cierre debe ser después de la de apertura.`, 'error');
      return;
    }
    setSaving(true);
    try {
      await api.post('/availability/bulk', {
        providerId,
        schedule: open.map((r) => ({ dayOfWeek: r.dayOfWeek, startTime: r.start, endTime: r.end, isActive: true })),
      });
      setHasSaved(true);
      addToast('Horario guardado. Ya se ve en tu vitrina.', 'success');
    } catch (e) {
      addToast(errMsg(e, 'No se pudo guardar el horario.'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <p className="text-sm text-slate-500 py-2">Cargando horario…</p>;

  return (
    <div>
      {!hasSaved && <p className="text-sm text-slate-600 mb-3">Aún no publicas tu horario. Ajusta los días y guarda para que tus clientes sepan cuándo atiendes.</p>}
      <ul className="space-y-2">
        {DISPLAY_ORDER.map((d) => {
          const r = rows.find((x) => x.dayOfWeek === d)!;
          return (
            <li key={d} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-1.5">
              <label className="flex items-center gap-2 w-32 shrink-0 min-h-[44px] cursor-pointer">
                <input type="checkbox" checked={r.enabled} onChange={(e) => update(d, { enabled: e.target.checked })} className="w-5 h-5 accent-primary" />
                <span className="text-sm font-semibold text-slate-800">{DAY_NAMES[d]}</span>
              </label>
              {r.enabled ? (
                <div className="flex items-center gap-2">
                  <label className="sr-only" htmlFor={`s-${d}`}>Apertura {DAY_NAMES[d]}</label>
                  <input id={`s-${d}`} type="time" value={r.start} onChange={(e) => update(d, { start: e.target.value })} className="input-market !w-auto" />
                  <span className="text-slate-500" aria-hidden="true">a</span>
                  <label className="sr-only" htmlFor={`e-${d}`}>Cierre {DAY_NAMES[d]}</label>
                  <input id={`e-${d}`} type="time" value={r.end} onChange={(e) => update(d, { end: e.target.value })} className="input-market !w-auto" />
                </div>
              ) : (
                <span className="text-sm text-slate-500">Cerrado</span>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={save} disabled={saving} className="btn-primary mt-4 disabled:opacity-50">{saving ? 'Guardando…' : 'Guardar horario'}</button>
    </div>
  );
};

export default ScheduleEditor;
