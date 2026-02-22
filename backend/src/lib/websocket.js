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
exports.setupWebSocket = setupWebSocket;
exports.getIO = getIO;
var socket_io_1 = require("socket.io");
var db_js_1 = require("../db.js");
function setupWebSocket(httpServer) {
    var _this = this;
    var io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });
    var connectedUsers = new Map();
    io.use(function (socket, next) { return __awaiter(_this, void 0, void 0, function () {
        var userId, userType;
        return __generator(this, function (_a) {
            try {
                userId = socket.handshake.auth.userId;
                userType = socket.handshake.auth.userType;
                if (!userId) {
                    return [2 /*return*/, next(new Error('Authentication error'))];
                }
                socket.userId = userId;
                socket.userType = userType || 'CUSTOMER';
                next();
            }
            catch (error) {
                next(new Error('Authentication error'));
            }
            return [2 /*return*/];
        });
    }); });
    io.on('connection', function (socket) {
        var userSocket = socket;
        var userId = userSocket.userId, userType = userSocket.userType;
        console.log("User connected: ".concat(userId, " (").concat(userType, ")"));
        connectedUsers.set(userId, userSocket);
        var fetchUserData = function () { return __awaiter(_this, void 0, void 0, function () {
            var user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_js_1.prisma.user.findUnique({
                                where: { id: userId },
                                select: { id: true, name: true }
                            })];
                    case 1:
                        user = _a.sent();
                        if (user) {
                            socket.broadcast.emit('user:online', { userId: user.id, name: user.name });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error fetching user data:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchUserData();
        socket.on('join:conversation', function (conversationId) { return __awaiter(_this, void 0, void 0, function () {
            var conversation, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_js_1.prisma.conversation.findUnique({
                                where: { id: conversationId },
                                select: { customerId: true, providerId: true }
                            })];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation) {
                            return [2 /*return*/, socket.emit('error', { message: 'Conversation not found' })];
                        }
                        if (conversation.customerId !== userId && conversation.providerId !== userId) {
                            return [2 /*return*/, socket.emit('error', { message: 'Not authorized' })];
                        }
                        socket.join("conversation:".concat(conversationId));
                        console.log("User ".concat(userId, " joined conversation ").concat(conversationId));
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error joining conversation:', error_2);
                        socket.emit('error', { message: 'Failed to join conversation' });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('leave:conversation', function (conversationId) {
            socket.leave("conversation:".concat(conversationId));
            console.log("User ".concat(userId, " left conversation ").concat(conversationId));
        });
        socket.on('message:send', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var conversationId, content, metadata, conversation, senderType, message, recipientId, recipientSocket, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        conversationId = data.conversationId, content = data.content, metadata = data.metadata;
                        return [4 /*yield*/, db_js_1.prisma.conversation.findUnique({
                                where: { id: conversationId },
                                select: { customerId: true, providerId: true }
                            })];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation) {
                            return [2 /*return*/, socket.emit('error', { message: 'Conversation not found' })];
                        }
                        if (conversation.customerId !== userId && conversation.providerId !== userId) {
                            return [2 /*return*/, socket.emit('error', { message: 'Not authorized' })];
                        }
                        senderType = userType === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';
                        return [4 /*yield*/, db_js_1.prisma.message.create({
                                data: {
                                    conversationId: conversationId,
                                    senderId: userId,
                                    senderType: senderType,
                                    content: content,
                                    metadata: metadata ? JSON.stringify(metadata) : null,
                                },
                                include: { conversation: true }
                            })];
                    case 2:
                        message = _a.sent();
                        return [4 /*yield*/, db_js_1.prisma.conversation.update({
                                where: { id: conversationId },
                                data: { lastMessageAt: new Date() }
                            })];
                    case 3:
                        _a.sent();
                        io.to("conversation:".concat(conversationId)).emit('message:received', {
                            id: message.id,
                            conversationId: message.conversationId,
                            senderId: message.senderId,
                            senderType: message.senderType,
                            content: message.content,
                            createdAt: message.createdAt,
                        });
                        recipientId = senderType === 'CUSTOMER' ? conversation.providerId : conversation.customerId;
                        recipientSocket = connectedUsers.get(recipientId);
                        if (!recipientSocket) return [3 /*break*/, 4];
                        recipientSocket.emit('notification:new_message', {
                            conversationId: conversationId,
                            senderId: userId,
                            senderName: socket.handshake.auth.userName || 'Usuario',
                            content: content.substring(0, 50),
                        });
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, db_js_1.prisma.notification.create({
                            data: {
                                userId: recipientId,
                                type: 'MESSAGE',
                                title: 'Nuevo mensaje',
                                body: content.substring(0, 100),
                                data: JSON.stringify({ conversationId: conversationId, messageId: message.id }),
                            }
                        })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_3 = _a.sent();
                        console.error('Error sending message:', error_3);
                        socket.emit('error', { message: 'Failed to send message' });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); });
        socket.on('message:read', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var conversationId, messageId, conversation, message, senderId, senderSocket, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        conversationId = data.conversationId, messageId = data.messageId;
                        return [4 /*yield*/, db_js_1.prisma.conversation.findUnique({
                                where: { id: conversationId },
                                select: { customerId: true, providerId: true }
                            })];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation)
                            return [2 /*return*/];
                        return [4 /*yield*/, db_js_1.prisma.message.update({
                                where: { id: messageId },
                                data: { isRead: true }
                            })];
                    case 2:
                        message = _a.sent();
                        io.to("conversation:".concat(conversationId)).emit('message:read', {
                            messageId: messageId,
                            readAt: new Date(),
                        });
                        senderId = message.senderId;
                        senderSocket = connectedUsers.get(senderId);
                        if (senderSocket) {
                            senderSocket.emit('message:delivered', { messageId: messageId });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error marking message as read:', error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        socket.on('typing:start', function (conversationId) {
            socket.to("conversation:".concat(conversationId)).emit('typing:started', {
                conversationId: conversationId,
                userId: userId,
                userType: userType,
            });
        });
        socket.on('typing:stop', function (conversationId) {
            socket.to("conversation:".concat(conversationId)).emit('typing:stopped', {
                conversationId: conversationId,
                userId: userId,
            });
        });
        socket.on('location:share', function (data) { return __awaiter(_this, void 0, void 0, function () {
            var conversationId, lat, lng, conversation, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        conversationId = data.conversationId, lat = data.lat, lng = data.lng;
                        return [4 /*yield*/, db_js_1.prisma.conversation.findUnique({
                                where: { id: conversationId },
                                select: { customerId: true, providerId: true }
                            })];
                    case 1:
                        conversation = _a.sent();
                        if (!conversation || (conversation.customerId !== userId && conversation.providerId !== userId)) {
                            return [2 /*return*/];
                        }
                        io.to("conversation:".concat(conversationId)).emit('location:received', {
                            userId: userId,
                            lat: lat,
                            lng: lng,
                            timestamp: new Date(),
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error sharing location:', error_5);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
            var user, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("User disconnected: ".concat(userId));
                        connectedUsers.delete(userId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, db_js_1.prisma.user.findUnique({
                                where: { id: userId },
                                select: { id: true }
                            })];
                    case 2:
                        user = _a.sent();
                        if (user) {
                            socket.broadcast.emit('user:offline', { userId: user.id });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error on disconnect:', error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
    });
    return io;
}
function getIO() {
    var httpServer = global.httpServer;
    if (!httpServer)
        return null;
    return null;
}
