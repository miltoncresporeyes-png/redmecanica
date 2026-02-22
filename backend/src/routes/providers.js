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
var auth_js_1 = require("../middleware/auth.js");
var rutValidator_js_1 = require("../utils/rutValidator.js");
var router = (0, express_1.Router)();
// Search providers by location and type
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, type, radius, latitude_1, longitude_1, rad_1, latDelta, lngDelta, whereClause, providers, results, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, lat = _a.lat, lng = _a.lng, type = _a.type, radius = _a.radius;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'Latitude and longitude are required' })];
                }
                latitude_1 = parseFloat(lat);
                longitude_1 = parseFloat(lng);
                rad_1 = parseFloat(radius || '10');
                latDelta = rad_1 / 111;
                lngDelta = rad_1 / (111 * Math.cos(latitude_1 * (Math.PI / 180)));
                whereClause = {
                    status: { in: ['ACTIVE', 'APPROVED'] },
                    latitude: {
                        gte: latitude_1 - latDelta,
                        lte: latitude_1 + latDelta
                    },
                    longitude: {
                        gte: longitude_1 - lngDelta,
                        lte: longitude_1 + lngDelta
                    }
                };
                if (type) {
                    whereClause.type = type;
                }
                if (req.query.certified === 'true') {
                    whereClause.emailVerified = true;
                }
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findMany({
                        where: whereClause,
                        include: { user: true }
                    })];
            case 1:
                providers = _b.sent();
                results = providers.map(function (p) {
                    if (!p.latitude || !p.longitude)
                        return null;
                    var dist = getDistanceFromLatLonInKm(latitude_1, longitude_1, p.latitude, p.longitude);
                    // Filtro por especialidades (si se solicitan)
                    if (req.query.specialties) {
                        var searchSpecs = req.query.specialties.split(',').map(function (s) { return s.trim().toLowerCase(); });
                        var providerSpecs_1 = (p.specialties || '').split(',').map(function (s) { return s.trim().toLowerCase(); });
                        var matches = searchSpecs.some(function (s) { return providerSpecs_1.includes(s); });
                        if (!matches)
                            return null;
                    }
                    return __assign(__assign({}, p), { distance: dist });
                })
                    .filter(function (p) { return p !== null && p.distance <= rad_1; })
                    .sort(function (a, b) { return ((a === null || a === void 0 ? void 0 : a.distance) || 0) - ((b === null || b === void 0 ? void 0 : b.distance) || 0); });
                return [2 /*return*/, res.json(results)];
            case 2:
                error_1 = _b.sent();
                console.error("Error searching providers:", error_1);
                return [2 /*return*/, res.status(500).json({ error: 'Failed to search providers' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Helper function for Haversine distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
// Get provider profile
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var provider, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({
                        where: { id: req.params.id },
                        include: {
                            user: true,
                            jobs: true
                        }
                    })];
            case 1:
                provider = _a.sent();
                if (!provider) {
                    return [2 /*return*/, res.status(404).json({ error: 'Provider not found' })];
                }
                return [2 /*return*/, res.json(provider)];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching provider:", error_2);
                return [2 /*return*/, res.status(500).json({ error: 'Failed to fetch provider' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Register new provider (creates or links to existing user)
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, type, bio, vehicle, licensePlate, latitude, longitude, address, commune, region, phone, website, paymentMethods, rut, specialties, idDocumentUrl, backgroundCheckUrl, existingProfile, newProvider, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, userId = _a.userId, type = _a.type, bio = _a.bio, vehicle = _a.vehicle, licensePlate = _a.licensePlate, latitude = _a.latitude, longitude = _a.longitude, address = _a.address, commune = _a.commune, region = _a.region, phone = _a.phone, website = _a.website, paymentMethods = _a.paymentMethods, rut = _a.rut, specialties = _a.specialties, idDocumentUrl = _a.idDocumentUrl, backgroundCheckUrl = _a.backgroundCheckUrl;
                // Validate essential fields
                if (!userId || !type) {
                    return [2 /*return*/, res.status(400).json({ error: "Faltan campos obligatorios: userId, tipo" })];
                }
                if (rut && !(0, rutValidator_js_1.validarRUT)(rut)) {
                    return [2 /*return*/, res.status(400).json({ error: "El RUT ingresado no es válido (Módulo 11)" })];
                }
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({
                        where: { userId: userId }
                    })];
            case 1:
                existingProfile = _b.sent();
                if (existingProfile) {
                    return [2 /*return*/, res.status(400).json({ error: "User is already a service provider" })];
                }
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.create({
                        data: {
                            userId: userId,
                            type: type, // MECHANIC, WORKSHOP, TOWING, INSURANCE
                            bio: bio,
                            vehicle: vehicle,
                            licensePlate: licensePlate,
                            latitude: latitude,
                            longitude: longitude,
                            address: address,
                            commune: commune,
                            region: region,
                            phone: phone,
                            website: website,
                            paymentMethods: paymentMethods,
                            rut: rut,
                            specialties: specialties,
                            idDocumentUrl: idDocumentUrl,
                            backgroundCheckUrl: backgroundCheckUrl,
                            submittedAt: new Date(),
                            status: "PENDING" // Default to pending approval
                        },
                        include: {
                            user: true
                        }
                    })];
            case 2:
                newProvider = _b.sent();
                // Optionally update user role to reflect provider status if needed
                // await prisma.user.update({ where: { id: userId }, data: { role: type } });
                return [2 /*return*/, res.status(201).json(newProvider)];
            case 3:
                error_3 = _b.sent();
                console.error("Error registering provider:", error_3);
                return [2 /*return*/, res.status(500).json({ error: 'Failed to register provider' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Update provider profile
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bio, vehicle, licensePlate, status_1, latitude, longitude, updatedProvider, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, bio = _a.bio, vehicle = _a.vehicle, licensePlate = _a.licensePlate, status_1 = _a.status, latitude = _a.latitude, longitude = _a.longitude;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.update({
                        where: { id: req.params.id },
                        data: {
                            bio: bio,
                            vehicle: vehicle,
                            licensePlate: licensePlate,
                            status: status_1,
                            latitude: latitude,
                            longitude: longitude
                        }
                    })];
            case 1:
                updatedProvider = _b.sent();
                res.json(updatedProvider);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error("Error updating provider:", error_4);
                res.status(500).json({ error: 'Failed to update provider' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/me/quotes', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, provider, quotes, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({ where: { userId: userId } })];
            case 1:
                provider = _b.sent();
                if (!provider)
                    return [2 /*return*/, res.status(404).json({ error: 'Proveedor no encontrado' })];
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
                return [2 /*return*/, res.json(quotes)];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, res.status(500).json({ error: 'Error al obtener cotizaciones' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// --- DASHBOARD FOR AUTHENTICATED PROVIDER ---
router.get('/me/dashboard', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, provider, earnings, now, firstDayOfMonth, monthEarnings, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({
                        where: { userId: userId },
                        include: {
                            _count: {
                                select: { jobs: true }
                            }
                        }
                    })];
            case 1:
                provider = _b.sent();
                if (!provider)
                    return [2 /*return*/, res.status(404).json({ error: 'Perfil de proveedor no encontrado' })];
                return [4 /*yield*/, db_js_1.prisma.job.aggregate({
                        where: {
                            providerId: provider.id,
                            status: 'COMPLETED'
                        },
                        _sum: {
                            estimatedCost: true
                        }
                    })];
            case 2:
                earnings = _b.sent();
                now = new Date();
                firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return [4 /*yield*/, db_js_1.prisma.job.aggregate({
                        where: {
                            providerId: provider.id,
                            status: 'COMPLETED',
                            completedAt: { gte: firstDayOfMonth }
                        },
                        _sum: {
                            estimatedCost: true
                        }
                    })];
            case 3:
                monthEarnings = _b.sent();
                return [2 /*return*/, res.json({
                        provider: provider,
                        stats: {
                            totalEarnings: earnings._sum.estimatedCost || 0,
                            monthEarnings: monthEarnings._sum.estimatedCost || 0,
                            completedJobs: provider._count.jobs,
                            avgRating: provider.rating,
                            responseTime: "15 min", // Mock por ahora
                            completionRate: 100 // Mock por ahora
                        }
                    })];
            case 4:
                error_6 = _b.sent();
                console.error("Dashboard error:", error_6);
                return [2 /*return*/, res.status(500).json({ error: 'Error al cargar dashboard' })];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get('/me/jobs', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, provider, jobs, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findUnique({ where: { userId: userId } })];
            case 1:
                provider = _b.sent();
                if (!provider)
                    return [2 /*return*/, res.status(404).json({ error: 'Proveedor no encontrado' })];
                return [4 /*yield*/, db_js_1.prisma.job.findMany({
                        where: { providerId: provider.id },
                        include: {
                            request: {
                                include: {
                                    user: { select: { name: true, email: true } },
                                    vehicle: true,
                                    service: true
                                }
                            }
                        },
                        orderBy: { createdAt: 'desc' }
                    })];
            case 2:
                jobs = _b.sent();
                return [2 /*return*/, res.json(jobs)];
            case 3:
                error_7 = _b.sent();
                return [2 /*return*/, res.status(500).json({ error: 'Error al obtener trabajos' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
