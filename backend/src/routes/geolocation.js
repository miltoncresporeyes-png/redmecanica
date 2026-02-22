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
var zod_1 = require("zod");
var geolocation_js_1 = require("../services/geolocation.js");
var router = (0, express_1.Router)();
var searchProvidersSchema = zod_1.z.object({
    lat: zod_1.z.coerce.number().min(-90).max(90),
    lng: zod_1.z.coerce.number().min(-180).max(180),
    radiusKm: zod_1.z.coerce.number().positive().max(100).optional().default(15),
    categoryId: zod_1.z.string().uuid().optional(),
    serviceType: zod_1.z.enum(['MECHANIC', 'WORKSHOP', 'TOWING', 'INSURANCE']).optional(),
    availableNow: zod_1.z.coerce.boolean().optional().default(false),
    status: zod_1.z.enum(['ACTIVE', 'PENDING', 'UNDER_REVIEW', 'SUSPENDED']).optional().default('ACTIVE'),
    useRawQuery: zod_1.z.coerce.boolean().optional().default(false),
});
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, providers, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                params = searchProvidersSchema.parse(req.query);
                providers = void 0;
                if (!params.useRawQuery) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, geolocation_js_1.findNearbyProvidersRaw)(params.lat, params.lng, params.radiusKm)];
            case 1:
                providers = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, (0, geolocation_js_1.findNearbyProviders)({
                    lat: params.lat,
                    lng: params.lng,
                    radiusKm: params.radiusKm,
                    categoryId: params.categoryId,
                    serviceType: params.serviceType,
                    availableNow: params.availableNow,
                    status: params.status,
                })];
            case 3:
                providers = _a.sent();
                _a.label = 4;
            case 4:
                response = providers.map(function (p) {
                    var _a;
                    var provider = 'distance' in p ? p : __assign(__assign({}, p), { distance: 0 });
                    var etaMinutes = (0, geolocation_js_1.estimateArrivalTime)(provider.distance, 'type' in p ? p.type : 'MECHANIC');
                    return {
                        id: provider.id,
                        name: 'user' in provider ? (_a = provider.user) === null || _a === void 0 ? void 0 : _a.name : provider.name,
                        type: provider.type,
                        status: provider.status,
                        rating: provider.rating,
                        latitude: provider.latitude,
                        longitude: provider.longitude,
                        distance: Math.round(provider.distance * 10) / 10,
                        etaMinutes: etaMinutes,
                        isAvailableNow: 'availability' in provider ? (0, geolocation_js_1.isProviderAvailableNow)(provider.availability || []) : null,
                    };
                });
                res.json({
                    providers: response,
                    total: response.length,
                    searchParams: {
                        lat: params.lat,
                        lng: params.lng,
                        radiusKm: params.radiusKm,
                    }
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                if (error_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_1.errors })];
                }
                console.error('Error searching providers:', error_1);
                res.status(500).json({ error: 'Failed to search providers' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.get('/categories', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, _b, radiusKm, providers, providerIds, categoriesWithCount, categoryMap, _i, categoriesWithCount_1, provider, _c, _d, pc, cat, current, categories, error_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                _a = req.query, lat = _a.lat, lng = _a.lng, _b = _a.radiusKm, radiusKm = _b === void 0 ? '15' : _b;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'lat and lng are required' })];
                }
                return [4 /*yield*/, (0, geolocation_js_1.findNearbyProvidersRaw)(Number(lat), Number(lng), Number(radiusKm))];
            case 1:
                providers = _e.sent();
                providerIds = providers.map(function (p) { return p.id; });
                return [4 /*yield*/, db_js_1.prisma.serviceProvider.findMany({
                        where: { id: { in: providerIds } },
                        include: {
                            categories: {
                                include: { category: true }
                            }
                        }
                    })];
            case 2:
                categoriesWithCount = _e.sent();
                categoryMap = new Map();
                for (_i = 0, categoriesWithCount_1 = categoriesWithCount; _i < categoriesWithCount_1.length; _i++) {
                    provider = categoriesWithCount_1[_i];
                    for (_c = 0, _d = provider.categories; _c < _d.length; _c++) {
                        pc = _d[_c];
                        cat = pc.category;
                        current = categoryMap.get(cat.id) || __assign(__assign({}, cat), { count: 0 });
                        current.count += 1;
                        categoryMap.set(cat.id, current);
                    }
                }
                categories = Array.from(categoryMap.values()).sort(function (a, b) { return b.count - a.count; });
                res.json(categories);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _e.sent();
                console.error('Error fetching categories:', error_2);
                res.status(500).json({ error: 'Failed to fetch categories' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/emergency', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, towingProviders, response, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, lat = _a.lat, lng = _a.lng;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'lat and lng are required' })];
                }
                return [4 /*yield*/, (0, geolocation_js_1.findNearbyProviders)({
                        lat: Number(lat),
                        lng: Number(lng),
                        radiusKm: 30,
                        serviceType: 'TOWING',
                        availableNow: true,
                    })];
            case 1:
                towingProviders = _b.sent();
                response = towingProviders.map(function (p) { return ({
                    id: p.id,
                    name: p.user.name,
                    phone: p.phone,
                    rating: p.rating,
                    latitude: p.latitude,
                    longitude: p.longitude,
                    distance: Math.round(p.distance * 10) / 10,
                    etaMinutes: (0, geolocation_js_1.estimateArrivalTime)(p.distance, 'TOWING'),
                }); });
                res.json({
                    providers: response,
                    total: response.length,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching emergency providers:', error_3);
                res.status(500).json({ error: 'Failed to fetch emergency providers' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
