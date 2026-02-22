// backend/scripts/test-auth.ts
// import fetch from 'node-fetch'; // Using global fetch
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
var BASE_URL = 'http://localhost:3010/api/auth';
function testAuth() {
    return __awaiter(this, void 0, void 0, function () {
        var loginRes, _a, _b, _c, loginData, cookies, accessToken, meRes, _d, _e, _f, meData, logoutRes;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    console.log('🧪 Testing Auth Flow...');
                    // 1. Login
                    console.log('\n🔸 Attempting Login with admin123...');
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/login"), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: 'admin@redmecanica.cl',
                                password: 'admin123'
                            })
                        })];
                case 1:
                    loginRes = _g.sent();
                    if (!(loginRes.status !== 200)) return [3 /*break*/, 3];
                    _b = (_a = console).error;
                    _c = ['❌ Login failed:', loginRes.status];
                    return [4 /*yield*/, loginRes.text()];
                case 2:
                    _b.apply(_a, _c.concat([_g.sent()]));
                    process.exit(1);
                    _g.label = 3;
                case 3: return [4 /*yield*/, loginRes.json()];
                case 4:
                    loginData = _g.sent();
                    console.log('✅ Login successful!');
                    console.log('user:', loginData.user.email);
                    console.log('access_token:', loginData.token ? 'Present' : 'Missing');
                    cookies = loginRes.headers.get('set-cookie');
                    console.log('Set-Cookie:', cookies);
                    if (!cookies || !cookies.includes('refresh_token')) {
                        console.error('❌ Refresh token cookie missing');
                        process.exit(1);
                    }
                    console.log('✅ Refresh token cookie set');
                    accessToken = loginData.token;
                    // 2. Get Profile (Protected)
                    console.log('\n🔸 Accessing /me with access token...');
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/me"), {
                            method: 'GET',
                            headers: {
                                'Authorization': "Bearer ".concat(accessToken)
                            }
                        })];
                case 5:
                    meRes = _g.sent();
                    if (!(meRes.status !== 200)) return [3 /*break*/, 7];
                    _e = (_d = console).error;
                    _f = ['❌ /me failed:', meRes.status];
                    return [4 /*yield*/, meRes.text()];
                case 6:
                    _e.apply(_d, _f.concat([_g.sent()]));
                    process.exit(1);
                    _g.label = 7;
                case 7: return [4 /*yield*/, meRes.json()];
                case 8:
                    meData = _g.sent();
                    console.log('✅ /me successful!');
                    console.log('Authenticated User:', meData.user.email);
                    // 3. Logout
                    console.log('\n🔸 Logging out...');
                    return [4 /*yield*/, fetch("".concat(BASE_URL, "/logout"), {
                            method: 'POST'
                        })];
                case 9:
                    logoutRes = _g.sent();
                    if (logoutRes.status !== 200) {
                        console.error('❌ Logout failed:', logoutRes.status);
                        process.exit(1);
                    }
                    console.log('✅ Logout successful!');
                    console.log('🎉 Auth Test Passed!');
                    return [2 /*return*/];
            }
        });
    });
}
testAuth().catch(console.error);
