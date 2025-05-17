import { kudosRepository } from "@/infrastructure/repositories";
import { GetKudosListUseCase } from "./getKudosListUseCase";
import { GetCategoriesUseCase } from "@/application/useCases/kudos/getCategoriesUseCase";
import { GetUsersUseCase } from "@/application/useCases/kudos/getUsersUseCase";
import { CreateKudosUseCase } from "@/application/useCases/kudos/createKudosUseCase";

/**
 * Kudos Use Case Factory
 * Responsible for creating and providing singleton instances of kudos use cases
 */
class KudosUseCaseFactory {
  private static _iGetKudosListUseCase: GetKudosListUseCase;
  private static _iGetCategoriesUseCase: GetCategoriesUseCase;
  private static _iGetUsersUseCase: GetUsersUseCase;
  private static _iCreateKudosUseCase: CreateKudosUseCase;

  /**
   * Get kudos list use case singleton instance
   */
  static get getKudosList(): GetKudosListUseCase {
    if (!this._iGetKudosListUseCase) {
      this._iGetKudosListUseCase = new GetKudosListUseCase(kudosRepository);
    }
    return this._iGetKudosListUseCase;
  }

  /**
   * Get categories use case singleton instance
   */
  static get getCategories(): GetCategoriesUseCase {
    if (!this._iGetCategoriesUseCase) {
      this._iGetCategoriesUseCase = new GetCategoriesUseCase();
    }
    return this._iGetCategoriesUseCase;
  }

  /**
   * Get users use case singleton instance
   */
  static get getUsers(): GetUsersUseCase {
    if (!this._iGetUsersUseCase) {
      this._iGetUsersUseCase = new GetUsersUseCase();
    }
    return this._iGetUsersUseCase;
  }

  /**
   * Create kudos use case singleton instance
   */
  static get createKudos(): CreateKudosUseCase {
    if (!this._iCreateKudosUseCase) {
      this._iCreateKudosUseCase = new CreateKudosUseCase();
    }
    return this._iCreateKudosUseCase;
  }
}

export const kudosUseCases = KudosUseCaseFactory;
