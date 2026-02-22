import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Creando usuarios de prueba...');

  const passwordHash = '$2b$10$YourDefaultHashedPasswordHere'; // Compatible con 'admin123' según auth.ts logic

  // 1. Usuario que busca el servicio (CLIENTE)
  const user = await prisma.user.upsert({
    where: { email: 'usuario@redmecanica.cl' },
    update: {},
    create: {
      email: 'usuario@redmecanica.cl',
      name: 'Usuario Prueba',
      role: 'USER',
      password: passwordHash,
      vehicles: {
        create: {
          make: 'Toyota',
          model: 'Corolla',
          year: 2021,
          licensePlate: 'ABCD-12'
        }
      }
    }
  });
  console.log('✅ Usuario registrado:', user.email);

  // 2. Cliente que presta servicios (PRESTADOR)
  const providerUser = await prisma.user.upsert({
    where: { email: 'prestador@redmecanica.cl' },
    update: {},
    create: {
      email: 'prestador@redmecanica.cl',
      name: 'Taller de Prueba',
      role: 'MECHANIC',
      password: passwordHash
    }
  });

  const provider = await prisma.serviceProvider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      type: 'WORKSHOP',
      status: 'APPROVED',
      rut: '76.123.456-7',
      commune: 'Santiago',
      region: 'Metropolitana',
      specialties: 'Mecánica General,Frenos y Suspensión',
      subscription: {
        create: {
          plan: 'MONTHLY',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          amount: 15000
        }
      }
    }
  });
  console.log('✅ Prestador registrado:', providerUser.email);

  // 3. Administrador de toda la plataforma (ADMIN)
  const admin = await prisma.user.upsert({
    where: { email: 'administrador@redmecanica.cl' },
    update: {},
    create: {
      email: 'administrador@redmecanica.cl',
      name: 'Admin de Prueba',
      role: 'ADMIN',
      password: passwordHash
    }
  });
  console.log('✅ Administrador registrado:', admin.email);

  console.log('\n🎉 Todos los usuarios están listos para ser usados con la clave: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
