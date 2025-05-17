# Use Case Factory Pattern

This document describes the Use Case Factory Pattern implemented in this application to create and manage singleton instances of use cases.

## Overview

The Use Case Factory Pattern provides a centralized way to access application use cases. Instead of creating new instances of use cases throughout the application, we use a factory class that manages singleton instances and provides access to them.

## Structure

```
src/
└── application/
    └── useCases/
        ├── auth/                  # Auth domain use cases
        │   ├── loginUseCase.ts
        │   ├── signupUseCase.ts
        │   ├── logoutUseCase.ts
        │   ├── checkAuthUseCase.ts
        │   ├── roleGuardUseCase.ts
        │   └── index.ts           # Auth use case factory
        └── index.ts               # Main use cases exports
```

## Implementation

Each use case follows these principles:

1. **Single Responsibility**: Each use case handles one specific function (login, signup, etc.)
2. **Execute Method**: Every use case has a primary `execute()` method as the main entry point
3. **Dependency Injection**: Dependencies are injected through constructors
4. **Singleton Instances**: Each use case has a single instance managed by the factory

## Usage

Instead of creating new instances of use cases, access them through the factory:

```typescript
// Import the use case factory
import { authUseCase } from "@/application/useCases";

// Use the login use case
const response = await authUseCase.login.execute(credentials);

// Use the signup use case
const response = await authUseCase.signup.execute(signupData);

// Use the logout use case
authUseCase.logout.execute();

// Check if user is authenticated
const isAuthenticated = authUseCase.checkAuth.execute();

// Check if user has a specific role
const isTechLead = authUseCase.roleGuard.hasRole(EUserRole.TECH_LEAD);
```

## Factory Implementation

The factory uses static getters to provide access to singleton instances:

```typescript
class AuthUseCaseFactory {
  private static _loginUseCase: LoginUseCase;

  static get login(): LoginUseCase {
    if (!this._loginUseCase) {
      this._loginUseCase = new LoginUseCase(/* dependencies */);
    }
    return this._loginUseCase;
  }

  // Other use case getters...
}

export const authUseCase = AuthUseCaseFactory;
```

## Benefits

1. **Centralized Access**: All use cases are accessed through a single entry point
2. **Singleton Instances**: Ensures only one instance of each use case exists
3. **Lazy Initialization**: Use cases are only created when needed
4. **Dependency Management**: Dependencies are managed in one place
5. **Testability**: Easy to mock in tests by replacing the factory

## Adding New Use Cases

To add a new use case to an existing domain:

1. Create a new use case class with an `execute()` method
2. Add a private static property and a getter to the factory class
3. Initialize the use case with its dependencies in the getter

## Creating New Domains

To create a new domain of use cases:

1. Create a new directory for the domain under `src/application/useCases/`
2. Implement the use case classes
3. Create a factory class for the domain
4. Export the factory from the domain's index file
5. Re-export from the main use cases index file
