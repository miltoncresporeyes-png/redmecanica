import React, { useState } from 'react';

const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const phone = '56912345678'; // Número de asistencia oficial de RedMecánica
  const message = 'Hola, me gustaría obtener asistencia para encontrar un mecánico en RedMecánica.';
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div 
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] right-6 z-50 flex items-center justify-end"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Sleek Tooltip */}
      <div 
        className={`bg-slate-900 text-white font-extrabold text-xs px-4 py-2 rounded-2xl mr-3 shadow-xl border border-slate-800 transition-all duration-300 transform origin-right select-none ${
          showTooltip 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
        }`}
      >
        ¿Necesitas ayuda inmediata? 💬
      </div>

      {/* Pulsing ring behind the button */}
      <div className="absolute w-14 h-14 bg-emerald-500 rounded-full animate-ping opacity-25"></div>

      {/* Main Button */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border border-emerald-400/20 group"
      >
        <svg 
          className="w-7 h-7 fill-current group-hover:rotate-12 transition-transform duration-300" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.53 1.97 14.053.945 11.428.945c-5.437 0-9.863 4.371-9.867 9.8.001 2.128.57 4.2 1.646 5.922L2.186 20.3l3.86-.995c1.602.87 3.254 1.349 4.601 1.349zM17.52 14.28c-.324-.162-1.92-.949-2.216-1.055-.297-.108-.513-.162-.73.162-.216.324-.838 1.055-1.027 1.27-.189.216-.378.243-.702.08-2.603-1.297-4.225-2.604-5.918-5.508-.189-.324-.018-.497.143-.657.146-.144.324-.378.486-.568.162-.189.216-.324.324-.54.108-.216.054-.405-.027-.567-.08-.162-.73-1.757-.999-2.406-.263-.63-.53-.54-.73-.55-.189-.01-.405-.01-.622-.01-.216 0-.568.08-.865.405-.297.324-1.135 1.109-1.135 2.703 0 1.594 1.162 3.136 1.324 3.352.162.216 2.284 3.487 5.535 4.893.774.335 1.378.535 1.847.684.778.247 1.488.212 2.048.128.624-.094 1.92-.784 2.19-1.54.27-.756.27-1.405.189-1.54-.082-.135-.298-.216-.622-.378z" />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;
