import React, { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';
import LeadQualificationModal from './LeadQualificationModal';

interface StickyWhatsAppButtonProps {
  phone?: string;
  providerName?: string;
  commune?: string;
}

export const StickyWhatsAppButton: React.FC<StickyWhatsAppButtonProps> = ({
  phone,
  providerName = 'prestador',
  commune = '',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!phone) return null;

  const sanitizedPhone = phone.replace(/[^0-9]/g, '');
  if (!sanitizedPhone) return null;

  const handleClick = () => {
    trackEvent('sticky_whatsapp_wizard_opened', {
      providerName,
      commune,
      phone: sanitizedPhone,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-8px_20px_rgba(0,0,0,0.12)] md:hidden animate-slideUp">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          {/* Botón WhatsApp Principal que abre el Wizard Multistep */}
          <button
            type="button"
            onClick={handleClick}
            className="flex-1 min-h-[48px] py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 tracking-tight cursor-pointer"
            aria-label={`Contactar por WhatsApp a ${providerName}`}
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0 stroke-emerald-500" />
            <span>Contactar por WhatsApp</span>
          </button>

          {/* Botón Llamada Directa */}
          <a
            href={`tel:${phone}`}
            className="min-h-[48px] min-w-[48px] p-3 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-md transition-transform active:scale-98"
            title={`Llamar a ${phone}`}
            aria-label={`Llamar al teléfono ${phone}`}
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Modal Wizard de 4 pasos */}
      <LeadQualificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phonePrestador={phone}
        nombrePrestador={providerName}
        comunaSugerida={commune}
      />
    </>
  );
};

export default StickyWhatsAppButton;
