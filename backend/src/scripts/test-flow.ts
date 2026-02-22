
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function runTestFlow() {
  console.log('🚀 Iniciando Prueba de Flujo Completo: RedMecánica Observability');

  try {
    // 1. Cliente
    let client = await prisma.user.findFirst({ where: { role: 'CLIENT' } });
    if (!client) {
      client = await prisma.user.create({
        data: { email: `test_${Date.now()}@example.com`, password: 'password123', name: 'Juan Cliente Test', role: 'CLIENT' }
      });
    }

    // 2. Vehículo
    const vehicle = await prisma.vehicle.create({
      data: { userId: client.id, licensePlate: `TEST-${Math.floor(Math.random() * 1000)}`, make: 'Toyota', model: 'Corolla', year: 2022 }
    });

    // 3. Servicio
    let service = await prisma.service.findFirst() || await prisma.service.create({
        data: { name: 'Cambio de Aceite', description: 'Aceite sintético.', price: 45000 }
    });

    // 4. Solicitud
    const request = await prisma.serviceRequest.create({
      data: { userId: client.id, serviceId: service.id, vehicleId: vehicle.id, status: 'PENDING', problemDescription: 'Check engine encendido.' }
    });

    // 5. Proveedor
    let provider = await prisma.serviceProvider.findFirst({ where: { status: 'APPROVED' } });
    if (!provider) {
        let pUser = await prisma.user.create({
            data: { email: `tech_${Date.now()}@test.com`, password: 'password', name: 'Mecánico Pro', role: 'MECHANIC' }
        });
        provider = await prisma.serviceProvider.create({
            data: { userId: pUser.id, status: 'APPROVED', type: 'MECHANIC', rut: '12345678-9', commune: 'Las Condes' }
        });
    }

    // 6. Job
    const job = await prisma.job.create({
      data: { requestId: request.id, providerId: provider.id, status: 'ASSIGNED', estimatedCost: 45000 }
    });

    // 7. Eventos
    await prisma.jobEvent.create({
        data: { jobId: job.id, status: 'ASSIGNED', description: 'Asignación automática exitosa.' }
    });

    await prisma.job.update({ where: { id: job.id }, data: { status: 'IN_PROGRESS' } });

    await prisma.jobEvent.create({
        data: { jobId: job.id, status: 'IN_PROGRESS', description: 'Técnico iniciando diagnóstico.' }
    });

    // 8. AuditLog
    const al = await prisma.auditLog.create({
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
    });

    console.log('✅ Flujo completado con éxito.');
    console.log(`- Cliente: ${client.email}`);
    console.log(`- Job ID: ${job.id}`);
    console.log(`- AuditLog ID: ${al.id}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

runTestFlow();
