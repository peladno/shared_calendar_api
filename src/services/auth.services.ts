import { hashPassword, comparePassword } from '../utils/password.utils';
import { signToken } from '../utils/jwt.utils';
import { prisma } from '../utils/prisma.utils';

export class AuthService {
  async register(email: string, username: string, password: string) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      throw { status: 409, message: 'Email or username already in use' };
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, username, password: hashed },
    });

    const token = signToken({ userId: user.id, email: user.email });
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 401, message: 'Invalid credentials' };

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw { status: 401, message: 'Invalid credentials' };

    const token = signToken({ userId: user.id, email: user.email });
    return { user, token };
  }

  async me(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }
}
