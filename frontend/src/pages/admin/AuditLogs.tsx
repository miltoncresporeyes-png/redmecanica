import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Globe, Monitor, RefreshCw, Search, ShieldAlert, User } from 'lucide-react';
import api from '../../lib/http';
import { downloadCsv } from '../../lib/csv';

interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

const PAGE_SIZE = 25;

const actionTone = (action: string) =>
  action.includes('REGISTER') || action.includes('CREATE') || action.includes('APPROVE') ? 'bg-emerald-100 text-emerald-700'
  : action.includes('LOGIN') ? 'bg-blue-100 text-blue-700'
  : action.includes('SUSPEND') || action.includes('REJECT') || action.includes('DELETE') ? 'bg-red-100 text-red-700'
  : 'bg-gray-100 text-gray-700';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [actions, setActions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Cualquier cambio de filtro vuelve a la primera pagina
  useEffect(() => { setPage(1); }, [debouncedSearch, action, from, to]);

  const buildParams = useCallback((p: number, limit: number) => {
    const params: Record<string, string> = { page: String(p), limit: String(limit) };
    if (debouncedSearch) params.search = debouncedSearch;
    if (action) params.action = action;
    if (from) params.from = from;
    if (to) params.to = to;
    return params;
  }, [debouncedSearch, action, from, to]);

  const requestSeq = useRef(0);

  const fetchLogs = useCallback(async () => {
    const seq = ++requestSeq.current;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/audit', { params: buildParams(page, PAGE_SIZE) });
      if (seq !== requestSeq.current) return; // llego una respuesta mas nueva: descartar esta
      setLogs(data.logs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      if (Array.isArray(data.actions)) setActions(data.actions);
    } catch (e: any) {
      if (seq !== requestSeq.current) return;
      setError(e?.response?.data?.error || 'No se pudo cargar el rastro de auditoría.');
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [buildParams, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const exportCsv = async () => {
    try {
      // Exporta todo lo que coincide con los filtros (hasta 5 paginas de 100 = 500 registros)
      const all: AuditLog[] = [];
      for (let p = 1; p <= 5; p++) {
        const { data } = await api.get('/admin/audit', { params: buildParams(p, 100) });
        all.push(...(data.logs || []));
        if (p >= (data.pages || 1)) break;
      }
      downloadCsv(`auditoria-${new Date().toISOString().slice(0, 10)}`, all, [
        { header: 'Fecha', value: (l) => new Date(l.createdAt).toLocaleString('es-CL') },
        { header: 'Acción', value: (l) => l.action },
        { header: 'Recurso', value: (l) => l.resource },
        { header: 'ID recurso', value: (l) => l.resourceId },
        { header: 'Usuario', value: (l) => l.userId || 'SISTEMA' },
        { header: 'IP', value: (l) => l.ipAddress },
        { header: 'Navegador', value: (l) => l.userAgent },
      ]);
    } catch {
      setError('No se pudo exportar el rastro.');
    }
  };

  const clearFilters = () => { setSearch(''); setAction(''); setFrom(''); setTo(''); };
  const hasFilters = Boolean(search || action || from || to);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl text-gray-900">Rastro de auditoría</h1>
          <p className="text-gray-600 mt-1">Historial de acciones realizadas en la plataforma.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchLogs} className="btn-ghost !min-h-[40px] !py-2" aria-label="Actualizar">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" /> Actualizar
          </button>
          <button onClick={exportCsv} disabled={total === 0} className="btn-primary !min-h-[40px] !py-2 disabled:opacity-50">
            <Download className="w-4 h-4" aria-hidden="true" /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-card border border-gray-200 grid gap-3 md:grid-cols-[1fr_auto_auto_auto_auto] items-end">
        <div>
          <label htmlFor="audit-search" className="block text-xs font-semibold text-gray-600 mb-1">Buscar</label>
          <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-control border border-gray-200">
            <Search className="w-4 h-4 text-gray-400" aria-hidden="true" />
            <input id="audit-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Acción, recurso o ID de usuario…" className="bg-transparent border-none focus:outline-none text-sm w-full" />
          </div>
        </div>
        <div>
          <label htmlFor="audit-action" className="block text-xs font-semibold text-gray-600 mb-1">Acción</label>
          <select id="audit-action" value={action} onChange={(e) => setAction(e.target.value)} className="input-market !w-full md:!w-52">
            <option value="">Todas</option>
            {actions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="audit-from" className="block text-xs font-semibold text-gray-600 mb-1">Desde</label>
          <input id="audit-from" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className="input-market" />
        </div>
        <div>
          <label htmlFor="audit-to" className="block text-xs font-semibold text-gray-600 mb-1">Hasta</label>
          <input id="audit-to" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className="input-market" />
        </div>
        <button onClick={clearFilters} disabled={!hasFilters} className="btn-ghost !min-h-[44px] disabled:opacity-40">Limpiar</button>
      </div>

      <div className="bg-white rounded-card border border-gray-200 overflow-hidden">
        {error ? (
          <p role="alert" className="p-6 text-sm text-red-600">{error}</p>
        ) : loading && logs.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">Cargando…</p>
        ) : logs.length === 0 ? (
          <p className="p-12 text-sm text-gray-500 text-center">No hay registros{hasFilters ? ' con esos filtros' : ''}.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                  <th scope="col" className="px-6 py-4 font-semibold">Acción</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Recurso</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Usuario</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Origen</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-control flex items-center justify-center shrink-0 ${actionTone(log.action)}`} aria-hidden="true">
                          <ShieldAlert className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-bold text-gray-900">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {log.resource}
                      {log.resourceId && <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-mono">#{log.resourceId.split('-')[0]}</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />{log.userId ? `${log.userId.split('-')[0]}…` : 'SISTEMA'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <p className="inline-flex items-center gap-1.5"><Globe className="w-3 h-3" aria-hidden="true" />{log.ipAddress || 'IP desconocida'}</p>
                      <p className="inline-flex items-center gap-1.5 max-w-[200px] truncate" title={log.userAgent || ''}><Monitor className="w-3 h-3 shrink-0" aria-hidden="true" /><span className="truncate">{log.userAgent || 'Navegador desconocido'}</span></p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('es-CL', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {total === 0 ? '0 registros' : `Mostrando ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} de ${total}`}
          </p>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1 || loading} onClick={() => setPage(page - 1)} aria-label="Página anterior" className="btn-ghost !min-h-[40px] !px-3 disabled:opacity-40"><ChevronLeft className="w-4 h-4" aria-hidden="true" /></button>
            <span className="text-sm text-gray-600 min-w-[90px] text-center">Página {page} de {pages}</span>
            <button disabled={page >= pages || loading} onClick={() => setPage(page + 1)} aria-label="Página siguiente" className="btn-ghost !min-h-[40px] !px-3 disabled:opacity-40"><ChevronRight className="w-4 h-4" aria-hidden="true" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
