"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SUBSCRIPTION_PLANS = void 0;
var express_1 = require("express");
var db_js_1 = require("../db.js");
var zod_1 = require("zod");
var router = (0, express_1.Router)();
exports.SUBSCRIPTION_PLANS = {
    MONTHLY: {
        id: 'MONTHLY',
        name: 'Plan Mensual',
        price: 15000,
        currency: 'CLP',
        jobsIncluded: 20,
        features: [
            'Hasta 20 trabajos al mes',
            'Perfil verificado',
            'Soporte prioritario',
            'Acceso a dashboard',
        ],
    },
    YEARLY: {
        id: 'YEARLY',
        name: 'Plan Anual',
        price: 150000,
        currency: 'CLP',
        jobsIncluded: 300,
        features: [
            'Hasta 300 trabajos al año',
            'Perfil verificado',
            'Soporte prioritario 24/7',
            'Acceso a dashboard avanzado',
            'Descuento del 17%',
            'Badges exclusivos',
        ],
    },
    PROFESSIONAL: {
        id: 'PROFESSIONAL',
        name: 'Plan Profesional',
        price: 500000,
        currency: 'CLP',
        jobsIncluded: -1,
        features: [
            'Trabajos ilimitados',
            'Perfil verificado + destacado',
            'Soporte dedicado 24/7',
            'Dashboard analytics',
            'API access',
            '优先匹配送位置',
        ],
    },
};
var createSubscriptionSchema = zod_1.z.object({
    providerId: zod_1.z.string().uuid('ID de proveedor inválido'),
    plan: zod_1.z.enum(['MONTHLY', 'YEARLY', 'PROFESSIONAL']),
    paymentMethod: zod_1.z.enum(['WEBPAY', 'TRANSFER']).default('WEBPAY'),
    autoRenew: zod_1.z.boolean().optional().default(true),
});
var updateSubscriptionSchema = zod_1.z.object({
    plan: zod_1.z.enum(['MONTHLY', 'YEARLY', 'PROFESSIONAL']).optional(),
    autoRenew: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(['ACTIVE', 'CANCELLED', 'SUSPENDED']).optional(),
});
router.get('/plans', function (_req, res) {
    res.json(exports.SUBSCRIPTION_PLANS);
});
router.get('/provider/:providerId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var providerId, subscription, planDetails, completedJobs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                providerId = req.params.providerId;
                return [4 /*yield*/, db_js_1.prisma.subscription.findUnique({
                        where: { providerId: providerId },
                        include: {
                            provider: {
                                include: {
                                    user: { select: { name: true, email: true } }
                                }
                            }
                        }
                    })];
            case 1:
                subscription = _a.sent();
                if (!subscription) {
                    return [2 /*return*/, res.status(404).json({ error: 'Subscription not found' })];
                }
                planDetails = exports.SUBSCRIPTION_PLANS[subscription.plan];
                return [4 /*yield*/, db_js_1.prisma.job.count({
                        where: { providerId: providerId, status: 'COMPLETED' }
                    })];
            case 2:
                completedJobs = _a.sent();
                res.json(__assign(__assign({}, subscription), { planDetails: planDetails, jobsUsed: completedJobs, jobsRemaining: planDetails.jobsIncluded === -1 ? -1 : Math.max(0, planDetails.jobsIncluded - completedJobs) }));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error fetching subscription:', error_1);
                res.status(500).json({ error: 'Failed to fetch subscription' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, planDetails, existingSubscription, startDate, endDate, subscription, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                data = createSubscriptionSchema.parse(req.body);
                planDetails = exports.SUBSCRIPTION_PLANS[data.plan];
                return [4 /*yield*/, db_js_1.prisma.subscription.findUnique({
                        where: { providerId: data.providerId }
                    })];
            case 1:
                existingSubscription = _a.sent();
                if (existingSubscription) {
                    return [2 /*return*/, res.status(400).json({ error: 'Provider already has a subscription' })];
                }
                startDate = new Date();
                endDate = new Date();
                if (data.plan === 'MONTHLY') {
                    endDate.setMonth(endDate.getMonth() + 1);
                }
                else if (data.plan === 'YEARLY') {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }
                else {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }
                return [4 /*yield*/, db_js_1.prisma.subscription.create({
                        data: {
                            providerId: data.providerId,
                            plan: data.plan,
                            status: 'PENDING',
                            startDate: startDate,
                            endDate: endDate,
                            amount: planDetails.price,
                            currency: planDetails.currency,
                            autoRenew: data.autoRenew,
                            nextBillingDate: data.plan === 'MONTHLY' ? endDate : undefined,
                        }
                    })];
            case 2:
                subscription = _a.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: data.providerId,
                            action: 'SUBSCRIPTION_CREATED',
                            description: "Suscripci\u00F3n ".concat(planDetails.name, " creada - Pendiente de pago"),
                        }
                    })];
            case 3:
                _a.sent();
                res.status(201).json({
                    subscription: subscription,
                    planDetails: planDetails,
                    paymentRequired: true,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                if (error_2 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_2.errors })];
                }
                console.error('Error creating subscription:', error_2);
                res.status(500).json({ error: 'Failed to create subscription' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.patch('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data, subscription, planDetails, newEndDate, updated, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                id = req.params.id;
                data = updateSubscriptionSchema.parse(req.body);
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        include: { provider: true }
                    })];
            case 1:
                subscription = _a.sent();
                if (!subscription) {
                    return [2 /*return*/, res.status(404).json({ error: 'Subscription not found' })];
                }
                if (!(data.plan && data.plan !== subscription.plan)) return [3 /*break*/, 4];
                planDetails = exports.SUBSCRIPTION_PLANS[data.plan];
                newEndDate = new Date();
                if (data.plan === 'MONTHLY') {
                    newEndDate.setMonth(newEndDate.getMonth() + 1);
                }
                else {
                    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                }
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        data: {
                            plan: data.plan,
                            amount: planDetails.price,
                            endDate: newEndDate,
                            nextBillingDate: data.plan === 'MONTHLY' ? newEndDate : undefined,
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: subscription.providerId,
                            action: 'PLAN_CHANGED',
                            description: "Plan cambiado a ".concat(planDetails.name),
                        }
                    })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(data.autoRenew !== undefined)) return [3 /*break*/, 6];
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        data: { autoRenew: data.autoRenew }
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!data.status) return [3 /*break*/, 9];
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        data: { status: data.status }
                    })];
            case 7:
                _a.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: subscription.providerId,
                            action: data.status === 'CANCELLED' ? 'SUBSCRIPTION_CANCELLED' : 'SUBSCRIPTION_SUSPENDED',
                            description: data.status === 'CANCELLED' ? 'Suscripción cancelada' : 'Suscripción suspendida',
                        }
                    })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [4 /*yield*/, db_js_1.prisma.subscription.findUnique({ where: { id: id } })];
            case 10:
                updated = _a.sent();
                res.json(updated);
                return [3 /*break*/, 12];
            case 11:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_3.errors })];
                }
                console.error('Error updating subscription:', error_3);
                res.status(500).json({ error: 'Failed to update subscription' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/activate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, subscription, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        data: { status: 'ACTIVE' },
                        include: { provider: true }
                    })];
            case 1:
                subscription = _a.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: subscription.providerId,
                            action: 'SUBSCRIPTION_ACTIVATED',
                            description: 'Suscripción activada exitosamente',
                        }
                    })];
            case 2:
                _a.sent();
                res.json(subscription);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error activating subscription:', error_4);
                res.status(500).json({ error: 'Failed to activate subscription' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/cancel', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, subscription, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        data: {
                            status: 'CANCELLED',
                            autoRenew: false
                        },
                        include: { provider: true }
                    })];
            case 1:
                subscription = _a.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: subscription.providerId,
                            action: 'SUBSCRIPTION_CANCELLED',
                            description: 'Suscripción cancelada por el usuario',
                        }
                    })];
            case 2:
                _a.sent();
                res.json(subscription);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Error cancelling subscription:', error_5);
                res.status(500).json({ error: 'Failed to cancel subscription' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/renew', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, current, planDetails, newEndDate, subscription, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.subscription.findUnique({ where: { id: id } })];
            case 1:
                current = _a.sent();
                if (!current) {
                    return [2 /*return*/, res.status(404).json({ error: 'Subscription not found' })];
                }
                planDetails = exports.SUBSCRIPTION_PLANS[current.plan];
                newEndDate = new Date(current.endDate);
                if (current.plan === 'MONTHLY') {
                    newEndDate.setMonth(newEndDate.getMonth() + 1);
                }
                else {
                    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                }
                return [4 /*yield*/, db_js_1.prisma.subscription.update({
                        where: { id: id },
                        data: {
                            status: 'ACTIVE',
                            startDate: current.endDate,
                            endDate: newEndDate,
                            lastPaymentDate: new Date(),
                            nextBillingDate: current.plan === 'MONTHLY' ? newEndDate : undefined,
                        },
                        include: { provider: true }
                    })];
            case 2:
                subscription = _a.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: subscription.providerId,
                            action: 'SUBSCRIPTION_RENEWAL',
                            description: "Suscripci\u00F3n renovada hasta ".concat(newEndDate.toLocaleDateString()),
                        }
                    })];
            case 3:
                _a.sent();
                res.json(subscription);
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error('Error renewing subscription:', error_6);
                res.status(500).json({ error: 'Failed to renew subscription' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
