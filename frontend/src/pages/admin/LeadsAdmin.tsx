import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import api from '../../lib/http';
import { downloadCsv } from '../../lib/csv';

interface Lead {
  id: string;
  email: string;
  discountCode?: string | null;
  createdAt: string;
}

interface LeadStats {
  total: number;
  today: number;
  thisWeek: number;
}

const PAGE_SIZE = 25;

const LeadsAdmin: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [l, s] = await Promise.all([api.get('/admin/launch-leads'), api.get('/admin/launch-leads/stats')]);
      setLeads(Array.isArray(l.data?.leads) ? l.data.leads : []);
      setStats(s.data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'No se pudieron cargar los leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? leads.filter((l) => l.email.toLowerCase().includes(q) || (l.discountCode || '').toLowerCase().includes(q)) : leads;
  }, [leads, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [query]);

  const exportCsv = () =>
    downloadCsv(`leads-${new Date().toISOString().slice(0, 10)}`, filtered, [
      { header: 'Correo', value: (l) => l.email },
      { header: 'Código de descuento', value: (l) => l.discountCode },
      { header: 'Fecha de registro', value: (l) => new Date(l.createdAt).toLocaleString('es-CL') },
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl text-gray-900">Leads de lanzamiento</h1>
          <p className="text-sm text-gray-600">Personas que dejaron su correo para recibir el código de descuento.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost !min-h-[40px] !py-2" aria-label="Actualizar">
            <RefreshCw className="w-4 h-4" aria-hidden="true" /> Actualizar
          </button>
          <button onClick={exportCsv} disabled={filtered.length === 0} className="btn-primary !min-h-[40px] !py-2 disabled:opacity-50">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: stats?.total },
          { label: 'Hoy', value: stats?.today },
          { label: 'Últimos 7 días', value: stats?.thisWeek },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-gray-200 rounded-card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{k.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{k.value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <label htmlFor="lead-search" className="sr-only">Buscar lead</label>
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-control border border-gray-100">
            <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <input id="lead-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por correo o código…" className="bg-transparent border-none focus:outline-none text-sm w-full min-h-0" />
          </div>
        </div>

        {error ? (
          <p role="alert" className="p-6 text-sm text-red-600">{error}</p>
        ) : loading ? (
          <p className="p-6 text-sm text-gray-500">Cargando…</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-sm text-gray-500 text-center">No hay leads{query ? ' que coincidan' : ' registrados todavía'}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th scope="col" className="px-6 py-3 font-semibold">Correo</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Código</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{l.email}</td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-700">{l.discountCode || '—'}</td>
                    <td className="px-6 py-3 text-gray-600 whitespace-nowrap">{new Date(l.createdAt).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
            <span>Página {current} de {pages} · {filtered.length} leads</span>
            <div className="flex gap-2">
              <button disabled={current <= 1} onClick={() => setPage(current - 1)} className="btn-ghost !min-h-[36px] !py-1.5 disabled:opacity-40">Anterior</button>
              <button disabled={current >= pages} onClick={() => setPage(current + 1)} className="btn-ghost !min-h-[36px] !py-1.5 disabled:opacity-40">Siguiente</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsAdmin;
