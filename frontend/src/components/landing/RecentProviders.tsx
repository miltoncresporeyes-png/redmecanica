import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Clock, MapPin, Sparkles, Truck, Warehouse, Wrench } from 'lucide-react';
import { getFeaturedProviders } from '../../services/api';

interface RecentProvider {
  id: string;
  type: string;
  status: string;
  businessName?: string | null;
  bio?: string | null;
  specialties?: string | null;
  commune?: string | null;
  region?: string | null;
  completedJobs?: number;
  submittedAt?: string | null;
  createdAt: string;
  featured?: boolean;
  user?: { name?: string };
}

const TYPE_LABEL: Record<string, string> = {
  MECHANIC: 'Mecánico',
  WORKSHOP: 'Taller',
  TOWING: 'Grúa y auxilio',
  INSURANCE: 'Seguros',
};

const TypeIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  if (type === 'WORKSHOP') return <Warehouse className={className} aria-hidden="true" />;
  if (type === 'TOWING') return <Truck className={className} aria-hidden="true" />;
  return <Wrench className={className} aria-hidden="true" />;
};

// "hace 3 días", "hace 2 horas"… (sin librerias)
const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'recién publicada';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
  const m = Math.floor(d / 30);
  return `hace ${m} ${m === 1 ? 'mes' : 'meses'}`;
};

const RecentProviders: React.FC = () => {
  const [providers, setProviders] = useState<RecentProvider[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFeaturedProviders(5)
      .then((list) => { if (!cancelled) setProviders(list); })
      .catch(() => { if (!cancelled) setProviders([]); });
    return () => { cancelled = true; };
  }, []);

  // Sin resultados (o sin conexión) la sección no aparece: no se muestra un espacio vacío en la portada.
  if (!providers || providers.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4" aria-labelledby="recent-title">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5 sm:mb-6">
        <div>
          <p className="badge-free mb-2"><Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Destacados</p>
          <h2 id="recent-title">Anuncios Destacados</h2>
          <p className="section-sub !text-base mt-1">Prestadores destacados y las últimas vitrinas publicadas. Contáctalos directo.</p>
        </div>
        <Link to="/search" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-blue-800 min-h-[44px]">
          Ver todo el directorio <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {providers.map((p) => {
          const name = p.businessName || p.user?.name || 'Prestador automotriz';
          const specs = (p.specialties || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
          const published = p.submittedAt || p.createdAt;
          const isNew = Date.now() - new Date(published).getTime() < 14 * 24 * 3600 * 1000;
          return (
            <li key={p.id}>
              <Link to={`/proveedor/${p.id}`} className={`card-market p-5 h-full flex flex-col gap-3 group ${p.featured ? '!border-primary/40 ring-1 ring-primary/20 bg-gradient-to-b from-blue-50/60 to-white' : ''}`} aria-label={`Ver vitrina de ${name}`}>
                <div className="flex items-start gap-3">
                  <span className="w-12 h-12 shrink-0 rounded-card bg-blue-50 text-primary flex items-center justify-center" aria-hidden="true">
                    <TypeIcon type={p.type} className="w-6 h-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-slate-900 truncate group-hover:text-primary transition-colors">{name}</h3>
                      {p.featured && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Destacado</span>}
                      {!p.featured && isNew && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">Nuevo</span>}
                    </div>
                    <p className="text-sm text-slate-600">{TYPE_LABEL[p.type] || 'Prestador'}</p>
                  </div>
                </div>

                {p.bio && <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{p.bio}</p>}

                {specs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {specs.map((s) => (
                      <span key={s} className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-0.5">{s}</span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                    <span className="truncate">{p.commune}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {timeAgo(published)}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RecentProviders;
