import { User } from '../entities/user.entity';

export interface AuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createUser(data: {
    email: string;
    username: string;
    password: string;
  }): Promise<User>;
}
