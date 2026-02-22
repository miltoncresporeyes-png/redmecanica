"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.calculateDistance = calculateDistance;
exports.findNearbyProviders = findNearbyProviders;
exports.findNearbyProvidersRaw = findNearbyProvidersRaw;
exports.isProviderAvailableNow = isProviderAvailableNow;
exports.estimateArrivalTime = estimateArrivalTime;
var db_js_1 = require("../db.js");
function calculateDistance(point1, point2) {
    var R = 6371;
    var dLat = toRad(point2.lat - point1.lat);
    var dLng = toRad(point2.lng - point1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function toRad(deg) {
    return deg * (Math.PI / 180);
}
function findNearbyProviders(params) {
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, _a, radiusKm, categoryId, serviceType, _b, availableNow, _c, status, providers, userLocation, nearbyProviders;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    lat = params.lat, lng = params.lng, _a = params.radiusKm, radiusKm = _a === void 0 ? 15 : _a, categoryId = params.categoryId, serviceType = params.serviceType, _b = params.availableNow, availableNow = _b === void 0 ? false : _b, _c = params.status, status = _c === void 0 ? 'ACTIVE' : _c;
                    return [4 /*yield*/, db_js_1.prisma.serviceProvider.findMany({
                            where: __assign(__assign({ status: status, latitude: { not: null }, longitude: { not: null } }, (categoryId && {
                                categories: {
                                    some: { categoryId: categoryId }
                                }
                            })), (serviceType && {
                                type: serviceType
                            })),
                            include: {
                                user: { select: { id: true, name: true, email: true, phone: true } },
                                subscription: true,
                                categories: { include: { category: true } },
                                zones: { include: { zone: true } },
                                availability: availableNow ? {
                                    where: {
                                        dayOfWeek: new Date().getDay(),
                                        isActive: true
                                    }
                                } : false
                            }
                        })];
                case 1:
                    providers = _d.sent();
                    userLocation = { lat: lat, lng: lng };
                    nearbyProviders = providers
                        .map(function (provider) {
                        var providerLocation = {
                            lat: provider.latitude,
                            lng: provider.longitude
                        };
                        var distance = calculateDistance(userLocation, providerLocation);
                        return __assign(__assign({}, provider), { distance: distance });
                    })
                        .filter(function (provider) { return provider.distance <= radiusKm; })
                        .sort(function (a, b) { return a.distance - b.distance; });
                    return [2 /*return*/, nearbyProviders];
            }
        });
    });
}
function findNearbyProvidersRaw(lat_1, lng_1) {
    return __awaiter(this, arguments, void 0, function (lat, lng, radiusKm) {
        var providers;
        if (radiusKm === void 0) { radiusKm = 15; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_js_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    SELECT \n      sp.id,\n      sp.type,\n      sp.status,\n      sp.rating,\n      sp.latitude,\n      sp.longitude,\n      u.name,\n      (6371 * acos(\n        cos(radians(", ")) * cos(radians(sp.latitude)) * \n        cos(radians(sp.longitude) - radians(", ")) + \n        sin(radians(", ")) * sin(radians(sp.latitude))\n      )) AS distance\n    FROM \"ServiceProvider\" sp\n    JOIN \"User\" u ON sp.\"userId\" = u.id\n    WHERE sp.status = 'ACTIVE'\n      AND sp.latitude IS NOT NULL\n      AND sp.longitude IS NOT NULL\n      AND (6371 * acos(\n        cos(radians(", ")) * cos(radians(sp.latitude)) * \n        cos(radians(sp.longitude) - radians(", ")) + \n        sin(radians(", ")) * sin(radians(sp.latitude))\n      )) <= ", "\n    ORDER BY distance ASC\n    LIMIT 20\n  "], ["\n    SELECT \n      sp.id,\n      sp.type,\n      sp.status,\n      sp.rating,\n      sp.latitude,\n      sp.longitude,\n      u.name,\n      (6371 * acos(\n        cos(radians(", ")) * cos(radians(sp.latitude)) * \n        cos(radians(sp.longitude) - radians(", ")) + \n        sin(radians(", ")) * sin(radians(sp.latitude))\n      )) AS distance\n    FROM \"ServiceProvider\" sp\n    JOIN \"User\" u ON sp.\"userId\" = u.id\n    WHERE sp.status = 'ACTIVE'\n      AND sp.latitude IS NOT NULL\n      AND sp.longitude IS NOT NULL\n      AND (6371 * acos(\n        cos(radians(", ")) * cos(radians(sp.latitude)) * \n        cos(radians(sp.longitude) - radians(", ")) + \n        sin(radians(", ")) * sin(radians(sp.latitude))\n      )) <= ", "\n    ORDER BY distance ASC\n    LIMIT 20\n  "])), lat, lng, lat, lat, lng, lat, radiusKm)];
                case 1:
                    providers = _a.sent();
                    return [2 /*return*/, providers];
            }
        });
    });
}
function isProviderAvailableNow(providerAvailability) {
    var now = new Date();
    var currentDay = now.getDay();
    var currentTime = now.getHours() * 60 + now.getMinutes();
    var todayAvailability = providerAvailability.filter(function (a) { return a.dayOfWeek === currentDay && a.isActive; });
    for (var _i = 0, todayAvailability_1 = todayAvailability; _i < todayAvailability_1.length; _i++) {
        var avail = todayAvailability_1[_i];
        var _a = avail.startTime.split(':').map(Number), startHour = _a[0], startMin = _a[1];
        var _b = avail.endTime.split(':').map(Number), endHour = _b[0], endMin = _b[1];
        var startTime = startHour * 60 + startMin;
        var endTime = endHour * 60 + endMin;
        if (currentTime >= startTime && currentTime <= endTime) {
            return true;
        }
    }
    return false;
}
function estimateArrivalTime(distanceKm, providerType) {
    var avgSpeedKmh = providerType === 'TOWING' ? 50 : 40;
    var margin = 1.2;
    return Math.ceil((distanceKm / avgSpeedKmh) * 60 * margin);
}
var templateObject_1;
