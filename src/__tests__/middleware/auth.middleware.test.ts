import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Response, NextFunction } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.middleware';
import * as jwtUtils from '../../utils/jwt.utils';

// Mock jwt utils
jest.mock('../../utils/jwt.utils');

describe('authMiddleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockVerifyToken: jest.MockedFunction<typeof jwtUtils.verifyToken>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mocks
    mockRequest = {
      headers: {},
      user: undefined,
    };

    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };

    mockNext = jest.fn() as NextFunction;
    mockVerifyToken = jest.mocked(jwtUtils.verifyToken);
  });

  describe('validates JWT and attaches user to request', () => {
    it('successfully validates token and attaches user data to request', () => {
      // Arrange
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      mockRequest.headers = {
        authorization: 'Bearer valid-token-123',
      };

      mockVerifyToken.mockReturnValue(mockPayload);

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token-123');
      expect(mockRequest.user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
      });
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it('extracts token correctly from Bearer scheme', () => {
      // Arrange
      const mockPayload = {
        userId: 'user-456',
        email: 'another@example.com',
      };

      mockRequest.headers = {
        authorization: 'Bearer my-jwt-token',
      };

      mockVerifyToken.mockReturnValue(mockPayload);

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('my-jwt-token');
      expect(mockRequest.user).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('returns 401 when authorization header is missing', () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'No token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockVerifyToken).not.toHaveBeenCalled();
    });

    it('returns 401 when authorization header does not start with Bearer', () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Basic dXNlcjpwYXNz',
      };

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'No token provided',
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockVerifyToken).not.toHaveBeenCalled();
    });

    it('returns 401 when token is empty after Bearer', () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer ',
      };

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token format',
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockVerifyToken).not.toHaveBeenCalled();
    });

    it('returns 401 when token verification fails', () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };

      mockVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('invalid-token');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRequest.user).toBeUndefined();
    });

    it('returns 401 when token is expired', () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer expired-token',
      };

      mockVerifyToken.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockVerifyToken).toHaveBeenCalledWith('expired-token');
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('attaches correct user object structure to request', () => {
      // Arrange
      const mockPayload = {
        userId: 'abc-123-def',
        email: 'integration@test.com',
      };

      mockRequest.headers = {
        authorization: 'Bearer integration-token',
      };

      mockVerifyToken.mockReturnValue(mockPayload);

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.user).toHaveProperty('userId', 'abc-123-def');
      expect(mockRequest.user).toHaveProperty('email', 'integration@test.com');
      expect(Object.keys(mockRequest.user!)).toHaveLength(2);
    });

    it('does not modify request when authentication fails', () => {
      // Arrange
      mockRequest.headers = {
        authorization: 'Bearer bad-token',
      };

      mockVerifyToken.mockImplementation(() => {
        throw new Error('Token verification failed');
      });

      // Act
      authMiddleware(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockRequest.user).toBeUndefined();
    });
  });
});
