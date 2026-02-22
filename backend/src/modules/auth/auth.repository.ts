
import { prisma } from '../../prisma/index.js';
import { User } from '@prisma/client';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        serviceProvider: true
      }
    });
  }

  async createUser(data: any): Promise<User> {
    const { email, password, name, role } = data;
    
    // Default Prisma logic handles optional fields etc.
    // Transaction if provider
    if (role === 'MECHANIC') {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password,
                    name,
                    role
                }
            });

            await tx.serviceProvider.create({
                data: {
                    userId: user.id,
                    status: 'PENDING',
                }
            });
            return user;
        });
        return result;
    }

    return prisma.user.create({
        data: {
            email,
            password,
            name,
            role
        }
    });
  }
}

export const authRepository = new AuthRepository();
