import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthResponseDTO } from '../dto/auth/auth-response.dto';
import { AuthRepository } from '../interfaces/auth.repository';
import { AppError } from '../../utils/error.utils';
import { RegisterDTO } from '../dto/auth/register.dto';
import { LoginDTO } from '../dto/auth/login.dto';

export class AuthService {
  constructor(private repo: AuthRepository) {}

  async register(data: RegisterDTO): Promise<AuthResponseDTO> {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new AppError(400, 'Email already registered');

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.repo.createUser({
      email: data.email,
      username: data.username,
      password: hashed,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.repo.findByEmail(data.email);
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName ?? undefined,
        avatarUrl: user.avatarUrl ?? undefined,
      },
    };
  }

  async me(userId: string) {
    return this.repo.findById(userId);
  }
}
