import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controllers';
import { AuthService } from '../../services/auth.services';
import { AuthRequest } from '../../middleware/auth.middleware';

// Mock the AuthService
jest.mock('../../services/auth.services');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthRequest: Partial<AuthRequest>;
  let mockRegister: jest.SpiedFunction<typeof AuthService.prototype.register>;
  let mockLogin: jest.SpiedFunction<typeof AuthService.prototype.login>;
  let mockMe: jest.SpiedFunction<typeof AuthService.prototype.me>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create controller instance
    authController = new AuthController();

    // Setup spies
    mockRegister = jest.spyOn(AuthService.prototype, 'register');
    mockLogin = jest.spyOn(AuthService.prototype, 'login');
    mockMe = jest.spyOn(AuthService.prototype, 'me');

    // Setup response mock
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };

    // Setup request mock
    mockRequest = {
      body: {},
    };

    // Setup auth request mock
    mockAuthRequest = {
      body: {},
      user: undefined,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register()', () => {
    it('creates a new user and returns the expected result', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashed-password',
        fullName: null,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'jwt-token-123';
      const expectedResult = { user: mockUser, token: mockToken };

      mockRequest.body = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
      };

      mockRegister.mockResolvedValue(expectedResult);

      // Act
      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockRegister).toHaveBeenCalledWith(
        'test@example.com',
        'testuser',
        'password123'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
    });

    it('calls authService.register with correct parameters', async () => {
      // Arrange
      mockRequest.body = {
        email: 'john@example.com',
        username: 'john_doe',
        password: 'securepass',
      };

      mockRegister.mockResolvedValue({
        user: {} as any,
        token: 'token',
      });

      // Act
      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockRegister).toHaveBeenCalledWith(
        'john@example.com',
        'john_doe',
        'securepass'
      );
    });
  });

  describe('login()', () => {
    it('authenticates user and returns token', async () => {
      // Arrange
      const mockUser = {
        id: 'user-456',
        email: 'login@example.com',
        username: 'loginuser',
        password: 'hashed-password',
        fullName: 'Login User',
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockToken = 'jwt-login-token-456';
      const expectedResult = { user: mockUser, token: mockToken };

      mockRequest.body = {
        email: 'login@example.com',
        password: 'password123',
      };

      mockLogin.mockResolvedValue(expectedResult);

      // Act
      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockLogin).toHaveBeenCalledWith(
        'login@example.com',
        'password123'
      );
      expect(mockResponse.json).toHaveBeenCalledWith(expectedResult);
      expect(mockResponse.status).not.toHaveBeenCalled(); // login returns 200 by default
    });

    it('calls authService.login with correct credentials', async () => {
      // Arrange
      mockRequest.body = {
        email: 'test@test.com',
        password: 'mypassword',
      };

      mockLogin.mockResolvedValue({
        user: {} as any,
        token: 'token',
      });

      // Act
      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith(
        'test@test.com',
        'mypassword'
      );
    });
  });

  describe('me()', () => {
    it("returns the authenticated user's data", async () => {
      // Arrange
      const mockUserData = {
        id: 'user-789',
        email: 'me@example.com',
        username: 'meuser',
        fullName: 'Me User',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-01'),
      };

      mockAuthRequest.user = {
        userId: 'user-789',
        email: 'me@example.com',
      };

      mockMe.mockResolvedValue(mockUserData);

      // Act
      await authController.me(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockMe).toHaveBeenCalledWith('user-789');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    });

    it('extracts userId from authenticated request', async () => {
      // Arrange
      mockAuthRequest.user = {
        userId: 'different-user-id',
        email: 'different@example.com',
      };

      mockMe.mockResolvedValue({} as any);

      // Act
      await authController.me(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockMe).toHaveBeenCalledWith('different-user-id');
      expect(mockMe).toHaveBeenCalledTimes(1);
    });
  });
});
