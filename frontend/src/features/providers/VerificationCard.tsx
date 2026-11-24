import React, { useRef, useState } from 'react';
import { BadgeCheck, Check, FileUp, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMarket } from '../../config/market';
import api from '../../lib/http';
import { useToast } from '../../contexts/ToastContext';
import { fileToDocumentDataUrl } from '../../utils/documentFile';

interface Props {
  provider: any;
  onSaved: () => void;
}

const DOCS = [
  { field: 'idDocumentUrl', flag: 'hasIdDocument', kind: 'identity', hintKey: 'verification.idHint' },
  { field: 'backgroundCheckUrl', flag: 'hasBackgroundCheck', kind: 'background', hintKey: 'verification.backgroundHint' },
] as const;

const errMsg = (e: any, fallback: string) => e?.response?.data?.error || e?.message || fallback;

/**
 * Verificación: el prestador sube sus documentos desde aqui (antes solo se podia durante el registro, y ese envio
 * fallaba por el limite de tamaño). Solo los ve el equipo de RedMecánica.
 */
const VerificationCard: React.FC<Props> = ({ provider, onSaved }) => {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const market = useMarket();
  const [busy, setBusy] = useState<string | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const verified = provider?.status === 'APPROVED';
  const allUploaded = DOCS.every((d) => provider?.[d.flag]);

  const onPick = async (field: string, file?: File | null) => {
    if (!file) return;
    setBusy(field);
    try {
      const dataUrl = await fileToDocumentDataUrl(file);
      const { data } = await api.put('/providers/me/documents', { [field]: dataUrl });
      addToast(data?.message || 'Documento guardado.', 'success');
      onSaved();
    } catch (e) {
      addToast(errMsg(e, 'No se pudo subir el documento.'), 'error');
    } finally {
      setBusy(null);
      if (inputs.current[field]) inputs.current[field]!.value = '';
    }
  };

  return (
    <section className="bg-white rounded-card p-6 border border-slate-200 shadow-sm" aria-labelledby="verif-title">
      <div className="flex items-start gap-3 mb-4">
        <span className="w-10 h-10 shrink-0 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center" aria-hidden="true">
          {verified ? <BadgeCheck className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
        </span>
        <div>
          <h2 id="verif-title" className="text-lg text-slate-900">{t('verification.title')}</h2>
          <p className="text-sm text-slate-600">
            {verified
              ? t('verification.verified')
              : allUploaded
              ? t('verification.reviewing')
              : t('verification.pending')}
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {DOCS.map((d) => {
          const done = !!provider?.[d.flag];
          return (
            <li key={d.field} className="flex items-center gap-3 p-3 rounded-control border border-slate-200">
              <span className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`} aria-hidden="true">
                {done ? <Check className="w-4 h-4" /> : <FileUp className="w-4 h-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{market.documents[d.kind]}</p>
                <p className="text-xs text-slate-600">{done ? t('verification.received') : t(d.hintKey)}</p>
              </div>
              <input
                ref={(el) => { inputs.current[d.field] = el; }}
                id={`doc-${d.field}`}
                type="file"
                accept="image/*,application/pdf"
                className="sr-only"
                onChange={(e) => onPick(d.field, e.target.files?.[0])}
              />
              <label
                htmlFor={`doc-${d.field}`}
                className={`btn-ghost !min-h-[40px] !py-2 cursor-pointer shrink-0 ${busy === d.field ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {busy === d.field ? t('verification.uploading') : done ? t('verification.replace') : t('verification.upload')}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default VerificationCard;
