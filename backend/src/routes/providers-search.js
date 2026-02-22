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
var geolocation_js_1 = require("../services/geolocation.js");
var router = (0, express_1.Router)();
router.get('/search', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, _b, radius, type, certified, specialties, region_1, commune_1, providers, filtered, specList_1, response, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, lat = _a.lat, lng = _a.lng, _b = _a.radius, radius = _b === void 0 ? '15' : _b, type = _a.type, certified = _a.certified, specialties = _a.specialties, region_1 = _a.region, commune_1 = _a.commune;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'lat and lng are required' })];
                }
                return [4 /*yield*/, (0, geolocation_js_1.findNearbyProviders)({
                        lat: Number(lat),
                        lng: Number(lng),
                        radiusKm: Number(radius),
                        serviceType: type,
                    })];
            case 1:
                providers = _c.sent();
                filtered = providers;
                if (certified === 'true') {
                    filtered = filtered.filter(function (p) { return p.emailVerified; });
                }
                if (specialties) {
                    specList_1 = specialties.split(',');
                    filtered = filtered.filter(function (p) {
                        return p.specialties && specList_1.some(function (spec) {
                            return p.specialties.toLowerCase().includes(spec.toLowerCase());
                        });
                    });
                }
                if (region_1) {
                    filtered = filtered.filter(function (p) {
                        return p.region && p.region.toLowerCase().includes(region_1.toLowerCase());
                    });
                }
                if (commune_1) {
                    filtered = filtered.filter(function (p) {
                        return p.commune && p.commune.toLowerCase().includes(commune_1.toLowerCase());
                    });
                }
                response = filtered.map(function (p) {
                    var _a;
                    return ({
                        id: p.id,
                        name: (_a = p.user) === null || _a === void 0 ? void 0 : _a.name,
                        type: p.type,
                        status: p.status,
                        rating: p.rating,
                        bio: p.bio,
                        specialties: p.specialties,
                        commune: p.commune,
                        region: p.region,
                        phone: p.phone,
                        latitude: p.latitude,
                        longitude: p.longitude,
                        emailVerified: p.emailVerified,
                        phoneVerified: p.phoneVerified,
                        trustScore: p.trustScore,
                        distance: Math.round(p.distance * 10) / 10,
                        etaMinutes: (0, geolocation_js_1.estimateArrivalTime)(p.distance, p.type),
                    });
                });
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _c.sent();
                console.error('Error searching providers:', error_1);
                res.status(500).json({ error: 'Failed to search providers' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/nearby', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, _b, radius, providers, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.query, lat = _a.lat, lng = _a.lng, _b = _a.radius, radius = _b === void 0 ? '15' : _b;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'lat and lng are required' })];
                }
                return [4 /*yield*/, (0, geolocation_js_1.findNearbyProviders)({
                        lat: Number(lat),
                        lng: Number(lng),
                        radiusKm: Number(radius),
                    })];
            case 1:
                providers = _c.sent();
                res.json(providers);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                console.error('Error fetching nearby providers:', error_2);
                res.status(500).json({ error: 'Failed to fetch nearby providers' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
