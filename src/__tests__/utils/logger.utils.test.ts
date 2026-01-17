const logger_path = '../../utils/logger.utils';
// Mock winston ANTES de importar cualquier cosa
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  add: jest.fn(),
  close: jest.fn(),
  level: 'info',
};

const mockFormat = {
  combine: jest.fn(() => 'combined-format'),
  timestamp: jest.fn(() => 'timestamp-format'),
  errors: jest.fn(() => 'errors-format'),
  splat: jest.fn(() => 'splat-format'),
  json: jest.fn(() => 'json-format'),
  colorize: jest.fn(() => 'colorize-format'),
  printf: jest.fn(() => 'printf-format'),
};

const mockConsoleTransport = jest.fn();
const mockFileTransport = jest.fn();

jest.mock('winston', () => ({
  format: mockFormat,
  transports: {
    Console: mockConsoleTransport,
    File: mockFileTransport,
  },
  createLogger: jest.fn(() => mockLogger),
}));

// Ahora sí importamos
import winston from 'winston';

describe('Logger Utility', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset environment
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Logger Creation', () => {
    it('should create a winston logger instance', () => {
      // Force re-import
      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(winston.createLogger).toHaveBeenCalled();
    });

    it('should have default service name in metadata', () => {
      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultMeta: { service: 'shared-calendar-backend' },
        })
      );
    });
  });

  describe('Log Level Configuration', () => {
    it('should use default log level "info" when LOG_LEVEL is not set', () => {
      delete process.env.LOG_LEVEL;

      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'info',
        })
      );
    });

    it('should use LOG_LEVEL from environment variable', () => {
      process.env.LOG_LEVEL = 'debug';

      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'debug',
        })
      );
    });

    it('should support error log level', () => {
      process.env.LOG_LEVEL = 'error';

      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(winston.createLogger).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'error',
        })
      );
    });
  });

  describe('Environment-Based Configuration', () => {
    it('should use development mode by default', () => {
      delete process.env.NODE_ENV;

      jest.isolateModules(() => {
        require(logger_path);
      });

      // Should create Console transport
      expect(mockConsoleTransport).toHaveBeenCalled();
    });

    it('should configure console transport for development', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(mockConsoleTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          format: expect.anything(),
        })
      );
    });

    it('should add file transports in production mode', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        require(logger_path);
      });

      // Should add error.log file
      expect(mockLogger.add).toHaveBeenCalledWith(expect.any(Object));

      // Check that File transport was created with correct config
      expect(mockFileTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'logs/error.log',
          level: 'error',
        })
      );

      // Should add combined.log file
      expect(mockFileTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          filename: 'logs/combined.log',
        })
      );
    });

    it('should configure file rotation in production', () => {
      process.env.NODE_ENV = 'production';

      jest.isolateModules(() => {
        require(logger_path);
      });

      // Check error.log configuration
      expect(mockFileTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        })
      );
    });

    it('should NOT add file transports in development mode', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        require(logger_path);
      });

      // logger.add should not be called in development
      expect(mockLogger.add).not.toHaveBeenCalled();
    });
  });

  describe('Format Configuration', () => {
    it('should configure custom JSON format', () => {
      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(mockFormat.combine).toHaveBeenCalled();
      expect(mockFormat.timestamp).toHaveBeenCalled();
      expect(mockFormat.errors).toHaveBeenCalledWith({ stack: true });
      expect(mockFormat.json).toHaveBeenCalled();
    });

    it('should configure colorized console format for development', () => {
      process.env.NODE_ENV = 'development';

      jest.isolateModules(() => {
        require(logger_path);
      });

      expect(mockFormat.colorize).toHaveBeenCalled();
      expect(mockFormat.printf).toHaveBeenCalled();
    });
  });

  describe('Logger Methods', () => {
    let logger: typeof mockLogger;

    beforeEach(() => {
      jest.isolateModules(() => {
        const loggerModule = require(logger_path);
        logger = loggerModule.logger;
      });
    });

    it('should have info method', () => {
      expect(logger.info).toBeDefined();
      expect(typeof logger.info).toBe('function');
    });

    it('should have error method', () => {
      expect(logger.error).toBeDefined();
      expect(typeof logger.error).toBe('function');
    });

    it('should have warn method', () => {
      expect(logger.warn).toBeDefined();
      expect(typeof logger.warn).toBe('function');
    });

    it('should have debug method', () => {
      expect(logger.debug).toBeDefined();
      expect(typeof logger.debug).toBe('function');
    });

    it('should call winston logger methods', () => {
      logger.info('test message');
      expect(mockLogger.info).toHaveBeenCalledWith('test message');

      logger.error('error message');
      expect(mockLogger.error).toHaveBeenCalledWith('error message');

      logger.warn('warning message');
      expect(mockLogger.warn).toHaveBeenCalledWith('warning message');

      logger.debug('debug message');
      expect(mockLogger.debug).toHaveBeenCalledWith('debug message');
    });
  });

  describe('Logger Export', () => {
    it('should export logger as named export', () => {
      jest.isolateModules(() => {
        const { logger } = require(logger_path);
        expect(logger).toBeDefined();
      });
    });

    it('should export logger as default export', () => {
      jest.isolateModules(() => {
        const defaultLogger = require(logger_path).default;
        expect(defaultLogger).toBeDefined();
      });
    });

    it('should have same instance for named and default exports', () => {
      jest.isolateModules(() => {
        const {
          logger: namedLogger,
          default: defaultLogger,
        } = require(logger_path);
        expect(namedLogger).toBe(defaultLogger);
      });
    });
  });
});
