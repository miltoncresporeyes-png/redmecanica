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
var pg_1 = require("pg");
var Client = pg_1.default.Client;
var passwords = ['password', 'postgres', 'admin', 'root', '1234', ''];
var dbs = ['redmecanica', 'postgres'];
function scan() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, dbs_1, db, _a, passwords_1, pw, connectionString, client, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, dbs_1 = dbs;
                    _b.label = 1;
                case 1:
                    if (!(_i < dbs_1.length)) return [3 /*break*/, 9];
                    db = dbs_1[_i];
                    _a = 0, passwords_1 = passwords;
                    _b.label = 2;
                case 2:
                    if (!(_a < passwords_1.length)) return [3 /*break*/, 8];
                    pw = passwords_1[_a];
                    connectionString = "postgresql://postgres:".concat(pw, "@127.0.0.1:5432/").concat(db);
                    console.log("Checking: ".concat(connectionString.replace(pw, '****')));
                    client = new Client({ connectionString: connectionString, connectionTimeoutMillis: 2000 });
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, client.connect()];
                case 4:
                    _b.sent();
                    console.log("\u2705 SUCCESS! Found credentials for DB: ".concat(db));
                    return [4 /*yield*/, client.end()];
                case 5:
                    _b.sent();
                    process.exit(0);
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _b.sent();
                    if (err_1.message.includes('autenticación') || err_1.message.includes('authentication')) {
                        console.log("\u274C Auth failed for password: ".concat(pw));
                    }
                    else if (err_1.message.includes('no existe el banco de datos') || err_1.message.includes('database does not exist')) {
                        console.log("\u274C DB ".concat(db, " does not exist."));
                        return [3 /*break*/, 8]; // No point testing other passwords for this DB if DB doesn't exist
                    }
                    else {
                        console.log("\u274C Other error: ".concat(err_1.message));
                    }
                    return [3 /*break*/, 7];
                case 7:
                    _a++;
                    return [3 /*break*/, 2];
                case 8:
                    _i++;
                    return [3 /*break*/, 1];
                case 9:
                    console.log('🏁 No se encontraron credenciales válidas en puerto 5432.');
                    return [2 /*return*/];
            }
        });
    });
}
scan();
