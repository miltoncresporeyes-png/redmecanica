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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, regions, createdZones, communes, admin, serviceMotor, serviceFrenos, serviceGrua, serviceAceite, serviceSuspension, serviceRevision, serviceEscaner, serviceBateria, serviceTransmision, serviceElectrico, client1, providerDetails, createdProviders, _i, providerDetails_1, detail, user, isSuspended, provider, activeProviders, _a, activeProviders_1, provider, weekDays, _b, weekDays_1, day, zones, i, client2, req1, req2, req3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('🌱 Seeding database with full project flow...');
                    // 1. Limpiar base de datos (según reglas ACID y consistencia)
                    return [4 /*yield*/, prisma.notification.deleteMany({})];
                case 1:
                    // 1. Limpiar base de datos (según reglas ACID y consistencia)
                    _c.sent();
                    return [4 /*yield*/, prisma.message.deleteMany({})];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, prisma.conversation.deleteMany({})];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, prisma.providerZone.deleteMany({})];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, prisma.providerAvailability.deleteMany({})];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, prisma.providerCategory.deleteMany({})];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, prisma.jobLocation.deleteMany({})];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, prisma.quote.deleteMany({})];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, prisma.jobEvent.deleteMany({})];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, prisma.job.deleteMany({})];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, prisma.serviceRequest.deleteMany({})];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, prisma.subscription.deleteMany({})];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, prisma.providerHistory.deleteMany({})];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, prisma.serviceProvider.deleteMany({})];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, prisma.serviceCategory.deleteMany({})];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, prisma.zone.deleteMany({})];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, prisma.vehicle.deleteMany({})];
                case 17:
                    _c.sent();
                    return [4 /*yield*/, prisma.service.deleteMany({})];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, prisma.user.deleteMany({})];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, prisma.invoice.deleteMany({})];
                case 20:
                    _c.sent();
                    console.log('🧹 Database cleaned');
                    // 2. Crear categorías de servicios
                    console.log('📂 Creating service categories...');
                    return [4 /*yield*/, Promise.all([
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Mecánica General',
                                    slug: 'mecanica-general',
                                    description: 'Servicios de mecánica básica y general',
                                    icon: 'wrench',
                                    type: 'MECHANIC',
                                    sortOrder: 1,
                                }
                            }),
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Reparación de Motor',
                                    slug: 'reparacion-motor',
                                    description: 'Diagnóstico y reparación de motores',
                                    icon: 'engine',
                                    type: 'MECHANIC',
                                    sortOrder: 2,
                                }
                            }),
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Frenos y Suspensión',
                                    slug: 'frenos-suspension',
                                    description: 'Sistema de frenos y suspensión',
                                    icon: 'car',
                                    type: 'MECHANIC',
                                    sortOrder: 3,
                                }
                            }),
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Sistema Eléctrico',
                                    slug: 'sistema-electrico',
                                    description: 'Reparaciones eléctricas y electrónicas',
                                    icon: 'flash',
                                    type: 'MECHANIC',
                                    sortOrder: 4,
                                }
                            }),
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Servicio de Grúas',
                                    slug: 'servicio-gruas',
                                    description: 'Rescate y traslado de vehículos',
                                    icon: 'truck',
                                    type: 'TOWING',
                                    sortOrder: 5,
                                }
                            }),
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Emergencias 24/7',
                                    slug: 'emergencias',
                                    description: 'Asistencia de emergencia vehicular',
                                    icon: 'alert',
                                    type: 'EMERGENCY',
                                    sortOrder: 6,
                                }
                            }),
                            prisma.serviceCategory.create({
                                data: {
                                    name: 'Seguros',
                                    slug: 'seguros',
                                    description: 'Servicios de seguros vehiculares',
                                    icon: 'shield',
                                    type: 'INSURANCE',
                                    sortOrder: 7,
                                }
                            }),
                        ])];
                case 21:
                    categories = _c.sent();
                    console.log('✅ Created', categories.length, 'categories');
                    // 3. Crear zonas (Regiones de Chile)
                    console.log('🌍 Creating zones...');
                    regions = [
                        { name: 'Metropolitana de Santiago', slug: 'metropolitana', lat: -33.4489, lng: -70.6693 },
                        { name: 'Valparaíso', slug: 'valparaiso', lat: -33.0472, lng: -71.6127 },
                        { name: 'Biobío', slug: 'biobio', lat: -37.4667, lng: -72.35 },
                        { name: 'Maule', slug: 'maule', lat: -35.5167, lng: -71.6667 },
                        { name: 'Los Lagos', slug: 'los-lagos', lat: -41.8, lng: -73.0 },
                        { name: 'Antofagasta', slug: 'antofagasta', lat: -23.65, lng: -70.4 },
                        { name: 'Coquimbo', slug: 'coquimbo', lat: -29.9533, lng: -71.0 },
                    ];
                    return [4 /*yield*/, Promise.all(regions.map(function (r) {
                            return prisma.zone.create({
                                data: {
                                    name: r.name,
                                    slug: r.slug,
                                    type: 'REGION',
                                    latitude: r.lat,
                                    longitude: r.lng,
                                    radiusKm: 50,
                                }
                            });
                        }))];
                case 22:
                    createdZones = _c.sent();
                    communes = [
                        { name: 'Santiago', slug: 'santiago', parentId: createdZones[0].id, lat: -33.4489, lng: -70.6693 },
                        { name: 'Las Condes', slug: 'las-condes', parentId: createdZones[0].id, lat: -33.412, lng: -70.566 },
                        { name: 'Providencia', slug: 'providencia', parentId: createdZones[0].id, lat: -33.431, lng: -70.609 },
                        { name: 'Maipú', slug: 'maipu', parentId: createdZones[0].id, lat: -33.510, lng: -70.757 },
                        { name: 'Puente Alto', slug: 'puente-alto', parentId: createdZones[0].id, lat: -33.612, lng: -70.575 },
                        { name: 'Valparaíso', slug: 'valparaiso-ciudad', parentId: createdZones[1].id, lat: -33.0472, lng: -71.6127 },
                        { name: 'Viña del Mar', slug: 'vina-del-mar', parentId: createdZones[1].id, lat: -33.0245, lng: -71.5518 },
                    ];
                    return [4 /*yield*/, Promise.all(communes.map(function (c) {
                            return prisma.zone.create({
                                data: {
                                    name: c.name,
                                    slug: c.slug,
                                    type: 'COMMUNE',
                                    parentId: c.parentId,
                                    latitude: c.lat,
                                    longitude: c.lng,
                                    radiusKm: 15,
                                }
                            });
                        }))];
                case 23:
                    _c.sent();
                    console.log('✅ Created zones');
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'admin@redmecanica.cl',
                                name: 'Admin Central',
                                role: 'ADMIN'
                            }
                        })];
                case 24:
                    admin = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'motor',
                                name: 'Reparación de Motor',
                                description: 'Diagnóstico y reparación completa de motor.',
                                price: 450000,
                                categoryId: categories[1].id
                            }
                        })];
                case 25:
                    serviceMotor = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'frenos',
                                name: 'Revisión y Cambio de Frenos',
                                description: 'Reemplazo de pastillas y rectificado de discos.',
                                price: 45000,
                                categoryId: categories[2].id
                            }
                        })];
                case 26:
                    serviceFrenos = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'grua',
                                name: 'Servicio de Grúa Emergencia',
                                description: 'Traslado de vehículo las 24 horas.',
                                price: 35000,
                                categoryId: categories[4].id
                            }
                        })];
                case 27:
                    serviceGrua = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'aceite',
                                name: 'Cambio de Aceite y Filtro',
                                description: 'Mantención preventiva estándar.',
                                price: 55000,
                                categoryId: categories[0].id
                            }
                        })];
                case 28:
                    serviceAceite = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'suspension',
                                name: 'Reparación de Suspensión',
                                description: 'Amortiguadores, cazoletas y terminales.',
                                price: 120000,
                                categoryId: categories[2].id
                            }
                        })];
                case 29:
                    serviceSuspension = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'revision_general',
                                name: 'Revisión General',
                                description: 'Inspección de seguridad de 50 puntos.',
                                price: 25000,
                                categoryId: categories[0].id
                            }
                        })];
                case 30:
                    serviceRevision = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'escaner',
                                name: 'Escáner Automotriz',
                                description: 'Lectura de códigos de falla y diagnóstico.',
                                price: 30000,
                                categoryId: categories[3].id
                            }
                        })];
                case 31:
                    serviceEscaner = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'bateria',
                                name: 'Cambio de Batería',
                                description: 'Instalación de batería nueva con garantía.',
                                price: 85000,
                                categoryId: categories[3].id
                            }
                        })];
                case 32:
                    serviceBateria = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'transmision',
                                name: 'Reparación de Transmisión',
                                description: 'Fallas en caja de cambios o embrague.',
                                price: 280000,
                                categoryId: categories[1].id
                            }
                        })];
                case 33:
                    serviceTransmision = _c.sent();
                    return [4 /*yield*/, prisma.service.create({
                            data: {
                                id: 'electrico',
                                name: 'Sistema Eléctrico',
                                description: 'Reparación de alternador, luces o sensores.',
                                price: 65000,
                                categoryId: categories[3].id
                            }
                        })];
                case 34:
                    serviceElectrico = _c.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: 'cliente.pyme@example.com',
                                name: 'Roberto Gómez',
                                role: 'USER',
                                vehicles: {
                                    create: {
                                        make: 'Toyota',
                                        model: 'Hilux',
                                        year: 2022,
                                        licensePlate: 'RR-TT-44'
                                    }
                                }
                            },
                            include: { vehicles: true }
                        })];
                case 35:
                    client1 = _c.sent();
                    // 5. Crear Prestadores con Diferentes Estados de Suscripción y Ubicaciones
                    console.log('🏗️ Creating providers...');
                    providerDetails = [
                        {
                            email: 'premium.workshop@example.com',
                            name: 'Taller Central Santiago',
                            type: 'WORKSHOP',
                            commune: 'Santiago',
                            lat: -33.4489,
                            lng: -70.6693,
                            plan: 'YEARLY',
                            status: 'ACTIVE',
                            specialties: 'Mecánica General,Frenos y Suspensión,Aire Acondicionado'
                        },
                        {
                            email: 'lascondes.mech@example.com',
                            name: 'Mecánico Pro Las Condes',
                            type: 'MECHANIC',
                            commune: 'Las Condes',
                            lat: -33.412,
                            lng: -70.566,
                            plan: 'MONTHLY',
                            status: 'ACTIVE',
                            specialties: 'Mecánica General,Electricidad / Electrónica'
                        },
                        {
                            email: 'providencia.taller@example.com',
                            name: 'AutoService Providencia',
                            type: 'WORKSHOP',
                            commune: 'Providencia',
                            lat: -33.431,
                            lng: -70.609,
                            plan: 'YEARLY',
                            status: 'ACTIVE',
                            specialties: 'Hojalatería y Pintura,Alineación y Balanceo'
                        },
                        {
                            email: 'maipu.sos@example.com',
                            name: 'Rescate Maipú 24/7',
                            type: 'TOWING',
                            commune: 'Maipú',
                            lat: -33.510,
                            lng: -70.757,
                            plan: 'MONTHLY',
                            status: 'ACTIVE',
                            specialties: 'Auxilio y Grúa,Mecánica Ligera'
                        },
                        {
                            email: 'nubledal.valpo@example.com',
                            name: 'Frenos Valpo',
                            type: 'WORKSHOP',
                            commune: 'Valparaíso',
                            lat: -33.0472,
                            lng: -71.6127,
                            plan: 'MONTHLY',
                            status: 'ACTIVE',
                            specialties: 'Frenos y Suspensión,Mecánica General'
                        },
                        {
                            email: 'expirado.mecanico@example.com',
                            name: 'Juan Mecánico (Suspendido)',
                            type: 'MECHANIC',
                            commune: 'La Florida',
                            lat: -33.522,
                            lng: -70.598,
                            plan: 'MONTHLY',
                            status: 'SUSPENDED',
                            specialties: 'Mecánica General'
                        },
                        {
                            email: 'nuevo.taller@test.com',
                            name: 'Mecánica Express Puente Alto',
                            type: 'WORKSHOP',
                            commune: 'Puente Alto',
                            lat: -33.612,
                            lng: -70.575,
                            plan: 'MONTHLY',
                            status: 'PENDING',
                            specialties: 'Frenos, Afinamiento',
                            docs: true
                        },
                        {
                            email: 'revision.pendiente@test.com',
                            name: 'Especialista BMW/Audi',
                            type: 'MECHANIC',
                            commune: 'Vitacura',
                            lat: -33.385,
                            lng: -70.589,
                            plan: 'YEARLY',
                            status: 'UNDER_REVIEW',
                            specialties: 'Alta Gama, Electrónica',
                            docs: true
                        }
                    ];
                    createdProviders = [];
                    _i = 0, providerDetails_1 = providerDetails;
                    _c.label = 36;
                case 36:
                    if (!(_i < providerDetails_1.length)) return [3 /*break*/, 40];
                    detail = providerDetails_1[_i];
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: detail.email,
                                name: detail.name,
                                role: 'MECHANIC',
                                password: '$2b$10$YourDefaultHashedPasswordHere'
                            }
                        })];
                case 37:
                    user = _c.sent();
                    isSuspended = detail.status === 'SUSPENDED';
                    return [4 /*yield*/, prisma.serviceProvider.create({
                            data: {
                                userId: user.id,
                                type: detail.type,
                                status: detail.status,
                                rut: "76.".concat(Math.floor(Math.random() * 900 + 100), ".").concat(Math.floor(Math.random() * 900 + 100), "-").concat(Math.floor(Math.random() * 9)),
                                commune: detail.commune,
                                region: 'Metropolitana',
                                latitude: detail.lat,
                                longitude: detail.lng,
                                bio: "Especialista en ".concat(detail.specialties, " con a\u00F1os de experiencia en la zona de ").concat(detail.commune, "."),
                                specialties: detail.specialties,
                                idDocumentUrl: detail.docs ? 'https://example.com/id.pdf' : null,
                                backgroundCheckUrl: detail.docs ? 'https://example.com/bg.pdf' : null,
                                submittedAt: detail.docs ? new Date() : null,
                                subscription: detail.status === 'ACTIVE' || isSuspended ? {
                                    create: {
                                        plan: detail.plan,
                                        status: isSuspended ? 'EXPIRED' : 'ACTIVE',
                                        startDate: new Date('2026-01-01'),
                                        endDate: isSuspended ? new Date('2026-02-01') : new Date('2027-01-01'),
                                        amount: detail.plan === 'YEARLY' ? 120000 : 15000
                                    }
                                } : undefined,
                                history: {
                                    create: __spreadArray([
                                        { action: 'ACTIVATION', description: 'Proveedor registrado en el sistema.' }
                                    ], (isSuspended ? [{ action: 'SUBSCRIPTION_EXPIRED', description: 'Bloqueo automático: periodo de prueba vencido.' }] : []), true)
                                }
                            }
                        })];
                case 38:
                    provider = _c.sent();
                    createdProviders.push(provider);
                    _c.label = 39;
                case 39:
                    _i++;
                    return [3 /*break*/, 36];
                case 40:
                    activeProviders = createdProviders.filter(function (p) { return p.status === 'ACTIVE'; });
                    _a = 0, activeProviders_1 = activeProviders;
                    _c.label = 41;
                case 41:
                    if (!(_a < activeProviders_1.length)) return [3 /*break*/, 46];
                    provider = activeProviders_1[_a];
                    weekDays = [1, 2, 3, 4, 5];
                    _b = 0, weekDays_1 = weekDays;
                    _c.label = 42;
                case 42:
                    if (!(_b < weekDays_1.length)) return [3 /*break*/, 45];
                    day = weekDays_1[_b];
                    return [4 /*yield*/, prisma.providerAvailability.create({
                            data: {
                                providerId: provider.id,
                                dayOfWeek: day,
                                startTime: '08:00',
                                endTime: '19:00',
                                isActive: true,
                            }
                        })];
                case 43:
                    _c.sent();
                    _c.label = 44;
                case 44:
                    _b++;
                    return [3 /*break*/, 42];
                case 45:
                    _a++;
                    return [3 /*break*/, 41];
                case 46: return [4 /*yield*/, prisma.zone.findMany({ take: 5 })];
                case 47:
                    zones = _c.sent();
                    i = 0;
                    _c.label = 48;
                case 48:
                    if (!(i < Math.min(activeProviders.length, zones.length))) return [3 /*break*/, 51];
                    return [4 /*yield*/, prisma.providerZone.create({
                            data: {
                                providerId: activeProviders[i].id,
                                zoneId: zones[i].id,
                                radiusKm: 15,
                            }
                        })];
                case 49:
                    _c.sent();
                    _c.label = 50;
                case 50:
                    i++;
                    return [3 /*break*/, 48];
                case 51: return [4 /*yield*/, prisma.user.create({
                        data: {
                            email: 'ana.torres@example.com',
                            name: 'Ana Torres',
                            role: 'USER',
                            vehicles: {
                                create: {
                                    make: 'Honda',
                                    model: 'Civic',
                                    year: 2020,
                                    licensePlate: 'HH-JJ-11'
                                }
                            }
                        },
                        include: { vehicles: true }
                    })];
                case 52:
                    client2 = _c.sent();
                    // 7. Crear un Flujo de Servicio (Request -> Job) Variado
                    console.log('📝 Creating service requests and jobs...');
                    return [4 /*yield*/, prisma.serviceRequest.create({
                            data: {
                                userId: client1.id,
                                vehicleId: client1.vehicles[0].id,
                                serviceId: serviceAceite.id,
                                problemDescription: 'Cambio de aceite y filtro 10k',
                                status: 'ACCEPTED'
                            }
                        })];
                case 53:
                    req1 = _c.sent();
                    return [4 /*yield*/, prisma.job.create({
                            data: {
                                requestId: req1.id,
                                customerId: client1.id,
                                providerId: activeProviders[0].id,
                                status: 'IN_PROGRESS',
                                etaMinutes: 45,
                                estimatedCost: 55000
                            }
                        })];
                case 54:
                    _c.sent();
                    return [4 /*yield*/, prisma.serviceRequest.create({
                            data: {
                                userId: client2.id,
                                vehicleId: client2.vehicles[0].id,
                                serviceId: serviceFrenos.id,
                                problemDescription: 'Ruidos al frenar en frío',
                                status: 'ACCEPTED'
                            }
                        })];
                case 55:
                    req2 = _c.sent();
                    return [4 /*yield*/, prisma.job.create({
                            data: {
                                requestId: req2.id,
                                customerId: client2.id,
                                providerId: activeProviders[1].id,
                                status: 'COMPLETED',
                                completedAt: new Date(),
                                estimatedCost: 45000,
                                paymentStatus: 'RELEASED'
                            }
                        })];
                case 56:
                    _c.sent();
                    return [4 /*yield*/, prisma.serviceRequest.create({
                            data: {
                                userId: client1.id,
                                vehicleId: client1.vehicles[0].id,
                                serviceId: serviceGrua.id,
                                problemDescription: 'Vehículo no arranca en vía pública',
                                status: 'ACCEPTED'
                            }
                        })];
                case 57:
                    req3 = _c.sent();
                    return [4 /*yield*/, prisma.job.create({
                            data: {
                                requestId: req3.id,
                                customerId: client1.id,
                                providerId: activeProviders[3].id,
                                status: 'EN_ROUTE',
                                etaMinutes: 15
                            }
                        })];
                case 58:
                    _c.sent();
                    console.log('✅ Seed complete!');
                    console.log("\n  \uD83D\uDE80 LISTO PARA PRUEBAS:\n  ---------------------\n  - Admin: admin@redmecanica.cl / clave: admin123\n  - 5 Prestadores Activos\n  - 2 Prestadores PENDIENTES (Revisiones)\n  - 3 Trabajos en diferentes estados\n  - Clientes: Roberto G\u00F3mez, Ana Torres\n  ");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
