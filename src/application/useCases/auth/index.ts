import { authRepository } from "@/infrastructure/repositories";
import { LoginUseCase } from "./loginUseCase";
import { SignupUseCase } from "./signupUseCase";
import { LogoutUseCase } from "./logoutUseCase";
import { CheckAuthUseCase } from "./checkAuthUseCase";
import { RoleGuardUseCase } from "./roleGuardUseCase";

// Export use case classes for type usage
export type {
  LoginUseCase,
  SignupUseCase,
  LogoutUseCase,
  CheckAuthUseCase,
  RoleGuardUseCase,
};

/**
 * Auth Use Case Factory
 * Responsible for creating and providing singleton instances of auth use cases
 */
class AuthUseCaseFactory {
  private static _iLoginUseCase: LoginUseCase;
  private static _iSignupUseCase: SignupUseCase;
  private static _iLogoutUseCase: LogoutUseCase;
  private static _iCheckAuthUseCase: CheckAuthUseCase;
  private static _iRoleGuardUseCase: RoleGuardUseCase;

  /**
   * Get login use case singleton instance
   */
  static get login(): LoginUseCase {
    if (!this._iLoginUseCase) {
      this._iLoginUseCase = new LoginUseCase(authRepository);
    }
    return this._iLoginUseCase;
  }

  /**
   * Get signup use case singleton instance
   */
  static get signup(): SignupUseCase {
    if (!this._iSignupUseCase) {
      this._iSignupUseCase = new SignupUseCase(authRepository);
    }
    return this._iSignupUseCase;
  }

  /**
   * Get logout use case singleton instance
   */
  static get logout(): LogoutUseCase {
    if (!this._iLogoutUseCase) {
      this._iLogoutUseCase = new LogoutUseCase();
    }
    return this._iLogoutUseCase;
  }

  /**
   * Get check auth use case singleton instance
   */
  static get checkAuth(): CheckAuthUseCase {
    if (!this._iCheckAuthUseCase) {
      this._iCheckAuthUseCase = new CheckAuthUseCase();
    }
    return this._iCheckAuthUseCase;
  }

  /**
   * Get role guard use case singleton instance
   */
  static get roleGuard(): RoleGuardUseCase {
    if (!this._iRoleGuardUseCase) {
      this._iRoleGuardUseCase = new RoleGuardUseCase(this.checkAuth);
    }
    return this._iRoleGuardUseCase;
  }
}

// Export the auth use case factory
export const authUseCase = AuthUseCaseFactory;
