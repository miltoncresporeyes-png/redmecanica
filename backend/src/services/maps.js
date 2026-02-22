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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapsService = void 0;
var axios_1 = require("axios");
var index_js_1 = require("../config/index.js");
var MapsService = /** @class */ (function () {
    function MapsService() {
        this.provider = index_js_1.config.maps.provider || 'mapbox';
        this.apiKey = index_js_1.config.maps.apiKey || '';
    }
    MapsService.prototype.geocode = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === 'mapbox') {
                    return [2 /*return*/, this.geocodeMapbox(address)];
                }
                return [2 /*return*/, this.geocodeGoogle(address)];
            });
        });
    };
    MapsService.prototype.reverseGeocode = function (lat, lng) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === 'mapbox') {
                    return [2 /*return*/, this.reverseGeocodeMapbox(lat, lng)];
                }
                return [2 /*return*/, this.reverseGeocodeGoogle(lat, lng)];
            });
        });
    };
    MapsService.prototype.getDirections = function (origin, destination) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === 'mapbox') {
                    return [2 /*return*/, this.getDirectionsMapbox(origin, destination)];
                }
                return [2 /*return*/, this.getDirectionsGoogle(origin, destination)];
            });
        });
    };
    MapsService.prototype.calculateDistanceMatrix = function (origins, destinations) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === 'mapbox') {
                    return [2 /*return*/, this.calculateDistanceMatrixMapbox(origins, destinations)];
                }
                return [2 /*return*/, this.calculateDistanceMatrixGoogle(origins, destinations)];
            });
        });
    };
    MapsService.prototype.geocodeMapbox = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, feature, _a, lng, lat, context, error_1;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(encodeURIComponent(address), ".json"), {
                                params: {
                                    access_token: this.apiKey,
                                    country: 'CL',
                                    limit: 1,
                                },
                            })];
                    case 1:
                        response = _d.sent();
                        if (((_b = response.data.features) === null || _b === void 0 ? void 0 : _b.length) === 0)
                            return [2 /*return*/, null];
                        feature = response.data.features[0];
                        _a = feature.center, lng = _a[0], lat = _a[1];
                        context = (_c = feature.context) === null || _c === void 0 ? void 0 : _c.reduce(function (acc, ctx) {
                            if (ctx.id.startsWith('commune'))
                                acc.commune = ctx.text;
                            if (ctx.id.startsWith('region'))
                                acc.region = ctx.text;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                lat: lat,
                                lng: lng,
                                address: feature.place_name,
                                commune: context === null || context === void 0 ? void 0 : context.commune,
                                region: context === null || context === void 0 ? void 0 : context.region,
                            }];
                    case 2:
                        error_1 = _d.sent();
                        console.error('Mapbox geocoding error:', error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.reverseGeocodeMapbox = function (lat, lng) {
        return __awaiter(this, void 0, void 0, function () {
            var response, feature, context, error_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("https://api.mapbox.com/geocoding/v5/mapbox.places/".concat(lng, ",").concat(lat, ".json"), {
                                params: {
                                    access_token: this.apiKey,
                                    types: 'address,place,locality',
                                },
                            })];
                    case 1:
                        response = _c.sent();
                        if (((_a = response.data.features) === null || _a === void 0 ? void 0 : _a.length) === 0)
                            return [2 /*return*/, null];
                        feature = response.data.features[0];
                        context = (_b = feature.context) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, ctx) {
                            if (ctx.id.startsWith('commune'))
                                acc.commune = ctx.text;
                            if (ctx.id.startsWith('region'))
                                acc.region = ctx.text;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                lat: lat,
                                lng: lng,
                                address: feature.place_name,
                                commune: context === null || context === void 0 ? void 0 : context.commune,
                                region: context === null || context === void 0 ? void 0 : context.region,
                            }];
                    case 2:
                        error_2 = _c.sent();
                        console.error('Mapbox reverse geocoding error:', error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.getDirectionsMapbox = function (origin, destination) {
        return __awaiter(this, void 0, void 0, function () {
            var response, route, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("https://api.mapbox.com/directions/v5/mapbox/driving/".concat(origin[0], ",").concat(origin[1], ";").concat(destination[0], ",").concat(destination[1]), {
                                params: {
                                    access_token: this.apiKey,
                                    geometries: 'geojson',
                                    overview: 'full',
                                },
                            })];
                    case 1:
                        response = _b.sent();
                        if (((_a = response.data.routes) === null || _a === void 0 ? void 0 : _a.length) === 0)
                            return [2 /*return*/, null];
                        route = response.data.routes[0];
                        return [2 /*return*/, {
                                duration: route.duration,
                                distance: route.distance,
                                geometry: route.geometry,
                            }];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Mapbox directions error:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.calculateDistanceMatrixMapbox = function (origins, destinations) {
        return __awaiter(this, void 0, void 0, function () {
            var coordinates, response, results, idx, i, row, j, error_4;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        coordinates = __spreadArray(__spreadArray([], origins.map(function (o) { return "".concat(o[0], ",").concat(o[1]); }), true), destinations.map(function (d) { return "".concat(d[0], ",").concat(d[1]); }), true).join(';');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get("https://api.mapbox.com/directions/v5/mapbox/driving/".concat(coordinates), {
                                params: {
                                    access_token: this.apiKey,
                                    annotations: 'duration,distance',
                                },
                            })];
                    case 2:
                        response = _c.sent();
                        results = [];
                        idx = 0;
                        for (i = 0; i < origins.length; i++) {
                            row = [];
                            for (j = 0; j < destinations.length; j++) {
                                if ((_a = response.data.durations) === null || _a === void 0 ? void 0 : _a[idx]) {
                                    row.push({
                                        duration: response.data.durations[idx],
                                        distance: ((_b = response.data.distances) === null || _b === void 0 ? void 0 : _b[idx]) || 0,
                                    });
                                }
                                else {
                                    row.push({ duration: 0, distance: 0 });
                                }
                                idx++;
                            }
                            results.push(row);
                        }
                        return [2 /*return*/, results];
                    case 3:
                        error_4 = _c.sent();
                        console.error('Mapbox matrix error:', error_4);
                        return [2 /*return*/, origins.map(function () { return destinations.map(function () { return ({ duration: 0, distance: 0 }); }); })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.geocodeGoogle = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var response, result, location_1, components, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('https://maps.googleapis.com/maps/api/geocode/json', {
                                params: {
                                    address: address,
                                    region: 'cl',
                                    key: this.apiKey,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data.status !== 'OK' || response.data.results.length === 0)
                            return [2 /*return*/, null];
                        result = response.data.results[0];
                        location_1 = result.geometry.location;
                        components = result.address_components.reduce(function (acc, comp) {
                            if (comp.types.includes('locality'))
                                acc.commune = comp.long_name;
                            if (comp.types.includes('administrative_area_level_1'))
                                acc.region = comp.long_name;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                lat: location_1.lat,
                                lng: location_1.lng,
                                address: result.formatted_address,
                                commune: components.commune,
                                region: components.region,
                            }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Google geocoding error:', error_5);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.reverseGeocodeGoogle = function (lat, lng) {
        return __awaiter(this, void 0, void 0, function () {
            var response, result, components, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('https://maps.googleapis.com/maps/api/geocode/json', {
                                params: {
                                    latlng: "".concat(lat, ",").concat(lng),
                                    key: this.apiKey,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data.status !== 'OK' || response.data.results.length === 0)
                            return [2 /*return*/, null];
                        result = response.data.results[0];
                        components = result.address_components.reduce(function (acc, comp) {
                            if (comp.types.includes('locality'))
                                acc.commune = comp.long_name;
                            if (comp.types.includes('administrative_area_level_1'))
                                acc.region = comp.long_name;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                lat: lat,
                                lng: lng,
                                address: result.formatted_address,
                                commune: components.commune,
                                region: components.region,
                            }];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Google reverse geocoding error:', error_6);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.getDirectionsGoogle = function (origin, destination) {
        return __awaiter(this, void 0, void 0, function () {
            var response, route, leg, coordinates, _i, _a, step, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('https://maps.googleapis.com/maps/api/directions/json', {
                                params: {
                                    origin: "".concat(origin[0], ",").concat(origin[1]),
                                    destination: "".concat(destination[0], ",").concat(destination[1]),
                                    mode: 'driving',
                                    key: this.apiKey,
                                },
                            })];
                    case 1:
                        response = _b.sent();
                        if (response.data.status !== 'OK' || response.data.routes.length === 0)
                            return [2 /*return*/, null];
                        route = response.data.routes[0];
                        leg = route.legs[0];
                        coordinates = [];
                        for (_i = 0, _a = route.overview_path; _i < _a.length; _i++) {
                            step = _a[_i];
                            coordinates.push([step.lng, step.lat]);
                        }
                        return [2 /*return*/, {
                                duration: leg.duration.value,
                                distance: leg.distance.value,
                                geometry: {
                                    coordinates: coordinates,
                                    type: 'LineString',
                                },
                            }];
                    case 2:
                        error_7 = _b.sent();
                        console.error('Google directions error:', error_7);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.calculateDistanceMatrixGoogle = function (origins, destinations) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                                params: {
                                    origins: origins.map(function (o) { return "".concat(o[0], ",").concat(o[1]); }).join('|'),
                                    destinations: destinations.map(function (d) { return "".concat(d[0], ",").concat(d[1]); }).join('|'),
                                    mode: 'driving',
                                    key: this.apiKey,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        if (response.data.status !== 'OK') {
                            return [2 /*return*/, origins.map(function () { return destinations.map(function () { return ({ duration: 0, distance: 0 }); }); })];
                        }
                        return [2 /*return*/, response.data.rows.map(function (row) {
                                return row.elements.map(function (el) {
                                    var _a, _b;
                                    return ({
                                        duration: ((_a = el.duration) === null || _a === void 0 ? void 0 : _a.value) || 0,
                                        distance: ((_b = el.distance) === null || _b === void 0 ? void 0 : _b.value) || 0,
                                    });
                                });
                            })];
                    case 2:
                        error_8 = _a.sent();
                        console.error('Google matrix error:', error_8);
                        return [2 /*return*/, origins.map(function () { return destinations.map(function () { return ({ duration: 0, distance: 0 }); }); })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MapsService.prototype.getStaticMapUrl = function (lat, lng, zoom, width, height) {
        if (zoom === void 0) { zoom = 14; }
        if (width === void 0) { width = 400; }
        if (height === void 0) { height = 300; }
        var center = "".concat(lat, ",").concat(lng);
        var markers = "pin-s+2ecc71(".concat(lat, ",").concat(lng, ")");
        if (this.provider === 'mapbox') {
            return "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/".concat(markers, "/").concat(center, "/").concat(zoom, "/").concat(width, "x").concat(height, "?access_token=").concat(this.apiKey);
        }
        return "https://maps.googleapis.com/maps/api/staticmap?center=".concat(center, "&zoom=").concat(zoom, "&size=").concat(width, "x").concat(height, "&markers=color:green|").concat(lat, ",").concat(lng, "&key=").concat(this.apiKey);
    };
    return MapsService;
}());
exports.mapsService = new MapsService();
