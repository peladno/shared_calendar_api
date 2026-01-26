import { AuthRepository } from '../../core/interfaces/auth.repository';
import { prisma } from '../../utils/prisma.utils';

export class PrismaAuthRepository implements AuthRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  createUser(data: { email: string; username: string; password: string }) {
    return prisma.user.create({ data });
  }
}
