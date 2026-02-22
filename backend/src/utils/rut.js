"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRut = exports.isValidRut = void 0;
// Rut validation logic
var isValidRut = function (rut) {
    if (!rut)
        return false;
    var cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
    if (cleanRut.length < 2)
        return false;
    var body = cleanRut.slice(0, -1);
    var dv = cleanRut.slice(-1).toUpperCase();
    if (!/^\d+$/.test(body))
        return false;
    var sum = 0;
    var multiplier = 2;
    for (var i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    var calculatedDv = 11 - (sum % 11);
    var expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();
    return dv === expectedDv;
};
exports.isValidRut = isValidRut;
var formatRut = function (rut) {
    var cleanRut = rut.replace(/[^0-9kK]/g, '');
    if (cleanRut.length < 2)
        return cleanRut;
    var body = cleanRut.slice(0, -1);
    var dv = cleanRut.slice(-1).toUpperCase();
    return "".concat(body.replace(/\B(?=(\d{3})+(?!\d))/g, '.'), "-").concat(dv);
};
exports.formatRut = formatRut;
