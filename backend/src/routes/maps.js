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
var maps_js_1 = require("../services/maps.js");
var router = (0, express_1.Router)();
router.get('/geocode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var address, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                address = req.query.address;
                if (!address || typeof address !== 'string') {
                    return [2 /*return*/, res.status(400).json({ error: 'address is required' })];
                }
                return [4 /*yield*/, maps_js_1.mapsService.geocode(address)];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'Address not found' })];
                }
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Geocode error:', error_1);
                res.status(500).json({ error: 'Failed to geocode address' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/reverse-geocode', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, lat = _a.lat, lng = _a.lng;
                if (!lat || !lng) {
                    return [2 /*return*/, res.status(400).json({ error: 'lat and lng are required' })];
                }
                return [4 /*yield*/, maps_js_1.mapsService.reverseGeocode(Number(lat), Number(lng))];
            case 1:
                result = _b.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'Location not found' })];
                }
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('Reverse geocode error:', error_2);
                res.status(500).json({ error: 'Failed to reverse geocode' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/directions', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, origin_1, destination, _b, originLat, originLng, _c, destLat, destLng, result, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.query, origin_1 = _a.origin, destination = _a.destination;
                if (!origin_1 || !destination) {
                    return [2 /*return*/, res.status(400).json({ error: 'origin and destination are required (format: lat,lng)' })];
                }
                _b = origin_1.split(',').map(Number), originLat = _b[0], originLng = _b[1];
                _c = destination.split(',').map(Number), destLat = _c[0], destLng = _c[1];
                if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid coordinates format' })];
                }
                return [4 /*yield*/, maps_js_1.mapsService.getDirections([originLng, originLat], [destLng, destLat])];
            case 1:
                result = _d.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'No route found' })];
                }
                res.json({
                    duration: Math.round(result.duration / 60),
                    distance: Math.round(result.distance / 1000 * 10) / 10,
                    geometry: result.geometry,
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _d.sent();
                console.error('Directions error:', error_3);
                res.status(500).json({ error: 'Failed to get directions' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/static-map', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lng, zoom, width, height, url;
    return __generator(this, function (_b) {
        try {
            _a = req.query, lat = _a.lat, lng = _a.lng, zoom = _a.zoom, width = _a.width, height = _a.height;
            if (!lat || !lng) {
                return [2 /*return*/, res.status(400).json({ error: 'lat and lng are required' })];
            }
            url = maps_js_1.mapsService.getStaticMapUrl(Number(lat), Number(lng), zoom ? Number(zoom) : 14, width ? Number(width) : 400, height ? Number(height) : 300);
            res.json({ url: url });
        }
        catch (error) {
            console.error('Static map error:', error);
            res.status(500).json({ error: 'Failed to generate static map URL' });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
