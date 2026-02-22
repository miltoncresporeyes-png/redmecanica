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
var zod_1 = require("zod");
var shared_1 = require("@redmecanica/shared");
var router = (0, express_1.Router)();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, parentId, where, zones, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, type = _a.type, parentId = _a.parentId;
                where = {};
                if (type)
                    where.type = type;
                if (parentId)
                    where.parentId = parentId;
                else
                    where.parentId = null;
                return [4 /*yield*/, db_js_1.prisma.zone.findMany({
                        where: where,
                        include: {
                            children: true,
                            _count: { select: { providers: true } }
                        },
                        orderBy: { name: 'asc' },
                    })];
            case 1:
                zones = _b.sent();
                res.json(zones);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching zones:', error_1);
                res.status(500).json({ error: 'Failed to fetch zones' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var zone, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.zone.findUnique({
                        where: { id: req.params.id },
                        include: {
                            parent: true,
                            children: true,
                            providers: { include: { provider: true } }
                        },
                    })];
            case 1:
                zone = _a.sent();
                if (!zone) {
                    return [2 /*return*/, res.status(404).json({ error: 'Zone not found' })];
                }
                res.json(zone);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching zone:', error_2);
                res.status(500).json({ error: 'Failed to fetch zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, zone, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = shared_1.zoneSchema.parse(req.body);
                return [4 /*yield*/, db_js_1.prisma.zone.create({
                        data: data,
                    })];
            case 1:
                zone = _a.sent();
                res.status(201).json(zone);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_3.errors })];
                }
                console.error('Error creating zone:', error_3);
                res.status(500).json({ error: 'Failed to create zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.patch('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, zone, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = shared_1.updateZoneSchema.parse(req.body);
                return [4 /*yield*/, db_js_1.prisma.zone.update({
                        where: { id: req.params.id },
                        data: data,
                    })];
            case 1:
                zone = _a.sent();
                res.json(zone);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_4.errors })];
                }
                console.error('Error updating zone:', error_4);
                res.status(500).json({ error: 'Failed to update zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.zone.delete({
                        where: { id: req.params.id },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting zone:', error_5);
                res.status(500).json({ error: 'Failed to delete zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/assign-provider', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, providerZone, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = shared_1.providerZoneSchema.parse(req.body);
                return [4 /*yield*/, db_js_1.prisma.providerZone.create({
                        data: data,
                    })];
            case 1:
                providerZone = _a.sent();
                res.status(201).json(providerZone);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                if (error_6 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_6.errors })];
                }
                console.error('Error assigning provider to zone:', error_6);
                res.status(500).json({ error: 'Failed to assign provider to zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/remove-provider', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, providerId, zoneId, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, providerId = _a.providerId, zoneId = _a.zoneId;
                return [4 /*yield*/, db_js_1.prisma.providerZone.deleteMany({
                        where: { providerId: providerId, zoneId: zoneId },
                    })];
            case 1:
                _b.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_7 = _b.sent();
                console.error('Error removing provider from zone:', error_7);
                res.status(500).json({ error: 'Failed to remove provider from zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:id/providers', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var providers, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.providerZone.findMany({
                        where: { zoneId: req.params.id },
                        include: {
                            provider: {
                                include: { user: { select: { name: true, email: true } } }
                            }
                        },
                    })];
            case 1:
                providers = _a.sent();
                res.json(providers.map(function (p) { return p.provider; }));
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error fetching providers in zone:', error_8);
                res.status(500).json({ error: 'Failed to fetch providers in zone' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
