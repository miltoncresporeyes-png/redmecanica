import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with full project flow...');

  // 1. Limpiar base de datos (según reglas ACID y consistencia)
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.conversation.deleteMany({});
  await prisma.providerZone.deleteMany({});
  await prisma.providerAvailability.deleteMany({});
  await prisma.providerCategory.deleteMany({});
  await prisma.jobLocation.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.jobEvent.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.serviceRequest.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.providerHistory.deleteMany({});
  await prisma.serviceProvider.deleteMany({});
  await prisma.serviceCategory.deleteMany({});
  await prisma.zone.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.invoice.deleteMany({});

  console.log('🧹 Database cleaned');

  // 2. Crear categorías de servicios
  console.log('📂 Creating service categories...');
  
  const categories = await Promise.all([
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
  ]);

  console.log('✅ Created', categories.length, 'categories');

  // 3. Crear zonas (Regiones de Chile)
  console.log('🌍 Creating zones...');
  
  const regions = [
    { name: 'Metropolitana de Santiago', slug: 'metropolitana', lat: -33.4489, lng: -70.6693 },
    { name: 'Valparaíso', slug: 'valparaiso', lat: -33.0472, lng: -71.6127 },
    { name: 'Biobío', slug: 'biobio', lat: -37.4667, lng: -72.35 },
    { name: 'Maule', slug: 'maule', lat: -35.5167, lng: -71.6667 },
    { name: 'Los Lagos', slug: 'los-lagos', lat: -41.8, lng: -73.0 },
    { name: 'Antofagasta', slug: 'antofagasta', lat: -23.65, lng: -70.4 },
    { name: 'Coquimbo', slug: 'coquimbo', lat: -29.9533, lng: -71.0 },
  ];

  const createdZones = await Promise.all(
    regions.map(r => 
      prisma.zone.create({
        data: {
          name: r.name,
          slug: r.slug,
          type: 'REGION',
          latitude: r.lat,
          longitude: r.lng,
          radiusKm: 50,
        }
      })
    )
  );

  // Agregar comunas de ejemplo
  const communes = [
    { name: 'Santiago', slug: 'santiago', parentId: createdZones[0].id, lat: -33.4489, lng: -70.6693 },
    { name: 'Las Condes', slug: 'las-condes', parentId: createdZones[0].id, lat: -33.412, lng: -70.566 },
    { name: 'Providencia', slug: 'providencia', parentId: createdZones[0].id, lat: -33.431, lng: -70.609 },
    { name: 'Maipú', slug: 'maipu', parentId: createdZones[0].id, lat: -33.510, lng: -70.757 },
    { name: 'Puente Alto', slug: 'puente-alto', parentId: createdZones[0].id, lat: -33.612, lng: -70.575 },
    { name: 'Valparaíso', slug: 'valparaiso-ciudad', parentId: createdZones[1].id, lat: -33.0472, lng: -71.6127 },
    { name: 'Viña del Mar', slug: 'vina-del-mar', parentId: createdZones[1].id, lat: -33.0245, lng: -71.5518 },
  ];

  await Promise.all(
    communes.map(c => 
      prisma.zone.create({
        data: {
          name: c.name,
          slug: c.slug,
          type: 'COMMUNE',
          parentId: c.parentId,
          latitude: c.lat,
          longitude: c.lng,
          radiusKm: 15,
        }
      })
    )
  );

  console.log('✅ Created zones');

  // 4. Crear Administrador
  const admin = await prisma.user.create({
    data: {
      email: 'admin@redmecanica.cl',
      name: 'Admin Central',
      role: 'ADMIN'
    }
  });

  // 5. Crear Servicios Maestros con Categorías
  const serviceMotor = await prisma.service.create({
    data: { 
      id: 'motor', 
      name: 'Reparación de Motor', 
      description: 'Diagnóstico y reparación completa de motor.', 
      price: 450000,
      categoryId: categories[1].id
    }
  });
  const serviceFrenos = await prisma.service.create({
    data: { 
      id: 'frenos', 
      name: 'Revisión y Cambio de Frenos', 
      description: 'Reemplazo de pastillas y rectificado de discos.', 
      price: 45000,
      categoryId: categories[2].id
    }
  });
  const serviceGrua = await prisma.service.create({
    data: { 
      id: 'grua', 
      name: 'Servicio de Grúa Emergencia', 
      description: 'Traslado de vehículo las 24 horas.', 
      price: 35000,
      categoryId: categories[4].id
    }
  });
  const serviceAceite = await prisma.service.create({
    data: { 
      id: 'aceite', 
      name: 'Cambio de Aceite y Filtro', 
      description: 'Mantención preventiva estándar.', 
      price: 55000,
      categoryId: categories[0].id
    }
  });
  const serviceSuspension = await prisma.service.create({
    data: { 
      id: 'suspension', 
      name: 'Reparación de Suspensión', 
      description: 'Amortiguadores, cazoletas y terminales.', 
      price: 120000,
      categoryId: categories[2].id
    }
  });
  const serviceRevision = await prisma.service.create({
    data: { 
      id: 'revision_general', 
      name: 'Revisión General', 
      description: 'Inspección de seguridad de 50 puntos.', 
      price: 25000,
      categoryId: categories[0].id
    }
  });
  const serviceEscaner = await prisma.service.create({
    data: { 
      id: 'escaner', 
      name: 'Escáner Automotriz', 
      description: 'Lectura de códigos de falla y diagnóstico.', 
      price: 30000,
      categoryId: categories[3].id
    }
  });
  const serviceBateria = await prisma.service.create({
    data: { 
      id: 'bateria', 
      name: 'Cambio de Batería', 
      description: 'Instalación de batería nueva con garantía.', 
      price: 85000,
      categoryId: categories[3].id
    }
  });
  const serviceTransmision = await prisma.service.create({
    data: { 
      id: 'transmision', 
      name: 'Reparación de Transmisión', 
      description: 'Fallas en caja de cambios o embrague.', 
      price: 280000,
      categoryId: categories[1].id
    }
  });
  const serviceElectrico = await prisma.service.create({
    data: { 
      id: 'electrico', 
      name: 'Sistema Eléctrico', 
      description: 'Reparación de alternador, luces o sensores.', 
      price: 65000,
      categoryId: categories[3].id
    }
  });

  // 4. Crear Clientes (Dueños de Vehículos)
  const client1 = await prisma.user.create({
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
  });

  // 5. Crear Prestadores con Diferentes Estados de Suscripción y Ubicaciones
  console.log('🏗️ Creating providers...');

  const providerDetails = [
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

  const createdProviders = [];

  for (const detail of providerDetails) {
    const user = await prisma.user.create({
      data: { 
        email: detail.email, 
        name: detail.name, 
        role: 'MECHANIC',
        password: '$2b$10$YourDefaultHashedPasswordHere' 
      }
    });

    const isSuspended = detail.status === 'SUSPENDED';
    
    const provider = await prisma.serviceProvider.create({
      data: {
        userId: user.id,
        type: detail.type as any,
        status: detail.status as any,
        rut: `76.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9)}`,
        commune: detail.commune,
        region: 'Metropolitana',
        latitude: detail.lat,
        longitude: detail.lng,
        bio: `Especialista en ${detail.specialties} con años de experiencia en la zona de ${detail.commune}.`,
        specialties: detail.specialties,
        idDocumentUrl: (detail as any).docs ? 'https://example.com/id.pdf' : null,
        backgroundCheckUrl: (detail as any).docs ? 'https://example.com/bg.pdf' : null,
        submittedAt: (detail as any).docs ? new Date() : null,
        subscription: detail.status === 'ACTIVE' || isSuspended ? {
          create: {
            plan: (detail as any).plan as any,
            status: isSuspended ? 'EXPIRED' : 'ACTIVE',
            startDate: new Date('2026-01-01'),
            endDate: isSuspended ? new Date('2026-02-01') : new Date('2027-01-01'),
            amount: detail.plan === 'YEARLY' ? 120000 : 15000
          }
        } : undefined,
        history: {
          create: [
            { action: 'ACTIVATION', description: 'Proveedor registrado en el sistema.' },
            ...(isSuspended ? [{ action: 'SUBSCRIPTION_EXPIRED', description: 'Bloqueo automático: periodo de prueba vencido.' }] : [])
          ]
        }
      } as any
    });
    createdProviders.push(provider);
  }

  const activeProviders = createdProviders.filter(p => p.status === 'ACTIVE');

  // Agregar disponibilidad a los Prestadores activos
  for (const provider of activeProviders) {
    const weekDays = [1, 2, 3, 4, 5]; // Lunes a Viernes
    for (const day of weekDays) {
      await prisma.providerAvailability.create({
        data: {
          providerId: provider.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '19:00',
          isActive: true,
        }
      });
    }
  }

  // Agregar algunos Prestadores a zonas
  const zones = await prisma.zone.findMany({ take: 5 });
  for (let i = 0; i < Math.min(activeProviders.length, zones.length); i++) {
    await prisma.providerZone.create({
      data: {
        providerId: activeProviders[i].id,
        zoneId: zones[i].id,
        radiusKm: 15,
      }
    });
  }

  // 6. Crear más Clientes y Vehículos
  const client2 = await prisma.user.create({
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
  });

  // 7. Crear un Flujo de Servicio (Request -> Job) Variado
  console.log('📝 Creating service requests and jobs...');
  
  // Job 1: In Progress
  const req1 = await prisma.serviceRequest.create({
    data: {
      userId: client1.id,
      vehicleId: client1.vehicles[0].id,
      serviceId: serviceAceite.id,
      problemDescription: 'Cambio de aceite y filtro 10k',
      status: 'ACCEPTED'
    }
  });

  await prisma.job.create({
    data: {
      requestId: req1.id,
      customerId: client1.id,
      providerId: activeProviders[0].id,
      status: 'IN_PROGRESS',
      etaMinutes: 45,
      estimatedCost: 55000
    }
  });

  // Job 2: Completed
  const req2 = await prisma.serviceRequest.create({
    data: {
      userId: client2.id,
      vehicleId: client2.vehicles[0].id,
      serviceId: serviceFrenos.id,
      problemDescription: 'Ruidos al frenar en frío',
      status: 'ACCEPTED'
    }
  });

  await prisma.job.create({
    data: {
      requestId: req2.id,
      customerId: client2.id,
      providerId: activeProviders[1].id,
      status: 'COMPLETED',
      completedAt: new Date(),
      estimatedCost: 45000,
      paymentStatus: 'RELEASED'
    }
  });

  // Job 3: En Route
  const req3 = await prisma.serviceRequest.create({
    data: {
      userId: client1.id,
      vehicleId: client1.vehicles[0].id,
      serviceId: serviceGrua.id,
      problemDescription: 'Vehículo no arranca en vía pública',
      status: 'ACCEPTED'
    }
  });

  await prisma.job.create({
    data: {
      requestId: req3.id,
      customerId: client1.id,
      providerId: activeProviders[3].id,
      status: 'EN_ROUTE',
      etaMinutes: 15
    }
  });

  console.log('✅ Seed complete!');
  console.log(`
  🚀 LISTO PARA PRUEBAS:
  ---------------------
  - Admin: admin@redmecanica.cl / clave: admin123
  - 5 Prestadores Activos
  - 2 Prestadores PENDIENTES (Revisiones)
  - 3 Trabajos en diferentes estados
  - Clientes: Roberto Gómez, Ana Torres
  `);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
