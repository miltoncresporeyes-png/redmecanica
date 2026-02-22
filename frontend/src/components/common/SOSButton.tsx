import React, { useState } from 'react';

interface SOSButtonProps {
  onEmergency: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ onEmergency }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onEmergency}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-[100] group flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full p-0 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-4 border-white/20 animate-pulse-slow"
      style={{
        width: isHovered ? 'auto' : '64px',
        height: '64px',
        paddingRight: isHovered ? '24px' : '0'
      }}
      aria-label="Botón de Emergencia SOS"
    >
      <div className={`flex items-center justify-center w-16 h-16 rounded-full bg-red-600 z-10 ${isHovered ? 'mr-1' : ''}`}>
        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      
      <span className={`font-black text-lg whitespace-nowrap overflow-hidden transition-all duration-300 ${
        isHovered ? 'max-w-[150px] opacity-100 ml-1' : 'max-w-0 opacity-0'
      }`}>
        EMERGENCIA
      </span>

      {/* Ripple Effect Background */}
      <span className="absolute inset-0 rounded-full bg-red-500 opacity-75 animate-ping -z-10"></span>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          50% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
      `}} />
    </button>
  );
};

export default SOSButton;
