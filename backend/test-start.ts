import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
console.log("Prisma client instantiated successfully.");
await prisma.$disconnect();
