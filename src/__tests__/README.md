# Unit Tests

This directory contains comprehensive unit tests for the shared-calendar-backend application.

## Test Coverage

### AuthController Tests (`controllers/auth.controllers.test.ts`)
Tests for authentication controller methods:
- ✅ `register()` - Creates new user and returns expected result
- ✅ `login()` - Authenticates user and returns token
- ✅ `me()` - Returns authenticated user's data

### Auth Middleware Tests (`middleware/auth.middleware.test.ts`)
Tests for JWT authentication middleware:
- ✅ Validates JWT and attaches user to request
- ✅ Handles missing authorization header
- ✅ Handles invalid token format
- ✅ Handles expired or invalid tokens
- ✅ Verifies Bearer token extraction

### Permission Utils Tests (`utils/permissions.utils.test.ts`)
Tests for role-based access control:
- ✅ `requireCalendarRole()` throws 403 error when user role is not allowed
- ✅ Returns member when user has correct role
- ✅ Validates database queries
- ✅ Tests all calendar roles (ADMIN, EDITOR, VIEWER)

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests follow the Arrange-Act-Assert (AAA) pattern:
1. **Arrange**: Set up test data and mocks
2. **Act**: Execute the function being tested
3. **Assert**: Verify the expected outcome

## Mocking Strategy

- **AuthService**: Mocked using `jest.spyOn()` to isolate controller logic
- **Prisma**: Mocked to avoid database dependencies
- **JWT Utils**: Mocked to control token validation behavior
- **Express Request/Response**: Partial mocks with jest functions

## Adding New Tests

When adding new tests:
1. Create test file in appropriate directory (`controllers/`, `middleware/`, `utils/`)
2. Use `*.test.ts` naming convention
3. Import necessary types and functions
4. Mock external dependencies
5. Follow AAA pattern
6. Use descriptive test names

### Example Test Structure

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('MyFunction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something specific', async () => {
    // Arrange
    const mockData = { ... };
    
    // Act
    const result = await myFunction(mockData);
    
    // Assert
    expect(result).toEqual(expectedValue);
  });
});
```

## Test Configuration

Tests are configured using:
- **Jest**: Testing framework
- **ts-jest**: TypeScript preprocessor for Jest
- **@jest/globals**: Typed Jest globals
- **jest.config.js**: Jest configuration file

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Test names should clearly describe what is being tested
3. **Coverage**: Aim for high code coverage, especially for critical paths
4. **Mocking**: Mock external dependencies to keep tests fast and reliable
5. **Cleanup**: Use `beforeEach` and `afterEach` to reset state between tests
