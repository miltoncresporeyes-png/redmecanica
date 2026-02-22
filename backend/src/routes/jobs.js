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
var requireAuth_js_1 = require("../middlewares/requireAuth.js");
var audit_js_1 = require("../lib/audit.js");
var validate_js_1 = require("../middlewares/validate.js");
var jobs_schemas_js_1 = require("../modules/jobs/jobs.schemas.js");
var httpErrors_js_1 = require("../lib/httpErrors.js");
var router = (0, express_1.Router)();
// Helper to check job access
function checkJobAccess(jobId, userId, role) {
    return __awaiter(this, void 0, void 0, function () {
        var job;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: jobId },
                        include: {
                            request: { select: { userId: true } },
                            provider: { select: { userId: true } }
                        }
                    })];
                case 1:
                    job = _a.sent();
                    if (!job)
                        throw new httpErrors_js_1.NotFoundError('Job no encontrado');
                    if (role === 'ADMIN' || role === 'SUPER_ADMIN')
                        return [2 /*return*/, job];
                    if (job.request.userId === userId)
                        return [2 /*return*/, job];
                    if (job.provider.userId === userId)
                        return [2 /*return*/, job];
                    throw new httpErrors_js_1.ForbiddenError('No tienes permiso para acceder a este job');
            }
        });
    });
}
// POST /api/jobs - Create a new job
router.post('/', requireAuth_js_1.requireAuth, (0, validate_js_1.validate)(jobs_schemas_js_1.createJobSchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, vehicleId, serviceId, providerId, problemDescription, damagePhoto, finalVehicleId, vehicle, fallbackVehicle, finalServiceId, service, fallbackService, finalProviderId, provider, serviceRequest, job, error_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 15, , 16]);
                userId = req.user.id;
                _a = req.body, vehicleId = _a.vehicleId, serviceId = _a.serviceId, providerId = _a.providerId, problemDescription = _a.problemDescription, damagePhoto = _a.damagePhoto;
                finalVehicleId = vehicleId || null;
                if (!finalVehicleId) return [3 /*break*/, 2];
                return [4 /*yield*/, db_js_1.prisma.vehicle.findUnique({ where: { id: String(finalVehicleId) } })];
            case 1:
                vehicle = _c.sent();
                if (!vehicle || vehicle.userId !== userId) {
                    throw new httpErrors_js_1.BadRequestError('El vehiculo no pertenece al usuario o no existe');
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, db_js_1.prisma.vehicle.findFirst({ where: { userId: userId }, orderBy: { createdAt: 'asc' } })];
            case 3:
                fallbackVehicle = _c.sent();
                if (fallbackVehicle) {
                    finalVehicleId = fallbackVehicle.id;
                }
                _c.label = 4;
            case 4:
                if (!finalVehicleId) {
                    throw new httpErrors_js_1.BadRequestError('Debes registrar un vehiculo antes de crear una solicitud.');
                }
                finalServiceId = serviceId || null;
                if (!finalServiceId) return [3 /*break*/, 6];
                return [4 /*yield*/, db_js_1.prisma.service.findUnique({ where: { id: String(finalServiceId) } })];
            case 5:
                service = _c.sent();
                if (!service) {
                    throw new httpErrors_js_1.BadRequestError('El servicio seleccionado no existe');
                }
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, db_js_1.prisma.service.findFirst({ where: { isActive: true }, orderBy: { createdAt: 'asc' } })];
            case 7:
                fallbackService = _c.sent();
                if (!fallbackService) {
                    throw new httpErrors_js_1.BadRequestError('No hay servicios activos disponibles');
                }
                finalServiceId = fallbackService.id;
                _c.label = 8;
            case 8:
                finalProviderId = providerId;
                if (!!finalProviderId) return [3 /*break*/, 10];
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findFirst({
                        where: { status: { in: ['APPROVED', 'ACTIVE'] } },
                        orderBy: { createdAt: 'asc' }
                    })];
            case 9:
                provider = _c.sent();
                finalProviderId = provider === null || provider === void 0 ? void 0 : provider.id;
                _c.label = 10;
            case 10:
                if (!finalProviderId) {
                    throw new httpErrors_js_1.BadRequestError('No hay Prestadores disponibles en este momento');
                }
                return [4 /*yield*/, db_js_1.prisma.serviceRequest.create({
                        data: {
                            userId: userId,
                            vehicleId: String(finalVehicleId),
                            serviceId: String(finalServiceId),
                            problemDescription: problemDescription,
                            damagePhoto: damagePhoto,
                            status: "PENDING"
                        }
                    })];
            case 11:
                serviceRequest = _c.sent();
                return [4 /*yield*/, db_js_1.prisma.job.create({
                        data: {
                            requestId: serviceRequest.id,
                            customerId: userId,
                            providerId: finalProviderId,
                            status: "SEARCHING",
                            etaMinutes: 15
                        },
                        include: {
                            request: { include: { service: true, vehicle: true } },
                            provider: { include: { user: true } }
                        }
                    })];
            case 12:
                job = _c.sent();
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                        action: 'CREATE_JOB',
                        resource: 'Job',
                        resourceId: job.id,
                        newValue: job,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent'] || undefined
                    })];
            case 13:
                _c.sent();
                // @ts-ignore
                return [4 /*yield*/, db_js_1.prisma.jobEvent.create({
                        data: {
                            jobId: job.id,
                            status: job.status,
                            description: 'Servicio iniciado y técnico asignado.',
                            metadata: JSON.stringify({ eta: job.etaMinutes })
                        }
                    })];
            case 14:
                // @ts-ignore
                _c.sent();
                res.json(job);
                return [3 /*break*/, 16];
            case 15:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
// GET /api/jobs - List jobs for current user/provider/admin
router.get('/', requireAuth_js_1.requireAuth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, where, jobs, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = req.user;
                where = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                    ? {}
                    : {
                        OR: [
                            { customerId: user.id },
                            { provider: { userId: user.id } }
                        ]
                    };
                return [4 /*yield*/, db_js_1.prisma.job.findMany({
                        where: where,
                        include: {
                            request: { include: { service: true, vehicle: true } },
                            provider: { include: { user: true } }
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 100
                    })];
            case 1:
                jobs = _a.sent();
                res.json(jobs);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/jobs/:id - Get job status
router.get('/:id', requireAuth_js_1.requireAuth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var job, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, checkJobAccess(String(req.params.id), req.user.id, req.user.role)];
            case 1:
                _a.sent();
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({
                        where: { id: String(req.params.id) },
                        include: {
                            request: { include: { service: true, vehicle: true } },
                            provider: { include: { user: true } },
                            // @ts-ignore
                            events: { orderBy: { createdAt: 'desc' } }
                        }
                    })];
            case 2:
                job = _a.sent();
                res.json(job);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PATCH /api/jobs/:id/status - Actualizar estado del job
router.patch('/:id/status', requireAuth_js_1.requireAuth, (0, validate_js_1.validate)(jobs_schemas_js_1.updateJobStatusSchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, status_1, metadata, updateData, job, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                id = req.params.id;
                _a = req.body, status_1 = _a.status, metadata = _a.metadata;
                return [4 /*yield*/, checkJobAccess(String(id), req.user.id, req.user.role)];
            case 1:
                _c.sent();
                if (req.user.role === 'USER' && status_1 !== 'CANCELLED') {
                    throw new httpErrors_js_1.ForbiddenError('Los clientes solo pueden cancelar solicitudes.');
                }
                updateData = { status: status_1 };
                switch (status_1) {
                    case 'CONFIRMED':
                        updateData.confirmedAt = new Date();
                        break;
                    case 'PROVIDER_EN_ROUTE':
                        if (metadata === null || metadata === void 0 ? void 0 : metadata.estimatedArrival) {
                            updateData.estimatedArrival = new Date(metadata.estimatedArrival);
                        }
                        break;
                    case 'IN_PROGRESS':
                        updateData.startedAt = new Date();
                        break;
                    case 'WORK_COMPLETED':
                        updateData.completedAt = new Date();
                        break;
                    case 'DELIVERED':
                        updateData.deliveredAt = new Date();
                        break;
                    case 'REVIEWED':
                        updateData.reviewedAt = new Date();
                        if (metadata === null || metadata === void 0 ? void 0 : metadata.rating)
                            updateData.rating = metadata.rating;
                        if (metadata === null || metadata === void 0 ? void 0 : metadata.review)
                            updateData.review = metadata.review;
                        break;
                    case 'CLOSED':
                        updateData.closedAt = new Date();
                        break;
                }
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: String(id) },
                        data: updateData,
                        include: {
                            request: true,
                            provider: { include: { user: true } }
                        }
                    })];
            case 2:
                job = _c.sent();
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
                        action: 'UPDATE_JOB_STATUS',
                        resource: 'Job',
                        resourceId: String(id),
                        newValue: { status: status_1 },
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent'] || undefined
                    })];
            case 3:
                _c.sent();
                // @ts-ignore
                return [4 /*yield*/, db_js_1.prisma.jobEvent.create({
                        data: {
                            jobId: job.id,
                            status: job.status,
                            description: "Estado cambiado a ".concat(status_1),
                            metadata: JSON.stringify(metadata || {})
                        }
                    })];
            case 4:
                // @ts-ignore
                _c.sent();
                res.json(job);
                return [3 /*break*/, 6];
            case 5:
                error_4 = _c.sent();
                next(error_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// PATCH /api/jobs/:id/advance - Advance to next logical status
router.patch('/:id/advance', requireAuth_js_1.requireAuth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, current, nextByStatus, nextStatus, updated, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                id = req.params.id;
                return [4 /*yield*/, checkJobAccess(String(id), req.user.id, req.user.role)];
            case 1:
                _a.sent();
                return [4 /*yield*/, db_js_1.prisma.job.findUnique({ where: { id: String(id) } })];
            case 2:
                current = _a.sent();
                if (!current)
                    throw new httpErrors_js_1.NotFoundError('Job no encontrado');
                nextByStatus = {
                    SEARCHING: 'QUOTING',
                    QUOTING: 'COMPARING_QUOTES',
                    COMPARING_QUOTES: 'CONFIRMED',
                    CONFIRMED: 'PROVIDER_EN_ROUTE',
                    PROVIDER_EN_ROUTE: 'PROVIDER_ARRIVED',
                    PROVIDER_ARRIVED: 'DIAGNOSING',
                    DIAGNOSING: 'IN_PROGRESS',
                    IN_PROGRESS: 'WORK_COMPLETED',
                    WORK_COMPLETED: 'DELIVERED',
                    DELIVERED: 'REVIEWED',
                    REVIEWED: 'CLOSED'
                };
                nextStatus = nextByStatus[current.status];
                if (!nextStatus) {
                    throw new httpErrors_js_1.BadRequestError("No existe un siguiente estado para ".concat(current.status));
                }
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: String(id) },
                        data: { status: nextStatus },
                        include: {
                            request: { include: { service: true, vehicle: true } },
                            provider: { include: { user: true } }
                        }
                    })];
            case 3:
                updated = _a.sent();
                return [4 /*yield*/, db_js_1.prisma.jobEvent.create({
                        data: {
                            jobId: updated.id,
                            status: updated.status,
                            description: "Estado avanzado automaticamente a ".concat(updated.status),
                            metadata: JSON.stringify({ by: req.user.id })
                        }
                    })];
            case 4:
                _a.sent();
                res.json(updated);
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// POST /api/jobs/:id/cancel - Cancelar un job
router.post('/:id/cancel', requireAuth_js_1.requireAuth, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, job, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, checkJobAccess(String(id), req.user.id, req.user.role)];
            case 1:
                _a.sent();
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: String(id) },
                        data: { status: 'CANCELLED' },
                        include: {
                            request: true,
                            provider: { include: { user: true } }
                        }
                    })];
            case 2:
                job = _a.sent();
                // @ts-ignore
                return [4 /*yield*/, db_js_1.prisma.jobEvent.create({
                        data: {
                            jobId: job.id,
                            status: 'CANCELLED',
                            description: 'Servicio cancelado.',
                            metadata: JSON.stringify({ cancelledBy: req.user.role })
                        }
                    })];
            case 3:
                // @ts-ignore
                _a.sent();
                res.json(job);
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// POST /api/jobs/:id/rate - Calificar un job completado
router.post('/:id/rate', requireAuth_js_1.requireAuth, (0, validate_js_1.validate)(jobs_schemas_js_1.rateJobSchema), function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, rating, review, job, updatedJob, allJobsForProvider, avgRating, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                id = req.params.id;
                _a = req.body, rating = _a.rating, review = _a.review;
                return [4 /*yield*/, checkJobAccess(String(id), req.user.id, req.user.role)];
            case 1:
                job = _b.sent();
                if (job.status !== 'WORK_COMPLETED' && job.status !== 'DELIVERED') {
                    throw new httpErrors_js_1.BadRequestError('Solo se pueden calificar trabajos finalizados');
                }
                return [4 /*yield*/, db_js_1.prisma.job.update({
                        where: { id: String(id) },
                        data: {
                            status: 'REVIEWED',
                            rating: rating,
                            review: review || null,
                            reviewedAt: new Date()
                        },
                        include: {
                            request: true,
                            provider: { include: { user: true } }
                        }
                    })];
            case 2:
                updatedJob = _b.sent();
                // @ts-ignore
                return [4 /*yield*/, db_js_1.prisma.jobEvent.create({
                        data: {
                            jobId: updatedJob.id,
                            status: 'REVIEWED',
                            description: "Servicio calificado con ".concat(rating, " estrellas."),
                            metadata: JSON.stringify({ rating: rating, review: review })
                        }
                    })];
            case 3:
                // @ts-ignore
                _b.sent();
                return [4 /*yield*/, db_js_1.prisma.job.findMany({
                        where: {
                            providerId: job.providerId,
                            rating: { not: null }
                        },
                        select: { rating: true }
                    })];
            case 4:
                allJobsForProvider = _b.sent();
                avgRating = allJobsForProvider.length > 0
                    ? allJobsForProvider.reduce(function (sum, j) { return sum + (j.rating || 0); }, 0) / allJobsForProvider.length
                    : rating;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.update({
                        where: { id: job.providerId },
                        data: { rating: avgRating }
                    })];
            case 5:
                _b.sent();
                res.json(updatedJob);
                return [3 /*break*/, 7];
            case 6:
                error_7 = _b.sent();
                next(error_7);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
