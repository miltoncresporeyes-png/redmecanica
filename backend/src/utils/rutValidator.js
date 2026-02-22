"use strict";
// Utilidades para validar RUT chileno
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarRUT = validarRUT;
exports.formatearRUT = formatearRUT;
function validarRUT(rut) {
    // Eliminar puntos y guión
    var rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
    if (rutLimpio.length < 2)
        return false;
    // Separar número y dígito verificador
    var cuerpo = rutLimpio.slice(0, -1);
    var dv = rutLimpio.slice(-1).toUpperCase();
    // Validar que el cuerpo sea numérico
    if (!/^\d+$/.test(cuerpo))
        return false;
    // Calcular dígito verificador
    var suma = 0;
    var multiplicador = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    var dvCalculado = 11 - (suma % 11);
    var dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
    return dv === dvEsperado;
}
function formatearRUT(rut) {
    // Eliminar caracteres no válidos
    var rutLimpio = rut.replace(/[^0-9kK]/g, '');
    if (rutLimpio.length < 2)
        return rutLimpio;
    // Separar cuerpo y dígito verificador
    var cuerpo = rutLimpio.slice(0, -1);
    var dv = rutLimpio.slice(-1).toUpperCase();
    // Formatear con puntos
    var cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return "".concat(cuerpoFormateado, "-").concat(dv);
}
