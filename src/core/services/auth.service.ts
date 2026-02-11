import bcrypt from 'bcryptjs';
import { signToken } from '../../utils/jwt.utils';
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

    const token = signToken({ id: user.id, email: user.email });

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
    console.log('User', user);
    if (!user) throw new AppError(401, 'Invalid credentials');

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    console.log('Valid', valid);
    if (!valid) throw new AppError(401, 'Invalid credentials');

    const token = signToken({ id: user.id, email: user.email });

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

  async me(id: string) {
    return this.repo.findById(id);
  }
}
