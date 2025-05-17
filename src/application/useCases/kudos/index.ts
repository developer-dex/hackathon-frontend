import { kudosRepository } from "@/infrastructure/repositories";
import { GetKudosListUseCase } from "./getKudosListUseCase";

/**
 * Kudos Use Case Factory
 * Responsible for creating and providing singleton instances of kudos use cases
 */
class KudosUseCaseFactory {
  private static _iGetKudosListUseCase: GetKudosListUseCase;

  /**
   * Get kudos list use case singleton instance
   */
  static get getKudosList(): GetKudosListUseCase {
    if (!this._iGetKudosListUseCase) {
      this._iGetKudosListUseCase = new GetKudosListUseCase(kudosRepository);
    }
    return this._iGetKudosListUseCase;
  }
}

export const kudosUseCases = KudosUseCaseFactory;
