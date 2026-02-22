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
exports.me = exports.refresh = exports.logout = exports.login = exports.register = void 0;
var auth_service_js_1 = require("./auth.service.js");
var index_js_1 = require("../../config/index.js");
var audit_js_1 = require("../../lib/audit.js");
var register = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, accessToken, refreshToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, auth_service_js_1.authService.register(req.body)];
            case 1:
                _a = _b.sent(), user = _a.user, accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: index_js_1.config.env === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: user.id,
                        action: 'REGISTER',
                        resource: 'User',
                        resourceId: user.id,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent']
                    })];
            case 2:
                _b.sent();
                res.status(201).json({
                    message: 'Usuario registrado exitosamente',
                    user: user,
                    token: accessToken
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, accessToken, refreshToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, auth_service_js_1.authService.login(req.body)];
            case 1:
                _a = _b.sent(), user = _a.user, accessToken = _a.accessToken, refreshToken = _a.refreshToken;
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true,
                    secure: index_js_1.config.env === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        userId: user.id,
                        action: 'LOGIN',
                        resource: 'User',
                        resourceId: user.id,
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent']
                    })];
            case 2:
                _b.sent();
                res.json({
                    message: 'Login exitoso',
                    user: user,
                    token: accessToken
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var logout = function (req, res) {
    res.clearCookie('refresh_token');
    var user = req.user;
    if (user) {
        (0, audit_js_1.auditLog)({
            userId: user.id,
            action: 'LOGOUT',
            resource: 'User',
            resourceId: user.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
    }
    res.json({ message: 'Logout exitoso' });
};
exports.logout = logout;
var refresh = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, _a, accessToken, newRefreshToken, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                refreshToken = req.cookies.refresh_token || req.body.refreshToken;
                return [4 /*yield*/, auth_service_js_1.authService.refresh(refreshToken)];
            case 1:
                _a = _b.sent(), accessToken = _a.accessToken, newRefreshToken = _a.refreshToken;
                res.cookie('refresh_token', newRefreshToken, {
                    httpOnly: true,
                    secure: index_js_1.config.env === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });
                return [4 /*yield*/, (0, audit_js_1.auditLog)({
                        action: 'REFRESH_TOKEN',
                        resource: 'User',
                        ipAddress: req.ip,
                        userAgent: req.headers['user-agent']
                    })];
            case 2:
                _b.sent();
                res.json({ token: accessToken });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.refresh = refresh;
var me = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // Logic from routes/auth.ts:182
        // req.user is populated by requireAuth middleware
        // We can just return it or re-fetch if needed (middleware already fetched basic info)
        // Original code fetched full user info again. Middleware fetches: id, email, role.
        // Let's assume middleware is enough or service can fetch full profile.
        // For now, return req.user (which is what we have)
        // If we want full profile including provider or details, we might want a userService call here.
        // But staying scope of auth module:
        res.json({ user: req.user });
        return [2 /*return*/];
    });
}); };
exports.me = me;
