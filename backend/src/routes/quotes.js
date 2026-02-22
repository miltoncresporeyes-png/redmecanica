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
var db_js_1 = require("../db.js");
var auth_js_1 = require("../middleware/auth.js");
var router = express_1.default.Router();
// Aplicar middleware de autenticación a todas las rutas
router.use(auth_js_1.authenticateToken);
// POST /api/quotes - Crear una nueva cotización (Solo Prestadores)
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, preliminaryDiagnosis, serviceItems, laborCost, partsCost, totalCost, estimatedDuration, warranty, paymentMethods, validUntil, userId, provider, job, existingQuote, quote, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                _a = req.body, jobId = _a.jobId, preliminaryDiagnosis = _a.preliminaryDiagnosis, serviceItems = _a.serviceItems, laborCost = _a.laborCost, partsCost = _a.partsCost, totalCost = _a.totalCost, estimatedDuration = _a.estimatedDuration, warranty = _a.warranty, paymentMethods = _a.paymentMethods, validUntil = _a.validUntil;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ error: 'Usuario no autenticado' })];
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findFirst({
                        where: { userId: userId }
                    })];
            case 1:
                provider = _c.sent();
                if (!provider) {
                    return [2 /*return*/, res.status(403).json({ error: 'Solo los Prestadores pueden crear cotizaciones' })];
                }
                // Validaciones
                if (!jobId || !totalCost) {
                    return [2 /*return*/, res.status(400).json({ error: 'Faltan campos obligatorios (jobId, totalCost)' })];
                }
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({ where: { id: jobId } })];
            case 2:
                job = _c.sent();
                if (!job)
                    return [2 /*return*/, res.status(404).json({ error: 'Job no encontrado' })];
                return [4 /*yield*/, db_js_1.prisma.quote.findFirst({
                        where: { jobId: jobId, providerId: provider.id }
                    })];
            case 3:
                existingQuote = _c.sent();
                if (existingQuote) {
                    return [2 /*return*/, res.status(400).json({ error: 'Ya has enviado una cotización para este trabajo' })];
                }
                return [4 /*yield*/, db_js_1.prisma.quote.create({
                        data: {
                            jobId: jobId,
                            providerId: provider.id,
                            preliminaryDiagnosis: preliminaryDiagnosis || '',
                            serviceItems: JSON.stringify(serviceItems || []),
                            laborCost: laborCost || 0,
                            partsCost: partsCost || 0,
                            totalCost: totalCost,
                            estimatedDuration: estimatedDuration || 60,
                            warranty: warranty || 'Sin garantía',
                            paymentMethods: paymentMethods || 'CASH',
                            validUntil: validUntil ? new Date(validUntil) : new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hrs por defecto
                            status: 'SENT'
                        }
                    })];
            case 4:
                quote = _c.sent();
                if (!(job.status === 'SEARCHING' || job.status === 'PENDING')) return [3 /*break*/, 6];
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: jobId },
                        data: { status: 'QUOTING', quotedAt: new Date() }
                    })];
            case 5:
                _c.sent();
                _c.label = 6;
            case 6: return [2 /*return*/, res.status(201).json(quote)];
            case 7:
                error_1 = _c.sent();
                console.error('Error creating quote:', error_1);
                return [2 /*return*/, res.status(500).json({ error: 'Error al crear cotización' })];
            case 8: return [2 /*return*/];
        }
    });
}); });
// GET /api/quotes/provider/me - Obtener todas las cotizaciones enviadas por el proveedor actual
router.get('/provider/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, provider, quotes, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ error: 'Usuario no autenticado' })];
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findFirst({ where: { userId: userId } })];
            case 1:
                provider = _b.sent();
                if (!provider)
                    return [2 /*return*/, res.status(403).json({ error: 'Usuario no es proveedor' })];
                return [4 /*yield*/, db_js_1.prisma.quote.findMany({
                        where: { providerId: provider.id },
                        include: {
                            job: {
                                include: {
                                    request: {
                                        include: {
                                            vehicle: true,
                                            service: true,
                                            user: { select: { name: true } }
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            case 2:
                quotes = _b.sent();
                res.json(quotes);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                console.error('Error fetching provider quotes:', error_2);
                res.status(500).json({ error: 'Error al obtener cotizaciones' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /api/quotes/user/me - Obtener todas las cotizaciones recibidas por el cliente actual
router.get('/user/me', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, quotes, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return [2 /*return*/, res.status(401).json({ error: 'No autenticado' })];
                return [4 /*yield*/, db_js_1.prisma.quote.findMany({
                        where: {
                            job: {
                                request: {
                                    userId: userId
                                }
                            }
                        },
                        include: {
                            job: {
                                include: {
                                    request: {
                                        include: {
                                            vehicle: true,
                                            service: true
                                        }
                                    }
                                }
                            },
                            provider: {
                                include: {
                                    user: { select: { name: true } }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            case 1:
                quotes = _b.sent();
                res.json(quotes);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching user quotes:', error_3);
                res.status(500).json({ error: 'Error al obtener tus cotizaciones' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/quotes/marketplace - Obtener trabajos disponibles para cotizar (Solo Prestadores)
router.get('/marketplace', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, provider, jobs, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findFirst({ where: { userId: userId } })];
            case 1:
                provider = _b.sent();
                if (!provider)
                    return [2 /*return*/, res.status(403).json({ error: 'Solo Prestadores pueden acceder al marketplace' })];
                return [4 /*yield*/, db_js_1.prisma.job.findMany({
                        where: {
                            status: { in: ['PENDING', 'SEARCHING', 'QUOTING'] },
                            quotes: {
                                none: { providerId: provider.id }
                            }
                        },
                        include: {
                            request: {
                                include: {
                                    service: true,
                                    vehicle: true,
                                    user: { select: { name: true } }
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            case 2:
                jobs = _b.sent();
                res.json(jobs);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('Error fetching marketplace:', error_4);
                res.status(500).json({ error: 'Error al obtener solicitudes disponibles' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /api/quotes/job/:jobId - Obtener todas las cotizaciones de un job
router.get('/job/:jobId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, quotes, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                jobId = req.params.jobId;
                return [4 /*yield*/, db_js_1.prisma.quote.findMany({
                        where: { jobId: jobId },
                        include: {
                            provider: {
                                include: {
                                    user: {
                                        select: {
                                            name: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        },
                        orderBy: { createdAt: 'asc' }
                    })];
            case 1:
                quotes = _a.sent();
                res.json(quotes);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error fetching quotes:', error_5);
                res.status(500).json({ error: 'Error al obtener cotizaciones' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/quotes/:id - Obtener una cotización específica
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, quote, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.quote.findUnique({
                        where: { id: id },
                        include: {
                            job: true,
                            provider: { include: { user: { select: { name: true, email: true } } } }
                        }
                    })];
            case 1:
                quote = _a.sent();
                if (!quote)
                    return [2 /*return*/, res.status(404).json({ error: 'Cotización no encontrada' })];
                res.json(quote);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(500).json({ error: 'Error al obtener cotización' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/quotes/:id - Actualizar una cotización (Solo si está en estado SENT)
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, existingQuote, _a, preliminaryDiagnosis, serviceItems, laborCost, partsCost, totalCost, estimatedDuration, warranty, paymentMethods, validUntil, updatedQuote, error_7;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = req.params.id;
                userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
                return [4 /*yield*/, db_js_1.prisma.quote.findUnique({
                        where: { id: id },
                        include: { provider: true }
                    })];
            case 1:
                existingQuote = _c.sent();
                if (!existingQuote)
                    return [2 /*return*/, res.status(404).json({ error: 'Cotización no encontrada' })];
                // Verificar que el usuario sea el dueño de la cotización (a través del provider)
                if (existingQuote.provider.userId !== userId) {
                    return [2 /*return*/, res.status(403).json({ error: 'No tienes permiso para editar esta cotización' })];
                }
                if (existingQuote.status !== 'SENT') {
                    return [2 /*return*/, res.status(400).json({ error: 'No se puede editar una cotización que ya fue respondida' })];
                }
                _a = req.body, preliminaryDiagnosis = _a.preliminaryDiagnosis, serviceItems = _a.serviceItems, laborCost = _a.laborCost, partsCost = _a.partsCost, totalCost = _a.totalCost, estimatedDuration = _a.estimatedDuration, warranty = _a.warranty, paymentMethods = _a.paymentMethods, validUntil = _a.validUntil;
                return [4 /*yield*/, db_js_1.prisma.quote.update({
                        where: { id: id },
                        data: {
                            preliminaryDiagnosis: preliminaryDiagnosis,
                            serviceItems: serviceItems ? JSON.stringify(serviceItems) : undefined,
                            laborCost: laborCost,
                            partsCost: partsCost,
                            totalCost: totalCost,
                            estimatedDuration: estimatedDuration,
                            warranty: warranty,
                            paymentMethods: paymentMethods,
                            validUntil: validUntil ? new Date(validUntil) : undefined,
                            updatedAt: new Date()
                        }
                    })];
            case 2:
                updatedQuote = _c.sent();
                res.json(updatedQuote);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _c.sent();
                console.error('Error updating quote:', error_7);
                res.status(500).json({ error: 'Error al actualizar cotización' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /api/quotes/:id/accept - Aceptar una cotización
router.post('/:id/accept', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, quote, updatedQuote, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.quote.findUnique({
                        where: { id: id },
                        include: { job: true }
                    })];
            case 1:
                quote = _a.sent();
                if (!quote) {
                    return [2 /*return*/, res.status(404).json({ error: 'Cotización no encontrada' })];
                }
                return [4 /*yield*/, db_js_1.prisma.quote.update({
                        where: { id: id },
                        data: {
                            status: 'ACCEPTED',
                            respondedAt: new Date()
                        }
                    })];
            case 2:
                updatedQuote = _a.sent();
                // Rechazar las demás cotizaciones del mismo job
                return [4 /*yield*/, db_js_1.prisma.quote.updateMany({
                        where: {
                            jobId: quote.jobId,
                            id: { not: id }
                        },
                        data: { status: 'REJECTED' }
                    })];
            case 3:
                // Rechazar las demás cotizaciones del mismo job
                _a.sent();
                // Actualizar el job
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: quote.jobId },
                        data: {
                            status: 'CONFIRMED',
                            selectedQuoteId: id,
                            providerId: quote.providerId,
                            estimatedCost: quote.totalCost,
                            confirmedAt: new Date()
                        }
                    })];
            case 4:
                // Actualizar el job
                _a.sent();
                res.json(updatedQuote);
                return [3 /*break*/, 6];
            case 5:
                error_8 = _a.sent();
                console.error('Error accepting quote:', error_8);
                res.status(500).json({ error: 'Error al aceptar cotización' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// POST /api/quotes/:id/reject - Rechazar una cotización
router.post('/:id/reject', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, quote, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.quote.update({
                        where: { id: id },
                        data: {
                            status: 'REJECTED',
                            respondedAt: new Date()
                        }
                    })];
            case 1:
                quote = _a.sent();
                res.json(quote);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error rejecting quote:', error_9);
                res.status(500).json({ error: 'Error al rechazar cotización' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/quotes/:id - Eliminar una cotización (solo si no ha sido aceptada)
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userId, quote, error_10;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = req.params.id;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, db_js_1.prisma.quote.findUnique({
                        where: { id: id },
                        include: { provider: true }
                    })];
            case 1:
                quote = _c.sent();
                if (!quote) {
                    return [2 /*return*/, res.status(404).json({ error: 'Cotización no encontrada' })];
                }
                // Verificar propiedad (o admin)
                if (quote.provider.userId !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
                    return [2 /*return*/, res.status(403).json({ error: 'No autorizado para eliminar esta cotización' })];
                }
                if (quote.status === 'ACCEPTED') {
                    return [2 /*return*/, res.status(400).json({ error: 'No se puede eliminar una cotización aceptada' })];
                }
                return [4 /*yield*/, db_js_1.prisma.quote.delete({
                        where: { id: id }
                    })];
            case 2:
                _c.sent();
                res.json({ message: 'Cotización eliminada' });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _c.sent();
                console.error('Error deleting quote:', error_10);
                res.status(500).json({ error: 'Error al eliminar cotización' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
