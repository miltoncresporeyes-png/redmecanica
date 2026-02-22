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
var express_1 = require("express");
var db_js_1 = require("../db.js");
var requireAuth_js_1 = require("../middlewares/requireAuth.js");
var audit_js_1 = require("../lib/audit.js");
var httpErrors_js_1 = require("../lib/httpErrors.js");
var router = (0, express_1.Router)();
// Proteger todas las rutas de admin
router.use(requireAuth_js_1.requireAuth, (0, requireAuth_js_1.requireRole)(['ADMIN', 'SUPER_ADMIN']));
// GET /api/admin/stats - Panel de Control Total (KPIs)
router.get('/stats', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, totalProviders, pendingProviders, activeJobsCount, jobsByStatus, communeStats, cancellations, avgRating, totalRequests, totalJobs, acceptanceRate, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                return [4 /*yield*/, Promise.all([
                        db_js_1.prisma.serviceProvider.count(),
                        db_js_1.prisma.serviceProvider.count({ where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
                        db_js_1.prisma.job.count({ where: { status: { notIn: ['CLOSED', 'CANCELLED', 'REVIEWED'] } } }),
                        db_js_1.prisma.job.groupBy({
                            by: ['status'],
                            _count: { _all: true }
                        }),
                        db_js_1.prisma.serviceProvider.groupBy({
                            by: ['commune'],
                            where: { commune: { not: null } },
                            _count: { _all: true },
                            orderBy: { _count: { commune: 'desc' } },
                            take: 5
                        }),
                        db_js_1.prisma.job.count({ where: { status: 'CANCELLED' } }),
                        db_js_1.prisma.serviceProvider.aggregate({
                            _avg: { rating: true }
                        })
                    ])];
            case 1:
                _a = _c.sent(), totalProviders = _a[0], pendingProviders = _a[1], activeJobsCount = _a[2], jobsByStatus = _a[3], communeStats = _a[4], cancellations = _a[5], avgRating = _a[6];
                return [4 /*yield*/, db_js_1.prisma.serviceRequest.count()];
            case 2:
                totalRequests = _c.sent();
                return [4 /*yield*/, db_js_1.prisma.job.count()];
            case 3:
                totalJobs = _c.sent();
                acceptanceRate = totalRequests > 0 ? (totalJobs / totalRequests) * 100 : 0;
                res.json({
                    summary: {
                        totalProviders: totalProviders,
                        pendingProviders: pendingProviders,
                        activeJobsCount: activeJobsCount,
                        totalRevenue: 0,
                        avgRating: avgRating._avg.rating || 0,
                        acceptanceRate: acceptanceRate.toFixed(2) + '%'
                    },
                    jobsByStatus: jobsByStatus,
                    topCommunes: communeStats,
                    issues: {
                        cancellations: cancellations
                    }
                });
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                        action: 'VIEW_ADMIN_STATS',
                        resource: 'Dashboard',
                        ipAddress: req.ip,
                        userAgent: String(req.headers['user-agent'] || 'unknown')
                    })];
            case 4:
                _c.sent();
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/providers/pending - Revisión de flota nueva
router.get('/providers/pending', function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var providers, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findMany({
                        where: { status: { in: ['PENDING', 'UNDER_REVIEW'] } },
                        include: { user: { select: { name: true, email: true } } },
                        orderBy: { createdAt: 'asc' }
                    })];
            case 1:
                providers = _a.sent();
                res.json(providers);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/jobs/:id/timeline - Ver detalle técnico y eventos
router.get('/jobs/:id/timeline', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, job, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: String(id) },
                        include: {
                            request: { include: { service: true, vehicle: true, user: { select: { name: true } } } },
                            provider: { include: { user: { select: { name: true } } } },
                            // @ts-ignore
                            events: { orderBy: { createdAt: 'desc' } }
                        }
                    })];
            case 1:
                job = _a.sent();
                if (!job)
                    throw new httpErrors_js_1.NotFoundError('Job no encontrado');
                res.json(job);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/admin/providers/:id/approve - Aprobar técnico
router.post('/providers/:id/approve', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, provider, updated, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({
                        where: { id: String(id) },
                        include: { user: true }
                    })];
            case 1:
                provider = _b.sent();
                if (!provider)
                    throw new httpErrors_js_1.NotFoundError('Proveedor no encontrado');
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.update({
                        where: { id: String(id) },
                        data: {
                            status: 'APPROVED',
                            reviewedAt: new Date(),
                            reviewedBy: req.user.email,
                            trustScore: 50.0
                        }
                    })];
            case 2:
                updated = _b.sent();
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                        action: 'APPROVE_PROVIDER',
                        resource: 'ServiceProvider',
                        resourceId: String(id),
                        newValue: updated,
                        ipAddress: req.ip,
                        userAgent: String(req.headers['user-agent'] || 'unknown')
                    })];
            case 3:
                _b.sent();
                res.json({ message: 'Proveedor aprobado', provider: updated });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _b.sent();
                next(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/audit - Ver rastro de auditoría
router.get('/audit', function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var logs, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.auditLog.findMany({
                        orderBy: { createdAt: 'desc' },
                        take: 100
                    })];
            case 1:
                logs = _a.sent();
                res.json(logs);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/users - Lista de usuarios para gestión
router.get('/users', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, role, _b, page, _c, limit, where, users, error_6;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, search = _a.search, role = _a.role, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '50' : _c;
                where = {};
                if (role && role !== 'ALL') {
                    where.role = String(role);
                }
                if (search) {
                    where.OR = [
                        { name: { contains: String(search), mode: 'insensitive' } },
                        { email: { contains: String(search), mode: 'insensitive' } }
                    ];
                }
                return [4 /*yield*/, db_js_1.prisma.user.findMany({
                        where: where,
                        include: {
                            _count: { select: { serviceRequests: true } }
                        },
                        orderBy: { createdAt: 'desc' },
                        take: Number(limit),
                        skip: (Number(page) - 1) * Number(limit)
                    })];
            case 1:
                users = _d.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _d.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/providers - Todos los Prestadores con filtros
router.get('/providers', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_1, type, search, _b, page, _c, limit, where, _d, providers, total, error_7;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, status_1 = _a.status, type = _a.type, search = _a.search, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '20' : _c;
                where = {};
                if (status_1 && status_1 !== 'ALL') {
                    where.status = status_1;
                }
                if (type) {
                    where.type = type;
                }
                if (search) {
                    where.OR = [
                        { user: { name: { contains: String(search), mode: 'insensitive' } } },
                        { user: { email: { contains: String(search), mode: 'insensitive' } } },
                        { rut: { contains: String(search), mode: 'insensitive' } },
                        { commune: { contains: String(search), mode: 'insensitive' } }
                    ];
                }
                return [4 /*yield*/, Promise.all([
                        db_js_1.prisma.serviceProvider.findMany({
                            where: where,
                            include: {
                                user: { select: { id: true, name: true, email: true, phone: true } },
                                subscription: true,
                                _count: { select: { jobs: true } }
                            },
                            orderBy: { createdAt: 'desc' },
                            take: Number(limit),
                            skip: (Number(page) - 1) * Number(limit)
                        }),
                        db_js_1.prisma.serviceProvider.count({ where: where })
                    ])];
            case 1:
                _d = _e.sent(), providers = _d[0], total = _d[1];
                res.json({
                    providers: providers,
                    total: total,
                    page: Number(page),
                    totalPages: Math.ceil(total / Number(limit))
                });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _e.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/providers/:id - Detalle de proveedor
router.get('/providers/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, provider, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({
                        where: { id: id },
                        include: {
                            user: true,
                            subscription: true,
                            categories: { include: { category: true } },
                            zones: { include: { zone: true } },
                            availability: true,
                            jobs: {
                                orderBy: { createdAt: 'desc' },
                                take: 10,
                                include: { request: { include: { service: true, vehicle: true } } }
                            },
                            history: { orderBy: { createdAt: 'desc' }, take: 20 },
                            _count: { select: { jobs: true, quotes: true } }
                        }
                    })];
            case 1:
                provider = _a.sent();
                if (!provider)
                    throw new httpErrors_js_1.NotFoundError('Proveedor no encontrado');
                res.json(provider);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PATCH /api/admin/providers/:id - Actualizar proveedor
router.patch('/providers/:id', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_2, trustScore, type, bio, commune, region, provider, error_9;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.body, status_2 = _a.status, trustScore = _a.trustScore, type = _a.type, bio = _a.bio, commune = _a.commune, region = _a.region;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.update({
                        where: { id: id },
                        data: __assign(__assign(__assign(__assign(__assign(__assign({}, (status_2 && { status: status_2 })), (trustScore !== undefined && { trustScore: trustScore })), (type && { type: type })), (bio !== undefined && { bio: bio })), (commune !== undefined && { commune: commune })), (region !== undefined && { region: region })),
                        include: { user: true }
                    })];
            case 1:
                provider = _c.sent();
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                        action: 'UPDATE_PROVIDER',
                        resource: 'ServiceProvider',
                        resourceId: id,
                        newValue: JSON.stringify(req.body),
                        ipAddress: req.ip,
                        userAgent: String(req.headers['user-agent'] || 'unknown')
                    })];
            case 2:
                _c.sent();
                res.json(provider);
                return [3 /*break*/, 4];
            case 3:
                error_9 = _c.sent();
                next(error_9);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /api/admin/providers/:id/suspend - Suspender proveedor
router.post('/providers/:id/suspend', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, reason, provider, error_10;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                id = req.params.id;
                reason = req.body.reason;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.update({
                        where: { id: id },
                        data: { status: 'SUSPENDED' }
                    })];
            case 1:
                provider = _c.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: id,
                            action: 'SUSPENDED',
                            description: reason || 'Suspendido por administrador',
                            metadata: JSON.stringify({ adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
                        }
                    })];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                        action: 'SUSPEND_PROVIDER',
                        resource: 'ServiceProvider',
                        resourceId: id,
                        newValue: reason,
                        ipAddress: req.ip,
                        userAgent: String(req.headers['user-agent'] || 'unknown')
                    })];
            case 3:
                _c.sent();
                res.json({ message: 'Proveedor suspendido', provider: provider });
                return [3 /*break*/, 5];
            case 4:
                error_10 = _c.sent();
                next(error_10);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// POST /api/admin/providers/:id/reactivate - Reactivar proveedor
router.post('/providers/:id/reactivate', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, provider, error_11;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.update({
                        where: { id: id },
                        data: { status: 'APPROVED' }
                    })];
            case 1:
                provider = _b.sent();
                return [4 /*yield*/, db_js_1.prisma.providerHistory.create({
                        data: {
                            providerId: id,
                            action: 'REACTIVATED',
                            description: 'Reactivado por administrador',
                            metadata: JSON.stringify({ adminId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
                        }
                    })];
            case 2:
                _b.sent();
                res.json({ message: 'Proveedor reactivado', provider: provider });
                return [3 /*break*/, 4];
            case 3:
                error_11 = _b.sent();
                next(error_11);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/subscriptions - Todas las suscripciones
router.get('/subscriptions', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_3, plan, _b, page, _c, limit, where, _d, subscriptions, total, error_12;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, status_3 = _a.status, plan = _a.plan, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '20' : _c;
                where = {};
                if (status_3 && status_3 !== 'ALL')
                    where.status = status_3;
                if (plan)
                    where.plan = plan;
                return [4 /*yield*/, Promise.all([
                        db_js_1.prisma.subscription.findMany({
                            where: where,
                            include: {
                                provider: {
                                    include: { user: { select: { name: true, email: true } } }
                                }
                            },
                            orderBy: { createdAt: 'desc' },
                            take: Number(limit),
                            skip: (Number(page) - 1) * Number(limit)
                        }),
                        db_js_1.prisma.subscription.count({ where: where })
                    ])];
            case 1:
                _d = _e.sent(), subscriptions = _d[0], total = _d[1];
                res.json({
                    subscriptions: subscriptions,
                    total: total,
                    page: Number(page),
                    totalPages: Math.ceil(total / Number(limit))
                });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _e.sent();
                next(error_12);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/zones - Todas las zonas
router.get('/zones', function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var zones, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.zone.findMany({
                        include: {
                            _count: { select: { providers: true, jobs: true } },
                            parent: true,
                            children: true
                        },
                        orderBy: { name: 'asc' }
                    })];
            case 1:
                zones = _a.sent();
                res.json(zones);
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                next(error_13);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/categories - Todas las categorías
router.get('/categories', function (_req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.serviceCategory.findMany({
                        include: {
                            _count: { select: { services: true, providers: true } }
                        },
                        orderBy: { sortOrder: 'asc' }
                    })];
            case 1:
                categories = _a.sent();
                res.json(categories);
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                next(error_14);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/jobs - Todos los trabajos con filtros
router.get('/jobs', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status_4, providerId, userId, _b, page, _c, limit, where, _d, jobs, total, error_15;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, status_4 = _a.status, providerId = _a.providerId, userId = _a.userId, _b = _a.page, page = _b === void 0 ? '1' : _b, _c = _a.limit, limit = _c === void 0 ? '20' : _c;
                where = {};
                if (status_4 && status_4 !== 'ALL')
                    where.status = status_4;
                if (providerId)
                    where.providerId = String(providerId);
                if (userId)
                    where.request = { userId: String(userId) };
                return [4 /*yield*/, Promise.all([
                        db_js_1.prisma.job.findMany({
                            where: where,
                            include: {
                                request: { include: { service: true, vehicle: true, user: { select: { name: true } } } },
                                provider: { include: { user: { select: { name: true } } } }
                            },
                            orderBy: { createdAt: 'desc' },
                            take: Number(limit),
                            skip: (Number(page) - 1) * Number(limit)
                        }),
                        db_js_1.prisma.job.count({ where: where })
                    ])];
            case 1:
                _d = _e.sent(), jobs = _d[0], total = _d[1];
                res.json({
                    jobs: jobs,
                    total: total,
                    page: Number(page),
                    totalPages: Math.ceil(total / Number(limit))
                });
                return [3 /*break*/, 3];
            case 2:
                error_15 = _e.sent();
                next(error_15);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/launch-leads - Ver todos los registros de preventa
router.get('/launch-leads', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var leads, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.launchLead.findMany({
                        orderBy: { createdAt: 'desc' }
                    })];
            case 1:
                leads = _a.sent();
                res.json({
                    leads: leads,
                    total: leads.length
                });
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                next(error_16);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/admin/launch-leads/stats - Estadísticas de leads
router.get('/launch-leads/stats', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var total, today, todayCount, thisWeek, weekCount, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, db_js_1.prisma.launchLead.count()];
            case 1:
                total = _a.sent();
                today = new Date();
                today.setHours(0, 0, 0, 0);
                return [4 /*yield*/, db_js_1.prisma.launchLead.count({
                        where: { createdAt: { gte: today } }
                    })];
            case 2:
                todayCount = _a.sent();
                thisWeek = new Date(today);
                thisWeek.setDate(thisWeek.getDate() - 7);
                return [4 /*yield*/, db_js_1.prisma.launchLead.count({
                        where: { createdAt: { gte: thisWeek } }
                    })];
            case 3:
                weekCount = _a.sent();
                res.json({
                    total: total,
                    today: todayCount,
                    thisWeek: weekCount
                });
                return [3 /*break*/, 5];
            case 4:
                error_17 = _a.sent();
                next(error_17);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
