import { User } from '../../../generated/prisma/client';

export interface AuthRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<User>;
}
