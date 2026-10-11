import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  type?: string;
  suggestionsLabel?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder = '',
  className = '',
  type = 'text',
  suggestionsLabel = 'Sugerencias rápidas (puedes escribir tu propia dirección):'
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim().length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      // Si el input está vacío, mostrar solo las primeras sugerencias de ejemplo
      setFilteredSuggestions(suggestions.slice(0, 6));
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className={className}
      />
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50 divide-y divide-slate-100 animate-fadeIn">
          {/* Header explicativo para que el usuario sepa que es solo sugerencia */}
          <div className="px-3.5 py-2 bg-slate-50 flex items-center justify-between text-[11px] font-semibold text-slate-500">
            <span>💡 {suggestionsLabel}</span>
            <span className="text-[10px] text-slate-400 font-normal">Escritura libre</span>
          </div>

          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center justify-between group"
              >
                <span>{suggestion}</span>
                <span className="text-[11px] text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Usar sugerencia ↵</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-xs text-slate-500 italic bg-white">
              No coincide con las avenidas sugeridas. <strong className="text-slate-700 not-italic">Puedes continuar escribiendo tu dirección completa normalmente.</strong>
            </div>
          )}

          {/* Footer aclaratorio */}
          <div className="px-3 py-1.5 bg-slate-50 text-[10px] text-slate-400 text-center">
            Ingresa tu calle y número exacto. No estás limitado a la lista.
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
