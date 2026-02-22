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
    var _a, userId, providerId, status_1, where, conversations, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, userId = _a.userId, providerId = _a.providerId, status_1 = _a.status;
                where = {};
                if (userId)
                    where.customerId = userId;
                if (providerId)
                    where.providerId = providerId;
                if (status_1)
                    where.status = status_1;
                return [4 /*yield*/, db_js_1.prisma.conversation.findMany({
                        where: where,
                        include: {
                            provider: { include: { user: { select: { name: true, email: true } } } },
                            job: { select: { id: true, status: true } },
                            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
                            _count: { select: { messages: true } }
                        },
                        orderBy: { lastMessageAt: 'desc' },
                    })];
            case 1:
                conversations = _b.sent();
                res.json(conversations);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching conversations:', error_1);
                res.status(500).json({ error: 'Failed to fetch conversations' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversation, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.conversation.findUnique({
                        where: { id: req.params.id },
                        include: {
                            provider: { include: { user: { select: { name: true, email: true, phone: true } } } },
                            job: { select: { id: true, status: true, request: { include: { vehicle: true, service: true } } } },
                            messages: { orderBy: { createdAt: 'asc' } },
                        },
                    })];
            case 1:
                conversation = _a.sent();
                if (!conversation) {
                    return [2 /*return*/, res.status(404).json({ error: 'Conversation not found' })];
                }
                res.json(conversation);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching conversation:', error_2);
                res.status(500).json({ error: 'Failed to fetch conversation' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, existing, conversation, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                data = shared_1.conversationSchema.parse(req.body);
                return [4 /*yield*/, db_js_1.prisma.conversation.findFirst({
                        where: {
                            customerId: data.customerId,
                            providerId: data.providerId,
                            jobId: data.jobId,
                            status: 'ACTIVE',
                        },
                    })];
            case 1:
                existing = _a.sent();
                if (existing) {
                    return [2 /*return*/, res.json(existing)];
                }
                return [4 /*yield*/, db_js_1.prisma.conversation.create({
                        data: data,
                    })];
            case 2:
                conversation = _a.sent();
                res.status(201).json(conversation);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                if (error_3 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_3.errors })];
                }
                console.error('Error creating conversation:', error_3);
                res.status(500).json({ error: 'Failed to create conversation' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/:id/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, limit, _c, offset, _d, unreadOnly, where, messages, error_4;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 2, , 3]);
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? '50' : _b, _c = _a.offset, offset = _c === void 0 ? '0' : _c, _d = _a.unreadOnly, unreadOnly = _d === void 0 ? 'false' : _d;
                where = { conversationId: req.params.id };
                if (unreadOnly === 'true')
                    where.isRead = false;
                return [4 /*yield*/, db_js_1.prisma.message.findMany({
                        where: where,
                        orderBy: { createdAt: 'desc' },
                        take: Number(limit),
                        skip: Number(offset),
                    })];
            case 1:
                messages = _e.sent();
                res.json(messages.reverse());
                return [3 /*break*/, 3];
            case 2:
                error_4 = _e.sent();
                console.error('Error fetching messages:', error_4);
                res.status(500).json({ error: 'Failed to fetch messages' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, message, _a, notificationType, senderType, conversation, recipientId, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                data = shared_1.messageSchema.parse(__assign(__assign({}, req.body), { conversationId: req.params.id }));
                return [4 /*yield*/, db_js_1.prisma.message.create({
                        data: {
                            conversationId: data.conversationId,
                            senderId: data.senderId,
                            senderType: data.senderType,
                            content: data.content,
                            metadata: data.metadata ? JSON.stringify(data.metadata) : null,
                        },
                        include: { conversation: true },
                    })];
            case 1:
                message = _b.sent();
                return [4 /*yield*/, db_js_1.prisma.conversation.update({
                        where: { id: req.params.id },
                        data: { lastMessageAt: new Date() },
                    })];
            case 2:
                _b.sent();
                _a = req.body, notificationType = _a.notificationType, senderType = _a.senderType;
                if (!(notificationType && senderType)) return [3 /*break*/, 5];
                return [4 /*yield*/, db_js_1.prisma.conversation.findUnique({
                        where: { id: req.params.id },
                    })];
            case 3:
                conversation = _b.sent();
                if (!conversation) return [3 /*break*/, 5];
                recipientId = senderType === 'CUSTOMER' ? conversation.providerId : conversation.customerId;
                return [4 /*yield*/, db_js_1.prisma.notification.create({
                        data: {
                            userId: senderType === 'CUSTOMER' ? conversation.customerId : recipientId,
                            type: 'MESSAGE',
                            title: 'Nuevo mensaje',
                            body: data.content.substring(0, 100),
                            data: JSON.stringify({ conversationId: req.params.id, messageId: message.id }),
                        },
                    })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                res.status(201).json(message);
                return [3 /*break*/, 7];
            case 6:
                error_5 = _b.sent();
                if (error_5 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ errors: error_5.errors })];
                }
                console.error('Error creating message:', error_5);
                res.status(500).json({ error: 'Failed to create message' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.patch('/messages/:messageId/read', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.message.update({
                        where: { id: req.params.messageId },
                        data: { isRead: true },
                    })];
            case 1:
                message = _a.sent();
                res.json(message);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error marking message as read:', error_6);
                res.status(500).json({ error: 'Failed to mark message as read' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/:id/archive', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var conversation, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.conversation.update({
                        where: { id: req.params.id },
                        data: { status: 'ARCHIVED' },
                    })];
            case 1:
                conversation = _a.sent();
                res.json(conversation);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error archiving conversation:', error_7);
                res.status(500).json({ error: 'Failed to archive conversation' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
