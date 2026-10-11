/**
 * Utilidades para formatear y validar números de teléfono/WhatsApp en Chile (+56 9 XXXX XXXX).
 */

export interface ResultadoValidacionWhatsApp {
  isValid: boolean;
  formatted: string;
  nationalNumber: string; // Los 9 dígitos nacionales (ej: 983414730)
  error?: string;
}

/**
 * Formatea un string asegurando el prefijo '+56 ' y separando los 9 dígitos chilenos.
 * Entrada libre -> '+56 9 1234 5678'
 */
export function formatearWhatsAppChile(input: string): string {
  if (!input) return '+56 ';

  // Extraer todos los dígitos
  let digits = input.replace(/\D/g, '');

  // Si comienza con 56, removerlo para normalizar los dígitos locales
  if (digits.startsWith('56')) {
    digits = digits.slice(2);
  }

  // En Chile los móviles parten con 9
  // Limitar a máximo 9 dígitos
  const maxDigits = digits.slice(0, 9);

  if (maxDigits.length === 0) {
    return '+56 ';
  }

  if (maxDigits.length <= 1) {
    return `+56 ${maxDigits}`;
  }

  if (maxDigits.length <= 5) {
    return `+56 ${maxDigits.slice(0, 1)} ${maxDigits.slice(1)}`;
  }

  // Formato: +56 9 1234 5678
  return `+56 ${maxDigits.slice(0, 1)} ${maxDigits.slice(1, 5)} ${maxDigits.slice(5, 9)}`.trim();
}

/**
 * Valida si el teléfono cumple con el estándar móvil de Chile:
 * Prefijo internacional +56, comenzando con 9 y exactamente 9 dígitos tras el prefijo.
 */
export function validarWhatsAppChile(input: string): ResultadoValidacionWhatsApp {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      formatted: '+56 ',
      nationalNumber: '',
      error: 'El número de WhatsApp es obligatorio.'
    };
  }

  // Extraer todos los dígitos
  let digits = input.replace(/\D/g, '');

  if (digits.startsWith('56')) {
    digits = digits.slice(2);
  }

  const formatted = formatearWhatsAppChile(input);

  if (digits.length === 0) {
    return {
      isValid: false,
      formatted: '+56 ',
      nationalNumber: '',
      error: 'Ingresa los 9 dígitos de tu WhatsApp (ej: 9 8341 4730).'
    };
  }

  if (digits.length < 9) {
    const faltantes = 9 - digits.length;
    return {
      isValid: false,
      formatted,
      nationalNumber: digits,
      error: `Número incompleto: faltan ${faltantes} dígito${faltantes > 1 ? 's' : ''} (deben ser 9 dígitos después de +56).`
    };
  }

  if (digits.length > 9) {
    return {
      isValid: false,
      formatted,
      nationalNumber: digits.slice(0, 9),
      error: 'Número excede los 9 dígitos permitidos para telefonía móvil en Chile.'
    };
  }

  if (!digits.startsWith('9')) {
    return {
      isValid: false,
      formatted,
      nationalNumber: digits,
      error: 'En Chile, los números móviles y WhatsApp deben comenzar con 9 (ej: +56 9...).'
    };
  }

  return {
    isValid: true,
    formatted,
    nationalNumber: digits
  };
}
