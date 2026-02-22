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
var shared_1 = require("@redmecanica/shared");
var router = (0, express_1.Router)();
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, isRead, _b, limit, _c, offset, where, notifications, total, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, userId = _a.userId, isRead = _a.isRead, _b = _a.limit, limit = _b === void 0 ? '50' : _b, _c = _a.offset, offset = _c === void 0 ? '0' : _c;
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: 'userId is required' })];
                }
                where = { userId: userId };
                if (isRead !== undefined)
                    where.isRead = isRead === 'true';
                return [4 /*yield*/, db_js_1.prisma.notification.findMany({
                        where: where,
                        orderBy: { createdAt: 'desc' },
                        take: Number(limit),
                        skip: Number(offset),
                    })];
            case 1:
                notifications = _d.sent();
                return [4 /*yield*/, db_js_1.prisma.notification.count({ where: where })];
            case 2:
                total = _d.sent();
                res.json({ notifications: notifications, total: total, limit: Number(limit), offset: Number(offset) });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                console.error('Error fetching notifications:', error_1);
                res.status(500).json({ error: 'Failed to fetch notifications' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/unread-count', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, count, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.query.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: 'userId is required' })];
                }
                return [4 /*yield*/, db_js_1.prisma.notification.count({
                        where: { userId: userId, isRead: false },
                    })];
            case 1:
                count = _a.sent();
                res.json({ count: count });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching unread count:', error_2);
                res.status(500).json({ error: 'Failed to fetch unread count' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, notification, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = shared_1.notificationSchema.parse(req.body);
                return [4 /*yield*/, db_js_1.prisma.notification.create({
                        data: __assign(__assign({}, data), { data: data.data ? JSON.stringify(data.data) : null }),
                    })];
            case 1:
                notification = _a.sent();
                res.status(201).json(notification);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_3.errors })];
                }
                console.error('Error creating notification:', error_3);
                res.status(500).json({ error: 'Failed to create notification' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/mark-read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notificationId, notification, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                notificationId = shared_1.markNotificationReadSchema.parse(req.body).notificationId;
                return [4 /*yield*/, db_js_1.prisma.notification.update({
                        where: { id: notificationId },
                        data: { isRead: true },
                    })];
            case 1:
                notification = _a.sent();
                res.json(notification);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_4.errors })];
                }
                console.error('Error marking notification as read:', error_4);
                res.status(500).json({ error: 'Failed to mark notification as read' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/mark-all-read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.body.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: 'userId is required' })];
                }
                return [4 /*yield*/, db_js_1.prisma.notification.updateMany({
                        where: { userId: userId, isRead: false },
                        data: { isRead: true },
                    })];
            case 1:
                _a.sent();
                res.json({ success: true });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error marking all notifications as read:', error_5);
                res.status(500).json({ error: 'Failed to mark all notifications as read' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.notification.delete({
                        where: { id: req.params.id },
                    })];
            case 1:
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error deleting notification:', error_6);
                res.status(500).json({ error: 'Failed to delete notification' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
