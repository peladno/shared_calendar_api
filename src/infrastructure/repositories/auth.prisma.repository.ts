import { User } from '../../core/entities/user.entity';
import { AuthRepository } from '../../core/interfaces/auth.repository';
import { prisma } from '../../utils/prisma.utils';
import { User as PrismaUser } from '../../../generated/prisma/client';

export class PrismaAuthRepository implements AuthRepository {
  private toEntity(u: PrismaUser): User {
    return new User(
      u.id,
      u.email,
      u.username,
      u.password, // Prisma 'password' maps to Entity 'passwordHash' in constructor position 4
      u.fullName,
      u.avatarUrl,
      u.createdAt,
      u.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? this.toEntity(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? this.toEntity(user) : null;
  }

  async createUser(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    const user = await prisma.user.create({ data });
    return this.toEntity(user);
  }
}
