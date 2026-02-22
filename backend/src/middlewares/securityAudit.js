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
exports.getClientIp = exports.isSuspiciousActivity = exports.SECURITY_EVENTS = exports.logSecurityEvent = void 0;
var db_js_1 = require("../db.js");
var logSecurityEvent = function (log) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_js_1.prisma.auditLog.create({
                        data: {
                            userId: log.userId,
                            action: log.action,
                            resource: log.resource,
                            resourceId: log.resourceId,
                            ipAddress: log.ipAddress,
                            userAgent: log.userAgent,
                            newValue: log.details
                        }
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Failed to log security event:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.logSecurityEvent = logSecurityEvent;
exports.SECURITY_EVENTS = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGIN_RATE_LIMIT: 'LOGIN_RATE_LIMIT',
    PASSWORD_CHANGE: 'PASSWORD_CHANGE',
    PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
    USER_CREATE: 'USER_CREATE',
    USER_DELETE: 'USER_DELETE',
    PROVIDER_APPROVE: 'PROVIDER_APPROVE',
    PROVIDER_REJECT: 'PROVIDER_REJECT',
    PAYMENT_CREATE: 'PAYMENT_CREATE',
    PAYMENT_CONFIRM: 'PAYMENT_CONFIRM',
    PAYMENT_RELEASE: 'PAYMENT_RELEASE',
    PAYMENT_REFUND: 'PAYMENT_REFUND',
    SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY'
};
var isSuspiciousActivity = function (req) {
    var suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /union.*select/i,
        /drop.*table/i,
        /insert.*into/i,
        /\.\.\//,
        /^\/etc\/passwd/,
        /^\/proc\//
    ];
    var bodyStr = JSON.stringify(req.body);
    var queryStr = JSON.stringify(req.query);
    var paramsStr = JSON.stringify(req.params);
    var allContent = bodyStr + queryStr + paramsStr;
    return suspiciousPatterns.some(function (pattern) { return pattern.test(allContent); });
};
exports.isSuspiciousActivity = isSuspiciousActivity;
var getClientIp = function (req) {
    var _a, _b, _c;
    return ((_b = (_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) ||
        req.headers['x-real-ip'] ||
        ((_c = req.connection) === null || _c === void 0 ? void 0 : _c.remoteAddress) ||
        req.ip ||
        'unknown';
};
exports.getClientIp = getClientIp;
