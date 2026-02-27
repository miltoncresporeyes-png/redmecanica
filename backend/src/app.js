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
var cors_1 = require("cors");
var cookie_parser_1 = require("cookie-parser");
var index_js_1 = require("./config/index.js");
var auth_routes_js_1 = require("./modules/auth/auth.routes.js");
var rateLimiter_js_1 = require("./middlewares/rateLimiter.js");
var monitoring_js_1 = require("./routes/monitoring.js");
var jobs_js_1 = require("./routes/jobs.js");
var services_js_1 = require("./routes/services.js");
var users_js_1 = require("./routes/users.js");
var providers_js_1 = require("./routes/providers.js");
var admin_js_1 = require("./routes/admin.js");
var quotes_js_1 = require("./routes/quotes.js");
var payments_js_1 = require("./routes/payments.js");
var categories_js_1 = require("./routes/categories.js");
var zones_js_1 = require("./routes/zones.js");
var availability_js_1 = require("./routes/availability.js");
var notifications_js_1 = require("./routes/notifications.js");
var conversations_js_1 = require("./routes/conversations.js");
var geolocation_js_1 = require("./routes/geolocation.js");
var maps_js_1 = require("./routes/maps.js");
var subscriptions_js_1 = require("./routes/subscriptions.js");
var contact_js_1 = require("./routes/contact.js");
var securityHeaders_js_1 = require("./middlewares/securityHeaders.js");
var errorHandler_js_1 = require("./middlewares/errorHandler.js");
var app = (0, express_1.default)();
var allowedOrigins = (process.env.FRONTEND_URL || 'https://redmecanica.cl,https://www.redmecanica.cl')
    .split(',')
    .map(function (origin) { return origin.trim(); })
    .filter(Boolean);
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("CORS blocked for origin: ".concat(origin)));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(rateLimiter_js_1.globalLimiter);
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use(securityHeaders_js_1.requestIdMiddleware);
// Health Check
app.get('/', function (_req, res) {
    res.send('RedMecanica Backend Running');
});
// Mount Routes
app.use('/api/auth', auth_routes_js_1.default);
app.use('/api/jobs', jobs_js_1.default);
app.use('/api/services', services_js_1.default);
app.use('/api/users', users_js_1.default);
app.use('/api/providers', providers_js_1.default);
app.use('/api/admin', admin_js_1.default);
app.use('/api/monitoring', monitoring_js_1.default);
app.use('/api/quotes', quotes_js_1.default);
app.use('/api/payments', payments_js_1.default);
app.use('/api/categories', categories_js_1.default);
app.use('/api/zones', zones_js_1.default);
app.use('/api/availability', availability_js_1.default);
app.use('/api/notifications', notifications_js_1.default);
app.use('/api/conversations', conversations_js_1.default);
app.use('/api/geo', geolocation_js_1.default);
app.use('/api/maps', maps_js_1.default);
app.use('/api/subscriptions', subscriptions_js_1.default);
app.use('/api/contact', contact_js_1.default);
// Temporary public endpoint to view launch leads (until admin is set up)
app.get('/api/public/launch-leads', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prisma, leads, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Promise.resolve().then(function () { return require('./db.js'); })];
            case 1:
                prisma = (_a.sent()).prisma;
                return [4 /*yield*/, prisma.launchLead.findMany({
                        orderBy: { createdAt: 'desc' }
                    })];
            case 2:
                leads = _a.sent();
                res.json({ leads: leads, total: leads.length });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).json({ error: 'Error fetching leads' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Error Handler
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
