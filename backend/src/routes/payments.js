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
var webpay_js_1 = require("../services/webpay.js");
var router = express_1.default.Router();
var PLATFORM_FEE_PERCENT = 10;
var WEBPAY_RETURN_URL = process.env.WEBPAY_RETURN_URL || 'https://redmecanica.cl/payment/return';
var WEBPAY_FINAL_URL = process.env.WEBPAY_FINAL_URL || 'https://redmecanica.cl/payment/final';
router.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, amount, paymentMethod, isDemo, existingJob, buyOrder, sessionId, webpayData, paymentOrder_1, job, paymentOrder, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, jobId = _a.jobId, amount = _a.amount, paymentMethod = _a.paymentMethod;
                if (!jobId || !amount) {
                    return [2 /*return*/, res.status(400).json({ error: 'Job ID y monto son requeridos' })];
                }
                isDemo = jobId === 'demo' || jobId.startsWith('demo-');
                if (!!isDemo) return [3 /*break*/, 2];
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: jobId },
                        include: {
                            request: { include: { user: true, vehicle: true } }
                        }
                    })];
            case 1:
                existingJob = _b.sent();
                if (!existingJob) {
                    return [2 /*return*/, res.status(404).json({ error: 'Job no encontrado' })];
                }
                _b.label = 2;
            case 2:
                if (!(paymentMethod === 'webpay')) return [3 /*break*/, 4];
                buyOrder = isDemo ? "RM-DEMO-".concat(Date.now()) : "RM-".concat(jobId, "-").concat(Date.now());
                sessionId = isDemo ? 'demo-session' : 'sessionId';
                return [4 /*yield*/, webpay_js_1.webpayService.createTransaction(buyOrder, sessionId, amount, "".concat(WEBPAY_RETURN_URL, "?jobId=").concat(jobId), "".concat(WEBPAY_FINAL_URL, "?jobId=").concat(jobId))];
            case 3:
                webpayData = _b.sent();
                paymentOrder_1 = {
                    id: "payment-".concat(Date.now()),
                    jobId: jobId,
                    amount: amount,
                    paymentMethod: 'WEBPAY',
                    status: 'PENDING',
                    buyOrder: buyOrder,
                    token: webpayData.token,
                    createdAt: new Date()
                };
                return [2 /*return*/, res.json({
                        payment: paymentOrder_1,
                        token: webpayData.token,
                        url: webpayData.url,
                        message: webpay_js_1.webpayService.isWebpayConfigured()
                            ? 'Redirigir a Webpay para completar pago'
                            : 'Modo simulación - token generado'
                    })];
            case 4:
                if (!!isDemo) return [3 /*break*/, 6];
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: jobId }
                    })];
            case 5:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ error: 'Job no encontrado' })];
                }
                _b.label = 6;
            case 6:
                paymentOrder = {
                    id: "payment-".concat(Date.now()),
                    jobId: jobId,
                    amount: amount,
                    paymentMethod: paymentMethod || 'TRANSFER',
                    status: 'PENDING',
                    createdAt: new Date()
                };
                res.json({
                    payment: paymentOrder,
                    message: "Orden de pago creada. M\u00E9todo: ".concat(paymentMethod || 'TRANSFER')
                });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                console.error('Error creating payment:', error_1);
                res.status(500).json({ error: 'Error al crear orden de pago' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/confirm', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, token, paymentMethod, commitResult, job_1, job, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, jobId = _a.jobId, token = _a.token, paymentMethod = _a.paymentMethod;
                if (!(paymentMethod === 'webpay' && token)) return [3 /*break*/, 3];
                return [4 /*yield*/, webpay_js_1.webpayService.commitTransaction(token)];
            case 1:
                commitResult = _b.sent();
                if (commitResult.responseCode !== 0) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Pago rechazado',
                            code: commitResult.responseCode,
                            status: commitResult.status
                        })];
                }
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: jobId },
                        data: {
                            paymentStatus: 'HELD',
                            status: 'CONFIRMED'
                        }
                    })];
            case 2:
                job_1 = _b.sent();
                return [2 /*return*/, res.json({
                        message: 'Pago confirmado y retenido en escrow',
                        job: job_1,
                        transaction: {
                            authorizationCode: commitResult.authorizationCode,
                            cardNumber: commitResult.cardDetail.card_number,
                            amount: commitResult.amount
                        },
                        escrow: {
                            amount: commitResult.amount,
                            status: 'HELD',
                            releaseCondition: 'Cliente debe aprobar el trabajo completado'
                        }
                    })];
            case 3: return [4 /*yield*/, db_js_1.prisma.job.update({
                    where: { id: jobId },
                    data: {
                        paymentStatus: 'HELD',
                        status: 'CONFIRMED'
                    }
                })];
            case 4:
                job = _b.sent();
                res.json({
                    message: 'Pago confirmado y retenido en escrow',
                    job: job,
                    escrow: {
                        amount: req.body.amount,
                        status: 'HELD',
                        releaseCondition: 'Cliente debe aprobar el trabajo completado'
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error('Error confirming payment:', error_2);
                res.status(500).json({ error: 'Error al confirmar pago' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/release', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, job, amount, platformFee, providerPayout, updatedJob, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                jobId = req.body.jobId;
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: jobId },
                        include: { provider: true }
                    })];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ error: 'Job no encontrado' })];
                }
                if (job.paymentStatus !== 'HELD') {
                    return [2 /*return*/, res.status(400).json({ error: 'No hay pago retenido para liberar' })];
                }
                if (job.status !== 'DELIVERED' && job.status !== 'REVIEWED') {
                    return [2 /*return*/, res.status(400).json({ error: 'El trabajo debe estar completado y entregado' })];
                }
                amount = job.estimatedCost || 0;
                platformFee = amount * (PLATFORM_FEE_PERCENT / 100);
                providerPayout = amount - platformFee;
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: jobId },
                        data: {
                            paymentStatus: 'RELEASED'
                        }
                    })];
            case 2:
                updatedJob = _a.sent();
                res.json({
                    message: 'Pago liberado al proveedor exitosamente',
                    job: updatedJob,
                    payout: {
                        total: amount,
                        platformFee: platformFee,
                        providerAmount: providerPayout,
                        currency: 'CLP'
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error releasing payment:', error_3);
                res.status(500).json({ error: 'Error al liberar pago' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/refund', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, jobId, reason, amount, token, authorizationCode, job, webpayError_1, updatedJob, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.body, jobId = _a.jobId, reason = _a.reason, amount = _a.amount, token = _a.token, authorizationCode = _a.authorizationCode;
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: jobId }
                    })];
            case 1:
                job = _b.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ error: 'Job no encontrado' })];
                }
                if (job.paymentStatus === 'RELEASED') {
                    return [2 /*return*/, res.status(400).json({ error: 'El pago ya fue liberado, no se puede reembolsar' })];
                }
                if (!(token && webpay_js_1.webpayService.isWebpayConfigured())) return [3 /*break*/, 5];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, webpay_js_1.webpayService.refundTransaction(token, amount || job.estimatedCost || 0, authorizationCode || '123456', jobId)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                webpayError_1 = _b.sent();
                console.error('Webpay refund error:', webpayError_1);
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, db_js_1.prisma.job.update({
                    where: { id: jobId },
                    data: {
                        paymentStatus: 'REFUNDED',
                        status: 'REFUNDED'
                    }
                })];
            case 6:
                updatedJob = _b.sent();
                res.json({
                    message: 'Reembolso procesado exitosamente',
                    job: updatedJob,
                    refund: {
                        amount: amount || job.estimatedCost || 'total',
                        reason: reason
                    }
                });
                return [3 /*break*/, 8];
            case 7:
                error_4 = _b.sent();
                console.error('Error processing refund:', error_4);
                res.status(500).json({ error: 'Error al procesar reembolso' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.get('/methods', function (req, res) {
    var paymentMethods = [
        {
            id: 'webpay',
            name: 'Webpay Plus',
            description: 'Tarjeta de crédito/débito vía Transbank',
            fee: '2.95% + $100',
            available: true,
            icon: '💳'
        },
        {
            id: 'transfer',
            name: 'Transferencia Bancaria',
            description: 'Transferencia directa a cuenta del proveedor',
            fee: 'Sin costo',
            available: true,
            icon: '🏦'
        },
        {
            id: 'cash',
            name: 'Efectivo',
            description: 'Pago en persona al finalizar el servicio',
            fee: 'Sin costo',
            available: true,
            note: 'El pago NO queda en escrow, mayor riesgo para la plataforma',
            icon: '💵'
        }
    ];
    res.json({
        methods: paymentMethods,
        escrowEnabled: ['webpay'],
        recommended: 'webpay'
    });
});
router.get('/status/:jobId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jobId, job, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                jobId = req.params.jobId;
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: jobId },
                        select: {
                            id: true,
                            paymentStatus: true,
                            estimatedCost: true,
                            status: true
                        }
                    })];
            case 1:
                job = _a.sent();
                if (!job) {
                    return [2 /*return*/, res.status(404).json({ error: 'Job no encontrado' })];
                }
                res.json({
                    jobId: job.id,
                    paymentStatus: job.paymentStatus,
                    amount: job.estimatedCost,
                    jobStatus: job.status
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error getting payment status:', error_5);
                res.status(500).json({ error: 'Error al obtener estado del pago' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
