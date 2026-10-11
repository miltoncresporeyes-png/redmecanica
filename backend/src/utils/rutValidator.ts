// Calcula el dígito verificador usando algoritmo Módulo 11
export function calcularDV(cuerpo: string): string {
  const cuerpoLimpio = cuerpo.replace(/\D/g, '');
  if (!cuerpoLimpio) return '';

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpoLimpio.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpoLimpio[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  if (dvCalculado === 11) return '0';
  if (dvCalculado === 10) return 'K';
  return dvCalculado.toString();
}

export interface ResultadoValidacionRUT {
  isValid: boolean;
  dvEsperado?: string;
  dvIngresado?: string;
  error?: string;
}

// Valida RUT con detalle de Módulo 11 (alerta si el DV no coincide)
export function validarRUTDetalle(rut: string): ResultadoValidacionRUT {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');

  if (rutLimpio.length < 2) {
    return { isValid: false, error: 'El RUT debe incluir cuerpo y dígito verificador' };
  }

  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1).toUpperCase();

  if (!/^\d{7,8}$/.test(cuerpo)) {
    return { isValid: false, error: 'El cuerpo del RUT debe tener entre 7 y 8 dígitos' };
  }

  const dvEsperado = calcularDV(cuerpo);

  if (dvIngresado !== dvEsperado) {
    return {
      isValid: false,
      dvEsperado,
      dvIngresado,
      error: `Dígito verificador incorrecto según Módulo 11: ingresaste "${dvIngresado}", pero le corresponde "${dvEsperado}".`
    };
  }

  return { isValid: true, dvEsperado, dvIngresado };
}

// Utilidad booleana para validar RUT chileno
export function validarRUT(rut: string): boolean {
  return validarRUTDetalle(rut).isValid;
}

export function formatearRUT(rut: string): string {
  // Eliminar caracteres no válidos
  const rutLimpio = rut.replace(/[^0-9kK]/g, '');
  
  if (rutLimpio.length < 2) return rutLimpio;
  
  // Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  
  // Formatear con puntos
  const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${cuerpoFormateado}-${dv}`;
}
