"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var email_js_1 = require("../services/email.js");
var logger_js_1 = require("../lib/logger.js");
var db_js_1 = require("../db.js");
var router = (0, express_1.Router)();
router.post('/message', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, phone, subject, message, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, subject = _a.subject, message = _a.message;
                if (!name_1 || !email || !message) {
                    return [2 /*return*/, res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios.' })];
                }
                return [4 /*yield*/, (0, email_js_1.sendContactNotification)({ name: name_1, email: email, phone: phone, subject: subject, message: message })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Mensaje enviado correctamente.' })];
            case 2:
                error_1 = _b.sent();
                logger_js_1.logger.error({ error: error_1 }, 'Error en ruta de contacto');
                return [2 /*return*/, res.status(500).json({ error: 'Hubo un error al enviar el mensaje.' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/launch-lead', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, emailRegex, prismaError_1, error_2, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(400).json({ error: 'El email es obligatorio.' })];
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return [2 /*return*/, res.status(400).json({ error: 'El email no tiene un formato válido.' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_js_1.prisma.launchLead.create({ data: { email: email } })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                prismaError_1 = _a.sent();
                // P2002 = unique constraint failed
                if (prismaError_1.code === 'P2002') {
                    // already exists, we can continue but inform client
                    logger_js_1.logger.info({ email: email }, 'Lead already registered');
                }
                else {
                    throw prismaError_1;
                }
                return [3 /*break*/, 4];
            case 4: 
            // send notification to internal address
            return [4 /*yield*/, (0, email_js_1.sendLaunchLeadNotification)(email)];
            case 5:
                // send notification to internal address
                _a.sent();
                // send confirmation to the user as well
                return [4 /*yield*/, (0, email_js_1.sendLaunchLeadConfirmation)(email)];
            case 6:
                // send confirmation to the user as well
                _a.sent();
                return [2 /*return*/, res.status(200).json({ success: true, message: 'Registro completado.' })];
            case 7:
                error_2 = _a.sent();
                logger_js_1.logger.error({ error: error_2 }, 'Error en ruta de leads');
                message = (error_2 === null || error_2 === void 0 ? void 0 : error_2.message) || 'Hubo un error al procesar el registro.';
                return [2 /*return*/, res.status(500).json({ error: message })];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
