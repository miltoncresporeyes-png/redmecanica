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
var prisma = new client_1.PrismaClient();
function runTestFlow() {
    return __awaiter(this, void 0, void 0, function () {
        var client, vehicle, service, _a, request, provider, pUser, job, al, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🚀 Iniciando Prueba de Flujo Completo: RedMecánica Observability');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 19, 20, 22]);
                    return [4 /*yield*/, prisma.user.findFirst({ where: { role: 'CLIENT' } })];
                case 2:
                    client = _b.sent();
                    if (!!client) return [3 /*break*/, 4];
                    return [4 /*yield*/, prisma.user.create({
                            data: { email: "test_".concat(Date.now(), "@example.com"), password: 'password123', name: 'Juan Cliente Test', role: 'CLIENT' }
                        })];
                case 3:
                    client = _b.sent();
                    _b.label = 4;
                case 4: return [4 /*yield*/, prisma.vehicle.create({
                        data: { userId: client.id, licensePlate: "TEST-".concat(Math.floor(Math.random() * 1000)), make: 'Toyota', model: 'Corolla', year: 2022 }
                    })];
                case 5:
                    vehicle = _b.sent();
                    return [4 /*yield*/, prisma.service.findFirst()];
                case 6:
                    _a = (_b.sent());
                    if (_a) return [3 /*break*/, 8];
                    return [4 /*yield*/, prisma.service.create({
                            data: { name: 'Cambio de Aceite', description: 'Aceite sintético.', price: 45000 }
                        })];
                case 7:
                    _a = (_b.sent());
                    _b.label = 8;
                case 8:
                    service = _a;
                    return [4 /*yield*/, prisma.serviceRequest.create({
                            data: { userId: client.id, serviceId: service.id, vehicleId: vehicle.id, status: 'PENDING', problemDescription: 'Check engine encendido.' }
                        })];
                case 9:
                    request = _b.sent();
                    return [4 /*yield*/, prisma.serviceProvider.findFirst({ where: { status: 'APPROVED' } })];
                case 10:
                    provider = _b.sent();
                    if (!!provider) return [3 /*break*/, 13];
                    return [4 /*yield*/, prisma.user.create({
                            data: { email: "tech_".concat(Date.now(), "@test.com"), password: 'password', name: 'Mecánico Pro', role: 'MECHANIC' }
                        })];
                case 11:
                    pUser = _b.sent();
                    return [4 /*yield*/, prisma.serviceProvider.create({
                            data: { userId: pUser.id, status: 'APPROVED', type: 'MECHANIC', rut: '12345678-9', commune: 'Las Condes' }
                        })];
                case 12:
                    provider = _b.sent();
                    _b.label = 13;
                case 13: return [4 /*yield*/, prisma.job.create({
                        data: { requestId: request.id, providerId: provider.id, status: 'ASSIGNED', estimatedCost: 45000 }
                    })];
                case 14:
                    job = _b.sent();
                    // 7. Eventos
                    return [4 /*yield*/, prisma.jobEvent.create({
                            data: { jobId: job.id, status: 'ASSIGNED', description: 'Asignación automática exitosa.' }
                        })];
                case 15:
                    // 7. Eventos
                    _b.sent();
                    return [4 /*yield*/, prisma.job.update({ where: { id: job.id }, data: { status: 'IN_PROGRESS' } })];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, prisma.jobEvent.create({
                            data: { jobId: job.id, status: 'IN_PROGRESS', description: 'Técnico iniciando diagnóstico.' }
                        })];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, prisma.auditLog.create({
                            data: {
                                userId: client.id,
                                action: 'CREATE_SR',
                                resource: 'ServiceRequest',
                                resourceId: request.id,
                                oldValue: null,
                                newValue: JSON.stringify(request),
                                ipAddress: '127.0.0.1',
                                userAgent: 'Test-Script'
                            }
                        })];
                case 18:
                    al = _b.sent();
                    console.log('✅ Flujo completado con éxito.');
                    console.log("- Cliente: ".concat(client.email));
                    console.log("- Job ID: ".concat(job.id));
                    console.log("- AuditLog ID: ".concat(al.id));
                    return [3 /*break*/, 22];
                case 19:
                    error_1 = _b.sent();
                    console.error('❌ Error:', error_1.message || error_1);
                    return [3 /*break*/, 22];
                case 20: return [4 /*yield*/, prisma.$disconnect()];
                case 21:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 22: return [2 /*return*/];
            }
        });
    });
}
runTestFlow();
