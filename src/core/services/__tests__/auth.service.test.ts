import { AuthService } from '../auth.service';
import { AuthRepository } from '../../interfaces/auth.repository';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../../../utils/error.utils';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let service: AuthService;
  let mockRepo: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
    };
    service = new AuthService(mockRepo);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const data = { email: 'test@test.com', username: 'testuser', password: 'password123' };
      const hashedPassword = 'hashedPassword';
      const mockUser = new User('1', data.email, data.username, hashedPassword);

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepo.createUser.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await service.register(data);

      expect(bcrypt.hash).toHaveBeenCalledWith(data.password, 10);
      expect(mockRepo.createUser).toHaveBeenCalledWith({ ...data, password: hashedPassword });
      expect(result).toEqual({
        token: 'mockToken',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
        },
      });
    });
  });

  describe('login', () => {
    const loginData = { email: 'test@test.com', password: 'password123' };
    const mockUser = new User('1', 'test@test.com', 'testuser', 'hashedPassword');

    it('should return token and user if credentials are valid', async () => {
      mockRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const result = await service.login(loginData);

      expect(result.token).toBe('mockToken');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
      });
    });

    it('should throw error if user not found', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(AppError);
    });

    it('should throw error if password incorrect', async () => {
      mockRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginData)).rejects.toThrow(AppError);
    });
  });

  describe('me', () => {
    it('should return user from repo', async () => {
      const mockUser = new User('1', 'test@test.com', 'testuser', 'hashedPassword');
      mockRepo.findById.mockResolvedValue(mockUser);

      const result = await service.me('1');

      expect(result).toEqual(mockUser);
      expect(mockRepo.findById).toHaveBeenCalledWith('1');
    });
  });
});
