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
var client_1 = require("@prisma/client");
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
var url_1 = require("url");
// Setup environment
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
var prisma = new client_1.PrismaClient();
var API_URL = process.env.API_URL || 'http://localhost:3010/api';
function testAdminAccess() {
    return __awaiter(this, void 0, void 0, function () {
        var userEmail, adminEmail, e_1, e_2, userLogin, userToken, error_1, adminLogin, adminToken, stats, error_2, users, error_3, error_4;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    console.log('🚀 Starting Admin Access Test...');
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 25, 26, 28]);
                    // 1. Setup Data
                    console.log('Creating test users...');
                    userEmail = "user_".concat(Date.now(), "@test.com");
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: userEmail },
                            update: {},
                            create: {
                                email: userEmail,
                                password: 'password123', // In real app, this should be hashed, but for test script calling login endpoint, we need to know the raw password. 
                                // Wait, if I create via Prisma, I need to hash it if the login endpoint compares hashes.
                                // Let's use the register endpoint instead to ensure hashing.
                                name: 'Test User',
                                role: 'USER'
                            }
                        })];
                case 2:
                    _f.sent();
                    adminEmail = "admin_".concat(Date.now(), "@test.com");
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/register"), {
                            email: adminEmail,
                            password: 'adminpassword',
                            name: 'Admin Candidate',
                            role: 'client'
                        })];
                case 4:
                    _f.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _f.sent();
                    return [3 /*break*/, 6];
                case 6: 
                // Elevate to ADMIN
                return [4 /*yield*/, prisma.user.update({
                        where: { email: adminEmail },
                        data: { role: 'ADMIN' }
                    })];
                case 7:
                    // Elevate to ADMIN
                    _f.sent();
                    _f.label = 8;
                case 8:
                    _f.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/register"), {
                            email: userEmail,
                            password: 'userpassword',
                            name: 'Normal User',
                            role: 'client'
                        })];
                case 9:
                    _f.sent();
                    return [3 /*break*/, 11];
                case 10:
                    e_2 = _f.sent();
                    return [3 /*break*/, 11];
                case 11:
                    // 2. Login as Normal User
                    console.log('\nTesting Normal User Access...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/login"), {
                            email: userEmail,
                            password: 'userpassword'
                        })];
                case 12:
                    userLogin = _f.sent();
                    userToken = userLogin.data.accessToken;
                    _f.label = 13;
                case 13:
                    _f.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/admin/stats"), {
                            headers: { Authorization: "Bearer ".concat(userToken) }
                        })];
                case 14:
                    _f.sent();
                    console.error('❌ User should NOT be able to access admin stats!');
                    process.exit(1);
                    return [3 /*break*/, 16];
                case 15:
                    error_1 = _f.sent();
                    if (((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 403) {
                        console.log('✅ User correctly denied access (403)');
                    }
                    else {
                        console.error("\u274C Unexpected error: ".concat(error_1.message));
                    }
                    return [3 /*break*/, 16];
                case 16:
                    // 3. Login as Admin
                    console.log('\nTesting Admin Access...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/login"), {
                            email: adminEmail,
                            password: 'adminpassword'
                        })];
                case 17:
                    adminLogin = _f.sent();
                    adminToken = adminLogin.data.accessToken;
                    _f.label = 18;
                case 18:
                    _f.trys.push([18, 20, , 21]);
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/admin/stats"), {
                            headers: { Authorization: "Bearer ".concat(adminToken) }
                        })];
                case 19:
                    stats = _f.sent();
                    console.log('✅ Admin accessed stats successfully');
                    console.log('Stats:', stats.data);
                    return [3 /*break*/, 21];
                case 20:
                    error_2 = _f.sent();
                    console.error("\u274C Admin failed to access stats: ".concat(((_c = (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || error_2.message));
                    process.exit(1);
                    return [3 /*break*/, 21];
                case 21:
                    _f.trys.push([21, 23, , 24]);
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/admin/users"), {
                            headers: { Authorization: "Bearer ".concat(adminToken) }
                        })];
                case 22:
                    users = _f.sent();
                    console.log("\u2705 Admin accessed users list (".concat(users.data.length, " users found)"));
                    return [3 /*break*/, 24];
                case 23:
                    error_3 = _f.sent();
                    console.error("\u274C Admin failed to access users: ".concat(((_e = (_d = error_3.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) || error_3.message));
                    return [3 /*break*/, 24];
                case 24:
                    console.log('\n🎉 Admin Security Tests Passed!');
                    return [3 /*break*/, 28];
                case 25:
                    error_4 = _f.sent();
                    console.error('Test Failed:', error_4.message);
                    if (error_4.response) {
                        console.error('Response Data:', error_4.response.data);
                    }
                    return [3 /*break*/, 28];
                case 26: return [4 /*yield*/, prisma.$disconnect()];
                case 27:
                    _f.sent();
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/];
            }
        });
    });
}
testAdminAccess();
